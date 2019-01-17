import { action, observable } from 'mobx';

export default class PendingClass {
    // request SMS
    @observable referenceNumber = '';
    @observable selectedNumber = '';

    // set username
    @action setReferenceNumber(str) {
        if (typeof str === 'string') {
            // get reference number out of string
            const referenceNumber = str.replace(/\./g, '').match(/\d+$/);
            // if there is a match
            if (referenceNumber.length && referenceNumber[0]) {
                // set reference number
                this.referenceNumber = referenceNumber[0];
            }
        }
    }

    // set subscription number
    @action setSelectedNumber(str) {
        if (typeof str === 'string') {
            this.selectedNumber = str;
        }
    }
}
