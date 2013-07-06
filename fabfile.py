import os
import contextlib
import subprocess
import signal

from fabric.api import env, sudo, cd, settings, prefix, task, local


env.app = {
    'user': 'csat',
    'dir': '/srv/csat',
    'envdir': 'data',
    'package': 'https://github.com/GaretJax/csat/archive/develop.zip',
    'port': 80,
}
env.local_envdir = '/Users/garetjax/Dropbox/CSAT/workspace/sources/env'
env.user = 'root'
env.hosts = [
    'stoppani-1.tic.hefr.ch',
]


def run(cmd, *args, **kwargs):
    kwargs['user'] = env.app['user']
    return sudo(cmd, *args, **kwargs)


def appenv():
    return contextlib.nested(
        cd(os.path.join(env.app['dir'], env.app['envdir'])),
        prefix('source {dir}/bin/activate'.format(**env.app)),
    )


def local_django(*cmd, **kwargs):
    environ = ['CSAT_{}={}'.format(k.upper(), v) for k, v in kwargs.iteritems()]
    environ += ['CSAT_ENVDIR={}'.format(env.local_envdir)]
    args = [
        '--pythonpath=.',
        '--settings=csat.webapp.settings',
    ]
    cmd = environ + ['django-admin.py'] + list(cmd) + args
    return local(' '.join(cmd))


@task
def install():
    with settings(warn_only=True):
        sudo('useradd --home-dir {dir} --system --shell /bin/false '
             '--create-home {user}'.format(**env.app))

    sudo('apt-get install python-virtualenv libxml2-dev libxslt-dev authbind')
    sudo('touch /etc/authbind/byport/{port}'.format(**env.app))
    sudo('chgrp {user} /etc/authbind/byport/{port}'.format(**env.app))
    sudo('chmod g+x /etc/authbind/byport/{port}'.format(**env.app))

    with cd(env.app['dir']):
        sudo('virtualenv .', user=env.app['user'])
        with prefix('source bin/activate'):
            run('pip install {package}'.format(**env.app))
            run('csat-init {envdir}'.format(**env.app))


@task
def update():
    stop()
    with cd(env.app['dir']):
        with prefix('source bin/activate'):
            run('pip install -U {package}'.format(**env.app))


@task
def uninstall():
    stop()
    sudo('userdel {user}'.format(**env.app))
    sudo('rm -rf {dir}'.format(**env.app))
    sudo('rm /etc/authbind/byport/{port}'.format(**env.app))


@task
def start():
    with appenv():
        run('authbind csat-webserver . tcp:{port}'.format(**env.app))
        run('csat-acquisition-server -p tcp:1500')


@task
def stop():
    with appenv():
        with settings(warn_only=True):
            run('csat-webserver . -s')
            run('csat-acquisition-server -s')


@task
def restart():
    stop()
    start()


@task
def weblog():
    run('tail -f {dir}/{envdir}/webserver.log'.format(**env.app))


@task
def dev():
    processes = []
    for p in ['devserver', 'watch', 'livereload']:
        processes.append(subprocess.Popen(['fab', p]))

    try:
        for p in processes:
            p.wait()
    except KeyboardInterrupt:
        for p in processes:
            p.send_signal(signal.SIGINT)


@task
def devserver():
    local_django('runserver', debug=True)


@task
def watch():
    local_django('assets', 'watch', debug=True)


@task
def livereload():
    process = subprocess.Popen([
        'bundle', 'exec', 'guard',
        '-i',
        '-w', env.local_envdir,
        '-G', os.path.join(os.path.dirname(__file__), 'Guardfile'),
    ])
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()
        process.kill()


@task
def assets(clean=False):
    if clean:
        from csat import webapp
        static = os.path.join(os.path.dirname(webapp.__file__), 'static')
        local('rm -rf {}'.format(static))
    local_django('collectstatic', '--noinput')
    local_django('assets', 'build')


@task
def lint():
    local('flake8 --statistics --exit-zero --max-complexity=10 --benchmark '
          '--exclude=\'*/migrations/*\' csat')
