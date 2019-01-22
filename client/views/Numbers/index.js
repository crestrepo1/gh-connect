// Import Dependencies
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';

// Import Components
import LinkBox from '~/views/Numbers/components/LinkBox';
import HeaderGroup from '~/common/components/HeaderGroup';
// import Centering from '~/common/components/Centering';
// import Stepper from '~/common/components/Stepper';

import { scBeacon, createPersonalizedPurchaseEvent } from '~/common/utils/tracking.js';
import {
    FLOW_STEP_NUMBERS,
    PATH_CUSTOM_TOLL_FREE, PATH_LOCAL_RECOMMEND, PATH_TRANSFER_CURRENT_NUMBER, PATH_BILLING
} from '~/common/utils/consts.js';

// Import Images
import transferSvgSrc from '~/common/images/ghnumber.svg';

// Import Stylesheet
import styles from './numbers.css';

@withRouter
@inject('lockNumberStore', 'modalStore', 'trialSignupStore', 'transferNumberStore', 'progressStore')
@observer
export default class Numbers extends Component {
    componentWillMount() {
        const { progressStore, lockNumberStore } = this.props;
        // checks if this is the app entry point and sets corresponding flag
        if (!progressStore.firstView) {
            progressStore.setFirstView(FLOW_STEP_NUMBERS);
        }

        if (!lockNumberStore.selectedNumberUI) {
            // track SCBeacon: saw Numbers page first or after picking a plan
            scBeacon(createPersonalizedPurchaseEvent('0'));
        }
    }

    componentDidMount() {
        this.props.lockNumberStore.setNumberIsLockedUI(true);
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }

    setNumberIsLockedUI() {
        this.props.lockNumberStore.setNumberIsLockedUI(false);
    }

    render() {
        const { lockNumberStore, transferNumberStore, trialSignupStore } = this.props;
        const { numberIsLocked, selectedNumber, numberIsLockedUI } = lockNumberStore;
        const { transferNumberValue } = transferNumberStore;
        const { isTrialFlow } = trialSignupStore;
        return (
            <section className={styles.wrapper}>
                <HeaderGroup>
                    <h1>Which number is right for you?</h1>
                    {!isTrialFlow &&
                        !numberIsLocked &&
                        !numberIsLockedUI &&
                        <h2>(Pick your main number now. You can add more after checkout!)</h2>
                    }
                </HeaderGroup>
                {numberIsLocked &&
                    numberIsLockedUI ?
                    <div>
                        <h3 className={styles['selected-number']}>
                            You've selected:<br /> {transferNumberValue || selectedNumber.UI}
                        </h3>
                        {!isTrialFlow && <p className={styles.disclaimer}>If you are purchasing a plan with multiple numbers,<br /> you can pick the rest after checkout!</p>}
                        <Link
                            className={`${
                                styles['continue-button']} ${
                                isTrialFlow ? styles['continue-button__margin-top'] : ''
                            }`}
                            to={PATH_BILLING}
                        >Continue &#187;</Link>
                        <button
                            className={styles['change-number']}
                            onClick={() => this.setNumberIsLockedUI()}
                        >
                            Pick a different number
                        </button>
                    </div>
                    :
                    <div>
                        <LinkBox
                            id='page-section_toll-free'
                            to={PATH_CUSTOM_TOLL_FREE}
                            type='Toll Free'
                        />
                        <LinkBox
                            id='page-section_local'
                            to={PATH_LOCAL_RECOMMEND}
                            type='Local'
                        />
                        <Link
                            className={styles.port}
                            id="page-section_number-porting"
                            to={PATH_TRANSFER_CURRENT_NUMBER}
                        >
                            <img
                                alt="grasshopper number badge"
                                className={styles['port-icon']}
                                src={transferSvgSrc}
                            />
                            <div className={styles['port-wrapper']}>
                                <h2 className={styles['port-header']}>Number Porting</h2>
                                <p className={styles['port-text']}>Already have a number you love? No problem! Access Grasshopper’s great features from your current number.</p>
                                <p className={styles['port-link']}>Use your Current Number &#187;</p>
                            </div>
                        </Link>
                    </div>
                }
            </section>
        );
    }
}

//                 <Stepper currentStep={FLOW_STEP_NUMBERS} />
