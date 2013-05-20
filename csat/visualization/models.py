from django.db import models
from django.template.defaultfilters import slugify


class Graph(models.Model):

    name = models.CharField(max_length=64)
    database = models.CharField(max_length=64)
    description = models.TextField()

    def get_upload_path(self, filename):
        extension = 'png'
        name = slugify(self.name)
        return 'databases/{}.{}'.format(name, extension)
    thumbnail = models.ImageField(upload_to=get_upload_path)

    def __unicode__(self):
        return self.name
