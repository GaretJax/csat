from crispy_forms import layout

from csat.acquisition import django
from . import models


class ConfigForm(django.CollectorConfigForm):

    class Meta(django.CollectorConfigForm.Meta):
        model = models.PipermailConfig

    def get_basic_layout(self):
        return layout.Layout(
            layout.Field('base_url')
        )

    def get_advanced_layout(self):
        return layout.Layout(
            layout.Field('link_mode')
        )
