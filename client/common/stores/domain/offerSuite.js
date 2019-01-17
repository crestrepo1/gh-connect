import { defaultOfferSuiteId, ghPreselectedPlan } from '~/common/globals.js';
import { action, computed, observable, reaction } from 'mobx';
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

// import consts
import { PLAN_TERM_MONTHLY, PLAN_TERM_ANNUAL, NUMBER_TRANSFER_FEE, SOLO_EXTENSION, PARTNER_EXTENSION, SMALL_BUSINESS_EXTENSION, DEFAULT_EXTENSION } from '~/common/utils/consts.js';

export default class OfferSuiteClass {

    constructor() {
        // set offer suite based on testing version
        const offerSuiteId = defaultOfferSuiteId();
        this.getOfferSuite(offerSuiteId);
        // upon successful fetching of offers
        reaction(
            () => this.fetchedOffers,
            () => {
                // set a monthly plan price (combination of recurring and initial fees)
                this.setMonthlyPlanPrices();
                // set included extensions based on plan name
                this.setIncludedExtensions();
                // set voicemail transcription included flag based on plan name
                this.setVoicemailTranscription();

                if (this.hasAnnualPlans) {
                    // standarize annual pricing offers
                    this.setAnnualPlanPrices();
                // if selected plan term is not monthly, switch it to it
                } else if (this.selectedPlanTerm !== PLAN_TERM_MONTHLY) {
                    this.setSelectedPlanTerm();
                }
            }
        );

        // set preselected plan based on query string
        reaction(
            () => this.sortedOffersByRecurringChargeAsc,
            (sortedOffersByRecurringCharge) => {
                const ghPreselectedPlanIndex = ghPreselectedPlan();
                // if preselected plan index exists, and there is a matching index in the offersuite
                if (
                    ghPreselectedPlanIndex !== null &&
                    typeof ghPreselectedPlanIndex === 'string' &&
                    ghPreselectedPlanIndex.length > 0 &&
                    Number(ghPreselectedPlanIndex) <= sortedOffersByRecurringCharge.length
                ) {
                    // TODO: make it so you can preselect plans
                    this.setSelectedOfferId(sortedOffersByRecurringCharge[Number(ghPreselectedPlanIndex)].Id);
                }
            }
        );
    }

    @observable fetchedOffers = false;
    @observable fetchedOffersError = false;
    @observable offerSuite;
    @observable selectedPlanTerm = PLAN_TERM_ANNUAL;
    @observable selectedOfferSet;

    // get offer suite from API
    @action getOfferSuite(offerSuiteId = defaultOfferSuiteId()) {
        // only get new offer suite if you dont already have one
        // or if you're getting a different offer suite
        if (!this.offerSuite || offerSuiteId !== this.offerSuiteId) {
            // reset flags
            this.setFetchedOffers(false);
            this.setFetchedOffersError(false);
            // get a list of offers
            axios.get(`/api/OfferSuite/${offerSuiteId}`)
                .then((response) => {
                // set offer suite with response data
                    this.setOfferSuite(response.data);
                    // set flag that we fetched offers
                    this.setFetchedOffers(true);
                }).catch((err) => {
                // catch errors from sources other than API
                // set fetched offers to false
                    this.setFetchedOffers(false);
                    this.setFetchedOffersError(true);
                    // return new Error('there was an error');
                    throw err;
                });
        }
    }

    // set a monthly plan price (combination of recurring and initial fees)
    @action setMonthlyPlanPrices() {
        // if offers exists
        if (this.fetchedOffers && this.offerSuite && this.offerSuite.Offers.length) {
            // loop through them
            this.offerSuite.Offers.map((plan, idx) => {
                // if there is a recurring charge and minute charge
                if (typeof plan.RecurringCharge === 'number' && typeof plan.MinutesInOfferCharge === 'number') {
                    // set a new key that adds the two
                    this.offerSuite.Offers[idx].monthlyPlanCost = plan.RecurringCharge + plan.MinutesInOfferCharge;
                }
                // otherwise don't add the key to the offer
                return false;
            });
        }
    }

    @action setAnnualPlanPrices() {
        // if offers exists
        if (this.fetchedOffers && this.offerSuite && this.offerSuite.Offers.length) {
            // loop through them
            this.offerSuite.Offers.map((plan, idx) => {
                // if there is a recurring charge and minute charge
                if (typeof plan.RecurringCharge === 'number' && typeof plan.MinutesInOfferCharge === 'number' && plan.Term.toLowerCase() === PLAN_TERM_ANNUAL) {
                    // set a new key that adds the two
                    this.offerSuite.Offers[idx].monthlyPlanCost = this.offerSuite.Offers[idx].monthlyPlanCost / 12;
                }
                // otherwise don't add the key to the offer
                return false;
            });
        }
    }

    @action setSelectedPlanTerm() {
        this.selectedPlanTerm = this.selectedPlanTerm === PLAN_TERM_ANNUAL ? PLAN_TERM_MONTHLY : PLAN_TERM_ANNUAL;
    }

    // set included extensions based on plan name
    @action setIncludedExtensions() {
        // if offers exists
        if (this.fetchedOffers && this.offerSuite && this.offerSuite.Offers.length) {
            // loop through them
            this.offerSuite.Offers.map((plan, idx) => {
                let includedExtensions;
                // set included extensions based on plan name
                switch (plan.Name) {
                    case 'Solo':
                        includedExtensions = SOLO_EXTENSION;
                        break;
                    case 'Partner':
                        includedExtensions = PARTNER_EXTENSION;
                        break;
                    case 'Small Business':
                        includedExtensions = SMALL_BUSINESS_EXTENSION;
                        break;
                    default:
                        includedExtensions = DEFAULT_EXTENSION;
                }
                // add included extensions key to offer
                this.offerSuite.Offers[idx].IncludedExtensions = includedExtensions;
                return false;
            });
        }
    }

    // set voicemail transcription included flag based on plan name
    @action setVoicemailTranscription() {
        // if offers exists
        if (this.fetchedOffers && this.offerSuite && this.offerSuite.Offers.length) {
            // loop through them
            this.offerSuite.Offers.map((plan, idx) => {
                // set all offer suites to have voicemail included
                this.offerSuite.Offers[idx].VoicemailTranscriptionIncluded = true;
                return false;
            });
        }
    }

    // set flag if offers have been fetched
    @action setFetchedOffers(bool) {
        // if true/false
        if (typeof bool === 'boolean') {
            // set fetchedOffers flag
            this.fetchedOffers = bool;
        }
    }

    // set flag if offers have been fetched
    @action setFetchedOffersError(bool) {
        // if true/false
        if (typeof bool === 'boolean') {
            // set fetchedOffersError flag
            this.fetchedOffersError = bool;
        }
    }

    // set selected offer
    @action setSelectedOfferSet(obj) {
        // if id is object (guid)
        if (isPlainObject(obj)) {
            // set id
            this.selectedOfferSet = obj;
        } else if (obj === null) {
            // set id to default undefined value
            this.selectedOfferSet = undefined;
        }
    }

    // set fetched offer suite
    @action setOfferSuite(offerSuite) {
        // if offerSuite is object
        if (isPlainObject(offerSuite)) {
            // set offer suite
            this.offerSuite = offerSuite;
        }
    }

    @computed get offerName() {
        if (isPlainObject(this.offerSuite) && this.selectedOfferSet && this.selectedOfferSet[this.selectedPlanTerm].Name) {
            return this.selectedOfferSet[this.selectedPlanTerm].Name;
        }
        return false;
    }

    @computed get offerRecurringCharge() {
        if (isPlainObject(this.offerSuite) && this.selectedOfferSet && this.selectedOfferSet[this.selectedPlanTerm].monthlyPlanCost) {
            return this.selectedOfferSet[this.selectedPlanTerm].monthlyPlanCost;
        }
        return false;
    }

    // return SMSPerNumberCharge
    @computed get smsPerNumberCharge() {
        if (isPlainObject(this.offerSuite) && this.selectedOfferSet && this.selectedOfferSet[this.selectedPlanTerm].SMSPerNumberCharge) {
            return this.selectedOfferSet[this.selectedPlanTerm].SMSPerNumberCharge;
        }
        return false;
    }

    @computed get selectedOfferId() {
        if (isPlainObject(this.offerSuite) && this.selectedOfferSet && this.selectedOfferSet[this.selectedPlanTerm].Id) {
            return this.selectedOfferSet[this.selectedPlanTerm].Id;
        }
        return false;
    }

    @computed get numberTransferFee() {
        // default transfer fee to $30
        let numberTransferFee = NUMBER_TRANSFER_FEE;
        if (isPlainObject(this.offerSuite) && this.selectedOfferSet && this.selectedOfferSet[this.selectedPlanTerm].OneTimeCharges) {
            // loop through one time charges
            this.selectedOfferSet[this.selectedPlanTerm].OneTimeCharges.forEach((arr) => {
                // if charge is number transfer fee
                if (arr.OneTimeChargeName === 'NumberTransferFee') {
                    // set value to amount
                    numberTransferFee = arr.Amount;
                }
            });
        }
        // return fee
        return numberTransferFee;
    }

    // get offer suite Id
    @computed get offerSuiteId() {
        // if offer suite exists and has an id
        if (isPlainObject(this.offerSuite) && this.offerSuite.Id) {
            // return offer suite id
            return this.offerSuite.Id;
        }
        return false;
    }

    // get default offer
    @computed get defaultOffer() {
        // if offer suite exists and has an default offer name
        if (isPlainObject(this.offerSuite) && this.offerSuite.DefaultOfferName) {
            // return default offer name
            return this.offerSuite.DefaultOfferName;
        }
        return false;
    }

    // check if offer term is monthly or annual
    @computed get isTermMonthly() {
        return this.selectedPlanTerm === PLAN_TERM_MONTHLY;
    }

    @computed get isTermAnnual() {
        return this.selectedPlanTerm === PLAN_TERM_ANNUAL;
    }

    // sort offers based on recurring month charge
    @computed get sortedOffersByRecurringChargeDesc() {
        const offerSuite = this.offerSuite;
        // if offerSuite is object and has offers
        if (isPlainObject(offerSuite) && offerSuite.Offers.length > 0) {
            // sort by recurring charge
            return offerSuite.Offers.slice().sort((a, b) => {
                return a.monthlyPlanCost - b.monthlyPlanCost;
            });
        }
        return false;
    }

    // sort offers based on recurring month charge
    @computed get sortedOffersByRecurringChargeAsc() {
        const offerSuite = this.offerSuite;
        // if offerSuite is object and has offers
        if (isPlainObject(offerSuite) && offerSuite.Offers.length > 0 && this.sortedOffersByRecurringChargeDesc) {
            // sort reverse of descending
            return this.sortedOffersByRecurringChargeDesc.reverse();
        }
        return false;
    }

    // find out if the offer has annual plans
    @computed get hasAnnualPlans() {
        const offerSuite = this.offerSuite;
        // if offerSuite is object and has offers
        if (isPlainObject(offerSuite) && offerSuite.Offers.length > 0 && this.sortedOffersByRecurringChargeDesc) {
            // find an offer suite with term === plan
            return offerSuite.Offers.find((offer) => {
                return offer.Term.toLowerCase() === PLAN_TERM_ANNUAL;
            });
        }
        return false;
    }

    // create array of offers pared by type
    @computed get pairedPlansByTerm() {
        // grab offer suite
        const offerSuite = this.offerSuite;
        // if offer suite exist and has offers
        if (isPlainObject(offerSuite) && offerSuite.Offers.length > 0) {
            const offers = this.sortedOffersByRecurringChargeAsc;
            return offers.reduce((offArray, offer) => {
                // if offer is annual
                if (offer.Term.toLowerCase() === PLAN_TERM_MONTHLY) {
                    // find matching monthly offer suite
                    const matchAnnualOffer = offers.find((offr) => {
                        return offr.Name === offer.Name && offr.Term.toLowerCase() === PLAN_TERM_ANNUAL;
                    });
                    // if matching offer suite found, create obj with both of them
                    const offerObj = {};
                    offerObj[PLAN_TERM_MONTHLY] = offer;
                    offerObj[PLAN_TERM_ANNUAL] = matchAnnualOffer || false;
                    offArray.push(offerObj);
                }
                return offArray;
            }, []);
        }

        return false;
    }
}
