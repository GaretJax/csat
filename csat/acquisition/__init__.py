from __future__ import absolute_import

import hashlib
import base64

from twisted import plugin

from csat import collectors
from csat.acquisition import base


_collectors = None
_models_to_collectors = None


def _hash_type(c):
    from django.conf import settings

    name = c.__module__ + "." + c.__class__.__name__

    h = hashlib.sha256(name)
    h.update(settings.SECRET_KEY)
    e = base64.urlsafe_b64encode(h.digest())
    return e


def get_collector(hashed):
    _collectors = get_collectors()

    try:
        return _collectors[hashed]
    except KeyError:
        raise ValueError('Invalid collector')


def get_collectors():
    configurators = plugin.getPlugins(base.ICollectorConfigurator, collectors)
    return {_hash_type(c): c for c in configurators}
