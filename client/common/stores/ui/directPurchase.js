import { action, observable } from 'mobx';
import axios from 'axios';


export default class DirectPurchaseClass {
    @observable creatingAccount = false;
    @observable signupError = '';

    @action setSignupError(str) {
        if (typeof str === 'string') {
            this.signupError = str;
        }
    }

    @action setCreatingAccount(bool) {
        if (typeof bool === 'boolean') {
            this.creatingAccount = bool;
        }
    }

    // post final signup object to the API
    @action postSignup(requestBody, successCallback, errorCallback) {
        // open up creating account modal
        this.setCreatingAccount(true);
        // post signup
        axios.post(`/api/signupv2?numberLockSessionId=${requestBody.NLS}`, requestBody.signupObject)
            .then((response) => {
                // post success object
                successCallback(response);
            }).catch((err) => {
                errorCallback(err);
            }).then(() => {
                this.setCreatingAccount(false);
            });
    }
}
