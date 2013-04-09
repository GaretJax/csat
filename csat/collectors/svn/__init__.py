from crispy_forms import layout

from .. import base
from . import models


class ConfigForm(base.CollectorConfigForm):

    class Meta:
        model = models.SvnConfig

    def get_basic_layout(self):
        return layout.Layout(
            layout.Field('repository_url')
        )


class Collector(base.Collector):
    name = 'SVN Source Code Retriever'
    config_form_class = ConfigForm
    model = models.SvnConfig
