import { action, observable, computed } from 'mobx';
import axios from 'axios';
import includes from 'lodash/includes';
import isPlainObject from 'lodash/isPlainObject';
import Cookies from 'js-cookie';

import { ghPromoCode } from '~/common/globals.js';
import { PROMO_CODE_COOKIE_NAME, PROMO_COUPON_25, PROMO_COUPON_75, PROMO_MAX_AMOUNT_ALLOWED, PROMO_MAX_AMOUNT_ALLOWED_MONTHLY, PROMO_CODE_MODAL_CLOSED_COOKIE_NAME } from '~/common/utils/consts.js';
import endOfDayDate from '~/common/utils/endOfDayDate.js';

export default class PromoCodeClass {
    @observable promo = null;
    @observable promoSup = null;
    @observable activePromo = null
    @observable PromoModalViewed = false;
    @observable isPromoStored = false;
    @observable isBannerOpen = false;

    constructor(rootStore) {
        this.offerSuiteStore = rootStore.offerSuiteStore;
        // if promo code global (query string, cookie)
        const savedCode = Cookies.get(PROMO_CODE_COOKIE_NAME);
        const code = ghPromoCode() || savedCode;

        // if the promo cookie exist
        if (Cookies.get('promoModalViewed') === 'true') {
            this.setPromoModalViewed(true);
        }

        // if there is a promo stored as a cookie
        if (savedCode) {
            this.setIsPromoStored(true);
        }

        // if code exists
        if (code) this.validatePrimaryPromoCode(code);
    }

    // set if promo was stored as a cookie
    @action setIsPromoStored(bool) {
        if (typeof bool === 'boolean') {
            this.isPromoStored = bool;
        }
    }

    @action setPromo(obj) {
        if (isPlainObject(obj)) {
            this.promo = obj;
        }
    }

    @action setPromoSup(obj) {
        if (isPlainObject(obj)) {
            this.promoSup = obj;
        }
    }

    @action setActivePromo() {
        this.activePromo = this.offerSuiteStore.isTermMonthly && isPlainObject(this.promoSup) ? this.promoSup : this.promo;
    }

    @action setIsBannerOpen(bool) {
        if (typeof bool === 'boolean') {
            this.isBannerOpen = bool;
        }
    }

    // set if promo modal was viewed here or in the marketing site
    @action setPromoModalViewed(bool) {
        if (typeof bool === 'boolean') {
            this.PromoModalViewed = bool;
        }
        return false;
    }

    // validate promo codes
    @action validatePrimaryPromoCode(code) {
        axios.get(`/api/PromoCode/?promocodename=${code}`)
            .then((response) => {
                // data object
                const data = response.data;
                // if data and promo code is valid
                if (data && data.IsValid) {
                    // if promo code is more than 75 dollars
                    if (data.Amount > PROMO_MAX_AMOUNT_ALLOWED) return this.validatePrimaryPromoCode(PROMO_COUPON_75);
                    // if coupon is more than
                    if (data.Amount > PROMO_MAX_AMOUNT_ALLOWED_MONTHLY) {
                        this.validateSuplementaryPromoCode(PROMO_COUPON_25);
                    }
                    // save coupon
                    this.setPromo(data);
                    // set active coupon
                    this.setActivePromo();
                    // set flag to open banner if it wasnt closed in the marketing site
                    if (!Cookies.get(PROMO_CODE_MODAL_CLOSED_COOKIE_NAME)) this.setIsBannerOpen(this.isCouponValid);
                    // if the promo was not a previusly saved one
                    if (!this.isPromoStored) Cookies.set(PROMO_CODE_COOKIE_NAME, this.promoCodeName, { expires: endOfDayDate() });
                }

                return data;
            // otherwise, do nothing
            }).catch((err) => {
            // throw error that promo code failed,
            // no need to tell user
                throw err;
            });
    }

    @action validateSuplementaryPromoCode(code) {
        axios.get(`/api/PromoCode/?promocodename=${code}`)
            .then((response) => {
                // data object
                const data = response.data;
                // if data and promo code is valid
                if (data && data.IsValid) {
                    this.setPromoSup(data);
                }
            // otherwise, do nothing
            }).catch((err) => {
            // throw error that promo code failed,
            // no need to tell user
                throw err;
            });
    }

    @computed get isCouponValid() {
        const couponTypeArray = ['CappedDiscount', 'Discount', 'Credit'];
        return this.promoCodeName && includes(couponTypeArray, this.promoCodeType) && this.promoCodeAmount > 0;
    }

    @computed get promoCodeName() {
        return isPlainObject(this.activePromo) && this.activePromo.PromoCodeName;
    }

    @computed get promoCodeId() {
        return isPlainObject(this.activePromo) && this.activePromo.Id;
    }

    @computed get promoCodeType() {
        return isPlainObject(this.activePromo) && this.activePromo.DiscountType;
    }

    @computed get promoCodeAmount() {
        return isPlainObject(this.activePromo) && this.activePromo.Amount;
    }

    @computed get promoCodeMessage() {
        return isPlainObject(this.activePromo) && this.activePromo.Message;
    }
}
