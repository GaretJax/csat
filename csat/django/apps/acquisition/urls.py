from django.conf.urls import patterns, url


urlpatterns = patterns('csat.django.apps.acquisition.views',
    url(r'^sessions/$', 'session_index', name='session-index'),
    url(r'^sessions/create/$', 'session_create', name='session-create'),
    url(r'^session/(?P<pk>\d+)/edit/$', 'session_edit', name='session-edit'),
    url(r'^session/(?P<pk>\d+)/run/$', 'session_run', name='session-run'),
    url(r'^session/(?P<pk>\d+)/delete/$', 'session_delete', name='session-delete'),
    url(r'^session/(?P<session_pk>\d+)/add/(?P<collector>[^/]+)/$', 'collector_create', name='collector-create'),
    url(r'^session/(?P<session_pk>\d+)/reconfig/(?P<collector_pk>\d+)/$', 'collector_edit', name='collector-edit'),
    url(r'^session/(?P<session_pk>\d+)/remove/(?P<collector_pk>\d+)/$', 'collector_remove', name='collector-remove'),
)
