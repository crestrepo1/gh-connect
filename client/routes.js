/*
Global file for setting React routes.
*/

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

// // Import view components for this flow, sort of like different views or page content
import Plans from '~/views/Plans';
import Numbers from '~/views/Numbers';
import LocalRecommend from '~/views/LocalRecommend';
import LocalSearch from '~/views/LocalSearch';
import TollFree from '~/views/TollFree';
import CustomTollFree from '~/views/CustomTollFree';
import TransferCurrentNumber from '~/views/TransferCurrentNumber';
import ConfirmNumberTransfer from '~/views/ConfirmNumberTransfer';
// import Billing from '~/views/Billing';
// import Pending from '~/views/Pending';
// import TrialSignup from '~/views/TrialSignup';
// import TrialSignupSuccess from '~/views/TrialSignupSuccess';
// import TrialBlocker from '~/views/TrialBlocker';
// import ExpiredTrialBlocker from '~/views/ExpiredTrialBlocker';

import {
    PATH_PLANS, PATH_NUMBERS, PATH_LOCAL_RECOMMEND, PATH_LOCAL_SEARCH, PATH_TOLL_FREE, PATH_CUSTOM_TOLL_FREE, PATH_TRANSFER_CURRENT_NUMBER, PATH_CONFIRM_NUMBER_TRANSFER,
    PATH_BILLING, PATH_PENDING,
    PATH_TRIAL_NUMBERS, PATH_TRIAL_SIGNUP, PATH_TRIAL_SIGNUP_SUCCESS,
    PATH_TRIAL_LOGIN, PATH_TRIAL_UPGRADE, PATH_TRIAL_BLOCKER,
    PATH_EXPIRED_TRIAL_BLOCKER
} from '~/common/utils/consts.js';

const Routes = () => (
    <Switch> {/* Switch, Renders first <Route> or <Redirect> that matches the location. */}
        <Route
            component={Numbers}
            exact
            path={PATH_NUMBERS}
        />
        {/* Vanity number views*/}
        <Route
            component={TollFree}
            path={PATH_TOLL_FREE}
        />
        <Route
            component={CustomTollFree}
            path={PATH_CUSTOM_TOLL_FREE}
        />
        {/* Local number views*/}
        <Route
            component={LocalRecommend}
            path={PATH_LOCAL_RECOMMEND}
        />
        <Route
            component={LocalSearch}
            path={PATH_LOCAL_SEARCH}
        />
        {/* Transfer number views*/}
        />
        <Route
            component={TransferCurrentNumber}
            path={PATH_TRANSFER_CURRENT_NUMBER}
        />
        <Route
            path={PATH_CONFIRM_NUMBER_TRANSFER}
            // render={() => {
            //     if (transferNumberStore.transferNumberLength > 0) {
            //         return <ConfirmNumberTransfer />;
            //     }
            //     return <Redirect to={PATH_TRANSFER_CURRENT_NUMBER} />;
            // }}
            component={ConfirmNumberTransfer}
        />
        <Route
            component={Plans}
            path={PATH_PLANS}
        />
        <Redirect to={{ pathname: PATH_NUMBERS, search: location.search }} />
    </Switch>
);

export default Routes;
