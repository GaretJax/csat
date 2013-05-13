import os

from django.conf import settings

from django_assets import Bundle, register

from csat.django.apps.bootstrap import assets as bootstrap


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
)
pygments = Bundle(
    'css/pygments.css',
)
screen_css = Bundle(
    pygments, css,
    output='styles/screen{}.css'.format(postfix),
)
register('screen_css', screen_css)

all_css = Bundle(
    bootstrap.css, css,
    filters=[],
    output='styles/master{}.css'.format(postfix),
)
register('all_css', all_css)

jquery = Bundle(
    'js/jquery-1.9.1.js',
    output='scripts/jquery{}.js'.format(postfix),
)
register('jquery', jquery)

jquery_ui = Bundle(
    'js/jquery-ui-1.10.2.custom.js',
    output='scripts/jquery-ui{}.js'.format(postfix),
)
register('jquery_ui', jquery_ui)

libraries = Bundle(
    'js/jquery-1.9.1.js',
    bootstrap.js,
    'js/jquery-ui-1.10.2.custom.js',
    output='scripts/libs{}.js'.format(postfix),
)
register('libraries_js', libraries)

js = Bundle(
    'coffeescripts/*.coffee',
    filters=['coffeescript'],
    output='scripts/master{}.js'.format(postfix),
)
register('master_js', js)
