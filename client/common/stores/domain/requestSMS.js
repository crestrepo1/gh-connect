import { action, observable } from 'mobx';

//TODO: IS THIS NEEDED ANYMORE?
export default class RequestSMSClass {
    // request SMS
    @observable requestSMS = true;

    // set selected Country
    @action setRequestSMS(data) {
        // if data type is boolean
        if (typeof data === 'boolean') {
            // set request SMS
            this.requestSMS = data;
        }
    }
}
