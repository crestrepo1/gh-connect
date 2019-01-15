import Config from 'config';
import Boom from 'boom';
import Wreck from 'wreck';

// TODO: move this to a config file when we reconfig Hapi
// MUST READ: These API creds are not saved in repo and must NEVER be - reach out to: brayden.crossett@logmein.com and add the creds to your machine manually
const apiConfig = {
    rejoiner: {
        url: process.env.REJOINER_API_URL,
        key: process.env.REJOINER_API_KEY
    }
};

// TODO: determine proper timeouts exclusively for proxy APIs
const baseTimeout = Config.get('apiTimeout');
const vanityTimeout = Config.get('apiVanityTimeout');

export const captureEmails = (request, reply) => {
    const { method, payload } = request;
    const { url, key: apiKey } = apiConfig.rejoiner;
    const timeout = baseTimeout; // TODO: finish logic for determining timeout

    const opts = {
        headers: {
            'x-api-key': apiKey,
            'content-type': 'application/json;charset=UTF-8'
        },
        payload,
        timeout
    };

    return Wreck.request(method, url, opts, (reqErr, res) => {
        // if request errors
        if (reqErr) {
            // error message to return to client (defaults to bad request)
            const message = reqErr.message || 'Bad Request';
            // return message and error object
            return reply(Boom.badRequest(message, reqErr));
        }

        return Wreck.read(res, null, (readErr, result) => {
            // if read errors
            if (readErr) {
                // error message to return to client (defaults to bad request)
                const readErrorMessage = readErr.message || 'Bad Read Request';
                // return message and error object
                return reply(Boom.badRequest(readErrorMessage, readErr));
            }
            const resp = result.toString();
            return reply(resp)
                .code(res.statusCode)
                .header('no-cache');
        });
    });
}
