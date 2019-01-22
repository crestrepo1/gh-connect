import { action, observable, computed } from 'mobx';
import { lockNumberStore } from '~/common/stores/domain/lockNumber.js';

import {
    FLOW_STEP_PLANS, FLOW_STEP_NUMBERS,
    PATH_BILLING, PATH_NUMBERS, PATH_PLANS
} from '~/common/utils/consts.js';

export default class ProgressClass {
    @observable firstView;

    @action setFirstView(str) {
        if (!(this.firstView) && typeof str === 'string') {
            this.firstView = str;
        }
    }

    @computed get nextStepFromPlans() {
        if (
            this.firstView === FLOW_STEP_PLANS ||
            (this.firstView === FLOW_STEP_NUMBERS && !lockNumberStore.numberIsLocked)
        ) {
            return PATH_NUMBERS;
        }

        return PATH_BILLING;
    }

    @computed get nextStepFromNumbers() {
        if (this.firstView === FLOW_STEP_NUMBERS) {
            return PATH_PLANS;
        }
        return PATH_BILLING;
    }
}
