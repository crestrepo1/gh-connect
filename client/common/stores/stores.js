// domain stores
import ConvertToPaidClass from '~/common/stores/domain/convertToPaid.js';
import CustomTollFreeNumbersClass from '~/common/stores/domain/customTollFreeNumbers.js';
import EmailCaptureClass from '~/common/stores/domain/emailCapture.js';
import FlexFrameStoreClass from '~/common/stores/domain/flexFrame.js';
import LocalNumbersClass from '~/common/stores/domain/localNumbers.js';
import LockNumberClass from '~/common/stores/domain/lockNumber.js';
import NumberLockSessionClass from '~/common/stores/domain/numberLockSession.js';
import OfferSuiteClass from '~/common/stores/domain/offerSuite.js';
import PendingClass from '~/common/stores/domain/pending.js';
import PromoCodeClass from '~/common/stores/domain/promoCode.js';
import RequestLocalNumberClass from '~/common/stores/domain/requestLocalNumber.js';
import RequestSMSClass from '~/common/stores/domain/requestSMS.js';
import SuggestedCitiesClass from '~/common/stores/domain/suggestedCities.js';
import TollFreeNumbersClass from '~/common/stores/domain/tollFreeNumbers.js';
import TransferNumberClass from '~/common/stores/domain/transferNumber.js';
import TrialSignupClass from '~/common/stores/domain/trialSignup.js';
import UserLocationClass from '~/common/stores/domain/userLocation.js';

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
        this.convertToPaidStore = new ConvertToPaidClass(this);
        this.customTollFreeNumbersStore = new CustomTollFreeNumbersClass(this);
        this.emailCaptureStore = new EmailCaptureClass();
        this.flexFrameStore = new FlexFrameStoreClass();
        this.localNumbersStore = new LocalNumbersClass(this);
        this.lockNumberStore = new LockNumberClass(this);
        this.numberLockSessionStore = new NumberLockSessionClass();
        this.offerSuiteStore = new OfferSuiteClass();
        this.pendingStore = new PendingClass();
        this.promoCodeStore = new PromoCodeClass(this);
        this.requestLocalNumberStore = new RequestLocalNumberClass();
        this.requestSMSStore = new RequestSMSClass();
        this.suggestedCitiesStore = new SuggestedCitiesClass();
        this.tollFreeNumbersStore = new TollFreeNumbersClass(this);
        this.transferNumberStore = new TransferNumberClass(this);
        this.trialSignupStore = new TrialSignupClass();
        this.userLocationStore = new UserLocationClass();
    }
}

