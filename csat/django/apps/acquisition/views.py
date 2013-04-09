from django.views.generic import edit, list, base
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect

from csat import collectors
from . import models, forms


class SessionsIndex(list.ListView):
    template_name = 'csat/acquisition/session/list.html'
    model = models.AcquisitionSessionConfig
    context_object_name = 'sessions'

    def get_queryset(self):
        return self.model.objects.filter(temporary=False)

session_index = SessionsIndex.as_view()


class SessionRun(base.TemplateView):
    template_name = 'csat/acquisition/session/running.html'

session_run = SessionRun.as_view()


class SessionEditor(edit.UpdateView):
    template_name = 'csat/acquisition/session/edit.html'
    model = models.AcquisitionSessionConfig
    form_class = forms.AcquisitionSessionConfigForm
    context_object_name = 'session'

    def get_success_url(self):
        return reverse('csat:acquisition:session-edit', kwargs={
            'pk': self.object.pk
        })

    def get_form(self, form_class):
        form = super(SessionEditor, self).get_form(form_class)
        form.helper.form_action = reverse('csat:acquisition:session-edit',
                                          kwargs={'pk': self.object.pk})
        return form

    def get_context_data(self, **kwargs):
        #import time, random
        #time.sleep(random.random() * 5)
        context = super(SessionEditor, self).get_context_data(**kwargs)
        context['collectors_types'] = collectors.get_types()
        return context

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.temporary = False
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())

    def get_template_names(self):
        if self.request.is_ajax():
            return ['csat/acquisition/session/ajax_form.html']
        else:
            return super(SessionEditor, self).get_template_names()

session_edit = SessionEditor.as_view()


class SessionCreator(base.RedirectView):
    permanent = False
    query_string = False

    def get_redirect_url(self):
        session = models.AcquisitionSessionConfig.objects.create(
            temporary=True)
        return reverse('csat:acquisition:session-edit', kwargs={
            'pk': session.pk
        })

session_create = SessionCreator.as_view()


class SessionDeletor(edit.DeleteView):
    template_name = 'csat/acquisition/session/delete.html'
    model = models.AcquisitionSessionConfig
    context_object_name = 'session'
    success_url = reverse_lazy('csat:acquisition:session-index')

session_delete = SessionDeletor.as_view()


class CollectorConfigCreate(edit.CreateView):
    template_name = 'csat/acquisition/session/ajax_form.html'

    def get_queryset(self):
        module = self.kwargs['collector']
        collector = collectors.get_collector(module)
        return collector().get_model().objects.all()

    def get_form_class(self):
        module = self.kwargs['collector']
        collector = collectors.get_collector(module)
        return collector().get_config_form_class()

    def get_form(self, form_class):
        #import time, random
        #time.sleep(random.random() * 5)
        form = super(CollectorConfigCreate, self).get_form(form_class)
        form.helper.form_action = reverse('csat:acquisition:collector-create',
                                          kwargs=self.kwargs)
        return form

    def get_context_data(self, **kwargs):
        module = self.kwargs['collector']
        context = super(CollectorConfigCreate, self).get_context_data(**kwargs)
        context['collector'] = collectors.get_collector(module)
        return context

    def get_success_url(self):
        return reverse('csat:acquisition:collector-edit', kwargs={
            'session_pk': self.kwargs['session_pk'],
            'collector_pk': self.object.pk,
        })

    def form_valid(self, form):
        session = get_object_or_404(models.AcquisitionSessionConfig,
                                    pk=int(self.kwargs['session_pk']))
        self.object = form.save(commit=False)
        self.object.session_config = session
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())

collector_create = CollectorConfigCreate.as_view()


class CollectorConfigEdit(edit.UpdateView):
    template_name = 'csat/acquisition/session/ajax_form.html'
    pk_url_kwarg = 'collector_pk'

    def get_queryset(self):
        return models.DataCollectorConfig.objects.filter(
                session_config=int(self.kwargs['session_pk']))

    def get_form_class(self):
        collector = self.object.get_collector_module()
        return collector().get_config_form_class()

    def get_form(self, form_class):
        #import time, random
        #time.sleep(random.random() * 3)

        form = super(CollectorConfigEdit, self).get_form(form_class)
        form.helper.form_action = reverse('csat:acquisition:collector-edit',
                                          kwargs=self.kwargs)
        form.helper.attrs['data-deleteurl'] = reverse(
            'csat:acquisition:collector-remove',
            kwargs=self.kwargs
        )
        return form

    def get_context_data(self, **kwargs):
        context = super(CollectorConfigEdit, self).get_context_data(**kwargs)
        context['collector'] = self.object.get_collector_module()
        return context

    def form_valid(self, form):
        self.object = form.save()
        return self.render_to_response(self.get_context_data(form=form))

collector_edit = CollectorConfigEdit.as_view()


class CollectorConfigRemove(edit.DeleteView):
    pk_url_kwarg = 'collector_pk'

    def get_queryset(self):
        #import time, random
        #time.sleep(random.random() * 5)

        return models.DataCollectorConfig.objects.filter(
                session_config=int(self.kwargs['session_pk']))

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.delete()
        return HttpResponse('')

collector_remove = CollectorConfigRemove.as_view()
