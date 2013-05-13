from django.db import models
from django.utils.translation import ugettext_lazy as _

from csat.django.apps.acquisition.models import DataCollectorConfig


class SvnConfig(DataCollectorConfig):
    repository_url = models.CharField(
            _('Repository URL'),
            max_length=255)
