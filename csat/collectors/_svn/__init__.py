#from crispy_forms import layout
#
#from csat.acquisition import django
#from . import models
#
#
#class ConfigForm(django.CollectorConfigForm):
#
#    class Meta:
#        model = models.SvnConfig
#
#    def get_basic_layout(self):
#        return layout.Layout(
#            layout.Field('repository_url')
#        )
#
#
#class Collector(django.Collector):
#    name = 'SVN Source Code Retriever'
#    config_form_class = ConfigForm
#    model = models.SvnConfig
