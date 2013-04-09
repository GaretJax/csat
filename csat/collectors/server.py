"""
A server to run a data collection session.
Runs multiple collectors and gathers the results.
"""

import json

from twisted.internet import reactor, protocol, defer, error
from twisted.protocols import basic


# Components
#  * list of collectors
#  * list of status publishers
#  * list of graph publishers


class CollectorProcessProtocol(protocol.ProcessProtocol):
    def __init__(self):
        self.buffer = ''
        self.doneDeferreds = []

    def errReceived(self, data):
        lines = data.split('\n')

        for line in lines[:-1]:
            self.lineReceived(self.buffer + line)
            self.buffer = ''

        self.buffer += lines[-1]

    def lineReceived(self, line):
        try:
            cmd, arguments = json.loads(line)
        except ValueError:
            # TODO: Log this
            #print line
            pass

    def processEnded(self, status):
        status.trap(error.ProcessDone)

        for d in self.doneDeferreds:
            d.callback(self)

    def whenDone(self):
        d = defer.Deferred()
        self.doneDeferreds.append(d)
        return d


class CollectorWrapper(object):

    def __init__(self, reactor, executable):
        self.reactor = reactor
        self.executable = executable

    def spawn(self):
        """
        Spawns a subprocess to run the defined collector.
        """
        protocol = CollectorProcessProtocol()
        self.reactor.spawnProcess(protocol, self.executable, [self.executable])
        return protocol.whenDone()

    @defer.inlineCallbacks
    def run(self):
        """
        Start listening and spawn the collector.
        """
        yield self.spawn()


COLLECTORS = [
    '/Users/garetjax/Projects/csat/sources/prototype/pipermail-runner.sh',
]


#@defer.inlineCallbacks
def run(reactor, collectors):
    #deferreds = [c.run() for c in collectors]

    #defer.DeferredList(deferreds)

    #reactor.stop()

    from txws import WebSocketFactory

    class WSProtocol(protocol.Protocol):
        def dataReceived(self, line):
            print repr(line)

        def connectionLost(self, reason):
            print reason

    class WSFactory(protocol.Factory):
        def buildProtocol(self, addr):
            print "buildporotocol", addr
            return WSProtocol()

    reactor.listenTCP(11111, WebSocketFactory(WSFactory()))

def main():
    # Start listening for incoming connections for each collector
    collectors = [CollectorWrapper(reactor, c) for c in COLLECTORS]

    # Spawn collector

    # Publish results

    reactor.callWhenRunning(run, reactor, collectors)
    reactor.run()


if __name__ == '__main__':
    main()
