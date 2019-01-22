import { observable, observe, action, computed } from 'mobx';
import includes from 'lodash/includes';
import isPlainObject from 'lodash/isPlainObject';

export default class ModalClass {
    // which child component to load into modal
    @observable childComponentString = null;
    // (optional) variation of child component to be accessed from child component (e.g. "Transfer")
    @observable childVariationString = null;
    // is the user is able to close the modal
    @observable isModalClosable = true;
    // whether or not to show the modal/blocker
    @observable isModalOpen = false;
    // type of modal (small, medium, large)
    @observable modalType = 'medium';

    constructor() {
        // whenever the modal opens/close
        observe(this, 'isModalOpen', () => {
            if (!this.isModalOpen) {
                // reset child variation string after a modal is closed
                this.setModalOptions({ childVariationString: null });
            }
        });
    }

    // set observable options
    @action setModalOptions(obj) {
        if (isPlainObject(obj)) {
            // loop through each option
            this.observableList.forEach((obs) => {
                // if object key matches observable
                if (includes(Object.keys(obj), obs)) {
                    // set observable with that value
                    this[obs] = obj[obs];
                }
            });
        }
    }

    @computed get observableList() {
        // list of items to compare against
        const arr = [];
        const mobxValues = this.$mobx.values;
        // order does matter, isModalOpen needs to be last so that this is the last obervable to change
        Object.keys(mobxValues).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(mobxValues, key) && key !== 'isModalOpen') {
                arr.push(key);
            }
        });
        arr.push('isModalOpen');
        return arr;
    }
}
