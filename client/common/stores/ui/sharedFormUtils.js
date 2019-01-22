import { action, observable } from 'mobx';
import axios from 'axios';

export default class SharedFormUtilsClass {
    @observable displayOptIn = false;
    @observable emailAlreadyUsedError = false;

    @action setDisplayOptIn(bool) {
        if (typeof bool === 'boolean') {
            this.displayOptIn = bool;
        }
    }

    @action setEmailAlreadyUsedError(bool) {
        if (typeof bool === 'boolean') {
            this.emailAlreadyUsedError = bool;
        }
    }

    // validate Email
    @action validateEmail(email, successCallback, errorCallback) {
        // verify email
        axios.get(`/api/User?username=${email}`)
            .then((response) => {
                // if the number is avalible procceed to the next step
                if (response.data && response.data.IsAvailable) {
                    successCallback(response);
                } else {
                    // if the email is already used, block the users from signing up
                    this.setEmailAlreadyUsedError(true);
                    errorCallback();
                }
            }).catch((err) => {
                return err;
            });
    }
}
