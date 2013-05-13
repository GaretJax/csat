#from bulbs.titan import Graph, Config
#config = Config('http://10.10.10.140:8182/graphs/db0/')
#g = Graph(config)
#print dir(g.scripts)
#script = g.scripts.get('get_vertices')

#print g.gremlin.command("""
#g.getVertices().count()
#""")


from __future__ import print_function

import struct
import msgpack
import random
import sys

from twisted.internet import reactor, endpoints, protocol, defer
from twisted.python import log


class Message(object):
    CHANNEL_CONSOLE = 1
    CHANNEL_MSGPACK = 2
    CHANNEL_GRAPHSON = 3
    channel = CHANNEL_MSGPACK


class Request(Message):
    def __init__(self, **kwargs):
        self.__dict__['_values'] = {}

        defaults = {
            'session': chr(0) * 16,
            'meta': {},
        }
        defaults.update(kwargs)

        for k, v in defaults.iteritems():
            setattr(self, k, v)

    def encode(self):
        values = [self._values[attr] for attr in self.Meta.fields]
        return msgpack.packb(values)

    def __setattr__(self, attr, value):
        if not attr in self.Meta.fields:
            raise AttributeError('No such attribute \'{}\' on \'{}\''.format(
                attr, self.__class__.__name__
            ))

        self._values[attr] = value

    def __getattr__(self, attr):
        if not attr in self.Meta.fields:
            raise AttributeError('No such attribute \'{}\' on \'{}\''.format(
                attr, self.__class__.__name__
            ))

        return self._values[attr]

    class Meta:
        fields = ('session', 'request')


class Response(Message):
    def __init__(self, payload):
        self._payload = payload
        self._decode()

    def _decode(self):
        values = msgpack.unpackb(self._payload)
        for k, v in zip(self.Meta.fields, values):
            setattr(self, k, v)


class SessionRequest(Request):
    def __init__(self, **kwargs):
        kwargs['channel'] = Message.channel  # This is the only supported one
        super(SessionRequest, self).__init__(**kwargs)

    class Meta:
        typeCode = 1
        fields = (
            'session',
            'request',
            'meta',
            'channel',
            'username',
            'password',
        )


class ScriptRequest(Request):
    class Meta:
        typeCode = 3
        fields = (
            'session',
            'request',
            'meta',
            'language',
            'script',
            'bindings',
        )


class SessionResponse(Response):
    class Meta:
        typeCode = 2
        fields = (
            'session',
            'request',
            'meta',
            'languages',
        )


class ScriptResponse(Response):
    class Meta:
        typeCode = 5
        fields = (
            'session',
            'request',
            'meta',
            'results',
            'bindings',
        )


class RexsterError(Exception):
    def __init__(self, message):
        self.original_exception, self.reason = message.message.split(':', 1)
        self.reason = self.reason.strip()
        self.reason = self.reason[0].upper() + self.reason[1:]
        self.original_message = message

    def __str__(self):
        return '{} ({})'.format(self.reason, self.original_exception)


class MalformedMessageError(RexsterError):
    code = 0
    explanation = 'The message sent to the RexPro Server was malformed.'


class InvalidSessionError(RexsterError):
    code = 1
    explanation = ('A session was requested that has either expired or no '
                   'longer exists.')


class ScriptExecutionError(RexsterError):
    code = 2
    explanation = 'A script failed to execute (likely cause is syntax error).'


class AuthenticationFailedError(RexsterError):
    code = 3
    explanation = 'Invalid username/password if authentication is turned on.'


class GraphNotFoundError(RexsterError):
    code = 4
    explanation = ('A graph requested via graphName meta attribute did not '
                   'exist.')


class InvalidChannelError(RexsterError):
    code = 5
    explanation = ('The channel requested did not exist or the channel was '
                   'changed after being established on the session.')


class SerializationError(RexsterError):
    code = 6
    explanation = ('The result or an item in the bindings could not be '
                   'serialized properly.')


class ErrorResponse(Response):

    exceptionTypes = {
        MalformedMessageError.code: MalformedMessageError,
        InvalidSessionError.code: InvalidSessionError,
        ScriptExecutionError.code: ScriptExecutionError,
        AuthenticationFailedError.code: AuthenticationFailedError,
        GraphNotFoundError.code: GraphNotFoundError,
        InvalidChannelError.code: InvalidChannelError,
        SerializationError.code: SerializationError,
    }

    class Meta:
        typeCode = 0
        fields = (
            'session',
            'request',
            'meta',
            'message',
        )

    def exception(self):
        exc_class = self.exceptionTypes[self.meta['flag']]
        return exc_class(self)


class RexsterProtocol(protocol.Protocol, object):

    MAX_LENGTH = 999999
    recvd = ''
    structFormat = "!BBI"
    prefixLength = struct.calcsize(structFormat)
    protocolVersion = 0
    responseMessageTypes = {
        SessionResponse.Meta.typeCode: SessionResponse,
        ScriptResponse.Meta.typeCode: ScriptResponse,
        ErrorResponse.Meta.typeCode: ErrorResponse,
    }

    def lengthLimitExceeded(self, length):
        log.msg('Length limit exceeded: {}'.format(length))
        self.transport.loseConnection()

    def unknownMessageType(self, messageType):
        log.msg('Unknown message type: {}'.format(messageType))
        self.transport.loseConnection()

    def unsupportedProtocolVersion(self, version):
        log.msg('Unsupported protocol version: {}'.format(version))
        self.transport.loseConnection()

    def dataReceived(self, recvd):
        self.recvd = self.recvd + recvd

        while len(self.recvd) >= self.prefixLength:
            protocolVersion, messageType, length = struct.unpack(
                self.structFormat,
                self.recvd[:self.prefixLength]
            )

            if protocolVersion != self.protocolVersion:
                self.unsupportedProtocolVersion(protocolVersion)
                return

            if messageType not in self.responseMessageTypes:
                self.unknownMessageType(messageType)
                return

            if length > self.MAX_LENGTH:
                self.lengthLimitExceeded(length)
                return

            if len(self.recvd) < length + self.prefixLength:
                break

            body = self.recvd[self.prefixLength:length + self.prefixLength]
            self.recvd = self.recvd[length + self.prefixLength:]
            message = self.responseMessageTypes[messageType](body)
            self.messageReceived(message)

    def messageReceived(self, message):
        pass

    def sendMessage(self, message):
        body = message.encode()
        header = struct.pack(self.structFormat, self.protocolVersion,
                              message.Meta.typeCode, len(body))
        self.transport.write(header + body)


class RexsterClientProxy(RexsterProtocol):

    def __init__(self):
        super(RexsterClientProxy, self).__init__()
        self._requests = {}
        self._request_id = random.getrandbits(128)
        self._session_id = chr(0) * 16
        self._session_started = False
        self.languages = set()

    def _getNextRequestId(self):
        self._request_id = (self._request_id + 1) % (2 ** 128)
        num = hex(self._request_id)[2:].rstrip('L')
        if len(num) % 2:
            num = '0' + num
        return num.decode('hex')

    def _getReadableId(self, id):
        id = id.encode('hex')
        l = []
        for i in (8, 4, 4, 4, 12):
            l.append(id[:i])
            id = id[i:]
        return '-'.join(l)

    def _makeRequest(self, message):
        request_id = self._getNextRequestId()
        session_id = self._session_id
        message.session = session_id
        message.request = request_id

        def checkError(message):
            if isinstance(message, ErrorResponse):
                raise message.exception()
            return message

        d = defer.Deferred()
        self._requests[request_id] = d
        self.sendMessage(message)
        d.addCallback(checkError)
        return d

    def messageReceived(self, message):
        try:
            deferred = self._requests.pop(message.request)
        except KeyError:
            self.unexpectedResponseReceived(message)
            return
        else:
            deferred.callback(message)

    def startSession(self, graph, username='', password=''):
        if self._session_started:
            raise RuntimeError('Session already started.')

        def initSession(message):
            if self._session_started:
                raise RuntimeError('Session already started.')

            self._session_started = True
            self._session_id = message.session
            self.languages = set(message.languages)
            self.sessionStarted()
            return self

        msg = SessionRequest(username=username, password=password)
        msg.meta['graphName'] = graph
        d = self._makeRequest(msg)
        d.addCallback(initSession)
        return d

    def stopSession(self):
        if not self._session_started:
            raise RuntimeError('Session not started or already closed.')

        def destroySession(message):
            if not self._session_started:
                raise RuntimeError('Session not started or already closed.')

            self._session_started = False
            self.languages = set()
            self._request_id = random.getrandbits(128)
            self.sessionStopped()
            self._session_id = chr(0) * 16
            return self

        msg = SessionRequest(username='', password='')
        msg.meta['killSession'] = True
        d = self._makeRequest(msg)
        d.addCallback(destroySession)
        return d

    def executeScript(self, script, params={}, language='groovy'):
        if not self._session_started:
            raise RuntimeError('A session has to be started prior to '
                               'executing scripts.')

        if language not in self.languages:
            raise RuntimeError('The server does not support \'{}\' scripts, '
                               'use one from the following list: {}.'.format(
                                   language,
                                   ', '.join(self.languages)
                               ))

        msg = ScriptRequest(script=script, bindings=params, language=language)
        msg.meta['channel'] = Message.channel
        msg.meta['isolate'] = False
        msg.meta['transaction'] = True
        msg.meta['inSession'] = True

        def unpackScriptResponse(message):
            return message.results

        d = self._makeRequest(msg)
        d.addCallback(unpackScriptResponse)
        return d

    def sessionStarted(self):
        sess_id = self._getReadableId(self._session_id)
        log.msg('Session {} started'.format(sess_id))

    def sessionStopped(self):
        sess_id = self._getReadableId(self._session_id)
        log.msg('Session {} stopped'.format(sess_id))

    def unexpectedResponseReceived(self, response):
        req_id = self._getReadableId(response.request)
        log.msg('Unexpected response received: {}'.format(req_id))
        self.transport.loseConnection()


class RexsterFactory(protocol.Factory):
    def buildProtocol(self, addr):
        return RexsterClientProxy()


class GraphProxy(object):
    def __init__(self, protocol):
        self.protocol = protocol

    def bind(self, name):
        self.name = name
        d = self.protocol.startSession(self.name)
        d.addCallback(lambda _: self)
        return d

    def vertices(self):
        return self.protocol.executeScript('g.getVertices()')

    def addVertex(self, vertex):
        return self.protocol.executeScript('g.addVertex(v)', {'v': vertex})


if __name__ == '__main__':
    def gotProtocol(proto):
        print("Sending message")

        def resultsReceived(results):
            import pprint
            pprint.pprint(results)

        def done(proto):
            #gotProtocol(proto)
            reactor.stop()

        def stopSession(_):
            proto.stopSession().addCallback(done)


        @defer.inlineCallbacks
        def sessionOpened(g):
            e = g.protocol.executeScript
            print(g.protocol.languages)

            def commit():
                return e('g.stopTransaction(SUCCESS)')

            def clear():
                return e('''
                        g.V.each{v->v.remove()}
                        g.stopTransaction(SUCCESS)
                        ''').addCallback(print)

            def getall():
                d = e('g.getVertices()')
                d.addCallback(pprint.pprint)
                return d

            def create(**kwargs):
                return e('g.addVertex(properties)', {'properties': kwargs})

            def count():
                return e('g.V.count()').addCallback(print)

            def one():
                return e('''
                        v=g.v(1)
                        if (v)
                            v.remove();
                        g.stopTransaction(SUCCESS)
                        ''').addCallback(print)

            def stop():
                return g.protocol.stopSession()

            import pprint

            #r = yield e('g.V.each{g.removeVertex(it)}; g.getVertices()')
            #yield getall()
            yield count()
            yield clear()
            yield count()
            #yield create()
            #yield getall()
            #yield commit()

            #r = yield e('g.createKeyIndex(name, Vertex.class)', {'name': 'name'})
            #print r
            def no():
                r = yield e('''
                if (g.getVertices(key, value).count() == 0) {
                    Vertex v = g.addVertex(null);
                    v.setProperty(key, value);
                }
                ''', {
                    'key': 'name',
                    'value': 'v1',
                })

                r = yield e('g.getVertices()')
                pprint.pprint(r)

            yield stop()

            reactor.stop()

        graph = GraphProxy(proto)
        graph.bind('neo4jsample').addCallback(sessionOpened)


    def connect():
        endpoint = endpoints.TCP4ClientEndpoint(reactor, '10.10.10.140', 8184)
        d = endpoint.connect(RexsterFactory())
        d.addCallback(gotProtocol)

    log.startLogging(sys.stderr)
    reactor.callWhenRunning(connect)
    reactor.run()
