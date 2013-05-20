import argparse

from twisted.python.filepath import FilePath

from twisted.python.runtime import platformType
if platformType == "win32":
    from twisted.scripts._twistw import (
        ServerOptions,
        WindowsApplicationRunner as _SomeApplicationRunner
    )
else:
    from twisted.scripts._twistd_unix import (
        ServerOptions,
        UnixApplicationRunner as _SomeApplicationRunner
    )


def main():
    parser = argparse.ArgumentParser('csat-acquisition-server')
    parser.add_argument('-n', '--nodaemon', action='store_false', dest='daemonize')
    args = parser.parse_args()

    server_module = FilePath(__file__).parent().sibling('server.py')
    options = [
        '-y', server_module.path,
    ]
    if args.daemonize:
        options += [
            '--pidfile', 'csat.pid',
            '--logfile', 'csat.log',
        ]
    else:
        options += [
            '-n',
        ]
    config = ServerOptions()
    config.parseOptions(options)
    _SomeApplicationRunner(config).run()


if __name__ == '__main__':
    main()
