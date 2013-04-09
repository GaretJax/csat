from django.db import models
from polymorphic import PolymorphicModel
from django.utils.translation import ugettext_lazy as _
from csat.collectors import get_collector_for_model


class AcquisitionSessionConfig(models.Model):
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

    class Meta:
        ordering = ['created']


class DataCollectorConfig(PolymorphicModel):
    session_config = models.ForeignKey(AcquisitionSessionConfig, related_name='collectors')

    def get_collector_module(self):
        return get_collector_for_model(self.__class__)
