import { action, observable, reaction, computed } from 'mobx';
// TODO: ADD MODALERROR AGAIN
//import fatalErrorModal from '~/common/utils/fatalErrorModal.js';

import axios from 'axios';
import Raven from 'raven-js';

export default class FlexFrameStoreClass {
    @observable key = {};
    @observable token = {};
    @observable microform = {};
    @observable isCardValid = false;
    @observable isFieldFocused = false;
    @observable userInteractedWithField = false;
    @observable creatingMicroform = false;
    @observable hasValue = false;
    @observable flexFrameError = '';

    constructor() {
        // react to key creation, when token avalible, create microform
        reaction(
            // object to watch
            () => this.key,
            // create microform
            () => this.createMicroForm()
        );
    }

    // setter functions

    @action setKey(data) {
        if (typeof data === 'object' && data.keyId && data.jwk && data.der.publicKey) {
            this.key = data;
        }
    }

    @action removeKey() {
        this.key = {};
    }

    @action setToken(token) {
        if (typeof token === 'object' && token.maskedPan && token.maskedPan) {
            this.token = token;
        }
    }

    @action setMicroform(form) {
        if (typeof form === 'object') {
            this.microform = form;
        }
    }

    @action setIsCardValid(val) {
        if (typeof val === 'boolean') {
            this.isCardValid = val;
        }
    }

    @action setCreatingMicroform(bool) {
        if (typeof bool === 'boolean') {
            this.creatingMicroform = bool;
        }
    }

    @action setIsFieldFocused(bool) {
        if (typeof bool === 'boolean') {
            this.isFieldFocused = bool;
        }
    }

    @action setUserInteractedWithField(bool) {
        if (typeof bool === 'boolean') {
            this.userInteractedWithField = bool;
        }
    }

    @action setHasValue(bool) {
        if (typeof bool === 'boolean') {
            this.hasValue = bool;
        }
    }

    @action setFlexFrameError(string) {
        if (typeof string === 'string') {
            this.flexFrameError = string;
        }
    }

    // get key to create the microform
    @action getFlexKey() {
        // stop user from interacting with the form until the microform is created;
        this.setCreatingMicroform(true);

        axios.get(`/api/getKey?baseURL=${window.location.origin}`).then((resp) => {
            this.setKey(resp.data);
        }).catch(() => {
            // couldn't get key, can't sign up
            this.setCreatingMicroform(false);
            // fatalErrorModal();
        });
    }

    // create microform
    @action createMicroForm() {
        /* eslint-disable */
        // disable linter to avoid error with predefined FLEX
        FLEX.microform(
        /* eslint-enable */
            {
                keyId: this.keyId,
                keystore: this.keyJwk,
                container: '#cc__number',
                label: '#cc__label',
                placeholder: '',
                styles: {
                    input: {
                        'font-size': '18px',
                        'font-family': 'ProximaNova, sans-serif',
                        'font-weight': '400',
                        color: '#000'
                    },
                    ':focus': { color: '#000' },
                    valid: { color: '#000' },
                    invalid: { color: '#E60502' }
                }
            },
            (setupError, microformInstance) => {
                if (setupError) {
                    // microform didnt load, can't sign up
                    this.setCreatingMicroform(false);
                    // fatalErrorModal();
                    Raven.captureMessage('flexFrameError', { extra: {
                        error: 'Setup Error',
                        errorMessage: setupError
                    } });
                    return;
                }
                // allow user to interact with the form
                this.setCreatingMicroform(false);
                // save microform instance
                this.setMicroform(microformInstance);

                microformInstance.on('validationChange', (data) => {
                    this.setIsCardValid(data.valid);
                });

                microformInstance.on('focus', () => {
                    this.setIsFieldFocused(true);
                });

                microformInstance.on('blur', () => {
                    this.setIsFieldFocused(false);
                    if (!this.userInteractedWithField) {
                        this.setUserInteractedWithField(true);
                    }
                });

                microformInstance.on('notEmpty', () => {
                    this.setHasValue(true);
                });

                microformInstance.on('empty', () => {
                    this.setHasValue(false);
                });
            }
        );
    }

    @action destroyFlexFrame() {
        // destroys the microform
        this.microform.teardown();
    }

    // destroy current microform and create a new one
    @action refreshMicroform() {
        // destroys the microform
        this.microform.teardown(() => {
            // rebuild a microform
            this.getFlexKey();
            // set error on
            this.setIsCardValid(false);
        }
        );
    }

    // on form submit create auth token with card information
    @action createToken(options, successCallback, errCallback) {
        this.microform.createToken(options, (err, token) => {
            // if error
            if (err) {
                errCallback(err);
                return;
            }
            // save token
            this.setToken(token);
            successCallback();
        });
    }


    // computed values

    @computed get tokenString() {
        return JSON.stringify(this.token);
    }

    @computed get maskCard() {
        return this.token.maskedPan;
    }

    @computed get cardType() {
        return this.token.cardType;
    }

    @computed get keyId() {
        return this.key.keyId;
    }

    @computed get keyJwk() {
        return this.key.jwk;
    }

    @computed get keyPublicKey() {
        return this.key.der.publicKey;
    }

    @computed get displayErrorUI() {
        return !this.isCardValid && !this.isFieldFocused && this.userInteractedWithField;
    }
}
