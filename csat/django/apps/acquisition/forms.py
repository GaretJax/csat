from django import forms
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _

from crispy_forms import layout, helper, bootstrap

from csat import acquisition
from csat.django.apps.bootstrap.layout import IconButton
from . import models


class CollectorsConfigLayout(layout.Layout):
    def render(self, form, form_style, context):
        return render_to_string('csat/acquisition/session/_collectors-configurator.html', {
            'collectors_types': acquisition.get_types()
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


class DatabaseSelectionForm(forms.Form):
    def __init__(self, available_graphs, *args, **kwargs):
        self.helper = helper.FormHelper()
        self.helper.layout = self.get_layout()
        self.helper.form_class = 'form-inline select-db'
        self.available_graphs = available_graphs
        super(DatabaseSelectionForm, self).__init__(*args, **kwargs)
        self.fields['database'].choices = self.get_available_databases()

    def get_layout(self):
        return layout.Layout(
            layout.Field('database', css_class='input-small',
                         template='bootstrap/inline-field.html'),
            IconButton(_('Run'), 'play', css_class='btn btn-primary',
                       type='submit', name='action', value='run'),
        )

    def get_available_databases(self):
        for graph in self.available_graphs:
            yield graph, graph
    database = forms.ChoiceField()


class SimpleFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(SimpleFormMixin, self).__init__(*args, **kwargs)
        self.helper = helper.FormHelper()
        self.helper.layout = self.get_layout()
        self.helper.form_class = 'form-horizontal form-bordered'

    def get_layout(self):
        elements = [layout.Field(name) for name in self.fields.iterkeys()]
        elements += [
            bootstrap.FormActions(
               layout.Submit('submit', _('Submit')),
            )
        ]
        return layout.Layout(*elements)


class ResultsUploadForm(SimpleFormMixin, forms.ModelForm):

    successful = forms.BooleanField(required=False)

    def __init__(self, *args, **kwargs):
        super(ResultsUploadForm, self).__init__(*args, **kwargs)
        self.fields['graph'].allow_empty_file = True
        self.fields['output'].allow_empty_file = True

    class Meta:
        model = models.DataCollectorConfig
        fields = ('graph', 'output')
