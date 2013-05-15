try:
    import git
except ImportError:
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter('always')
        warnings.warn('No git module found, the pygit collector will not be '
                      'available', ImportWarning)
    git = None

from csat.acquisition import base


__version__ = '0.1.0'


class GitPythonCollector(base.FactoryBase):

    name = 'Git + Python dependencies analyzer'
    key = 'pygit'
    version = __version__

    def build_parser(self, base):
        parser = super(GitPythonCollector, self).build_parser(base)
        parser.add_argument('repo_path')
        parser.add_argument('revspec', default='master', nargs='?')
        parser.add_argument('package_name')
        return parser

    def build_collector(self, task_manager, logger, args):
        from .collector import GitPythonCollector

        #rev: 'trunk' #'63be1f698a60d572fc6436cbc0af9e0fcff9713e..a0626e'

        repo = git.Repo(args.repo_path)
        return GitPythonCollector(task_manager, logger, repo, args.revspec,
                                  args.package_name)


if git is not None:
    git_python_collector = GitPythonCollector()

    if __name__ == '__main__':
        from csat.acquisition.runner import get_runner
        get_runner(git_python_collector).run()
