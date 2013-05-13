from csat.acquisition import base


__version__ = '0.1.0'


class GitPythonCollector(base.FactoryBase):

    name = 'Git + Python dependencies analyzer'
    key = 'pygit'
    version = __version__

    def build_parser(self, base):
        parser = super(GitPythonCollector, self).build_parser(base)
        parser.add_argument('repo_path')
        return parser

    def build_collector(self, task_manager, logger, args):
        from .collector import GitPythonCollector
        return GitPythonCollector(task_manager, logger, args.repo_path)


git_python_collector = GitPythonCollector()


if __name__ == '__main__':
    from csat.acquisition.runner import get_runner
    get_runner(git_python_collector).run()
