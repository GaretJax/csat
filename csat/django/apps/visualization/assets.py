from django.conf import settings

from django_assets import Bundle, register


if getattr(settings, 'ASSETS_VERSIONS', True):
    postfix = '-%(version)s'
else:
    postfix = ''


three_js = Bundle(
    'js/three.js',
    output='scripts/three{}.js'.format(postfix),
)
register('three_js', three_js)
