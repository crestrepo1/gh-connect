import forwarded from 'forwarded';
import Handler from '../handlers/util';
import stateConfig from '../config/state'

export default [
    {
        method: 'GET',
        path: '/status',
        handler: (request, reply) => {
            reply('ok').code(200);
        }
    },
    {
        method: 'POST',
        path: '/util/geoip',
        config: {
            handler: Handler.geoip,
            state: stateConfig
        }
    },
    {
        method: 'POST',
        path: '/util/ip',
        config: {
            handler: (request, reply) => {
                let ip = '127.0.0.1';

                if (request.raw.req && request.raw.req.connection && request.raw.req.connection.remoteAddress) {
                    ip = forwarded(request.raw.req).pop();
                } else if (request.info && request.info.remoteAddress) {
                    ip = request.info.remoteAddress;
                }

                reply(ip).code(200);
            },
            state: stateConfig
        }
    },
    {
        method: 'GET',
        path: '/util/date',
        config: {
            handler: (request, reply) => {
                reply(new Date().getFullYear());
            },
            state: stateConfig

        }
    }
];
