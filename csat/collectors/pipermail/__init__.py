import sys

from csat.acquisition import base


__all__ = ['runner', 'configurator']
__version__ = '0.1.0'


class PipermailInfoMixin(object):
    name = 'Pipermail Archives Scraper'
    key = 'pipermail'
    version = __version__


class PipermailConfigurator(PipermailInfoMixin, base.ConfiguratorBase):
    def get_form(self):
        from . import forms
        return forms.ConfigForm

    def get_model(self):
        from . import models
        return models.PipermailConfig

    def get_command(self, model):
        # TODO: Switch to the runner
        return [sys.executable, '-m', 'csat.collectors.pipermail.collector',
                model.base_url,]


class PipermailRunner(PipermailInfoMixin, base.RunnerBase):
    def build_parser(self, base):
        parser = super(PipermailRunner, self).build_parser(base)
        parser.add_argument('base_url')
        parser.add_argument('-c', '--concurrency', default=16, type=int,
                            help='Number of concurrent HTTP requests used '
                            'when collecting data (default: 16).')
        return parser

    def run(self, args):
        from .collector import PipermailCollector
        collector = PipermailCollector(args.url, args.concurrency)
        return collector.run()


runner = PipermailRunner()
configurator = PipermailConfigurator()
