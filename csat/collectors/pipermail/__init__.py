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
        return ['csat-collect', 'pipermail.collector', model.base_url,]


class PipermailFactory(PipermailInfoMixin, base.FactoryBase):
    def build_parser(self, base):
        parser = super(PipermailFactory, self).build_parser(base)
        parser.add_argument('base_url')
        parser.add_argument('-c', '--concurrency', default=16, type=int,
                            help='Number of concurrent HTTP requests used '
                            'when collecting data (default: 16).')
        return parser

    def build_collector(self, task_manager, logger, args):
        from .collector import PipermailCollector
        return PipermailCollector(task_manager, logger, args.base_url,
                                  args.concurrency)


factory = PipermailFactory()
configurator = PipermailConfigurator()


if __name__ == '__main__':
    from csat.acquisition.runner import get_runner
    get_runner(factory).run()
