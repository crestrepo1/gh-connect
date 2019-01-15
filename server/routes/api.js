import apiHandler from '../handlers/api';
import { captureEmails } from '../handlers/apiProxy';
import stateConfig from '../config/state'

export default [
    {
        method: 'GET',
        path: '/api/getNLS',
        config: {
            handler: apiHandler.getNLS,
            jsonp: 'callback',
            state: stateConfig
        }
    },
    {
        method: ['GET', 'POST'],
        path: '/api/getKey',
        config: {
            handler: apiHandler.cybersource,
            jsonp: 'callback',
            state: stateConfig
        }
    },
    {
        method: 'GET',
        path: '/api/vps/{vps_id}',
        config: {
            handler: apiHandler.getNumberByVpsId,
            jsonp: 'callback',
            state: stateConfig
        }
    },
    {
        method: 'POST',
        path: '/api/proxy/capture-emails',
        config: {
            handler: captureEmails,
            state: stateConfig
        }
    },
    {
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        path: '/api/{p*}',
        config: {
            handler: apiHandler.api,
            jsonp: 'callback',
            state: stateConfig
        }
    },
    // free trial API methods
    {
        method: 'POST',
        path: '/token/new',
        config: {
            handler: apiHandler.trialToken,
            jsonp: 'callback',
            state: stateConfig
        }
    },
    {
        method: ['GET', 'POST'],
        path: '/users/{p*}',
        config: {
            handler: apiHandler.trialConversion,
            jsonp: 'callback',
            state: stateConfig
        }
    },
];
