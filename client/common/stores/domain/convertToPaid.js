import { action, observable, computed, reaction } from 'mobx';
import { modalStore } from '~/common/stores/ui/modal.js';
import axios from 'axios';

import isPlainObject from 'lodash/isPlainObject';
import Raven from 'raven-js';

import {
    PLAN_TERM_MONTHLY, PLAN_TERM_ANNUAL,
    USER_LOGIN_GRANT_TYPE, USER_LOGIN_VERSION, USER_LOGIN_PRODUCT_GUID,
    PAYMENT_ESTIMATE_NO_TRIAL_ACCOUNT
} from '~/common/utils/consts.js';
import { convertNumberFormat } from '~/common/utils/numberOperations.js';
import deepGet from '~/common/utils/deepGet.js';
import { ghIsTransferNeeded } from '~/common/globals.js';

export default class ConvertToPaidClass {
    @observable authToken = '';
    @observable isUserConvertingToPaid = false;
    @observable canTrialBeConverted = true;
    @observable loginError = '';
    @observable userInfo = {}
    @observable trialNumberInfo = {}

    @observable invalidAddress = false;
    // payment estimate vars
    @observable calculatingTaxes = false;
    @observable estimatePaymentError = '';
    @observable orderTotal = {};

    @observable creatingAccount = false;
    @observable signupError = '';

    @observable timeoutErrorStep = '';

    bootstrapStore() {
        // react to auth token being set
        reaction(
            // when auth token changes
            () => this.authToken.length,
            () => {
                // if a token is added
                if (this.authToken.length > 0) {
                    // get user info
                    this.getUserInfo();
                } else {
                    // flush users info
                    this.setIsUserConvertingToPaid(false);
                    this.setCanTrialBeConverted(true);
                    this.setUserInfo({});
                    this.setTrialNumberInfo({});
                    this.setInvalidAddress(false);
                    this.setOrderTotal({});

                    if (modalStore.childComponentString === 'loginModal') modalStore.setModalOptions({ isModalOpen: true });
                }
            }
        );
    }

    @action setAuthToken(str) {
        if (typeof str === 'string') {
            this.authToken = str;
        }
    }

    @action setTimeoutErrorStep(str) {
        if (typeof str === 'string') {
            this.timeoutErrorStep = str;
        }
    }

    @action setIsUserConvertingToPaid(bool) {
        if (typeof bool === 'boolean') {
            this.isUserConvertingToPaid = bool;
        }
    }

    @action setCanTrialBeConverted(bool) {
        if (typeof bool === 'boolean') {
            this.canTrialBeConverted = bool;
        }
    }

    @action setLoginError(str) {
        if (typeof str === 'string') {
            this.loginError = str;
        }
    }

    @action setUserInfo(obj) {
        if (isPlainObject(obj)) {
            this.userInfo = obj;
        }
    }

    @action setTrialNumberInfo(obj) {
        if (isPlainObject(obj)) {
            this.trialNumberInfo = obj;
        }
    }

    // set flag saying we're calculating taxes
    @action setCalculatingTaxes(bool) {
        if (typeof bool === 'boolean') {
            this.calculatingTaxes = bool;
        }
    }

    @action setEstimatePaymentError(str) {
        if (typeof str === 'string') {
            this.estimatePaymentError = str;
        }
    }

    @action setInvalidAddress(bool) {
        if (typeof bool === 'boolean') {
            this.invalidAddress = bool;
        }
    }

    // set order total
    @action setOrderTotal(obj) {
        if (isPlainObject(obj)) {
            this.orderTotal = obj;
        }
    }

    @action setCreatingAccount(bool) {
        if (typeof bool === 'boolean') {
            this.creatingAccount = bool;
        }
    }

    @action setSignupError(str) {
        if (typeof str === 'string') {
            this.signupError = str;
        }
    }

    // log in user to get auth token
    @action authUser(requestBody) {
        const { email, password } = requestBody;

        axios.post('/token/new', {
            version: USER_LOGIN_VERSION,
            grant_type: USER_LOGIN_GRANT_TYPE,
            username: email,
            password,
            product_guid: USER_LOGIN_PRODUCT_GUID
        }).then((response) => {
            // set token
            this.setAuthToken(deepGet(response, ['data', 'Token']));
        }).catch((err) => {
            const errorResponseData = deepGet(err, ['response', 'data']);
            const errorString = deepGet(errorResponseData, ['Errors', 0]);

            if (typeof errorString === 'string') {
                // if trial has expired still set token
                if (errorString.includes('FreeTrial Account is Canceled')) {
                    // extract token from response string
                    const token = errorString.split('Token:');
                    // set token
                    this.setAuthToken(token[1]);
                } else {
                    // error was from invalid user credentials, alert user
                    this.setLoginError('Your email address and/or password are incorrect.');
                }
            } else {
                // report a general error and alert user
                this.setLoginError('Something went wrong. Please try again.');
                Raven.captureMessage('userLoginError', { extra: {
                    errorObj: errorResponseData
                } });
            }
        });
    }

    // grab users info so we can prepopulate it
    @action getUserInfo() {
        axios.get('/users/details', { headers: { Authorization: this.authToken }
        }).then((response) => {
            const { data } = response;

            // if auth token has expired
            if (data.Success === false) {
                throw new Error('expired token');
            }

            // if there is no expire date
            if (data.FreeTrialExpiry.length === 0) {
                // trial has been converted to paid don't let the user log in
                this.setCanTrialBeConverted(false);
                this.setLoginError('This account is already associated with a Grasshopper paid plan. Please go to grasshopper.com and log in to make any changes to your account.');
                throw new Error('Trial already converted to paid');
            }

            // current date
            const currentDate = new Date().getTime();
            // date the user signed up
            const signupDate = new Date(data.FreeTrialExpiry).getTime();
            // milliseconds * seconds * mins * hours * days = 19 days
            const trialTime = 1000 * 60 * 60 * 24 * 19;
            // if time passed is more than trial time
            if (currentDate - signupDate > trialTime) {
                // trial is expired and user can not convert
                this.setCanTrialBeConverted(false);
                // set error for user
                this.setLoginError('Your trial has expired and your number is no longer available. Please visit Grasshopper.com to select a new number and complete your purchase.');
                throw new Error('Trial expired, no number associated with it');
            }
            // set converting to paid to true
            this.setIsUserConvertingToPaid(true);
            // close modal
            if (modalStore.childComponentString === 'loginModal') modalStore.setModalOptions({ isModalOpen: false });
            // if no issues set user data
            this.setUserInfo({
                ...data,
                CancelledNumbers: data.CancelledNumbers ? convertNumberFormat(data.CancelledNumbers[0], 'UI') : false
            });
            // get users phone number if the account is expired
            if (!this.userInfo.CancelledNumbers) this.getTrialNumberInfo();
            return true;
        }).catch((err) => {
            // clear user info
            this.setAuthToken('');
            // if error capture it on Sentry
            Raven.captureMessage('getUserInfoError', { extra: {
                errorObj: err
            } });
            return err;
        });
    }

    @action getTrialNumberInfo() {
        const headers = { Authorization: this.authToken };

        axios.get(`/api/vps/${this.userInfo.VpsId}`, { headers })
            .then((response) => {
                const { data } = response;

                if (data && data[0]) {
                    this.setTrialNumberInfo({
                        ...data[0],
                        Number: convertNumberFormat(data[0].Number, 'UI'),
                        IsTransferNeeded: ghIsTransferNeeded() === 'true'
                    });
                }
            })
            .catch((err) => {
                // if error capture it on Sentry
                Raven.captureMessage('getTrialNumberInfoError', { extra: {
                    errorObj: err
                } });
                return err;
            });
    }

    // TODO: rearchitect this to be drier, the same logic happens when validating both api calls, it can be extracted to be handled by 1 function
    // estimate the payment based on plan and user location
    @action estimatePayment(requestBody, offerSet, locationCallback) {
        const orderTotal = {};
        const estimatePaymentObj = requestBody;

        // set calculating taxes
        this.setCalculatingTaxes(true);
        // add monthly plan id to the sign up object
        estimatePaymentObj.OfferId = offerSet[PLAN_TERM_MONTHLY].Id;
        axios.post('/users/ConvertFreeTrialEstimates', requestBody, { headers: { Authorization: this.authToken }
        }).then((response) => {
            // validate 200 response with success = false
            if (response.data.Success === false) {
                // if no error message, session has expired
                if (!response.data.ErrorText) {
                    // add error session expired copy to the modal
                    this.setLoginError('your session has expired please log in again');
                    // clear user info
                    this.setAuthToken('');

                    this.setTimeoutErrorStep('payment estimate');
                }

                // if trial account not found
                if (response.data.ErrorText === 'Not Free Trial Account') {
                    this.setEstimatePaymentError(PAYMENT_ESTIMATE_NO_TRIAL_ACCOUNT);
                    this.setCanTrialBeConverted(false);
                }

                // error is invalid zip
                if (response.data.ErrorText === 'Invalid ZIP Code') {
                    this.setInvalidAddress(true);
                    locationCallback();
                }
            }
            // add response to order total obj
            orderTotal[PLAN_TERM_MONTHLY] = response.data;
            // if there is a matching annual plan
            if (offerSet[PLAN_TERM_ANNUAL]) {
                // replace the monthly plan ID for the annual plan ID
                estimatePaymentObj.OfferId = offerSet[PLAN_TERM_ANNUAL].Id;
                // estimate annual prices
                axios.post('/users/ConvertFreeTrialEstimates', requestBody, { headers: { Authorization: this.authToken } })
                    .then((resp) => {
                        // validate 200 response with success = false
                        if (resp.data.Success === false) {
                            // if no error message, session has expired
                            if (!resp.data.ErrorText) {
                                // add error session expired copy to the modal
                                this.setLoginError('your session has expired please log in again');
                                // clear user info
                                this.setAuthToken('');

                                this.setTimeoutErrorStep('payment estimate');
                            }

                            // if trial account not found
                            if (resp.data.ErrorText === 'Not Free Trial Account') {
                                this.setEstimatePaymentError(PAYMENT_ESTIMATE_NO_TRIAL_ACCOUNT);
                                this.setCanTrialBeConverted(false);
                            }

                            // error is invalid zip
                            if (resp.data.ErrorText === 'Invalid ZIP Code') {
                                this.setInvalidAddress(true);
                                locationCallback();
                            }
                        }
                        // add response to the order total
                        orderTotal[PLAN_TERM_ANNUAL] = resp.data;
                        // set order total
                        this.setOrderTotal(orderTotal);
                    }).catch((err) => {
                        return err;
                    });
            } else {
                // set order total
                this.setOrderTotal(response.data);
            }
        }).catch((err) => {
            // add error session expired copy to the modal
            this.setLoginError('your session has expired please log in again');
            // clear user info
            this.setAuthToken('');
            // set error step
            this.setTimeoutErrorStep('payment estimate');
            // track error in Raven
            Raven.captureMessage('estimatePaymentError', { extra: {
                errorObj: err.response.data
            } });
            return err;
        }).then(() => {
            // set calculating taxes to false
            this.setCalculatingTaxes(false);
        });
    }

    // estimate the payment  based on plan and user location
    @action convertFreeTrial(requestBody, successCallback) {
        // open up creating account modal
        this.setCreatingAccount(true);
        axios.post('/users/ConvertFreeTrial', requestBody, { headers: { Authorization: this.authToken } })
            .then((response) => {
                successCallback(response);
            })
            .catch((err) => {
                // add error session expired copy to the modal
                this.setLoginError('your session has expired please log in again');
                // clear user info
                this.setAuthToken('');
                // set error step
                this.setTimeoutErrorStep('payment estimate');
                // track error in Raven
                Raven.captureMessage('convertToPaidError', {
                    extra: {
                        errorMessage: 'error not tracked',
                        error: err
                    }
                });
            })
            .then(() => {
                this.setCreatingAccount(false);
            });
    }
    // check if taxes are total amount is calculated
    @computed get calculatedTotal() {
        return isPlainObject(this.orderTotal) && this.orderTotal[PLAN_TERM_MONTHLY] && this.orderTotal[PLAN_TERM_MONTHLY].TotalAmount;
    }

    @computed get userNumber() {
        if (isPlainObject(this.userInfo) && this.userInfo.CancelledNumbers && this.userInfo.CancelledNumbers[0]) {
            return this.userInfo.CancelledNumbers;
        } else if (isPlainObject(this.trialNumberInfo) && this.trialNumberInfo.Number) {
            return this.trialNumberInfo.Number;
        }
        return false;
    }

    @computed get isTransferNeeded() {
        if (isPlainObject(this.trialNumberInfo)) {
            return this.trialNumberInfo.IsTransferNeeded;
        }
        return false;
    }
}
