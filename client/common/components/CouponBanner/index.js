// Import Dependencies
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { PATH_EXPIRED_TRIAL_BLOCKER } from '~/common/utils/consts.js';

// Import Local Styles
import styles from './coupon-banner.css';

@withRouter
@inject('promoCodeStore')
@observer
export default class CouponBanner extends React.Component {
    renderCopy() {
        const { promo } = this.props.promoCodeStore;
        return (
            promo && promo.Message ?
                <div className={styles['text-container']}>
                    {promo.Message}
                </div>
                :
                <div className={styles['text-container']}>
                    Hurry, offer valid today only!<br /> Discount reflected at checkout.
                </div>
        );
    }

    renderAmount() {
        const { promo } = this.props.promoCodeStore;

        return (
            promo && promo.Amount &&
                <div className={styles['amount-container']}>
                    {promo.Amount > 50 ? 'Up to ' : null}${promo.Amount} off!
                </div>
        );
    }

    closeBanner() {
        this.props.promoCodeStore.setIsBannerOpen(false);
    }

    render() {
        const { isBannerOpen } = this.props.promoCodeStore;
        const { location } = this.props.history;

        if (
            location.pathname === PATH_EXPIRED_TRIAL_BLOCKER
        ) return false;

        return (
            <div className={`${styles.wrapper} ${isBannerOpen ? styles.open : ''}`}>
                <div className={styles.content}>
                    {this.renderCopy()}
                    {this.renderAmount()}
                    <span className={styles.close} onClick={() => this.closeBanner()}>×</span>
                </div>
            </div>
        );
    }
}
