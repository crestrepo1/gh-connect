import { action, observable } from 'mobx';
import axios from 'axios';

export default class SuggestedCitiesClass {
    // array to hold suggested cities
    @observable suggestedCities = [];
    // show suggested cities
    @observable showSuggestedCities = false;
    // number of items to show in list
    @observable numberOfItemsPerPage = 4;
    // number of pages
    @observable suggestedCityCurrentPage = 1;
    @observable suggestedCityTotalPages = 1;

    // set suggested cities
    @action setSuggestedCities(obj) {
        if (typeof obj === 'object') {
            this.suggestedCities = obj;
            // set total pages (4 per page)
            this.suggestedCityTotalPages = Math.ceil(obj.length / 4);
        }
    }

    // set current page
    @action setSuggestedCityCurrentPage(num) {
        if (typeof num === 'number') {
            this.suggestedCityCurrentPage = num;
        }
    }

    // set show cities boolean
    @action setShowSuggestedCities(bool) {
        if (typeof bool === 'boolean') {
            this.showSuggestedCities = bool;
        }
    }

    // validate address
    @action validateAddress(zipcode, successCallback, errorCallback) {
        // verify username
        axios.get(`/api/Location/zipcoderegions?zipCode=${zipcode}`)
            .then((response) => {
                successCallback(response);
            }).catch((err) => {
                errorCallback(err);
                return err;
            });
    }
}
