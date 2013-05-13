from __future__ import absolute_import

from twisted import plugin

from csat import collectors
from csat.acquisition import base


_collectors = None
_models_to_collectors = None


def get_collector(hashed):
    _collectors = get_collectors()

    try:
        return _collectors[hashed]
    except KeyError:
        raise ValueError('Invalid collector')


def get_collectors():
    configurators = plugin.getPlugins(base.ICollectorConfigurator, collectors)
    return {c.key: c for c in configurators}
