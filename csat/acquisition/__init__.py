from twisted import plugin

from csat import collectors
from csat.acquisition import base


def get_collector(key):
    for c in get_collector():
        if key == c.key:
            return c


def get_collectors():
    return plugin.getPlugins(base.ICollectorConfigurator, collectors)
