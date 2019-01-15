const apiUrl = process.env.API_URL || 'https://papi.us.grasshopper.com';
const mapiAuthUrl = process.env.MAPI_AUTH_URL || 'https://mobile-auth.us-stg.ghus-aws.com';
const mapiUrl = process.env.MAPI_URL || 'https://mobile-api.us-stg.ghus-aws.com';

module.exports = {
    apiUrl,
    mapiAuthUrl,
    mapiUrl,
    fileCache: 'max-age=2629746000',
    loggingDSN: 'https://90f95384fd8e42c49aafa83a3f829c87:0e65d52955e14c7a8e6e478d9452424f@sentry.io/179696'
};
