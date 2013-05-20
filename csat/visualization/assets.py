from csat.django.apps.base import bundles


three_js = bundles.make_js_bundle('three', [
    'js/three.js',
    'js/OrbitControls.js',
])

master = bundles.make_js_bundle('visualization', [
    bundles.coffee('views'),
    bundles.coffee('viewer.old'),
    bundles.coffee('visualization'),
], filters=['coffeescript'])


master = bundles.make_js_bundle('viewer', [
    bundles.coffee('viewer'),
], filters=['coffeescript'])
