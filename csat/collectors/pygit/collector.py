import git
import datetime


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


class GitPythonCollector(object):

    def __init__(self, task_manager, logger, repo_path):
        self.tasks = task_manager
        self.log = logger
        self.repo_path = repo_path
        self.branch = 'trunk'

    def run(self):
        self.commit_task = self.tasks.new('Parsing commits')

        self.commit_task.statusText = 'Getting commit summary...'
        repo = git.Repo(self.repo_path, odbt=git.GitCmdObjectDB)
        count = 0
        for commit in repo.iter_commits(self.branch, max_count=500):
            count += 1
        self.commit_task.steps = count

        gitcmd = repo.git

        # Checkout first commit
        gitcmd.checkout(commit.hexsha, force=True)
        #print commit.message.splitlines()[0]

        """
        File created: add node + outgoing dependency links
        File removed: remove node + outgoing dependency links, assert no incoming links
        File modified: analyze outgoing dependencies again
        """

        self.commit_task.statusText = 'Analyzing initial commit...'

        # TODO: Build data structure with global analysis

        self.commit_task.makeStep()

        for i, commit in enumerate(repo.iter_commits(self.branch, max_count=count - 1, reverse=True)):
            self.commit_task.statusText = 'Analyzing commit {}/{}...'.format(
                i + 2, count)

            # TODO: Get changed files to index

            paths = (diff.a_blob.abspath for diff in commit.diff() if diff.renamed)
            paths = (p for p in paths if p.endswith('.py'))
            paths = tuple(paths)

            if paths:
                print commit.message.splitlines()[0]
                for path in paths:
                    print ' * ' + path

            # TODO: Checkout
            gitcmd.checkout(commit.hexsha, force=True)

            # TODO: Analyze changed files

            self.commit_task.makeStep()

        self.commit_task.setCompleted()

        # Get revisions

        # For each revision

        # Checkout revision

        # Get dependencies
        return FakeGraphML()
