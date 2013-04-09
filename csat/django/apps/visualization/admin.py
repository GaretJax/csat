from django.contrib import admin

from . import models

class GraphAdmin(admin.ModelAdmin):
    pass
admin.site.register(models.Graph, GraphAdmin)
