import importlib
import hashlib
import base64

from django.conf import settings


_collectors = None
_models_to_collectors = None


def _hash_type(c):
    h = hashlib.sha256(c)
    h.update(settings.SECRET_KEY)
    e = base64.urlsafe_b64encode(h.digest())
    return e


def _init_collectors():
    global _collectors, _models_to_collectors
    if _collectors is None:
        _collectors = {}
        _models_to_collectors = {}
        for c in settings.CSAT_COLLECTORS:
            h = _hash_type(c)
            collector = _load_collector(c)
            _collectors[h] = collector
            _models_to_collectors[collector().get_model()] = collector


def _load_collector(name):
    module, klass = name.rsplit('.', 1)
    collector = importlib.import_module(module)
    return getattr(collector, klass)


def get_collector(hashed):
    _init_collectors()

    try:
        return _collectors[hashed]
    except KeyError:
        raise ValueError('Invalid collector')


def get_collector_for_model(model):
    _init_collectors()
    return _models_to_collectors[model]


def get_types():
    _init_collectors()
    return _collectors.copy()
