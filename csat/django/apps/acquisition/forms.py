from django import forms
from django.template.loader import render_to_string

from crispy_forms import layout, helper

from csat import collectors
from . import models


class CollectorsConfigLayout(layout.Layout):
    def render(self, form, form_style, context):
        return render_to_string('csat/acquisition/session/_collectors-configurator.html', {
            'collectors_types': collectors.get_types()
        })


class AcquisitionSessionConfigForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        self.helper = helper.FormHelper()
        self.helper.layout = self.get_layout()
        super(AcquisitionSessionConfigForm, self).__init__(*args, **kwargs)

    def get_layout(self):
        return layout.Layout(
            layout.Field('name'),
            layout.Field('description'),
            #CollectorsConfigLayout(),
        )

    class Meta:
        model = models.AcquisitionSessionConfig
        exclude = ['temporary', 'created',]
