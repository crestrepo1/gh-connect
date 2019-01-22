import { action, observable, computed } from 'mobx';

export default class FormsClass {
    @observable FirstName = '';
    @observable FirstNameError = '';
    @observable LastName = '';
    @observable LastNameError = '';
    @observable Email = '';
    @observable EmailError = '';
    @observable Username = '';
    @observable UsernameError = '';
    @observable UsernameWarning = '';
    @observable Password = '';
    @observable PasswordError = '';
    @observable ProductPhone = '';
    @observable ProductPhoneError = '';
    @observable ContactPhone = '';
    @observable ContactPhoneError = '';
    @observable Pin = '';
    @observable PinError = '';
    @observable Street1 = '';
    @observable Street1Error = '';
    @observable City = '';
    @observable CityError = '';
    @observable StateCode = '';
    @observable StateCodeError = '';
    @observable ZipCode = '';
    @observable ZipCodeError = '';
    @observable CountryCode = '';
    @observable CountryCodeError = '';
    @observable IsNewsletter = true;
    @observable OptInSms = true;
    @observable OptInReadYourVoicemail = true;
    @observable MarketSourceId = '';
    @observable MarketSourceComments = '';
    @observable MarketSourceCommentsError = '';
    @observable NameOnCard = '';
    @observable NameOnCardError = '';
    @observable SecurityCode = '';
    @observable SecurityCodeError = '';
    @observable ExpirationDate = '';
    @observable ExpirationDateError ='';


    // setters
    // set all form values
    @action setFormData(input, val) {
        if (typeof input === 'string' && (typeof val === 'string' || typeof val === 'boolean')) {
            this[input] = val;
        }
    }

    // newsletter
    @action toggleNewsletter() {
        this.IsNewsletter = !this.IsNewsletter;
    }

    // sms feature
    @action toggleOptInSms() {
        this.OptInSms = !this.OptInSms;
    }

    // read your voicemail feature
    @action toggleOptInReadYourVoicemail() {
        this.OptInReadYourVoicemail = !this.OptInReadYourVoicemail;
    }

    // remove error from input
    @action clearFieldError(name) {
        if (typeof name === 'string') {
            this[`${name}Error`] = '';
        }
    }

    @action setFieldError(name, error) {
        if (typeof name === 'string' && typeof error === 'string') {
            this[`${name}Error`] = error;
        }
    }

    // set field warning
    @action setFieldWarning(name, warning) {
        if (typeof name === 'string' && typeof warning === 'string') {
            this[`${name}Warning`] = warning;
        }
    }

    @action removeFieldWarning(name) {
        if (typeof name === 'string') {
            this[`${name}Warning`] = '';
        }
    }

    @action removeValidationErrors(fields) {
        fields.forEach((field) => {
            this.clearFieldError(field);
        });
    }

    @action validateForm(fields) {
        this.removeValidationErrors(fields);
        fields.forEach((field) => {
            this[`${field}Validation`]();
        });
    }

    @action doesFormHaveErrors(fields) {
        return fields.find((field) => {
            return this[`${field}Error`].length > 0;
        });
    }

    @action areFieldsEmpty(fields) {
        return !!fields.find((field) => {
            return this[`${field}`].length === 0;
        });
    }

    // escapes characters in a string, so regExp works
    @action escapeRegExp(text) {
        return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : '';
    }

    // form valiation

    @action isFieldEmpty(input) {
        return this[input] === '';
    }

    @action onlyNumbers(input, allowedChar = '') {
        const allowed = this.escapeRegExp(allowedChar);
        const regex = new RegExp(`[^0-9${allowed}]+`, 'g');
        if (input !== '') {
            return regex.test(this[input]);
        }
        return true;
    }

    @action onlyLetters(input, allowedChar = '') {
        const allowed = this.escapeRegExp(allowedChar);
        const regex = new RegExp(`[^a-zA-Z${allowed}]+`, 'g');
        if (input !== '') {
            return regex.test(this[input]);
        }
        return true;
    }

    @action onlyLatin(input, allowedChar = '') {
        const allowed = this.escapeRegExp(allowedChar);
        const regex = new RegExp(`[^A-zÀ-ÖØ-öø-ÿ${allowed}]+`, 'g');
        if (input !== '') {
            return regex.test(this[input]);
        }
        return true;
    }

    @action onlyNumbersAndLetters(input, allowedChar = '') {
        const allowed = this.escapeRegExp(allowedChar);
        const regex = new RegExp(`[^a-zA-Z0-9${allowed}]+`, 'g');
        if (input !== '') {
            return regex.test(this[input]);
        }
        return true;
    }

    @action hasInvalidCharacter(input, disallowedChar = '') {
        const disallowed = this.escapeRegExp(disallowedChar);
        const regex = new RegExp(`[${disallowed}]+`, 'g');
        if (input !== '') {
            return regex.test(this[input]);
        }
        return true;
    }

    @action isInputNotSelected(input) {
        return this[input] === '' || this[input] === false;
    }

    // error validation for specific fields

    @action FirstNameValidation() {
        let FirstNameError = '';
        if (this.isFieldEmpty('FirstName')) {
            FirstNameError = 'Please enter your first name.';
        } else if (this.onlyNumbersAndLetters('FirstName', " -'")) {
            FirstNameError = 'Invalid character(s). Please use only letters, spaces, -, or \'.';
        }
        this.FirstNameError = FirstNameError;
    }

    @action LastNameValidation() {
        let LastNameError = '';
        if (this.isFieldEmpty('LastName')) {
            LastNameError = 'Please enter your last name.';
        } else if (this.onlyNumbersAndLetters('LastName', " -'")) {
            LastNameError = 'Invalid character(s). Please use only letters, spaces, -, or \'.';
        }
        this.LastNameError = LastNameError;
    }

    @action NameOnCardValidation() {
        let NameOnCardError = '';
        if (this.isFieldEmpty('NameOnCard')) {
            NameOnCardError = 'Please enter a name.';
        } else if (this.onlyNumbersAndLetters('NameOnCard', " -'")) {
            NameOnCardError = 'Invalid character(s). Please use only letters, spaces, -, or \'.';
        }
        this.NameOnCardError = NameOnCardError;
    }

    @action EmailValidation() {
        let EmailError = '';
        if (!(this.Email.match(/^[A-zÀ-ÖØ-öø-ÿ0-9.!#$%&’*+/=?^-_`{|}~-]+@[A-zÀ-ÖØ-öø-ÿ0-9-_]+(\.[A-zÀ-ÖØ-öø-ÿ]+)+$/))) {
            EmailError = 'Please enter a valid email address.';
        }
        this.EmailError = EmailError;
    }

    @action PasswordValidation() {
        let PasswordError = '';
        if (this.isFieldEmpty('Password')) {
            PasswordError = 'Please enter a password.';
        } else if (this.Password.length < 6 || this.Password.length > 26) {
            PasswordError = 'Password must be 6-26 characters.';
        } else if (this.onlyNumbersAndLetters('Password', '@$?')) {
            PasswordError = 'Invalid character(s). Please use only letters, numbers, @, $, or ?.';
        }
        this.PasswordError = PasswordError;
    }

    @action ProductPhoneValidation() {
        let ProductPhoneError = '';
        if (this.parsedProductNumber.length < 10) {
            ProductPhoneError = 'Please enter a valid phone number.';
        } else if (this.onlyNumbers('ProductPhone', '()_- ')) {
            ProductPhoneError = 'Invalid character(s). Please use only numbers.';
        }
        this.ProductPhoneError = ProductPhoneError;
    }

    @action ContactPhoneValidation() {
        let ContactPhoneError = '';
        if (this.parsedContactNumber.length < 10) {
            ContactPhoneError = 'Please enter a valid phone number.';
        } else if (this.onlyNumbers('ContactPhone', '()_- ')) {
            ContactPhoneError = 'Invalid character(s). Please use only numbers.';
        }
        this.ContactPhoneError = ContactPhoneError;
    }

    @action Street1Validation() {
        let Street1Error = '';
        if (this.isFieldEmpty('Street1')) {
            Street1Error = 'Please enter your street address.';
        } else if (this.onlyNumbersAndLetters('Street1', ' #.()/-,')) {
            Street1Error = 'Invalid character(s). Please use only letters, numbers, spaces, periods, commas, parentheses and dashes.';
        }
        this.Street1Error = Street1Error;
    }

    @action CityValidation() {
        let CityError = '';
        if (this.isFieldEmpty('City')) {
            CityError = 'Please enter your city.';
        } else if (this.onlyLetters('City', ' #.')) {
            CityError = 'Invalid character(s). Please use only letters, spaces, and dashes.';
        }
        this.CityError = CityError;
    }

    @action ZipCodeValidation() {
        let ZipCodeError = '';
        if (this.ZipCode.length < 3 || this.ZipCode.length > 12) {
            ZipCodeError = 'Zip codes must be 3-12 characters.';
        } else if (this.onlyNumbersAndLetters('ZipCode', ' -')) {
            ZipCodeError = 'Invalid character(s). Please use only letters and numbers.';
        }
        this.ZipCodeError = ZipCodeError;
    }

    @action SecurityCodeValidation() {
        let SecurityCodeError = '';
        if (this.SecurityCode.length < 3 || this.SecurityCode.length > 4) {
            SecurityCodeError = 'Security code must be either 3 or 4 digits.';
        } else if (this.onlyNumbers('SecurityCode')) {
            SecurityCodeError = 'Invalid character(s). Please use only numbers.';
        }
        this.SecurityCodeError = SecurityCodeError;
    }

    @action ExpirationDateValidation() {
        let ExpirationDateError = '';
        if (this.ExpirationDate.length !== 5) {
            ExpirationDateError = 'Please use the format MM/YY.';
        } else if (this.onlyNumbers('ExpirationDate', '/')) {
            ExpirationDateError = 'Invalid character(s). Please use only numbers.';
        } else if (this.ExpirationMonth > 12) {
            ExpirationDateError = 'Please enter a valid expiration date.';
        } else if (this.ExpirationYear < new Date().getFullYear()) {
            ExpirationDateError = 'Please enter a valid expiration date.';
        }
        this.ExpirationDateError = ExpirationDateError;
    }

    @action PinValidation() {
        let PinError = '';
        if (this.Pin.length !== 4) {
            PinError = 'Your verification code must be 4 digits long.';
        } else if (this.onlyNumbers('Pin')) {
            PinError = 'Invalid character(s). Please use only numbers.';
        }
        this.PinError = PinError;
    }

    @action UsernameValidation() {
        let UsernameError = '';
        if (this.isFieldEmpty('Username')) {
            UsernameError = 'Please enter a username.';
        } else if (this.Username.length < 3) {
            UsernameError = 'Username must be at least 3 characters.';
        } else if (this.onlyNumbersAndLetters('Username')) {
            UsernameError = 'Invalid character. Please use only numbers and letters.';
        }
        this.UsernameError = UsernameError;
    }

    @action MarketSourceCommentsValidation() {
        let MarketSourceCommentsError = '';
        if (!this.isFieldEmpty('MarketSourceComments') && this.onlyNumbersAndLetters('MarketSourceComments', ' ')) {
            MarketSourceCommentsError = 'Invalid character. Please use only numbers and letters.';
        }
        this.MarketSourceCommentsError = MarketSourceCommentsError;
    }

    @action StateCodeValidation() {
        let StateCodeError = '';
        if (this.isInputNotSelected('StateCode')) {
            StateCodeError = 'Please select your state.';
        }
        this.StateCodeError = StateCodeError;
    }

    @action CountryCodeValidation() {
        let CountryCodeError = '';
        if (this.isInputNotSelected('CountryCode')) {
            CountryCodeError = 'Please select your country.';
        }
        this.CountryCodeError = CountryCodeError;
    }

    // computed

    @computed get parsedPin() {
        return Number(this.Pin);
    }

    @computed get parsedProductNumber() {
        return this.ProductPhone.replace(/\D/g, '');
    }

    @computed get parsedContactNumber() {
        return this.ContactPhone.replace(/\D/g, '');
    }

    @computed get ExpirationMonth() {
        // if valid expiration date
        if (this.ExpirationDate.length === 5 && (/(\d\d)\/(\d\d)/).test(this.ExpirationDate)) {
            // return 2 digit month
            return this.ExpirationDate.substring(0, 2);
        }
        return '';
    }

    @computed get ExpirationYear() {
        // if valid expiration date
        if (this.ExpirationDate.length === 5 && (/(\d\d)\/(\d\d)/).test(this.ExpirationDate)) {
            // return 4 digit year
            return `20${this.ExpirationDate.substring(3, 5)}`;
        }
        return '';
    }
}
