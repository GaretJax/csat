import os
import base64

from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.core.files.storage import FileSystemStorage
from django.utils.timezone import now
from django.core.urlresolvers import reverse

from polymorphic import PolymorphicModel

from csat.acquisition import get_collector


graph_fs = FileSystemStorage(location=settings.GRAPHS_ROOT)
logs_fs = FileSystemStorage(location=settings.EXECUTION_LOGS_ROOT)


class AcquisitionSessionConfig(models.Model):

    CONFIGURED, RUNNING, COMPLETED = range(3)

    STATUSES = {
        CONFIGURED: _('Configured'),
        RUNNING: _('Running'),
        COMPLETED: _('Completed'),
    }

    name = models.CharField(
        max_length=64,
        help_text=_('Name this acquisition setup. Choose something you can '
                    'easily remember'))

    description = models.TextField(
        blank=True,
        help_text=_('Describe the setup, e.g. which project are you capturing '
                    'data for, from which sources,...'))

    temporary = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    started = models.DateTimeField(null=True, blank=True)
    completed = models.DateTimeField(null=True, blank=True)

    @property
    def status(self):
        if self.started is None:
            return self.CONFIGURED

        if self.completed is None:
            return self.RUNNING

        return self.COMPLETED

    def set_completed(self, save=True):
        self.completed = now()
        if save:
            self.save()

    def get_absolute_url(self):
        return reverse('csat:acquisition:session', kwargs={'pk': self.pk})

    class Meta:
        ordering = ['created']


class DataCollectorConfig(PolymorphicModel):

    READY, RUNNING, FAILED, COMPLETED = range(4)

    STATUS_CHOICES = (
        (READY, _('Ready to run')),
        (RUNNING, _('Running')),
        (FAILED, _('Failed')),
        (COMPLETED, _('Completed')),
    )

    configurator = models.CharField(max_length=44)

    session_config = models.ForeignKey(AcquisitionSessionConfig,
                                       related_name='collectors')
    started = models.DateTimeField(null=True, blank=True)
    completed = models.DateTimeField(null=True, blank=True)
    running_instance_id = models.CharField(max_length=128,
                                           null=True, blank=True)
    result_id = models.CharField(max_length=64, blank=True, null=True)
    status = models.PositiveSmallIntegerField(
        choices=STATUS_CHOICES, default=READY)

    def get_graph_upload_path(self, filename):
        return 'graphs/{}-{}.graphml'.format(self.id, self.result_id)
    graph = models.FileField(upload_to=get_graph_upload_path, storage=graph_fs,
                              blank=True, null=True)

    def get_log_upload_path(self, filename):
        return 'logs/{}-{}.log'.format(self.id, self.result_id)
    output = models.FileField(upload_to=get_log_upload_path, storage=logs_fs,
                              blank=True, null=True)

    def set_running(self, save=True):
        if self.status != DataCollectorConfig.READY:
            raise RuntimeError('Collector in invalid state: {}'.format(
                self.status))
        self.status = DataCollectorConfig.RUNNING
        self.started = now()
        if save:
            self.save()

    def set_failed(self, save=True):
        if self.status not in (DataCollectorConfig.RUNNING,
                               DataCollectorConfig.READY):
            raise RuntimeError('Collector in invalid state: {}'.format(
                self.status))

        self.status = DataCollectorConfig.FAILED
        self.completed = now()

        if save:
            self.save()

    def set_completed(self, save=True):
        if self.status != DataCollectorConfig.RUNNING:
            raise RuntimeError('Collector in invalid state: {}'.format(
                self.status))

        self.status = DataCollectorConfig.COMPLETED
        self.completed = now()

        if save:
            self.save()

    def create_postback_url(self, save=True):
        if self.result_id:
            raise ValueError('Postback URL already defined')

        if self.status in (DataCollectorConfig.FAILED,
                           DataCollectorConfig.COMPLETED):
            raise RuntimeError('Collector in invalid state: {}'.format(
                self.status))

        self.result_id = base64.urlsafe_b64encode(os.urandom(48))

        if save:
            self.save()

        return self.get_postback_url()

    def get_postback_url(self):
        if not self.result_id:
            raise ValueError('Postback URL not yet defined')
        return reverse('csat:acquisition:collector-upload-results', kwargs={
            'result_id': self.result_id,
        })

    def get_collector(self):
        return get_collector(self.configurator)
