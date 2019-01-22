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

// ui stores
import AccountInfoClass from '~/common/stores/ui/accountInfo.js';
import BillingInfoClass from '~/common/stores/ui/billingInfo.js';
import DirectPurchaseClass from '~/common/stores/ui/directPurchase.js';
import FormsClass from '~/common/stores/ui/forms.js';
import ModalClass from '~/common/stores/ui/modal.js';
import PlansClass from '~/common/stores/ui/plans.js';
import ProgressClass from '~/common/stores/ui/progress.js';
import ResponsiveClass from '~/common/stores/ui/responsive.js';
import SharedFormUtilsClass from '~/common/stores/ui/sharedFormUtils.js';
import TestingClass from '~/common/stores/ui/testing.js';
import TollFreeClass from '~/common/stores/ui/tollFree.js';

// created root store
class RootStore {
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
        this.accountInfoStore = new AccountInfoClass();
        this.billingInfoStore = new BillingInfoClass();
        this.directPurchaseStore = new DirectPurchaseClass();
        this.formsStore = new FormsClass();
        this.modalStore = new ModalClass();
        this.plansStore = new PlansClass();
        this.progressStore = new ProgressClass();
        this.responsiveStore = new ResponsiveClass();
        this.sharedFormUtilsStore = new SharedFormUtilsClass();
        this.testingStore = new TestingClass();
        this.tollFreeStore = new TollFreeClass();
    }
}

export default new RootStore();
