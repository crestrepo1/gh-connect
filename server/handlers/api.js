import Config from 'config';
import Boom from 'boom';
import Wreck from 'wreck';
import stripUnderscores from '../utils/stripUnderscores.js';

const baseTimeout = Config.get('apiTimeout');
const vanityTimeout = Config.get('apiVanityTimeout');

export default {
    api: (request, reply) => {
        const qs = stripUnderscores(request.url.query);
        const url = `${Config.get('apiUrl')}${request.url.pathname}${qs}`;
        const method = request.method;

        // set bool if this is a vanity query so we can lengthen the timeout
        const isVanity = Boolean(qs && qs.vanityPattern);
        const timeout = isVanity ? vanityTimeout : baseTimeout;

        const opts = {
            headers: {
                Authorization: process.env.API_BASIC_AUTH,
                'content-type': 'application/json;charset=UTF-8'
            },
            payload: request.payload,
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
    },

    // this route is used to proxy a GET to PAPI as a POST
    getNLS: (request, reply) => {
        const url = `${Config.get('apiUrl')}/api/NumberLockSession`;
        const timeout = baseTimeout;

        const opts = {
            headers: {
                Authorization: process.env.API_BASIC_AUTH,
                'content-type': 'application/json;charset=UTF-8'
            },
            timeout
        };

        return Wreck.request('POST', url, opts, (reqErr, res) => {
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

                return reply(result)
                    .code(res.statusCode)
                    .header('no-cache');
            });
        });
    },

    // API to get key for cybersource iframe
    cybersource: (request, reply) => {
        const qs = stripUnderscores(request.url.query);
        const url = `${Config.get('apiUrl')}/api/v1/cybersource${qs}`;
        const timeout = baseTimeout;

        const opts = {
            headers: {
                Authorization: process.env.API_BASIC_AUTH,
                'content-type': 'application/json;charset=UTF-8'
            },
            timeout
        };

        return Wreck.request('GET', url, opts, (reqErr, res) => {
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

                return reply(result)
                    .code(res.statusCode)
                    .header('no-cache');
            });
        });
    },

    // API to get trial token from mapi Auth
    trialToken: (request, reply) => {
        const url = `${Config.get('mapiAuthUrl')}${request.url.pathname}`;
        const timeout = baseTimeout;
        const opts = {
            payload: request.payload,
            headers: {
                Authorization: process.env.API_BASIC_AUTH,
                'content-type': 'application/json'
            },
            timeout
        };

        return Wreck.request('POST', url, opts, (reqErr, res) => {
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

                return reply(result)
                    .code(res.statusCode)
                    .header('no-cache');
            });
        });
    },

    // API to get trial token from mapi
    trialConversion: (request, reply) => {
        const qs = stripUnderscores(request.url.query);
        const url = `${Config.get('mapiUrl')}${request.url.pathname}${qs}`;
        const timeout = baseTimeout;
        const method = request.method;

        const opts = {
            payload: request.payload,
            headers: {
                Authorization: `OAuth ${request.headers.authorization}`,
                'content-type': 'application/json'
            },
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

                return reply(result)
                    .code(res.statusCode)
                    .header('no-cache');
            });
        });
    },
    // API to get trial token from mapi
    getNumberByVpsId: (request, reply) => {
        const url = `${Config.get('mapiUrl')}/vps/${request.params.vps_id}/accesspoints`;
        const timeout = baseTimeout;
        const method = request.method;

        const opts = {
            headers: {
                Authorization: `OAuth ${request.headers.authorization}`,
                'content-type': 'application/json'
            },
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

                return reply(result)
                    .code(res.statusCode)
                    .header('no-cache');
            });
        });
    }
};
