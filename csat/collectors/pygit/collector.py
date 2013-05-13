class GitPythonCollector(object):

    def __init__(self, task_manager, logger, repo_url):
        self.tasks = task_manager
        self.log = logger
        self.repo_url = repo_url

    def run(self):
        pass
