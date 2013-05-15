import os
import pprint

from csat.paths import PathWalker
from . import parser


class FakeGraphML(object):
    def write_graphml(self, stream):
        return


class Module(object):
    def __init__(self, name):
        self.name = name

    def __hash__(self):
        return hash(self.name)

    def __eq__(self, other):
        return isinstance(other, Module) and self.name == other.name


class PathActionString(str):
    deleted = False
    created = False


class GitPythonCollector(object):

    def __init__(self, task_manager, logger, repo):
        self.tasks = task_manager
        self.log = logger
        self.repo = repo
        self.git = repo.git
        self.rev = 'trunk'#'63be1f698a60d572fc6436cbc0af9e0fcff9713e..a0626e'
        self.package_name = 'twisted'
        self.modules = {}

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
        self.log.info('First commit is [{}]: {}'.format(commit.hexsha[:6],
                                                        commit.summary))
        self.handle_initial_commit(commit)
        self.commit_task.makeStep()

        # Iteratively analyze all remaining commits
        commits = self.repo.iter_commits(self.rev, max_count=count,
                                         reverse=True)
        for i, commit in enumerate(commits):
            self.commit_task.statusText = 'Analyzing commit {}/{}...'.format(
                i + 1, count)
            self.git.checkout(commit.hexsha, force=True)
            paths = self.get_modified_paths(commit.parents[0])
            self.handle_commit(commit, paths)
            self.commit_task.makeStep()

        # Cleanup
        self.commit_task.setCompleted()
        self.log.info('Last commit is [{}]: {}'.format(commit.hexsha[:6],
                                                       commit.summary))

        return FakeGraphML()

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

            # Keep only python files
            if not path.endswith('.py'):
                continue

            # Keep only files in the twisted package
            if not path.startswith('{}/'.format(self.package_name)):
                continue

            # Exclude test files
            if '/test/' in path or path.endswith('test.py'):
                continue

            yield path, deleted

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
        walker = PathWalker(self.repo.working_dir, fullpath=True)
        walker.filter(filename=r'.*\.py')
        walker.exclude(directory=r'\.git')
        walker.exclude(directory=r'test')
        walker.exclude(directory=r'doc')

        def create_iter(paths):
            for p in paths:
                yield p, False

        self.handle_commit(commit, create_iter(walker.walk()))

    def handle_commit(self, commit, paths):
        delta = 0
        changed = False

        for path, deleted in paths:
            changed = True
            module = parser.Module(path, self.repo.working_dir)

            if deleted:
                dependencies = set()
            else:
                dependencies = self.get_dependent_modules(commit, module)

            if module in self.modules:
                removed = self.modules[module] - dependencies
                added = dependencies - self.modules[module]
            else:
                assert not deleted
                added = dependencies
                removed = []

            for dep in removed:
                self.remove_dependency(commit, module, dep)

            for dep in added:
                self.add_dependency(commit, module, dep)

            delta += len(added) - len(removed)

            if deleted:
                self.log.debug('Deleted {!r}'.format(module))
                del self.modules[module]
            else:
                self.modules[module] = dependencies

        if changed:
            self.log.debug(u'Commit {} delta: {}, {}'.format(
                commit.hexsha[:6], delta, commit.summary))
        else:
            self.log.debug('No source files modified, skipping commit {}'
                           .format(commit.hexsha[:6]))

    def add_dependency(self, commit, source, target):
        #print '  + ', source, '->', target
        pass

    def remove_dependency(self, commit, source, target):
        #print '  - ', source, '->', target
        pass
