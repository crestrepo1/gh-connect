// domain stores
import NumberLockSessionClass from '~/common/stores/domain/numberLockSession.js';
import PromoCodeClass from '~/common/stores/domain/promoCode.js';
// import { userLocationStore } from '~/common/stores/domain/userLocation.js';
// import { lockNumberStore } from '~/common/stores/domain/lockNumber.js';
// import { customTollFreeNumbersStore } from '~/common/stores/domain/customTollFreeNumbers.js';
// import { localNumbersStore } from '~/common/stores/domain/localNumbers.js';
import OfferSuiteClass from '~/common/stores/domain/offerSuite.js';
// import { requestLocalNumberStore } from '~/common/stores/domain/requestLocalNumber.js';
// import { requestSMSStore } from '~/common/stores/domain/requestSMS.js';
// import { tollFreeNumbersStore } from '~/common/stores/domain/tollFreeNumbers.js';
// import { pendingStore } from '~/common/stores/domain/pending.js';
// import { suggestedCitiesStore } from '~/common/stores/domain/suggestedCities.js';
// import { emailCaptureStore } from '~/common/stores/domain/emailCapture.js';
// import { flexFrameStore } from '~/common/stores/domain/flexFrame.js';
// import { trialSignupStore } from '~/common/stores/domain/trialSignup.js';
// import { convertToPaidStore } from '~/common/stores/domain/convertToPaid.js';
// import { transferNumberStore } from '~/common/stores/domain/transferNumber.js';

// // ui stores
// import { modalStore } from '~/common/stores/ui/modal.js';
// import { directPurchaseStore } from '~/common/stores/ui/directPurchase.js';
// import { plansStore } from '~/common/stores/ui/plans.js';
// import { tollFreeStore } from '~/common/stores/ui/tollFree.js';
// import { progressStore } from '~/common/stores/ui/progress.js';
// import { testingStore } from '~/common/stores/ui/testing.js';
// import { formsStore } from '~/common/stores/ui/forms.js';
// import { sharedFormUtilsStore } from '~/common/stores/ui/sharedFormUtils.js';
// import { accountInfoStore } from '~/common/stores/ui/accountInfo.js';
// import { billingInfoStore } from '~/common/stores/ui/billingInfo.js';
// import { responsiveStore } from '~/common/stores/ui/responsive.js';

// created root store
export default class RootStore {
    constructor() {
        this.numberLockSessionStore = new NumberLockSessionClass();
        this.offerSuiteStore = new OfferSuiteClass();
        this.promoCodeStore = new PromoCodeClass(this)
    }
}

