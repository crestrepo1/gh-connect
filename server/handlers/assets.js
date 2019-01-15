import config from 'config';

const fileCache = config.get('fileCache');

export default {
    assets: (request, reply) => {
        return reply
            .file(`./build/${request.url.pathname}`)
            .header('Cache-Control', fileCache);
    }
};
