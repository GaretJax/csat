from django.conf.urls import patterns, url


urlpatterns = patterns(
    'csat.visualization.views',
    url(r'^$', 'database_list', name='database-list'),
    url(r'^viewer/$', 'standalone_viewer', name='standalone-viewer'),
    url(r'^benchmarks/$', 'benchmarks'),
    url(r'^(?P<pk>\d+)/$', 'graph', name='render-graph'),
)
