import { action, computed, observable } from 'mobx';
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

import { isAreaCodePremium } from '~/common/utils/premiumAreaCodes.js';

export default class LockNumberClass {
    @observable numberIsLocked = false;
    @observable numberIsLockedUI = true; // move to UI store if test wins
    @observable selectedNumber = {};
    @observable lockingNumber = false;
    // the current number select, capitalized (Custom Toll Free, Toll Free, Local, or Transfer)
    @observable selectedNumberType = '';

    constructor(rootStore) {
        this.numberLockSessionStore = rootStore.numberLockSessionStore;
        this.transferNumberStore = rootStore.transferNumberStore;
        this.modalStore = rootStore.modalStore;
    }

    @action lockNumberToSession(typeOfNumber) {
        // reset number is locked flag
        this.setNumberIsLocked(false);
        // attempting to lock number
        this.setLockingNumber(true);
        // get a new NLS ID since we don't already have one
        axios.put('/api/NumberLockSession/', {
            SessionId: this.numberLockSessionStore.NLS,
            NumbersToBeLocked: [this.selectedNumberE164]
        })
            .then((response) => {
                // numbers match, and are locked, then try and go to SMS
                if (response.data.LockedNumbers[0] === response.data.NumbersToBeLocked[0]) {
                    // set number is locked
                    this.setNumberIsLocked(true);
                    this.setLockingNumber(false);
                    // if transfer number, add that number to the store
                    if (typeOfNumber === 'transfer') {
                        this.transferNumberStore.setTransferNumber(true);
                    }
                } else { // else show the cantLockNumberToSessionModalContent
                    // reset number is locked
                    this.setNumberIsLocked(false);
                    this.setLockingNumber(false);
                    // open error modal
                    this.modalStore.setModalOptions({
                        isModalOpen: true,
                        isModalClosable: true,
                        modalType: 'medium',
                        childComponentString: 'cantLockNumberToSessionModalContent'
                    });
                }
            }).catch((err) => {
                // Don't open if there is an NLS error
                if (!this.numberLockSessionStore.NLSerror) {
                    this.modalStore.setModalOptions({
                        isModalOpen: true,
                        isModalClosable: true,
                        modalType: 'medium',
                        childComponentString: 'cantLockNumberToSessionModalContent'
                    });
                }
                // reset number is locked
                this.setNumberIsLocked(false);
                this.setLockingNumber(false);
                // catch errors from sources other than API
                return err;
            });
    }

    @action setNumberIsLocked(bool) {
        // if bool exists and is a boolean
        if (typeof bool === 'boolean') {
            // set number is locked
            this.numberIsLocked = bool;
        }
    }

    @action setNumberIsLockedUI(bool) {
        // if bool exists and is a boolean
        if (typeof bool === 'boolean') {
            // set number is locked
            this.numberIsLockedUI = bool;
        }
    }

    // set selected number
    @action setSelectedNumber(obj) {
        // if number object is passed
        if (typeof obj === 'object' && obj.E164) {
            // set selected number object
            this.selectedNumber = obj;
        }
    }

    @action setLockingNumber(bool) {
        // if type exists
        if (typeof bool === 'boolean') {
            // set selected number type
            this.lockingNumber = bool;
        }
    }

    // set the type of number select (custom toll free, toll free, or local)
    @action setSelectedNumberType(type) {
        // if type exists
        if (typeof type === 'string') {
            // set selected number type
            this.selectedNumberType = type;
        }
    }

    @action flushSelectedNumber() {
        this.selectedNumber = {};
        this.selectedNumberType = '';
    }

    // get the E164 value out of the selected number object
    @computed get selectedNumberE164() {
        const number = this.selectedNumber;
        // if selected number and E164 number exist
        if (isPlainObject(number) && number.E164) {
            // return E164 number
            return number.E164;
        }
        // otherwise return false
        return false;
    }

    // get the UI value out of the selected number object
    @computed get selectedNumberUI() {
        const number = this.selectedNumber;
        // if selected number and UI number exist
        if (isPlainObject(number) && number.UI) {
            // return UI number
            return number.UI;
        }
        // otherwise return false
        return false;
    }

    // derive the area code from properties of the selected number object
    @computed get selectedNumberPrefix() {
        const number = this.selectedNumber;
        if (isPlainObject(number)) {
            if (number.E164) return number.E164.substring(2, 5);
            if (number.UI) return number.UI.substring(1, 4);
        }
        return false;
    }

    // get the IsSMSEnabled value out of the selected number object
    @computed get smsEnabled() {
        const number = this.selectedNumber;
        // if selected number and IsSMSEnabled number exist
        if (isPlainObject(number) && number.IsSMSEnabled) {
            // return IsSMSEnabled number
            return number.IsSMSEnabled;
        }
        // otherwise return false
        return false;
    }

    @computed get numberIsSelected() {
        // if a number has been selected
        const number = this.selectedNumber;
        return isPlainObject(number) && (number.E164 || number.UI);
    }

    @computed get isSelectedAreaCodePremium() {
        // if selected number contains a premium area code
        if (!this.selectedNumberPrefix) return false;

        return isAreaCodePremium(this.selectedNumberPrefix);
    }

    @computed get isNumberTransfer() {
        // if user is transfering return
        return this.selectedNumberType === 'Transfer';
    }

    @computed get isNumberInGHInventory() {
        const number = this.selectedNumber;
        // if selected number and isGhInventory number exist
        if (isPlainObject(number) && number.IsNumberInGHInventory) {
            // return IsSMSEnabled number
            return number.IsNumberInGHInventory;
        }
        // otherwise return false
        return false;
    }
}
