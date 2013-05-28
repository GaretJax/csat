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


class BenchCase(models.Model):
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=16, unique=True)
    description = models.TextField()

    def get_timings(self):
        return self.sessions.values('commit').annotate(average_timing=models.Avg('timings__timing'))

    def __unicode__(self):
        return self.name


class BenchmarkSession(models.Model):
    testcase = models.ForeignKey(BenchCase, related_name='sessions')
    commit = models.CharField(max_length=100)
    data = models.TextField()
    user_agent = models.CharField(max_length=255)
    iterations = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u'{} ({}x, {}x)'.format(self.testcase, self.iterations, self.timings.count())


class BenchmarkTiming(models.Model):
    session = models.ForeignKey(BenchmarkSession, related_name='timings')
    timing = models.IntegerField()
