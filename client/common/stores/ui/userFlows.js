import { action, observable, computed, reaction } from 'mobx';
// import { lockNumberStore } from '~/common/stores/domain/lockNumber.js';

import {
    FLOW_STEP_PLANS, FLOW_STEP_NUMBERS,
    FLOW_STEP_BILLING, FLOW_STEP_ACCOUNT,
    FLOW_STEP_WELCOME, FLOW_STEP_VERIFICATION,
    FLOW_DIRECT_PURCHASE, FLOW_TRIAL_SIGNUP,
    FLOW_TRIAL_CONVERTION
    //PATH_BILLING, PATH_NUMBERS, PATH_PLANS,
} from '~/common/utils/consts.js';

class UserFlowsClass {

    FLOWS = {
        [FLOW_DIRECT_PURCHASE] : [FLOW_STEP_NUMBERS, FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_BILLING, FLOW_STEP_WELCOME],
        [FLOW_TRIAL_SIGNUP] : [FLOW_STEP_NUMBERS, FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_VERIFICATION, FLOW_STEP_WELCOME],
        [FLOW_TRIAL_CONVERTION] : [FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_BILLING, FLOW_STEP_WELCOME]
    }


    @observable directPurchase =  [FLOW_STEP_NUMBERS, FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_BILLING, FLOW_STEP_WELCOME];
    @observable trial = [FLOW_STEP_NUMBERS, FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_VERIFICATION, FLOW_STEP_WELCOME];
    @observable convertToPaid = [FLOW_STEP_ACCOUNT, FLOW_STEP_PLANS, FLOW_STEP_BILLING, FLOW_STEP_WELCOME];
    @observable userFlow = null;

    @observable firstView;

    constructor() {
        reaction(

        )
    }


    // @computed get nextStepFromPlans() {
    //     if (
    //         this.firstView === FLOW_STEP_PLANS ||
    //         (this.firstView === FLOW_STEP_NUMBERS && !lockNumberStore.numberIsLocked)
    //     ) {
    //         return PATH_NUMBERS;
    //     }

    //     return PATH_BILLING;
    // }

    // @computed get nextStepFromNumbers() {
    //     if (this.firstView === FLOW_STEP_NUMBERS) {
    //         return PATH_PLANS;
    //     }
    //     return PATH_BILLING;
    // }

}

const userFlowStore = new UserFlowsClass();
export { userFlowStore, UserFlowsClass };
