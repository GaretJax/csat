from django.conf.urls import patterns, url


urlpatterns = patterns(
    'csat.acquisition.views',
    url(r'^sessions/$', 'session_index', name='session-index'),
    url(r'^session/new/$', 'session_create', name='session-create'),
    url(r'^session/(?P<pk>\d+)/$', 'session_view', name='session'),
    url(r'^session/(?P<pk>\d+)/edit/$', 'session_edit', name='session-edit'),
    url(r'^session/(?P<pk>\d+)/reset/$', 'session_reset',
        name='session-reset'),
    url(r'^session/(?P<pk>\d+)/run/$', 'session_run', name='session-run'),
    url(r'^session/(?P<pk>\d+)/delete/$', 'session_delete',
        name='session-delete'),
    url(r'^results/(?P<result_id>[^/]+)/$', 'collector_upload_results',
        name='collector-upload-results'),
    url(r'^session/(?P<session_pk>\d+)/add/(?P<collector>[^/]+)/$',
        'collector_create', name='collector-create'),
    url(r'^session/(?P<session_pk>\d+)/reconfig/(?P<collector_pk>\d+)/$',
        'collector_edit', name='collector-edit'),
    url(r'^session/(?P<session_pk>\d+)/remove/(?P<collector_pk>\d+)/$',
        'collector_remove', name='collector-remove'),
    url(r'^session/(?P<session_pk>\d+)/view/(?P<collector_pk>\d+).log(?P<html>.html)?$',
        'collector_view_log', name='collector-view-log'),
    url(r'^session/(?P<session_pk>\d+)/view/(?P<collector_pk>\d+).graphml(?P<html>.html)?$',
        'collector_view_results', name='collector-view-results'),

    url(r'^session/(?P<session_pk>\d+).graphml(?P<html>.html)?$',
        'session_view_results', name='session-view-results'),

#    url(r'^graphs/(?P<result_id>[A-Za-z0-9_-]+={0,2}).graphml',
#        'collector_result', name='collector-result'),
)
