import React from 'react';
import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import { PATH_TRIAL_BLOCKER } from '~/common/utils/consts.js';


const trialFlowView = (View) => {
    @inject('userLocationStore', 'trialSignupStore')
    @observer
    class TrialFlowView extends React.Component {
        render() {
            const { userLocationStore, trialSignupStore } = this.props;

            // if user location has been fetched and the user is not in the US
            if (userLocationStore.userLocation && !userLocationStore.isTrialAllowed && trialSignupStore.isTrialFlow) {
                return <Redirect push={true} to={PATH_TRIAL_BLOCKER} />;
            }
            return <View {...this.props} />;
        }
    }

    return TrialFlowView;
};

export default trialFlowView;
