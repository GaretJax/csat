import os
import contextlib
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


def local_django(*cmd):
    args = (
        '--pythonpath=.',
        '--settings=csat.webapp.settings',
    )
    cmd = (('CSAT_ENVDIR={}'.format(env.local_envdir ), 'django-admin.py', )
           + cmd + args)
    return local(' '.join(cmd))


@task
def install():
    with settings(warn_only=True):
        sudo('useradd --home-dir {dir} --system --shell /bin/false --create-home '
             '{user}'.format(**env.app))

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
def uninstall():
    stop()
    sudo('userdel {user}'.format(**env.app))
    sudo('rm -rf {dir}'.format(**env.app))
    sudo('rm /etc/authbind/byport/{port}'.format(**env.app))


@task
def start():
    with appenv():
        run('authbind csat-webserver -n . tcp:{port}'.format(**env.app))
        #run('csat-acquisition-server')


@task
def stop():
    with appenv():
        with settings(warn_only=True):
            run('csat-webserver . -s')
            run('csat-acquisition-server -s')


@task
def assets():
    local_django('collectstatic', '--noinput')
    local_django('assets', 'build')
