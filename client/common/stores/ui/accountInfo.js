import { action, observable, computed, toJS } from 'mobx';
import axios from 'axios';


export default class AccountInfoClass {
    @observable marketSources = [];

    @observable fetchedMarketSources = false;
    @observable UsernameAlreadyInUse = false;


    // set fetched market source flag
    @action setFetchedMarketSources(bool) {
        if (typeof bool === 'boolean') {
            this.fetchedMarketSources = bool;
        }
    }

    // set market sources
    @action setMarketSources(data) {
        if (typeof data === 'object') {
            this.marketSources = data;
        }
    }

    @action setUsernameAlreadyInUse(bool) {
        if (typeof bool === 'boolean') {
            this.UsernameAlreadyInUse = bool;
        }
    }

    @action getMarketSources(errorCallback) {
        // reset fetched market sources
        this.setMarketSources([]);
        this.setFetchedMarketSources(false);
        // get market sources
        axios.get('/api/MarketSource')
            .then((response) => {
            // set market sources
                this.setMarketSources(response.data);
                // set fetched market sources
                this.setFetchedMarketSources(true);
            }).catch((err) => {
                errorCallback();
                return err;
            });
    }

    // Validate Username
    @action validateUsername(username, successCallback, errorCallback) {
        // verify username
        axios.get(`/api/User?username=${username}`)
            .then((response) => {
                // if user name is not available, set the error message flag
                this.setUsernameAlreadyInUse(!(response.data && response.data.IsAvailable));
                successCallback(response);
            }).catch((err) => {
                errorCallback(err);
                return err;
            });
    }

    // return a randomized list of market sources
    @computed get randomizedMarketSources() {
        const sources = this.marketSources;
        // randomize list of market sources
        if (typeof sources === 'object' && sources.length > 0) {
            for (let i = this.marketSources.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = sources[i];
                sources[i] = sources[j];
                sources[j] = temp;
            }
            // loop through sources to see if there is a default option
            const arrayWithoutDefault = sources.map((source) => {
                if (source.Id) {
                    // set flag to true is default option exists
                    return source;
                }
                // otherwise skip it
                return false;
            });
            // add how'd you hear about us to top of list and return it
            arrayWithoutDefault.unshift({ Id: false, Name: "How'd you hear about us?" });
            // return array now with default
            return arrayWithoutDefault;
        }
        return sources;
    }

    @computed get marketSourcesArray() {
        return toJS(this.marketSources);
    }
}
