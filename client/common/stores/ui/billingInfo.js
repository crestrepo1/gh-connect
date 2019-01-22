import { action, observable, computed } from 'mobx';
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

import { PLAN_TERM_MONTHLY, PLAN_TERM_ANNUAL } from '~/common/utils/consts.js';


export default class BillingInfoClass {
    @observable countries = [];
    @observable states = [];

    @observable fetchedCountries = false;
    @observable fetchedStates = false;
    @observable offshoreWarning = false;
    @observable countryHasStates = false;
    @observable invalidAddress = false;
    // payment estimate vars
    @observable calculatingTaxes = false;
    @observable estimatePaymentError = '';
    @observable orderTotal = {};


    // set countries data
    @action setCountries(data) {
        if (Array.isArray(data)) {
            this.countries = data;
        }
    }

    // set flag that we fetched countries
    @action setFetchedCountries(bool) {
        if (typeof bool === 'boolean') {
            this.fetchedCountries = bool;
        }
    }

    // set states data
    @action setStates(data) {
        if (typeof data === 'object') {
            this.states = data;
        }
    }

    // set fetched states flags
    @action setCountryHasStates(bool) {
        if (typeof bool === 'boolean') {
            this.countryHasStates = bool;
        }
    }

    // set fetched states flags
    @action setFetchedStates(bool) {
        if (typeof bool === 'boolean') {
            this.fetchedStates = bool;
        }
    }

    @action setInvalidAddress(bool) {
        if (typeof bool === 'boolean') {
            this.invalidAddress = bool;
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

    @action setOffshoreWarning(bool) {
        if (typeof bool === 'boolean') {
            this.offshoreWarning = bool;
        }
    }

    // set order total
    @action setOrderTotal(obj) {
        if (typeof obj === 'object') {
            this.orderTotal = obj;
        }
    }

    @action getCountries(callback) {
        this.setCountries([]);
        // reset fetched countries
        this.setFetchedCountries(false);
        // get countries sources
        axios.get('/api/Location/Countries')
            .then((response) => {
                const { data } = response;
                // set countries
                this.setCountries(data);
                // set fetched countries
                this.setFetchedCountries(true);
                callback();
            }).catch((err) => {
                return err;
            });
    }

    // get states
    @action getStates(countryCode = 'us') {
        this.setStates([]);
        // reset fetched states
        this.setFetchedStates(false);

        // get states
        axios.get(`/api/Location/States?countryCode=${countryCode}`)
            .then((response) => {
            // set states
                this.setStates(response.data);
                // set fetched states
                this.setFetchedStates(true);
            }).catch((err) => {
                return err;
            });
    }

    @action isNumberOffshore(contactPhone) {
        // MUST VALIDATE THAT THE contactPhone IS A VALID PHONE STRING
        // Must be a string
        if (typeof contactPhone === 'string') {
            // value to return
            let showRateFlyout = false;
            // remove non numbers
            const strippedNumber = contactPhone.replace(/[^0-9]/g, '');
            // remove all 0's and 1's at beginning of string
            const strippedNumberWithoutCountryCode = strippedNumber.replace(/^[0-1]+/, '');
            // pick off first 3 digits
            const requestPrefix = strippedNumberWithoutCountryCode.substring(0, 3);
            // area codes that we want to notify users about
            const prefixes = ['808', '907', '787', '939', '340'];
            // if the user's prefix is in the prefixes array, notify user
            prefixes.forEach((prefix) => {
                // if prefix matches
                if (prefix === requestPrefix) {
                    // set flag to true
                    showRateFlyout = true;
                }
            });
            // return show offshore rate value
            this.setOffshoreWarning(showRateFlyout);
        }
    }

    // estimate direct buy payment
    @action estimatePayment(sessionID, estimatePaymentObject, offerSet, errorCallback) {
        const orderTotal = {};
        const estimatePaymentObj = estimatePaymentObject;
        // set calculating taxes
        this.setCalculatingTaxes(true);
        // remove invalid address error
        this.setInvalidAddress(false);
        // add monthly plan id to the sign up object
        estimatePaymentObj.OfferId = offerSet[PLAN_TERM_MONTHLY].Id;
        // esimate taxes
        axios.put(`/api/signup?numberLockSessionId=${sessionID}`, estimatePaymentObj)
            .then((response) => {
                // add response to order total obj
                orderTotal[PLAN_TERM_MONTHLY] = response.data;
            }).catch((err) => {
                // hide taxes
                this.setCalculatingTaxes(false);
                errorCallback(err);
                return err;
            }).then(() => {
                // if there is a matching annual plan
                if (offerSet[PLAN_TERM_ANNUAL]) {
                    // replace the monthly plan ID for the annual plan ID
                    estimatePaymentObj.OfferId = offerSet[PLAN_TERM_ANNUAL].Id;
                    axios.put(`/api/signup?numberLockSessionId=${sessionID}`, estimatePaymentObj)
                        .then((response) => {
                            // add response to the order total
                            orderTotal[PLAN_TERM_ANNUAL] = response.data;
                            // set order total
                            this.setOrderTotal(orderTotal);
                            // set calculating false
                            this.setCalculatingTaxes(false);
                        }).catch((err) => {
                            // hide taxes
                            this.setCalculatingTaxes(false);
                            errorCallback(err);
                            return err;
                        });
                } else {
                    // set order total
                    this.setOrderTotal(orderTotal);
                    // set calculating false
                    this.setCalculatingTaxes(false);
                }
            });
    }

    // order countries dropdown
    @computed get orderedCountries() {
        const countries = this.countries;
        // if countries exists
        if (typeof countries === 'object' && countries.length > 0) {
            // sort by name
            countries.sort((a, b) => {
                return a.Name < b.Name;
            });
            // add default select value
            if (countries[0].Code) {
                countries.unshift({ Name: 'Country', Code: '', HasStates: false });
            }
            // return countries
            return countries;
        }
        return countries;
    }

    // order states
    @computed get orderedStates() {
        const states = this.states;
        // if states exists
        if (typeof states === 'object' && states.length > 0) {
            // sort by name
            states.sort((a, b) => {
                return a.Name < b.Name;
            });
            // add default select value
            if (states[0].Code) {
                states.unshift({ Name: 'State', Code: '' });
            }
            // return states
            return states;
        }
        return states;
    }

    // check if taxes are total amount is calculated
    @computed get calculatedTotal() {
        return isPlainObject(this.orderTotal) && this.orderTotal[PLAN_TERM_MONTHLY] && this.orderTotal[PLAN_TERM_MONTHLY].TotalAmount;
    }
}
