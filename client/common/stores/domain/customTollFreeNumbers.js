import { action, computed, observable, reaction } from 'mobx';
import axios from 'axios';

import { ghSearchTerm } from '~/common/globals.js';
import { isAreaCodePremium } from '~/common/utils/premiumAreaCodes.js';
import { extractAreaCode } from '~/common/utils/numberOperations.js';
import customTollFreeCharacterRestrictions from '~/common/utils/customTollFreeCharacterRestrictions.js';
import { numberMap } from '~/common/utils/highlightCustomTollFreeNumbers';

export default class CustomTollFreeNumbersClass {
    // term that user searched for in their last search
    @observable activeSearchTerm = '';
    // observable saying we're fetching
    @observable fetchingCustomTollFreeNumbers = false;
    // numbers has been fetched
    @observable fetchedCustomTollFreeNumbers = false;
    // error fetching custom toll free numbers
    @observable fetchedCustomTollFreeNumbersError = false;
    // prefixes has been fetched
    @observable fetchedCustomTollFreePrefixes = false;
    // prefixes has been fetched
    @observable fetchedCustomTollFreePrefixesError = false;
    // numbers returned from the API, for selection
    @observable customTollFreeNumbers = [];
    // prefixes returned from the API, for selection
    @observable customTollFreePrefixes = [];
    // prefix the user has selected
    @observable selectedCustomTollFreePrefix = '8**';
    // search term the user has entered
    @observable customTollFreeSearchTerm = '';
    // number selected in modal
    @observable numberSelectedInModal = {};
    // term that user searched for and selected a number from
    @observable selectedNumberTerm = '';
    // if a user has ever searched
    @observable initialSearch = false;

    constructor(rootStore) {
        this.numberLockSessionStore = rootStore.numberLockSessionStore;

        reaction(
            // if there is a number lock session or the number lock session changes and if search term is passed
            () => this.numberLockSessionStore && this.numberLockSessionStore.NLS && ghSearchTerm(),
            // set query string params
            () => this.cresetDataFromQueryStringteMicroForm()
        );
    }

    // get a list of custom toll free numbers, set tollFreeNumbers array & sets fetchedTollFreeNumbers
    @action getCustomTollFreeNumbers() {
        // remove previous list of custom toll free numbers
        this.setCustomTollFreeNumbers([]);
        // set active modal search term
        this.setActiveSearchTerm(this.customTollFreeSearchTerm);
        // set flag to say we're fetching numbers
        this.setFetchedCustomTollFreeNumbersError(false);
        this.setFetchedCustomTollFreeNumbers(false);
        this.setFetchingCustomTollFreeNumbers(true);
        // url string
        const url = this.customTollFreeSearchTerm
            ? `/api/NumberCatalog/ghnumber?city=TF&areaCode=${this.selectedCustomTollFreePrefix}&numberLockSessionId=${this.numberLockSessionStore.NLS}&count=10&vanityPattern=${this.customTollFreeSearchTerm}`
            : `/api/NumberCatalog/ghnumber?city=TF&areaCode=${this.selectedCustomTollFreePrefix}&numberLockSessionId=${this.numberLockSessionStore.NLS}&count=10`;
            // get a list of custom toll free numbers with specified type and count
        axios.get(url)
            .then((response) => {
            // set custom toll free numbersnumberLockSessionStore
                this.setCustomTollFreeNumbers(response.data);
                // set fetched flag
                this.setFetchedCustomTollFreeNumbers(true);
                // set initial search
                this.setFetchingCustomTollFreeNumbers(false);
                this.setInitialSearch(true);
            }).catch((err) => {
            // set fetched flag
                this.setFetchedCustomTollFreeNumbersError(true);
                this.setFetchingCustomTollFreeNumbers(false);
                this.setFetchedCustomTollFreeNumbers(false);
                return err;
            });
    }

    @action setDataFromQueryString() {
        const term = ghSearchTerm();

        // if there is a search term
        if (typeof term === 'string') {
            // set it in the store
            this.setPreselectedTerm(term);
        }
    }

    // set preselected term from query string
    @action setPreselectedTerm(term) {
        // force to uppercase (used for matching)
        const uppercaseTerm = term.toUpperCase();
        // strip out any disallowed characters
        const approvedTerm = customTollFreeCharacterRestrictions(uppercaseTerm);
        // trim term to a max length to 7
        const trimmedString = approvedTerm.substring(0, 7);
        // if seach term exists after trimming and character restrictions
        if (trimmedString.length > 0) {
            // set search term
            this.setActiveSearchTerm(trimmedString);
            this.setSelectedCustomTollFreeSearchTerm(trimmedString);
            this.setSelectedNumberTerm(trimmedString);
            this.getCustomTollFreeNumbers();
        }
    }

    @action resetSearchTerm() {
        this.customTollFreeSearchTerm = '';
    }

    @action setActiveSearchTerm(term) {
        // if term is a string
        if (typeof term === 'string') {
            // set custom toll free term user searched in modal
            this.activeSearchTerm = term;
        }
    }

    @action setSelectedNumberTerm(term) {
        // if term is a string
        if (typeof term === 'string') {
            // set custom toll free term user searched in modal
            this.selectedNumberTerm = term;
        }
    }

    // set selected custom toll free prefix
    @action setSelectedCustomTollFreeSearchTerm(term) {
        // if term is a string
        if (typeof term === 'string') {
            // set custom toll free prefix
            this.customTollFreeSearchTerm = term;
        }
    }

    // set custom toll free numbers
    @action setCustomTollFreeNumbers(data) {
        // if data and data has a length of 0 or more
        if (typeof data === 'object') {
            // set custom toll free numbers
            this.customTollFreeNumbers = data;
        }
    }

    // set fetchedCustomTollFreeNumbers flag
    @action setFetchedCustomTollFreeNumbers(bool) {
        if (typeof bool === 'boolean') {
            // set fetched custom toll free number flag
            this.fetchedCustomTollFreeNumbers = bool;
        }
    }

    // set custom toll free numbers error
    @action setFetchedCustomTollFreeNumbersError(bool) {
        if (typeof bool === 'boolean') {
            // set custom toll free numbers error
            this.fetchedCustomTollFreeNumbersError = bool;
        }
    }

    @action setFetchingCustomTollFreeNumbers(bool) {
        if (typeof bool === 'boolean') {
            // set fetching flag
            this.fetchingCustomTollFreeNumbers = bool;
        }
    }

    @action setInitialSearch(bool) {
        if (typeof bool === 'boolean') {
            // set initial search flag
            this.initialSearch = bool;
        }
    }

    // finds the first custom toll free number that isn't premium (i.e. not an 800 area code)
    @computed get trialValidNumber() {
        if (!Array.isArray(this.customTollFreeNumbers.slice())) return null;

        return this.customTollFreeNumbers.find((num) => {
            const areaCode = extractAreaCode(num);
            if (!areaCode) return false;
            return !isAreaCodePremium(areaCode);
        }) || null;
    }

    @computed get recommendedVanityNumber() {
        // set recommended vanity number if custom toll free numbers
        if (this.customTollFreeNumbers.length && this.activeSearchTerm) {
            // for term upper case for matching
            const term = this.activeSearchTerm.toUpperCase();
            // return full term match
            return this.customTollFreeNumbers.find(num => (
                typeof num.UI === 'string' &&
                num.UI.replace(/[^A-Za-z0-9]/g, '').toUpperCase().includes(term)
            ));
        }
        return false;
    }

    // get numeric representation of vanity search term
    @computed get vanityTermToNumbers() {
        if (this.activeSearchTerm) {
            // split the string into array, and replace numbers
            return this.activeSearchTerm.split('').map((value) => {
                const val = value.toUpperCase();
                // if letter
                if (numberMap[val]) {
                    // return number
                    return numberMap[val];
                }
                // otherwise return value
                return val;
            // join back into a string
            }).join('');
        }
        return false;
    }
}
