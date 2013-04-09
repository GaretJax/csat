from django.conf import settings

from django_assets import Bundle, register


if getattr(settings, 'ASSETS_VERSIONS', True):
    postfix = '-%(version)s'
else:
    postfix = ''


css = Bundle(
    'sass/bootstrap-include.sass',
    filters=['compass'],
    output='styles/bootstrap{}.css'.format(postfix),
)
register('bootstrap_css', css)


js = Bundle(
    'js/bootstrap-tooltip.js', 'js/bootstrap-*.js', 'js/bootstrap-popover.js',
    filters=[],
    output='scripts/bootstrap{}.js'.format(postfix),
)
register('bootstrap_js', js)
