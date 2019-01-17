import { action, observable, computed } from 'mobx';
import axios from 'axios';
import { TRIAL_ALLOWED_COUNTRIES } from '~/common/utils/consts.js';

export default class UserLocationClass {
    @observable userLocation;
    @observable UserLocationError = false;

    constructor() {
        return this.getUserLocation();
    }

    // get users location
    @action getUserLocation() {
        // if we don't already have the users location
        if (!this.userLocation) {
            // get users location from API
            axios.post('/util/geoip')
                .then((response) => {
                    // set user location with response data
                    this.setUserLocationError(false);
                    return this.setUserLocation(response.data);
                }).catch((err) => {
                    // catch errors from sources other than API
                    this.setUserLocationError(true);
                    return err;
                });
        }
    }

    // set user location error
    @action setUserLocationError(bool) {
        // if bool exists and is a boolean
        if (typeof bool === 'boolean') {
            this.UserLocationError = bool;
        }
    }

    // set user location
    @action setUserLocation(data) {
        // if data exists and is object or array
        if (typeof data === 'object') {
            this.userLocation = data;
        }
    }

    @computed get UserCountryCode() {
        return (this.userLocation && this.userLocation.countrycode) ?
            this.userLocation.countrycode.toUpperCase()
            :
            'US';
    }

    @computed get ipAddress() {
        return this.userLocation && this.userLocation.ip;
    }

    @computed get localAreaCode() {
        return this.userLocation && this.userLocation.areacode;
    }

    @computed get isUserInUS() {
        return this.userLocation && this.userLocation.countrycode.toLowerCase() === 'us';
    }

    @computed get isTrialAllowed() {
        return this.userLocation && TRIAL_ALLOWED_COUNTRIES.find((country) => {
            return country === this.userLocation.countrycode.toUpperCase();
        });
    }
}
