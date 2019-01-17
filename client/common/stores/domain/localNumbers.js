import { action, observable, autorun, computed } from 'mobx';
import axios from 'axios';

import preselectedNumberObject from '~/common/utils/preselectedNumberObject.js';
import verifyPreselectedNumber from '~/common/utils/verifyPreselectedNumber.js';
import { ghPreselectedNumberType, ghArea } from '~/common/globals.js';
import { isAreaCodePremium } from '~/common/utils/premiumAreaCodes.js';

export default class LocalNumbersClass {
    @observable localNumbersFetching = false;
    // did the box error
    @observable localNumberError = false;
    // numbers returned from the API, for selection
    @observable localNumbers = [];
    // currently selected area code
    @observable selectedAreaCode = '';
    // pre selected number
    @observable preSelectedNumberIndex = 0;
    // if a user has ever searched
    @observable initialSearch = false;
    // search field value
    @observable query = '';
    // holder for previous search (used in error message)
    @observable previousAreaCode = '';

    constructor(rootStore) {
        this.lockNumberStore = rootStore.lockNumberStore;
        this.numberLockSessionStore = rootStore.numberLockSessionStore;

        autorun(() => {
            if (decodeURI(ghPreselectedNumberType()).toLowerCase() === 'local') {
                // set preselected number if available
                this.setPreselectedNumber();
            }
        });
    }

    @action setPreselectedNumber() {
        if (verifyPreselectedNumber('local')) {
            // set selected number with number user preselected
            this.lockNumberStore.setSelectedNumber(preselectedNumberObject());
            // set local area code
            this.selectedAreaCode = ghArea();
            // set locked number type
            this.lockNumberStore.setSelectedNumberType('Local');
            // lock number to session
            this.lockNumberStore.lockNumberToSession();
        }
    }

    @computed get selectedNumber() {
        if (this.localNumbers.length) {
            return this.localNumbers[this.preSelectedNumberIndex];
        }
        // return empty object
        return {};
    }

    // set selected numbers fetch
    @action setLocalNumbersFetch(bool) {
        // if bool type is boolean
        if (typeof bool === 'boolean') {
            // set local number error
            this.localNumbersFetching = bool;
        }
    }

    // set selected number error
    @action setLocalNumberError(bool) {
        // if bool type is boolean
        if (typeof bool === 'boolean') {
            // set local number error
            this.localNumberError = bool;
        }
    }

    @action setSelectedAreaCode(areaCode) {
        // if area type is string and has a length of 3
        if (typeof areaCode === 'string' && areaCode.length === 3) {
            this.previousAreaCode = this.selectedAreaCode;
            this.selectedAreaCode = areaCode;
        }
    }

    @action resetSelectedAreaCode() {
        this.selectedAreaCode = '';
    }

    @action resetLocalNumbers() {
        this.localNumbers = [];
    }

    // set pre selected number index
    @action setPreSelectedNumberIndex(index) {
        // if number index type is number
        if (typeof index === 'number') {
            // set selected number index
            this.preSelectedNumberIndex = index;
        }
    }

    // set pre selected number index
    @action setInitialSearch(bool) {
        // if number index type is number
        if (typeof bool === 'boolean') {
            // set selected number index
            this.initialSearch = bool;
        }
    }

    @action updateSearch(q) {
        if (typeof q === 'string' && q.length < 4) {
            this.query = q;
        }
    }

    // get a list of available numbers
    @action getLocalNumbersByNpa(areaCode) {
        // if areaCode exists and is a string
        if (typeof areaCode === 'string') {
            // reset error flag
            this.setLocalNumbersFetch(true);
            // set area code
            this.setSelectedAreaCode(areaCode);
            // get a list of available area codes based on country and state
            axios.get(`/api/LocalNumberCatalog/LocalNumbersbynpa?areaCode=${areaCode}&count=10&numberLockSessionId=${this.numberLockSessionStore.NLS}`)
                .then((response) => {
                    // no data
                    if (response.data.length === 0) {
                        this.setLocalNumberError(true);
                        this.setLocalNumbersFetch(false);
                        return false;
                    }
                    this.setLocalNumberError(false);
                    // set available area codes
                    this.setLocalNumbers(response.data);
                    return this.setLocalNumbersFetch(false);
                }).catch((err) => {
                    this.setLocalNumberError(true);
                    this.setLocalNumbersFetch(false);
                    return err;
                });
        }
    }

    // set local numbers
    @action setLocalNumbers(data) {
        // if data type is object
        if (typeof data === 'object') {
            // set toll free numbers
            this.localNumbers = data;
        }
    }

    // if selected area code is premium
    @computed get isSelectedAreaCodePremium() {
        if (!this.selectedAreaCode) return false;

        return isAreaCodePremium(this.selectedAreaCode);
    }
}
