import Hapi from 'hapi';
import Raven from 'raven';
import Config from 'config';

import stateConfig from './config/state'

// import routes array
import Routes from './routes';

// import plugins array
import Plugins from './plugins';

// pull version number out of package file
import { version as Version } from '../package.json';

// init logger service
Raven
    .config(
        Config.get('loggingDSN'), {
            release: Version,
            environment: process.env.NODE_ENV,
            tags: { side: 'server' }
        }
    )
    .install();

// init hapi
const server = new Hapi.Server();

// register server params
server.connection({
    host: Config.get('host'),
    port: Config.get('port')
});

server.register(Plugins, (err) => {
    if (err) {
        throw err;
    }

    // load array of routes
    server.route(Routes);

    // default catch-all route
    server.route({
        method: 'GET',
        path: '/{p*}',
        handler: (request, reply) => {
            if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== '') {
                return reply
                    .file('./build/index.html')
                    .header('Cache-Control', 'no-cache');
            }
            return reply
                .file('./client/index.html')
                .header('Cache-Control', 'no-cache');
        },
        config: {
            state: stateConfig
        }
    });
    server.start((e) => {
        if (e) {
            throw e;
        }

        const startMessage = `App v${Version} | Server start on port [${server.info.port}] in [${process.env.NODE_ENV}] mode on Node.js version [${process.versions.node}]`;

        if (process.env.NODE_ENV === 'production') {
            Raven.captureMessage(startMessage, {
                level: 'info'
            });
        } else {
            console.log(startMessage);
        }
    });
});
