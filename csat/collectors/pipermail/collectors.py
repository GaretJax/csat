from crispy_forms import layout

from .. import base
from . import models


class ConfigForm(base.CollectorConfigForm):

    class Meta:
        model = models.PipermailConfig

    def get_basic_layout(self):
        return layout.Layout(
            layout.Field('base_url')
        )

    def get_advanced_layout(self):
        return layout.Layout(
            layout.Field('link_mode')
        )


class Collector(base.Collector):
    name = 'Pipermail Archives Scraper'
    config_form_class = ConfigForm
    model = ConfigForm.Meta.model
