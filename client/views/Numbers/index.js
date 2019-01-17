// Import Dependencies
import React, { Component } from 'react';
// Import Stylesheet
// import styles from './numbers.css';

import { observer, inject } from 'mobx-react';

@inject()
@observer
export default class Numbers extends Component {
    componentWillMount() {
        console.log('numbers view will mount');
        // const { progressStore, lockNumberStore } = this.props;
        // // checks if this is the app entry point and sets corresponding flag
        // if (!progressStore.firstView) {
        //     progressStore.setFirstView(FLOW_STEP_NUMBERS);
        // }

        // if (!lockNumberStore.selectedNumberUI) {
        //     // track SCBeacon: saw Numbers page first or after picking a plan
        //     scBeacon(createPersonalizedPurchaseEvent('0'));
        // }
    }
    render() {
        return (
            <section>
                numbers view
            </section>
        );
    }
}
