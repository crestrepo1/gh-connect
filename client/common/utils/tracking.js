import isPlainObject from 'lodash/isPlainObject';

import stores from '~/common/stores/stores.js'

import containErrors from '~/common/utils/containErrors.js';

import { CARD_TYPE_OBJ } from '~/common/utils/consts.js';

// extract stores

const {convertToPaidStore, customTollFreeNumbersStore, lockNumberStore,
    transferNumberStore, offerSuiteStore, promoCodeStore,
    flexFrameStore, testingStore, formsStore} = stores;

// TRACKING EVENTS
export const createPersonalizedPurchaseEvent = containErrors(status => ({
    event: 'updateSignupTransaction',
    customParams: {
        xID: offerSuiteStore.offerName || '',
        xName: lockNumberStore.selectedNumberType,
        xNumberPrefix: lockNumberStore.selectedNumberPrefix || '',
        xSearchTerm: customTollFreeNumbersStore.customTollFreeSearchTerm || '',
        xTransactionStatus: status || '',
        xTrackDateTime: (new Date()).toISOString()
    }
}));

// Direct Buy API failure
export const createSignupErrorEvent = containErrors(err => ({
    event: 'signupError',
    signupError: err
}));

export const createBillingPageDataEvent = containErrors(() => ({
    event: 'billingPageData',
    selectedPlanName: offerSuiteStore.offerName,
    selectedPlanPrice: offerSuiteStore.selectedOfferSet[offerSuiteStore.selectedPlanTerm].monthlyPlanCost,
    transferRequested: transferNumberStore.transferNumber,
    selectedNumber: lockNumberStore.selectedNumberUI,
    selectedNumberType: lockNumberStore.selectedNumberType,
    promoCode: promoCodeStore.promoCodeName,
    promoCodeType: promoCodeStore.promoCodeType
}));

export const createTestingEvent = containErrors(() => ({
    event: 'Optimizely',
    optimizelyTest: testingStore.testVersion || 'Control'
}));

// mimics data-ga click tracking during Trial Signup process
export const createAnnualPricingEvent = containErrors(() => ({
    event: `annualPricing${offerSuiteStore.isTermMonthly ? 'Monthly' : 'Annual'}`
}));

// mimics data-ga click tracking during Trial Signup process
export const createSignupProgressEvent = containErrors((category, action) => ({
    event: 'signupProgress',
    category,
    action
}));

// successful Trial Signup
export const createTrialSignupSuccessEvent = containErrors(successObj => ({
    event: 'signupSuccess',
    trialSignup: 'Success',
    trialNumberType: transferNumberStore.transferNumber ?
        'KEEP NUMBER'
        :
        (['CUSTOM TOLL FREE', 'TOLL FREE', 'LOCAL'].find(
            type => lockNumberStore.selectedNumberType.toUpperCase() === type
        ) || ''),
    trialNumberPrefix: lockNumberStore.selectedNumberPrefix || '',
    trialCostumerId: successObj.ExternalCustomerId
}));

export const createConversionEvent = containErrors((successObj) => {
    // array of products (always has at least the plan)
    const productsArr = [
        {
            name: offerSuiteStore.offerName,
            id: convertToPaidStore.isUserConvertingToPaid ?
                'TRIAL NUMBER'
                :
                lockNumberStore.selectedNumberType.toUpperCase() === 'TRANSFER' ?
                    'KEEP NUMBER'
                    :
                    ['CUSTOM TOLL FREE', 'TOLL FREE', 'LOCAL'].find(
                        type => lockNumberStore.selectedNumberType.toUpperCase() === type
                    ) || '',
            price: successObj.Charges.PlanMonthlyFee,
            quantity: 1
        }
    ];

    if (!convertToPaidStore.isUserConvertingToPaid) {
        // add RYVM if they opted in
        if (formsStore.OptInReadYourVoicemail) {
            productsArr.push({
                name: 'OptInReadYourVoicemail',
                price: '0',
                quantity: 1
            });
        }

        // add SMS if they opted in
        if (formsStore.OptInSms) {
            productsArr.push({
                name: 'OptInSMS',
                price: offerSuiteStore.smsPerNumberCharge,
                quantity: 1
            });
        }
    }

    return {
        event: 'transactionComplete',
        paymentTerm: offerSuiteStore.selectedPlanTerm,
        numberPrefix: convertToPaidStore.isUserConvertingToPaid ? 'TRIAL NUMBER' : lockNumberStore.selectedNumberPrefix,
        purchaseType: convertToPaidStore.isUserConvertingToPaid ? 'Trial Buy' : 'Direct Buy',
        couponUsed: !!promoCodeStore.promoCodeName,
        revenueNoTax: offerSuiteStore.isTermMonthly ? offerSuiteStore.offerRecurringCharge : offerSuiteStore.offerRecurringCharge * 12,
        creditcardType: CARD_TYPE_OBJ[flexFrameStore.cardType],
        ecommerce: {
            currencyCode: 'USD',
            purchase: {
                actionField: {
                    id: convertToPaidStore.isUserConvertingToPaid ? successObj.ExternalCustomerID : successObj.ExternalCustomerId,
                    revenue: successObj.Charges.FirstMonthTotalCharge,
                    tax: successObj.Charges.TaxesAndSurcharges,
                    coupon: promoCodeStore.promoCodeName
                },
                products: productsArr
            }
        }
    };
});

// TRACKING FUNCTIONS

// Google Tag Manager utility
// https://developers.google.com/tag-manager/devguide
// tracking object has to match structure designated in GTM
// https://developers.google.com/tag-manager/enhanced-ecommerce#purchases
export const gtm = (trackingEvent, debug = true) => {
    window.dataLayer = window.dataLayer || [];
    try {
        if (!(trackingEvent && isPlainObject(trackingEvent))) throw Error('Tracking Event is invalid');
        if (debug) console.info(JSON.stringify(trackingEvent, null, 2)); // eslint-disable-line

        window.dataLayer.push(trackingEvent);
    } catch (err) {
        if (debug) console.error(err); // eslint-disable-line
    }
};

// script file must be present for this to work: if backend doesn't receive tracking, enable debug
export const scBeacon = (trackingEvent, debug = false) => {
    try {
        if (!window.SCBeacon) throw Error('Sitecore Beacon not found');
        const { event, data, dataKey, customParams } = trackingEvent;

        // all custom parameter names must start with 'x' (e.g. 'xKey1')
        for (const paramKey in customParams) { // eslint-disable-line
            if (paramKey[0] !== 'x') throw Error('Custom Sitecore parameter names must be camelCase, and must begin with "x"');
        }

        if (debug) console.info(`Beacon Event: '${event}', ${JSON.stringify({ data, dataKey, ...customParams }, null, 2)}`); // eslint-disable-line

        window.SCBeacon.trackEvent(event, { data, dataKey, ...customParams });
    } catch (err) {
        if (debug) console.error(err); // eslint-disable-line
    }
};
