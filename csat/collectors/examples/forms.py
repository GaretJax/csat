from crispy_forms import layout

from csat.acquisition import forms
from . import models


class ConfigForm(forms.CollectorConfigForm):

    class Meta(forms.CollectorConfigForm.Meta):
        model = models.ExamplesConfig

    def get_basic_layout(self):
        return layout.Layout(
            layout.Field('example'),
        )

    def get_advanced_layout(self):
        return None
