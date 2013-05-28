from django.contrib import admin

from . import models


class GraphAdmin(admin.ModelAdmin):
    pass
admin.site.register(models.Graph, GraphAdmin)


class BenchCaseAdmin(admin.ModelAdmin):
    pass
admin.site.register(models.BenchCase, BenchCaseAdmin)


class BenchmarkTiming(admin.TabularInline):
    model = models.BenchmarkTiming


class BenchmarkSessionAdmin(admin.ModelAdmin):
    inlines = [
        BenchmarkTiming,
    ]
admin.site.register(models.BenchmarkSession, BenchmarkSessionAdmin)
