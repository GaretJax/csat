"""
A server to run a data collection session.
Runs multiple collectors and gathers the results.
"""

import json
import uuid
import random
from cStringIO import StringIO

from twisted.application import internet, service
from twisted.internet import reactor, protocol, defer, error
from twisted.protocols import basic
from twisted.python import log
from twisted.web import client, http_headers
from twisted.web.client import FileBodyProducer

from txjsonrpc.netstring import jsonrpc
from txjsonrpc.jsonrpc import BaseSubhandler
from txjsonrpc import jsonrpclib

from txws import WebSocketFactory

from csat import queue, tasks


class CollectorProcessProtocol(protocol.ProcessProtocol):
    def __init__(self, collector):
        self.buffer = ''
        self.doneDeferreds = []
        self.jsonrpc_handler = CsatCollectorInterface(collector)
        self.graph_output = StringIO()
        self.logger_output = StringIO()

    def outReceived(self, data):
        self.graph_output.write(data)

    def errReceived(self, data):
        lines = data.split('\n')

        for line in lines[:-1]:
            self.lineReceived(self.buffer + line)
            self.buffer = ''

        self.buffer += lines[-1]

    def lineReceived(self, line):
        try:
            self.jsonrpc_handler.stringReceived(line)
        except ValueError:
            self.logger_output.write(line + '\n')

    def errConnectionLost(self):
        if self.buffer:
            self.lineReceived(self.buffer)
        self.logger_output.seek(0)

    def outConnectionLost(self):
        self.graph_output.seek(0)

    def processEnded(self, status):
        if status.check(error.ProcessDone):
            while self.doneDeferreds:
                self.doneDeferreds.pop().callback((self, status))
        else:
            while self.doneDeferreds:
                status.protocol = self
                self.doneDeferreds.pop().errback(status)

    def whenDone(self):
        d = defer.Deferred()
        self.doneDeferreds.append(d)
        return d


class CollectorWrapper(object):

    def __init__(self, reactor, command, broker):
        self.uuid = str(uuid.uuid4())
        self.reactor = reactor
        self.command = command
        self.broker = broker
        self.protocol = None
        self.tasks = {}

    def spawn(self):
        """
        Spawns a subprocess to run the defined collector.
        """
        self.protocol = CollectorProcessProtocol(self)
        log.msg(' '.join(self.command))
        self.reactor.spawnProcess(self.protocol, self.command[0], self.command)
        return self.protocol.whenDone()

    def run(self):
        """
        Start listening and spawn the collector.
        """
        return self.spawn()

    def getTasks(self):
        return self.tasks.values()

    def addTask(self, task):
        self.tasks[task.uuid] = task
        exchange = self.broker.exchange('tasks')

        def pub(task):
            exchange.pub(task, ('task', self.uuid, task.uuid))
        task.observe(pub)
        pub(task)

    def updateTask(self, task):
        if task['uuid'] in self.tasks:
            self.tasks[task['uuid']].updateState(task)
        else:
            task = tasks.Task.fromState(task)
            self.addTask(task)


class CsatCollectionServer(object):
    """
    Central management unit for the CSAT collection server. Requests are
    processed here on the application level.
    """

    def __init__(self, reactor):
        self.reactor = reactor
        self.collectors = {}
        self.broker = queue.Broker()
        self.collectors = {}

    def getPrivateFactory(self):
        factory = jsonrpc.RPCFactory(CsatPrivateInterface)
        factory.server = self
        return factory

    def getPublicFactory(self):
        factory = jsonrpc.RPCFactory(CsatPublicInterface)
        factory.server = self
        factory.putSubHandler('broker', MessageBrokerInterface, (self.broker,))
        return WebSocketFactory(factory)

    def postbackResults(self, upload_task, url, success, graph, output):
        log.msg('Posting results back to {}'.format(url))
        upload_task.statusText = 'Uploading results to server...'

        data = {'successful': 'on'} if success else {}
        producer = MultipartFormProducer(data, {
            'graph': ('graph.graphml', 'application/graphml+xml', graph),
            'output': ('output.log', 'text/plain', output),
        })
        headers = http_headers.Headers()
        headers.setRawHeaders("Content-Type", [producer.content_type])

        agent = client.Agent(reactor)
        d = agent.request("POST", url, headers,
                          ProgressProducerWrapper(producer, upload_task))

        def done(res):
            upload_task.setCompleted()
            return res

        def fail(res):
            upload_task.status = tasks.Task.FAILED
            return res

        d.addCallbacks(done, fail)
        return d

    def runCollector(self, command, postback):
        """
        Starts running the requested collector and returns a unique ID to
        identify it.
        """
        collector = CollectorWrapper(reactor, command, self.broker)
        upload_task = tasks.Task('Uploading results')
        collector.addTask(upload_task)

        def postback_success((protocol, status)):
            return self.postbackResults(upload_task, str(postback), True,
                                        protocol.graph_output,
                                        protocol.logger_output)

        def postback_fail(status):
            return self.postbackResults(upload_task, str(postback), False,
                                        status.protocol.graph_output,
                                        status.protocol.logger_output)

        def clean(_):
            del self.collectors[collector.uuid]

        def run():
            d = collector.run()
            d.addCallbacks(postback_success, postback_fail)
            d.addBoth(clean)
        reactor.callLater(1, run)

        self.collectors[collector.uuid] = collector
        return collector.uuid

    def getCollector(self, name):
        return self.collectors[name]


class ProgressProducerWrapper(object):
    def __init__(self, producer, task):
        self.producer = producer
        self.length = self.producer.length
        self.task = task
        self.task.steps = self.length

    def startProducing(self, consumer):
        consumer = ProgressConsumerWrapper(consumer, self.task)
        return self.producer.startProducing(consumer)

    def pauseProducing(self):
        return self.producer.pauseProducing()

    def resumeProducing(self):
        return self.producer.resumeProducing()

    def stopProducing(self):
        return self.producer.stopProducing()


class ProgressConsumerWrapper(object):
    def __init__(self, consumer, task):
        self.task = task
        self.consumer = consumer

    def write(self, s):
        self.task.makeStep(len(s))
        return self.consumer.write(s)


class MultipartFormProducer(object):
    crlf = '\r\n'

    def __init__(self, fields, files):
        self.boundary = self._generate_boundary()
        self.content_type = self._get_content_type(self.boundary)
        self.fields = self._prepare_fields(fields)
        self.files = self._prepare_files(files)
        self.length = self._compute_length()
        self._current_producer = None

    def _compute_length(self):
        # Normal fields
        length = len(self.fields)

        # File fields
        length += sum((f[0] + len(self.crlf) for f in self.files))

        # Final boundary
        length += 2 * len('--') + len(self.boundary)

        return length

    def _prepare_fields(self, fields):
        data = []

        for name, value in fields.iteritems():
            data += [
                '--{}'.format(self.boundary),
                'Content-Disposition: form-data; name="{}"'.format(name),
                '',
                value,
            ]

        return self.crlf.join(data) + self.crlf

    def _prepare_files(self, files):
        filespecs = []

        for name, (filename, mime, file) in files.iteritems():
            headers = [
                '--{}'.format(self.boundary),
                ('Content-Disposition: form-data; name="{}"; filename="{}"'
                 .format(name, filename)),
                'Content-Type: {}'.format(mime),
                #'Content-Transfer-Encoding: binary',
                '', '',
            ]
            headers = self.crlf.join(headers)
            producer = FileBodyProducer(file)
            length = len(headers) + producer.length
            filespecs.append((length, headers, producer))

        return filespecs

    def _get_content_type(self, boundary):
        return 'multipart/form-data; boundary={}'.format(boundary)

    def _generate_boundary(self):
        randomChars = [str(random.randrange(10)) for _ in xrange(10)]
        return '----------CsatCollectorBoundary' + ''.join(randomChars)

    @defer.inlineCallbacks
    def startProducing(self, consumer):
        consumer.write(self.fields)

        for _, headers, producer in self.files:
            consumer.write(headers)
            self._current_producer = producer
            yield producer.startProducing(consumer)
            consumer.write(self.crlf)

        consumer.write('--' + self.boundary + '--')

    def pauseProducing(self):
        if self._current_producer:
            self._current_producer.pauseProducing()

    def resumeProducing(self):
        if self._current_producer:
            self._current_producer.resumeProducing()

    def stopProducing(self):
        for _, _, producer in self.files:
            producer.stopProducing()


class LineJsonRpc(basic.LineReceiver, jsonrpc.JSONRPC):

    delimiter = '\n'

    def lineReceived(self, line):
        self.stringReceived(line)

    def sendString(self, line):
        self.sendLine(line)


class JsonProtocolBase(jsonrpc.JSONRPC, object):
    """
    Compatibility layer to make jsonrpc.JSONRPC actually behave!
    """

    def __init__(self):
        """
        Call ALL superclass __init__ methods.
        """
        jsonrpc.JSONRPC.__init__(self)
        BaseSubhandler.__init__(self)

    def _cbRender(self, result, req_id):
        """
        A result is a result, I don't want to wrap it in a list.
        """
        if req_id is None:
            # This was a notification, don't bother
            return
        try:
            s = jsonrpclib.dumps(result, id=req_id, version=self.version)
        except:
            f = jsonrpclib.Fault(self.FAILURE, "can't serialize output")
            s = jsonrpclib.dumps(f, id=req_id, version=self.version)
        return self.sendString(s)

    def connectionMade(self):
        self.MAX_LENGTH = self.factory.maxLength
        for handler in self.subHandlers.itervalues():
            handler.transport = self.transport

    def connectionLost(self, reason):
        for handler in self.subHandlers.itervalues():
            handler.connectionLost(reason)

    def notify(self, func, *args):
        payload = {
            'method': func,
            'params': args,
        }
        self.sendString(json.dumps(payload))


class CsatPublicInterface(JsonProtocolBase):

    def __init__(self):
        super(CsatPublicInterface, self).__init__()
        self.subscriptions = {}
        self.tasks = {}

    def jsonrpc_getTasksForCollector(self, name):
        tasks = self.factory.server.getCollector(name).getTasks()
        return [task.getState() for task in tasks]

    def jsonrpc_echo(self, *params):
        if len(params) == 1:
            return params[0]
        return params


class MessageBrokerInterface(JsonProtocolBase):

    def __init__(self, broker):
        super(MessageBrokerInterface, self).__init__()
        self.broker = broker
        self.exclusive_queues = []

    def jsonrpc_exclusiveQueueBind(self, exchange, routing_key, callback):
        def sendUpdate(task):
            return self.notify(callback, task.getState())

        queue_name = str(uuid.uuid4())
        queue = self.broker.queue(queue_name)
        exchange = self.broker.exchange(exchange)
        queue.consume(sendUpdate)
        queue.bind(exchange, routing_key)
        self.exclusive_queues.append(queue)
        return queue.name

    def connectionLost(self, reason):
        # Close all exclusive queues
        for queue in self.exclusive_queues:
            queue.close()


class CsatCollectorInterface(JsonProtocolBase):

    def __init__(self, collector):
        super(CsatCollectorInterface, self).__init__()
        self.collector = collector

    def jsonrpc_updateTask(self, task):
        return self.collector.updateTask(task)


class CsatPrivateInterface(CsatPublicInterface):
    def jsonrpc_runCollector(self, command, postback):
        return self.factory.server.runCollector(command, postback)

server = CsatCollectionServer(reactor)
application = service.Application('csat-server')

# Private facing TCP (netstring) based service, to be used to administer the
# server.
tcpService = internet.TCPServer(7001, server.getPrivateFactory())
tcpService.setServiceParent(application)

# Public facing websocket-based service, to be used to get information from the
# web browser.
wsService = internet.TCPServer(7002, server.getPublicFactory())
wsService.setServiceParent(application)
