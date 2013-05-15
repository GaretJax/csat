import os
import datetime

import networkx as nx

from csat.paths import PathWalker
from . import parser


class ModuleNotFound(KeyError):
    pass


class ModuleAlreadyTracked(KeyError):
    pass


def timestamp_to_iso(timestamp):
    return datetime.datetime.fromtimestamp(timestamp).isoformat()


class DependencyGraph(object):
    def __init__(self):
        self.modules = {}
        self._nextid = 1
        self.graph = nx.DiGraph()

    def add_module(self, commit, module):
        try:
            self.modules[module][2] = True
        except KeyError:
            self.modules[module] = [self._nextid, set(), True]
            self.graph.add_node(self._nextid, {
                'label': module.get_import_path(),
                # TODO: Nor really true
                'date_added': timestamp_to_iso(commit.committed_date),
                'commit_added': commit.hexsha,
                'author_added': commit.author.email,
            })
            self._nextid += 1
        else:
            # TODO: Update commit metadata
            pass

    def id(self, module):
        return self.modules[module][0]

    def node(self, module):
        return self.graph.node[self.modules[module][0]]

    def edge(self, source, target):
        return self.graph.edge[self.id(source)][self.id(target)]

    def remove_module(self, commit, module):
        spec = self.modules[module]
        assert not spec[1]
        spec[2] = False
        node = self.node(module)
        node['date_removed'] = timestamp_to_iso(commit.committed_date)
        node['commit_removed'] = commit.hexsha
        node['author_removed'] = commit.author.email

    def get_dependencies(self, module):
        try:
            _, deps, active = self.modules[module]
            if not active:
                raise ModuleNotFound(module)
        except KeyError:
            raise ModuleNotFound(module)
        return deps

    def add_dependency(self, commit, source, target):
        self.add_module(commit, target)
        self.get_dependencies(source).add(target)
        self.graph.add_edge(self.id(source), self.id(target), {
            'date_added': timestamp_to_iso(commit.committed_date),
            'commit_added': commit.hexsha,
            'author_added': commit.author.email,
        })

    def remove_dependency(self, commit, source, target):
        self.get_dependencies(source).remove(target)
        edge = self.edge(source, target)
        edge['date_removed'] = timestamp_to_iso(commit.committed_date)
        edge['commit_removed'] = commit.hexsha
        edge['author_removed'] = commit.author.email

    def write_graphml(self, stream):
        return nx.write_graphml(self.graph, stream)


class GitPythonCollector(object):

    def __init__(self, task_manager, logger, repo, rev, package):
        self.tasks = task_manager
        self.log = logger
        self.repo = repo
        self.git = repo.git
        self.rev = rev
        self.package_name = package
        self.graph = DependencyGraph()

    def run(self):
        self.commit_task = self.tasks.new('Parsing commits')
        self.commit_task.statusText = 'Getting commit summary...'

        count = 0
        for commit in self.repo.iter_commits(self.rev):
            count += 1

        if not count:
            raise ValueError('The provided revision specifier does not '
                             'contain any commits.')

        self.commit_task.steps = count + 1

        # Checkout and analyze initial (specified) commit
        try:
            commit = commit.parents[0]
        except IndexError:
            # We are at the first commit
            count -= 1
        self.git.checkout(commit.hexsha, force=True)
        self.log.info(u'First commit is [{}]: {}'.format(commit.hexsha[:6],
                                                        commit.summary))
        self.handle_initial_commit(commit)
        self.commit_task.makeStep()

        # Iteratively analyze all remaining commits
        commits = self.repo.iter_commits(self.rev, max_count=count,
                                         reverse=True)
        for i, commit in enumerate(commits):
            self.log.debug(u'Analyzing commit [{}]: {}'.format(
                commit.hexsha[:6], commit.summary))
            self.commit_task.statusText = 'Analyzing commit {}/{}...'.format(
                i + 1, count)
            self.git.checkout(commit.hexsha, force=True)
            paths = self.get_modified_paths(commit.parents[0])
            self.handle_commit(commit, paths)
            self.commit_task.makeStep()

        # Cleanup
        self.commit_task.setCompleted()
        self.log.info(u'Last commit is [{}]: {}'.format(commit.hexsha[:6],
                                                       commit.summary))

        return self.graph

    def get_modified_paths(self, commit):
        for diff in commit.diff():
            if diff.renamed:
                self.log.error('RENAMED {}'.format(diff.path))

            #if diff.a_blob is None:
            #    # File was created
            #    self.log.error('CREATED {}'.format(diff.b_blob.path))

            if diff.b_blob is None:
                # File was deleted
                deleted = True
                path = diff.a_blob.path
            else:
                deleted = False
                path = diff.b_blob.path

            if self.filter_path(path):
                yield path, deleted

    def filter_path(self, path):
        # Keep only python files
        if not path.endswith('.py'):
            return False

        # Keep only files in the twisted package
        if not path.startswith('{}/'.format(self.package_name)):
            return False

        # Exclude test files
        if '/test/' in path or path.endswith('test.py'):
            return False

        return True

    def get_dependent_modules(self, commit, module):
        imports = module.get_imports()
        imports = (imp for imp in imports if imp.is_submodule(
            self.package_name))
        depends_on = set()

        try:
            for imp in imports:
                paths = imp.get_paths()
                for p in paths:
                    if os.path.exists(os.path.join(self.repo.working_dir, p)):
                        depends_on.add(parser.Module(p, self.repo.working_dir))
                        break
                else:
                    location = '{}:{}:{} @ {}'.format(
                        module.path, imp.node.lineno, imp.node.col_offset,
                        commit.hexsha[:6])

                    path_list = '\n'.join(' * {}'.format(p) for p in paths)
                    msg = (
                        'Could not find target for \'{}\' in {}, tried:\n{}'
                        .format(imp.code(), location, path_list)
                    )
                    self.log.warn(msg)
        except:
            self.log.exception('Could not parse {}'.format(module))

        return depends_on

    def handle_initial_commit(self, commit):
        walker = PathWalker(self.repo.working_dir, fullpath=False)
        walker.filter(filename=r'.*\.py')
        walker.exclude(directory=r'\.git')
        walker.exclude(directory=r'test')
        walker.exclude(directory=r'doc')

        def create_iter(paths):
            for p in paths:
                if self.filter_path(p):
                    yield p, False

        self.handle_commit(commit, create_iter(walker.walk()))

    def handle_commit(self, commit, paths):
        changed = False

        for path, deleted in paths:
            changed = True
            module = parser.Module(path, self.repo.working_dir)

            if deleted:
                dependencies = set()
            else:
                dependencies = self.get_dependent_modules(commit, module)

            try:
                old_dependencies = self.graph.get_dependencies(module)
                removed = old_dependencies - dependencies
                added = dependencies - old_dependencies
            except ModuleNotFound:
                assert not deleted
                self.log.debug('Created {!r}'.format(module))
                self.graph.add_module(commit, module)
                added = dependencies
                removed = set()

            if deleted:
                self.log.debug('Deleted {!r}'.format(module))

            for dep in removed:
                self.graph.remove_dependency(commit, module, dep)

            for dep in added:
                self.graph.add_dependency(commit, module, dep)

            if deleted:
                self.graph.remove_module(commit, module)

        if not changed:
            self.log.debug('No source files modified, skipping commit {}'
                           .format(commit.hexsha[:6]))
