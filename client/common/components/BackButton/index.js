import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import {
    FLOW_STEP_BILLING, FLOW_STEP_NUMBERS,
    PATH_PLANS, PATH_NUMBERS, PATH_TRIAL_NUMBERS
} from '~/common/utils/consts.js';

// Import Local Styles
import styles from './back-button.css';

@inject('trialSignupStore')
@observer
export default class BackButton extends React.Component {
    render() {
        const { currentStep, trialSignupStore } = this.props;

        const backToPath = currentStep === FLOW_STEP_NUMBERS ?
            trialSignupStore.isTrialFlow ?
                // take user back to Trial Numbers page
                PATH_TRIAL_NUMBERS
                :
                // take user back to Numbers page
                PATH_NUMBERS
            :
            currentStep === FLOW_STEP_BILLING ?
                // take user back to Plans page
                PATH_PLANS
                :
                null;

        return (
            <Link
                className={styles.wrapper}
                id='back-button'
                to={backToPath}
            >
                Back
            </Link>
        );
    }
}
