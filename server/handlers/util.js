import Boom from 'boom';
import Wreck from 'wreck';
import raven from 'raven';
import config from 'config';
import parser from 'xml2json';
import forwarded from 'forwarded';
const Querystring = require('querystring');

const client = new raven.Client(config.loggingDSN);

export default {
    geoip: (request, reply) => {
        let locationData = {};
        let ip = '127.0.0.1';
        if (
            request.raw &&
            request.raw.req &&
            request.raw.req.connection &&
            request.raw.req.connection.remoteAddress
        ) {
            ip = forwarded(request.raw.req).pop();
        } else if (
            request.info &&
            request.info.remoteAddress
        ) {
            ip = request.info.remoteAddress;
        }

        if (ip.trim() === '') {
            ip = request.info.remoteAddress;
        }

        // set default IP for testing in dev environments
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
            // ip = '108.20.218.73'; // holliston
            ip = '174.192.4.199'; // boston
        }

        // if we don't have an IP address, we can't get the GEOIP
        if (ip.trim() === '127.0.0.1' || ip.trim() === '') {
            return reply(Boom.badRequest('Invalid IP address'));
        }

        const url = 'https://www.infosniper.net/ssl/';
        const payload = {
            'k' : process.env.GEOIP_SECRET,
            'ip_address' : ip
        }
        const opts = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            payload: Querystring.stringify(payload),
            timeout: 5000
        };

        return Wreck.request('POST', url, opts, (reqErr, res) => {
            // if request errors
            if (reqErr) {
                // log error
                client.captureMessage('GeoIP API Request Error', {
                    level: 'fatal',
                    extra: {
                        errorObj: reqErr
                    }
                });

                // error message to return to client (defaults to bad request)
                const message = reqErr.message || 'Bad Request';
                // return message and error object
                return reply(Boom.badRequest(message, reqErr));
            }

            return Wreck.read(res, null, (readErr, result) => {
                // if read errors
                if (readErr) {
                    // log error
                    client.captureMessage('GeoIP API Read Error', {
                        level: 'fatal',
                        extra: {
                            errorObj: readErr
                        }
                    });

                    // error message to return to client (defaults to bad request)
                    const readErrorMessage = readErr.message || 'Bad Read Request';
                    // return message and error object
                    return reply(Boom.badRequest(readErrorMessage, readErr));
                }

                // parse the xml as json
                try {
                    locationData = JSON.parse(parser.toJson(result));
                } catch (parseErr) {
                    // log error
                    client.captureMessage('GeoIP API JSON Parse Error', {
                        level: 'fatal',
                        extra: {
                            errorObj: parseErr
                        }
                    });

                    return reply(Boom.badRequest('JSON Parse Error', parseErr));
                }

                // infosniper data cleanup
                let loc = {};
                try {
                    loc = locationData.results.result;
                } catch (apiError) {
                    // log error
                    client.captureMessage('GeoIP API Unexpected Data Structure Error', {
                        level: 'fatal',
                        extra: {
                            errorObj: apiError
                        }
                    });
                    return reply(Boom.badRequest('GeoIP API Unexpected Data Structure Error', apiError));
                }

                // make sure the areacode is what we expect it to be
                // it should always be a string with a length of 3
                if (!loc.areacode || typeof loc.areacode !== 'string' || loc.areacode.length !== 3) {
                    return reply(Boom.badRequest('Invalid area code value'));
                }

                locationData = {
                    ip,
                    country: loc.country,
                    countrycode: loc.countrycode,
                    city: loc.city,
                    state: loc.state,
                    zip: loc.postalcode,
                    areacode: loc.areacode,
                    continent: loc.continent
                };

                return reply(locationData).code(res.statusCode);
            });
        });
    }
};
