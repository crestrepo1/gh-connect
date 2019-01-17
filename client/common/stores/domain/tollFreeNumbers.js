import { observable, action, autorun, computed } from 'mobx';
import axios from 'axios';

import { ghPreselectedNumberType } from '~/common/globals.js';
import { isAreaCodePremium } from '~/common/utils/premiumAreaCodes.js';
import { extractAreaCode } from '~/common/utils/numberOperations.js';
import preselectedNumberObject from '~/common/utils/preselectedNumberObject.js';
import verifyPreselectedNumber from '~/common/utils/verifyPreselectedNumber.js';

export default class TollFreeNumbersClass {
    @observable tollFreeNumbers = [];
    @observable true800Numbers = [];
    @observable tollFreeNumbersError = false;
    @observable true800NumbersError = false;

    constructor(rootStore) {

        this.numberLockSessionStore = rootStore.numberLockSessionStore;
        this.lockNumberStore = rootStore.lockNumberStore

        autorun(() => {
            // if there is a number lock session or the number lock session changes
            if (decodeURI(ghPreselectedNumberType()).toLowerCase() === 'toll free') {
                // set preselected number if available
                this.setPreselectedNumber();
            } else if (this.numberLockSessionStore.NLS) {
                // if pre selected number is toll free
                // get true 800 number for default button
                this.get800Numbers();
                // get an initial random toll free numbers
                this.getTollFreeNumbers();
            }
        });
    }

    @action setPreselectedNumber() {
        if (verifyPreselectedNumber('Toll Free')) {
            // set selected number with number user preselected
            this.lockNumberStore.setSelectedNumber(preselectedNumberObject());
            // set locked number type
            this.lockNumberStore.setSelectedNumberType('Toll Free');
            // lock number to session
            this.lockNumberStore.lockNumberToSession(this.lockNumberStore.selectedNumberType);
        }
    }

    @action getTollFreeNumbers() {
        this.clearTollFreeNumbers();
        this.setTollFreeNumbersError(false);
        axios.get(`/api/NumberCatalog/ghnumber?city=TF&areaCode=8**&numberLockSessionId=${this.numberLockSessionStore.NLS}&count=10`)
            .then((response) => {
                // if response object
                if (typeof response === 'object' && typeof response.data === 'object') {
                    // set numbers
                    this.setTollFreeNumbers(response.data);
                }
            }).catch((err) => {
                // set error flag to true
                this.setTollFreeNumbersError(true);
                return err;
            });
    }

    @action get800Numbers(count = 1) {
        axios.get(`/api/NumberCatalog/ghnumber?city=TF&areaCode=800&numberLockSessionId=${this.numberLockSessionStore.NLS}&count=${count}`)
            .then((response) => {
                // if response object
                if (typeof response === 'object' && typeof response.data === 'object') {
                    // set numbers
                    this.set800Numbers(response.data);
                }
            }).catch((err) => {
                // set error flag to true
                this.set800NumbersError(true);
                return err;
            });
    }

    @action set800NumbersError(bool) {
        if (typeof bool === 'boolean') {
            this.true800NumbersError = bool;
        }
    }

    @action set800Numbers(data) {
        if (typeof data === 'object') {
            this.true800Numbers = data;
        }
    }

    // reset toll free numbers array
    @action clearTollFreeNumbers() {
        this.tollFreeNumbers = [];
    }

    @action setTollFreeNumbers(obj) {
        if (typeof obj === 'object') {
            this.tollFreeNumbers = obj;
        }
    }

    @action setTollFreeNumbersError(bool) {
        if (typeof bool === 'boolean') {
            this.tollFreeNumbersError = bool;
        }
    }

    @computed get fetchedTollFreeNumbers() {
        return this.tollFreeNumbers && this.tollFreeNumbers.length > 0;
    }

    @computed get fetched800Numbers() {
        return this.true800Numbers && this.true800Numbers.length > 0;
    }

    // finds the first toll free number that isn't premium (i.e. not an 800 area code)
    @computed get trialValidNumber() {
        if (!Array.isArray(this.tollFreeNumbers.slice())) return null;

        return this.tollFreeNumbers.find((num) => {
            const areaCode = extractAreaCode(num);
            if (!areaCode) return false;
            return !isAreaCodePremium(areaCode);
        }) || null;
    }
}
