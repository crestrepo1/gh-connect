import { action, observable, reaction } from 'mobx';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

import Cookies from 'js-cookie';

const PROGRAM_NAME = 'GH | Abandoned Cart';

export default class EmailCaptureClass {
    // arrays
    @observable capturedEmails = [];
    @observable capturedEmailError = false;
    @observable capturedEmailsPosting = false;

    constructor() {
        // react to capturedEmails changes in length and item's success
        reaction(
            // object to watch
            () => this.capturedEmails.map(email => email.success),
            // react to capturedEmails
            (emailSuccesses, capturedEmailRxn) => {
                const emails = this.capturedEmails;

                // if change was from setSubmittedEmail, emails.find will return
                // the email. Otherwise, send the last added email
                const capturedEmail = emails.find(item => item.success) ||
                    emails[emails.length - 1];

                this.sendCapturedEmail(capturedEmail);
                if (capturedEmail.success) capturedEmailRxn.dispose();
            }
        );
    }

    // adds client-validated email in a wrapper to capturedEmail list
    // if it wasn't already included
    @action addCapturedEmail(email) {
        if (
            typeof email === 'string' &&
            !this.capturedEmails.find(item => item.email === email)
        ) {
            this.capturedEmails.push({ email, success: false });
        }
    }

    // finds email in capturedEmails corresponding to value of email in
    // submission success response payload
    @action setSubmittedEmail(email) {
        const submittedEmail = this.capturedEmails.find(item => item.email === email);

        if (submittedEmail) { submittedEmail.success = true; }
    }

    // set captured email error
    @action setCapturedEmailError(bool) {
        // if bool type is boolean
        if (typeof bool === 'boolean') {
            // set captured email error
            this.capturedEmailError = bool;
        }
    }

    // set captured emails post
    @action setCapturedEmailsPosting(bool) {
        // if bool type is boolean
        if (typeof bool === 'boolean') {
            // set captured email posting status
            this.capturedEmailsPosting = bool;
        }
    }

    // makes an axios request to post an email to endpoint
    sendCapturedEmail(emailObj) {
        if (!emailObj || isEmpty(emailObj)) throw Error(`Invalid POST payload: ${emailObj}`);

        const preparedEmail = {
            email: emailObj.email,
            program: PROGRAM_NAME,
            success: emailObj.success.toString(),
            mkto_trk: Cookies.get('_mkto_trk') || ''
        };

        this.setCapturedEmailsPosting(true);
        axios.post('/api/proxy/capture-emails', preparedEmail)
            .then((response) => {
                this.setCapturedEmailError(false);
                this.setCapturedEmailsPosting(false);
                return response.data;
            })
            .catch((err) => {
                this.setCapturedEmailError(true);
                this.setCapturedEmailsPosting(false);
                return err;
            });
    }
}
