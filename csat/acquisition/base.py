from __future__ import absolute_import

import abc
import argparse

from zope.interface import implementer, Interface

from twisted.plugin import IPlugin

from polymorphic.base import PolymorphicModelBase


class ICollectorRunner(Interface):
    pass


class ICollectorConfigurator(Interface):
    pass


class _ConfiguratorMeta(PolymorphicModelBase, abc.ABCMeta):
    pass


@implementer(ICollectorConfigurator, IPlugin)
class ConfiguratorBase(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_model(self):
        pass

    @abc.abstractmethod
    def get_command(self, model):
        pass

    @abc.abstractproperty
    def version(self):
        pass

    @abc.abstractproperty
    def name(self):
        pass

    @abc.abstractproperty
    def key(self):
        pass


@implementer(ICollectorRunner, IPlugin)
class RunnerBase(object):
    """
    Base data collection class to implement an actual collector runner.

    The log and tasks attributes will be set by the enclosing Runner
    instance before calling the run method.
    """
    __metaclass__ = abc.ABCMeta

    def build_parser(self, base):
        parser = argparse.ArgumentParser(parents=[base])
        parser.add_argument('--version', action='version',
                            version='{} {}'.format(self.name, self.version))
        return parser

    @abc.abstractproperty
    def key(self):
        pass

    @abc.abstractproperty
    def version(self):
        pass

    @abc.abstractproperty
    def name(self):
        pass

    @abc.abstractmethod
    def run(self, args):
        pass
