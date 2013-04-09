import re
import calendar
import urlparse
import gzip
from cStringIO import StringIO

from dateutil import parser

from twisted.internet import defer, reactor
from twisted.web import client

from bs4 import BeautifulSoup


class Collector(object):
    def collect(self):
        pass


class AsynchronousCollector(object):
    def collect(self):
        def p(res):
            print "Done."
            s = [0, 0]
            for (status, mails) in res:
                s[int(status)] += 1
            print s
            reactor.stop()

        d = self.asyncCollect(reactor)
        d.addCallback(p)
        reactor.run()


class Job(object):
    def __init__(self, tasks):
        self.tasks = tasks
        self.eventHandlers = []

    def __iter__(self):
        return iter(self.tasks)

    def onUpdate(self, func):
        self.eventHandlers.append(func)

    def _fireOnUpdate(self, task):
        for handler in self.eventHandlers:
            handler(self, task)

    def addTask(self, task):
        self.tasks.append(task)
        self._fireOnUpdate(task)


class Task(object):

    INACTIVE = 0
    RUNNING = 1
    PAUSED = 2
    COMPLETED = 3
    FAILED = 4
    INDEFINITE = -1

    STATUS_NAMES = {
        INACTIVE: 'waiting',
        RUNNING: 'running',
        PAUSED: 'paused',
        COMPLETED: 'completed',
        FAILED: 'failed',
        INDEFINITE: 'indefinite',
    }

    def __init__(self, name):
        self.eventHandlers = []
        self.name = name
        self._status = self.INACTIVE
        self._steps = 0
        self._totalSteps = 1
        self._statusText = ''
        self._progress = self.INDEFINITE

    def onUpdate(self, func):
        self.eventHandlers.append(func)

    def _fireOnUpdate(self):
        for handler in self.eventHandlers:
            handler(self)

    def started():
        pass

    @property
    def statusName(self):
        return self.STATUS_NAMES[self._status]

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, val):
        self._status = val
        self._fireOnUpdate()

    @property
    def statusText(self):
        return self._statusText

    @statusText.setter
    def statusText(self, val):
        self._statusText = val
        self._fireOnUpdate()

    @property
    def progress(self):
        return self._progress

    @progress.setter
    def progress(self, val):
        self._progress = val
        self._fireOnUpdate()

    @property
    def steps(self):
        return self._totalSteps

    @steps.setter
    def steps(self, val):
        self._totalSteps = val
        self._progress = self._steps / self._totalSteps

    def complete(self):
        self._status = self.COMPLETED
        self._progress = 1
        self._steps = self._totalSteps
        self._fireOnUpdate()

    def makeStep(self):
        self._status = self.RUNNING
        self._steps += 1
        self.progress = self._steps * 1.0 / self._totalSteps


class ConsoleRunner(object):

    def registerTask(self, job, task):
        task.onUpdate(self.taskUpdated)

    def taskUpdated(self, task):
        import json, sys

        print >>sys.stderr, json.dumps(('task.update', {
            'name': task.name,
            'status': task.status,
            'statusText': task.statusText,
            'progress': task.progress
        }))

        return

        for task in self.job:
            status = task.statusName
            if task.progress == task.INDEFINITE:
                bar = '-' * 80
                percent = '      ?'
            else:
                ticks = int(80 * task.progress)
                bar = '#' * ticks + '_' * (80 - ticks)
                percent = ' {:5.1f}%'.format(task.progress * 100)
            print '{:>30s}: {:80s}{} - {}'.format(task.name, bar, percent, status.capitalize())

    def run(self):
        collector = PipermailCollector()

        self.job = collector.getJob()

        for task in self.job:
            self.registerTask(self.job, task)

        self.job.onUpdate(self.registerTask)

        collector.collect()


class PipermailCollector(AsynchronousCollector):

    DATE_REGEX = re.compile(r'({})\s(\d{{4}})'.format(
        '|'.join(calendar.month_name).strip('|')))

    SPLIT_REGEX = re.compile(r'From \S+ at \S+\s+\S+\s+\S+\s+\d\d?\s+(?:\d\d:)'
                             '{2}\d\d \d{4}')

    FROM_REGEX = re.compile(r'(\S+) at (\S+) \([^\)]+\)')

    def __init__(self):
        parallel_fetch = 100
        self.url = 'http://twistedmatrix.com/pipermail/twisted-python/'
        self.getPageQueue = defer.DeferredSemaphore(parallel_fetch)

        self.fetchTask = Task('Fetching data')
        self.publishTask = Task('Publishing graph info')
        self.job = Job([self.fetchTask, self.publishTask])

    def getJob(self):
        return self.job

    def getPage(self, url):
        url = str(url)
        return self.getPageQueue.run(client.getPage, url)

    def getSoup(self, url):
        return self.getPage(url).addCallback(BeautifulSoup)

    def getGzipCompressed(self, url):
        def decompress(payload):
            stream = StringIO(payload)
            return gzip.GzipFile(fileobj=stream).read()
        return self.getPage(url).addCallback(decompress)

    def asyncCollect(self, reactor):
        def complete(_):
            self.fetchTask.complete()
            return _
        return self.getSoup(self.url).addCallback(self.gotIndex).addCallback(complete)

    def gotIndex(self, page):
        deferreds = []
        rows = page.find_all('tr')
        self.fetchTask.steps = len(rows)
        for row in rows:
            cells = row.find_all('td')
            header = cells[0].get_text()
            date = self.DATE_REGEX.match(header)
            if not date:
                continue
            month, year = date.groups()
            month, year = list(calendar.month_name).index(month), int(year)

            archive = cells[-1].a.get('href')
            archive = urlparse.urljoin(self.url, archive)

            d = self.getGzipCompressed(archive)
            def inc(r):
                self.fetchTask.makeStep()
                return r
            d.addCallback(inc)
            d.addCallback(self.gotMonth, year, month)
            deferreds.append(d)
        return defer.DeferredList(deferreds)

    def gotMonth(self, page, year, month):
        mails = self.SPLIT_REGEX.split(page)
        return [self.parseMail(m) for m in mails[1:]]

    def parseMail(self, text):
        mail = text.strip().split('\n\n', 1)

        headers = mail[0]
        body = mail[1] if len(mail) == 2 else ''

        headers = re.split('\n(?!\s)', headers)
        headers = [re.sub(r'\s+', ' ', h) for h in headers]
        headers = [self.parseHeader(h) for h in headers]

        parts = body.split('\n-------------- next part --------------\n')

        return {
            'headers': dict(headers),
            'body': parts,
        }

    def parseHeader(self, header):
        key, value = header.split(': ', 1)

        func = 'parseHeader_{}'.format(key.upper())
        func = getattr(self, func, None)
        if callable(func):
            value = func(value)

        return (key.lower(), value)

    def parseHeader_FROM(self, val):
        match = self.FROM_REGEX.match(val)
        email = '@'.join(match.groups())
        return email

    def parseHeader_DATE(self, val):
        try:
            return parser.parse(val)
        except ValueError:
            # Try again using fuzzy parsing
            return parser.parse(val, fuzzy=True)

    def parseHeader_REFERENCES(self, val):
        return val.split(' ')

    def parseHeader_SUBJECT(self, val):
        return re.sub(r'^([a-zA-Z]{1,3}:\s+)+', '', val)


if __name__ == '__main__':
    ConsoleRunner().run()
