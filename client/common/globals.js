import Raven from 'raven-js';
// import axios from 'axios';
// import logError from '~/common/utils/errorLogging.js';
import smoothscrollPolyfill from 'smoothscroll-polyfill';

import UrlParam from '~/common/utils/urlParam.js';
// import { numberLockSessionStore } from '~/common/stores/domain/numberLockSession.js';
// import deepGet from '~/common/utils/deepGet.js';
import { OFFER_SUITE_DEFAULT } from '~/common/utils/consts.js';

// polyfill the scroll* (intoView, By, & To) api for the DOM
smoothscrollPolyfill.polyfill();

// log API errors in prod
/* istanbul ignore next */
// if (ENV === 'production') { // eslint-disable-line
//     // sentry error tracking
//     // VERSION and ENV below are passed in via webpack
//     Raven
//         .config(
//             'https://90f95384fd8e42c49aafa83a3f829c87@sentry.io/179696', {
//                 release: VERSION, // eslint-disable-line
//                 environment: ENV, // eslint-disable-line
//                 tags: { side: 'client' }
//             }
//         )
//         .install();

//     // create random ID
//     Raven.setUserContext({
//         id: `_${Math.random().toString(36).substr(2, 9)}`
//     });
// }

// log API errors
// axios.interceptors.response.use(
//     response => response,
//     (err) => {
//         // Invalid or expired NumberLockSessionId
//         if (deepGet(err, ['reponse', 'data', 'Details', 0, 'ErrorCode']) === 5004) {
//             // Set NLS error
//             numberLockSessionStore.setNLSError(true);
//         }
//         logError(err);
//         return Promise.reject(err);
//     }
// );

export const ghOfferSuite = () => { return UrlParam('ghos', 'alphaNumericOnly', '-'); };
export const ghPreselectedPlan = () => { return UrlParam('ghpp', 'alphaNumericOnly'); };
export const ghNoPlan = () => { return UrlParam('ghnp'); };
export const ghIsTransferNeeded = () => { return UrlParam('itn', 'alphaNumericOnly'); };
export const ghPromoCode = () => { return UrlParam('promocode', 'alphaNumericOnly') || UrlParam('ghpc', 'alphaNumericOnly'); };
export const ghNumberModal = () => { return UrlParam('ghnm'); };
export const ghSearchTerm = () => { return UrlParam('ghsearch', 'alphaNumericOnly'); };
export const ghSearchPrefix = () => { return UrlParam('ghprefix'); };
export const ghCountry = () => { return UrlParam('ghcountry', 'alphaOnly'); };
export const ghState = () => { return UrlParam('ghstate', 'alphaOnly'); };
export const ghCity = () => { return UrlParam('ghcity', 'alphaOnly'); };
export const ghArea = () => { return UrlParam('gharea', 'numericOnly'); };
export const ghUi = () => { return UrlParam('ghui', 'numericOnly', '()- '); };
export const ghE164 = () => { return UrlParam('ghe164', 'alphaNumericOnly', '+'); };
export const ghSms = () => { return UrlParam('ghsms', 'alphaOnly'); };
export const ghTrialSelected = () => { return UrlParam('ghts', 'alphaOnly'); };
export const ghPreselectedNumberType = () => { return UrlParam('ghpsnt', 'alphaOnly', ' '); };
export const ghNls = () => { return UrlParam('ghnls', 'alphaNumericOnly', '-'); };
export const ghToken = () => { return UrlParam('convert', 'alphaNumericOnly', '='); };
// offer suite discount amount
export const ghOp = () => { return UrlParam('ghOp', 'numericOnly'); };

// Offer Suite / Plans
export const defaultOfferSuiteId = () => { return ghOfferSuite() || OFFER_SUITE_DEFAULT; };
