import { action, observable } from 'mobx';
import axios from 'axios';

export default class TrialSignupClass {
    @observable formStep = 1;
    @observable isTrialFlow = false;
    @observable isCodeSent = false;
    @observable performingTrialSignup = false;
    @observable signupTrialSuccessful = false;
    @observable wrongPinError = false;
    @observable validatePhoneNumberError = '';
    @observable trialSignupError = '';


    // setters
    @action setIsTrialFlow(bool) {
        if (typeof bool === 'boolean') {
            this.isTrialFlow = bool;
        }
    }

    @action setIsCodeSent(bool) {
        if (typeof bool === 'boolean') {
            this.isCodeSent = bool;
        }
    }

    @action setFormStep(num) {
        if (typeof num === 'number' && num >= 1 && num <= 2) {
            this.formStep = num;
        }
    }

    @action setPerformingTrialSignup(bool) {
        if (typeof bool === 'boolean') {
            this.performingTrialSignup = bool;
        }
    }

    @action setSignupTrialSuccessful(bool) {
        if (typeof bool === 'boolean') {
            this.signupTrialSuccessful = bool;
        }
    }

    @action setWrongPinError(bool) {
        if (typeof bool === 'boolean') {
            this.wrongPinError = bool;
        }
    }

    @action setValidatePhoneNumberError(str) {
        if (typeof str === 'string') {
            this.validatePhoneNumberError = str;
        }
    }

    @action setTrialSignupError(str) {
        if (typeof str === 'string') {
            this.trialSignupError = str;
        }
    }

    // send user pin
    @action sendUserPin(sessionID, contactPhone, errorCallback) {
        axios.post(`/api/ValidatePhoneNumber?numberLockSessionId=${sessionID}&contactPhone=${contactPhone}&validationType=sms`)
            .then((response) => {
                // if valid response set isCodeSent to true
                if (response.data === true) {
                    this.setIsCodeSent(true);
                    // do something here
                }
            }).catch((err) => {
                // TODO: institute deepGet here for safe error handling
                const errorData = err.response.data.Details[0] ? err.response.data.Details[0] : err;

                errorCallback(errorData);

                return err;
            });
    }

    // perform sign up
    @action signupTrial(sessionID, signupTrialObject, successCallback, errorCallback) {
        this.setPerformingTrialSignup(true);
        axios.post(`/api/signupfreetrial?numberLockSessionId=${sessionID}`, signupTrialObject)
            .then((response) => {
                this.setSignupTrialSuccessful(true);
                successCallback(response.data);
            }).catch((err) => {
                errorCallback(err);
            }).then(() => this.setPerformingTrialSignup(false));
    }
}
