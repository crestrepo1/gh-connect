const port = process.env.SIGNUP_API_PORT || '8090';
const host = process.env.SIGNUP_HOST || '127.0.0.1';
const apiUrl = process.env.API_URL || 'https://papi.us-stg.ghus-aws.com';
const mapiAuthUrl = process.env.MAPI_AUTH_URL || 'https://mobile-auth.us-stg.ghus-aws.com';
const mapiUrl = process.env.MAPI_URL || 'https://mobile-api.us-stg.ghus-aws.com';

module.exports = {
    apiUrl,
    mapiAuthUrl,
    mapiUrl,
    apiTimeout: 120000,
    apiVanityTimeout: 30000,
    fileCache: 'no-cache',
    host,
    loggingDSN: '',
    port
};
