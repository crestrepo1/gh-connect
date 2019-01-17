import { action, observable, observe } from 'mobx';

export default class RequestLocalNumberClass {
    // requested area code
    @observable requestedAreaCode = '';
    // requested city
    @observable requestedCity = '';
    // selected Country
    @observable selectedCountry = 'US';
    // selected State
    @observable selectedState = '';
    // request confirmed
    @observable requestConfirmed = false;

    constructor() {
        // observe the selected country changing
        observe(this, 'selectedCountry', () => {
            // remove selected State
            this.setSelectedState('');
            // remove requested Area Code
            this.setRequestedAreaCode('');
            // remove requested City
            this.setRequestedCity('');
        });
    }

    // set selected Country
    @action setSelectedCountry(data) {
        // if data type is string
        if (typeof data === 'string') {
            // set selected Country
            this.selectedCountry = data;
        }
    }
    // set selected State
    @action setSelectedState(data) {
        // if data type is string
        if (typeof data === 'string') {
            // set selected State
            this.selectedState = data;
        }
    }
    // set requested area code
    @action setRequestedAreaCode(data) {
        // if data type is string
        if (typeof data === 'string') {
            // set requested area code
            this.requestedAreaCode = data;
        }
    }
    // set requested City
    @action setRequestedCity(data) {
        // if data type is string
        if (typeof data === 'string') {
            // set requested City
            this.requestedCity = data;
        }
    }
    // set request to confirmed
    @action setRequestConfirmed(data) {
        // if data type is boolean
        if (typeof data === 'boolean') {
            // set request confirmed
            this.requestConfirmed = data;
        }
    }
}
