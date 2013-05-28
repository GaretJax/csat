from csat.django.apps.base import bundles


three_js = bundles.make_js_bundle('three', [
    'js/three.js',
    'js/stats.js',
    'js/OrbitControls.js',
])

master = bundles.make_js_bundle('visualization', [
    bundles.coffee('viewer.old'),
    bundles.coffee('visualization'),
], filters=['coffeescript'])


master = bundles.make_js_bundle('viewer', [
    bundles.coffee('views'),
    bundles.coffee('rendering'),
    bundles.coffee('layout'),
    bundles.coffee('graph'),
    bundles.coffee('viewer'),
], filters=['coffeescript'])


seedrandom = bundles.make_js_bundle('seedrandom', [
    'js/seedrandom.js',
])

benchmarks = bundles.make_js_bundle('benchmarks_base', [
    bundles.coffee('views'),
    bundles.coffee('rendering'),
    bundles.coffee('layout'),
    bundles.coffee('graph'),
    bundles.coffee('benchmarks'),
], filters=['coffeescript'])

bundles.make_js_bundle('benchmarks', [
    seedrandom,
    benchmarks,
])
