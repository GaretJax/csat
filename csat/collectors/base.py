from django import forms
from django.utils.translation import ugettext_lazy as _

from crispy_forms import layout, helper, bootstrap
from csat.django.apps.bootstrap.layout import ButtonLink


class BasicPanel(layout.Layout):
    def render(self, *args, **kwargs):
        html = super(BasicPanel, self).render(*args, **kwargs)
        return '<div class="front-panel">{}</div>'.format(html)


class AdvancedPanel(layout.Layout):
    def render(self, *args, **kwargs):
        html = super(AdvancedPanel, self).render(*args, **kwargs)
        return '<div class="back-panel">{}</div>'.format(html)


class CollectorFormTitle(layout.Layout):
    def render(self, form, form_style, context):
        html = u'<h1 class="form-title">{}</h1>'.format(context['collector'].name)
        return html


class Collector(object):
    def get_config_form_class(self):
        return self.config_form_class

    def get_model(self):
        return self.model


class CollectorConfigForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        self.helper = helper.FormHelper()
        self.helper.layout = self.get_layout()
        self.helper.form_class = 'form-horizontal form-force-block-help'
        super(CollectorConfigForm, self).__init__(*args, **kwargs)
        self.fields.pop('session_config')

    def get_advanced_layout(self):
        return None

    def get_layout(self):
        advanced_layout = self.get_advanced_layout()

        if advanced_layout:
            advanced_link = '<li><a class="advanced" href="#"><i class="icon-wrench"></i>More options</a></li>'
            advanced_panel = AdvancedPanel(
                self.get_advanced_layout(),
                bootstrap.FormActions(
                    layout.Button('submit', _('Apply'), css_class='btn-primary'),
                    ButtonLink(_('Cancel'), url='#'),
                )
            )
        else:
            advanced_link = ''
            advanced_panel = layout.Layout()

        basic_panel = BasicPanel(
            CollectorFormTitle(),
            layout.HTML("""
                <ul class="actions">
                    {}
                    <li><a class="remove" href="#"><i class="icon-remove"></i>Remove</a></li>
                </ul>
                """.format(advanced_link)
            ),
            self.get_basic_layout()
        )

        return layout.Layout(basic_panel, advanced_panel)
