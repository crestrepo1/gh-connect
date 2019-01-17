import { action, observe, observable } from 'mobx';

export default class TransferNumberClass {
    @observable transferNumberValue = '';
    @observable transferNumber = false;
    @observable transferNumberLength = 0;

    constructor(rootStore) {

        this.lockNumberStore = rootStore.lockNumberStore;

        observe(this.lockNumberStore, 'selectedNumberType', (change) => {
            if (change.newValue !== 'Transfer') {
                this.setTransferNumberValue('');
                this.setTransferNumber(false);
                this.setTransferNumberLength(0);
            }
        });
    }

    @action setTransferNumberValue(number) {
        if (typeof number === 'string') {
            this.transferNumberValue = number;
            this.setTransferNumberLength(number);
        }
    }

    @action setTransferNumberLength(num) {
        if (num === 0) {
            this.transferNumberLength = 0;
        } else {
            this.transferNumberLength = num.replace(/\D/g, '').length;
        }
    }

    @action setTransferNumber(bool) {
        if (typeof bool === 'boolean') {
            this.transferNumber = bool;
        }
    }
}
