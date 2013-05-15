from django.db import models
from csat.acquisition.models import DataCollectorConfig
from django.utils.translation import ugettext_lazy as _


class Config(DataCollectorConfig):
    repo_url = models.URLField(_('Repository URL'))
    revspec = models.CharField(_('Revision specifier'), max_length=255)
    package = models.CharField(_('Package name'), max_length=63)
