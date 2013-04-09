from django.conf.urls import patterns, url


urlpatterns = patterns('csat.django.apps.visualization.views',
    url(r'^$', 'database_list', name='database-list'),
    url(r'^(?P<pk>\d+)/$', 'graph', name='render-graph'),
)
