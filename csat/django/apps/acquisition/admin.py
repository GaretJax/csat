from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin

from . import models


class AcquisitionSessionConfigAdmin(admin.ModelAdmin):
    pass
admin.site.register(models.AcquisitionSessionConfig, AcquisitionSessionConfigAdmin)


class DataCollectorConfigAdmin(PolymorphicChildModelAdmin):
    base_model = models.DataCollectorConfig


class PipermailConfigAdmin(DataCollectorConfigAdmin):
    pass


class SvnConfigAdmin(DataCollectorConfigAdmin):
    pass


class DataCollectorConfigAdmin(PolymorphicParentModelAdmin):
    base_model = models.DataCollectorConfig

    def get_child_models(self):
        from csat.collectors.pipermail.models import PipermailConfig
        from csat.collectors.svn.models import SvnConfig
        return (
            (PipermailConfig, PipermailConfigAdmin),
            (SvnConfig, SvnConfigAdmin),
        )
admin.site.register(models.DataCollectorConfig, DataCollectorConfigAdmin)
