import os

from django.conf import settings

from django_assets import Bundle, register

from csat.django.apps.bootstrap.assets import css as bootstrap


shared = os.path.join(
    os.path.dirname(__file__),
    'assets', 'sass_shared')

compass_config = getattr(settings, 'COMPASS_CONFIG', None)

if compass_config is None:
    settings.COMPASS_CONFIG = compass_config = {}

compass_config.setdefault('additional_import_paths', []).append(shared)


if getattr(settings, 'ASSETS_VERSIONS', True):
    postfix = '-%(version)s'
else:
    postfix = ''


css = Bundle(
    'sass/*/screen.sass',
    filters=['compass'],
    depends=['sass/*/*.sass'],
    output='styles/screen{}.css'.format(postfix),
)
register('screen_css', css)


all_css = Bundle(
    bootstrap, css,
    filters=[],
    output='styles/master{}.css'.format(postfix),
)
register('all_css', all_css)


jquery_ui = Bundle(
    'js/jquery-ui-1.10.2.custom.js',
    output='scripts/jquery-ui{}.js'.format(postfix),
)
register('jquery_ui', jquery_ui)

jquery_websocket = Bundle(
    'js/jquery.websocket.js',
    output='scripts/jquery.websocket{}.js'.format(postfix),
)
register('jquery_websocket', jquery_websocket)

js = Bundle(
    'coffeescripts/*.coffee',
    filters=['coffeescript'],
    output='scripts/master{}.js'.format(postfix),
)
register('master_js', js)
