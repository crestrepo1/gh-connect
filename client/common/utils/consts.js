import UrlParam from '~/common/utils/urlParam.js';

// offer suite plans consts
export const PLAN_TERM_MONTHLY = 'monthly';
export const PLAN_TERM_ANNUAL = 'annual';
export const NUMBER_TRANSFER_FEE = 30;
export const SOLO_EXTENSION = 3;
export const PARTNER_EXTENSION = 6;
export const SMALL_BUSINESS_EXTENSION = 'Unlimited';
export const DEFAULT_EXTENSION = SOLO_EXTENSION;
export const BASE_ODOMETER_REEL = '0123456789';
// offer suite discount amount text
// export const BASE_ANNUAL_DISCOUNT_PERCENTAGE = UrlParam('ghOp') ? `${UrlParam('ghOp')}%` : '10%';
// saving this for record
export const OFFER_SUITE_NO_ANNUAL = 'ad188a9b-097d-4478-9f27-85e7c37f38cf';
export const OFFER_SUITE_ANNUAL = 'E5E48C3A-9E93-4350-A974-36E18D27F1D0';
export const OFFER_SUITE_DEFAULT = OFFER_SUITE_ANNUAL;


// convert to paid store consts
export const USER_LOGIN_VERSION = 4;
export const USER_LOGIN_GRANT_TYPE = 'password';
export const USER_LOGIN_PRODUCT_GUID = '9b1b8c63-1354-2078-e053-0100007f2fee';

// trial sign up consts
export const OFFER_SUITE_TRIAL = '3E1777E1-C207-4C97-8869-B793E887D436';
export const OFFER_ID_TRIAL = '842C4C5D-D0B3-4310-A11D-1E4460B73086';
export const TRIAL_PRODUCT_GUID = '9b1b8c63-1354-2078-e053-0100007f2fee';
export const TRIAL_PRODUCT_DESC = 'Grasshopper';

// error handling messages for payment estimate
export const PAYMENT_ESTIMATE_GENERIC_ERROR = 'Your address is invalid. Please correct any errors below and try submitting your information again.';
export const PAYMENT_ESTIMATE_MISMATCH_COUNTRY = 'This country doesn\'t match the zip code you\'ve selected. Please try again.';
export const PAYMENT_ESTIMATE_NO_TRIAL_ACCOUNT = 'You do not have a trial account.';

// responsive breakpoint consts
export const BREAKPOINT_SMALL = { name: 'small', value: 768 };
export const BREAKPOINT_MEDIUM = { name: 'medium', value: 992 };
export const BREAKPOINT_LARGE = { name: 'large', value: 1200 };

// promo codes
export const PROMO_CODE_COOKIE_NAME = 'promo';
export const PROMO_CODE_MODAL_VIEWED_COOKIE_NAME = 'promoModalViewed';
export const PROMO_CODE_MODAL_CLOSED_COOKIE_NAME = 'promoBannerClosed';
export const PROMO_COUPON_25 = '25dollars';
export const PROMO_COUPON_75 = '75dollars';
export const PROMO_COUPON_TRIAL_EXPIRED = 'try75recycled';
export const PROMO_MAX_AMOUNT_ALLOWED = 75;
export const PROMO_MAX_AMOUNT_ALLOWED_MONTHLY = 30;

// user flows
export const FLOW_DIRECT_PURCHASE = 'direct purchase';
export const FLOW_TRIAL_SIGNUP = 'trial signup';
export const FLOW_TRIAL_CONVERTION = 'convert to paid';

// flow step consts
export const FLOW_STEP_PLANS = 'plans';
export const FLOW_STEP_NUMBERS = 'numbers';
export const FLOW_STEP_BILLING = 'billing';
export const FLOW_STEP_ACCOUNT = 'account';
export const FLOW_STEP_WELCOME = 'welcome';
export const FLOW_STEP_VERIFICATION = 'verification';

// path consts
// general paths
export const PATH_PLANS = '/plans';
export const PATH_NUMBERS = '/numbers';
export const PATH_LOCAL_RECOMMEND = '/numbers/local-recommend';
export const PATH_LOCAL_SEARCH = '/numbers/local-search';
export const PATH_TOLL_FREE = '/numbers/toll-free';
export const PATH_CUSTOM_TOLL_FREE = '/numbers/custom-toll-free';
export const PATH_TRANSFER_CURRENT_NUMBER = '/numbers/transfer/current-number';
export const PATH_CONFIRM_NUMBER_TRANSFER = '/numbers/transfer/confirm-current-number-transfer';
export const PATH_BILLING = '/billing';
export const PATH_PENDING = '/pending';
// trial signup paths
export const PATH_TRIAL_NUMBERS = '/trial-numbers';
export const PATH_TRIAL_SIGNUP = '/trial-signup';
export const PATH_TRIAL_SIGNUP_SUCCESS = '/trial-signup-success';
export const PATH_TRIAL_BLOCKER = '/trial-block';
export const PATH_EXPIRED_TRIAL_BLOCKER = '/expired/trial';
// convert to paid paths
export const PATH_TRIAL_LOGIN = '/plans/trial';
export const PATH_TRIAL_UPGRADE = '/billing/trial';

// device types
export const DEVICE_MOBILE_IOS = 'ios mobile touch-screen';
export const DEVICE_MOBILE_ANDROID = 'android mobile touch-screen';
export const DEVICE_MOBILE_OTHER = 'mobile touch-screen';
export const DEVICE_TABLET_IOS = 'ios tablet touch-screen';
export const DEVICE_TABLET_OTHER = 'tablet touch-screen';
export const DEVICE_DESKTOP_MAC = 'mac desktop';
export const DEVICE_DESKTOP_WINDOWS = 'windows desktop';
export const DEVICE_DESKTOP_OTHER = 'desktop';

// cards types array
export const CARD_TYPE_OBJ = { '001': 'visa', '002': 'mc', '003': 'amex' };

// trial allowed countries
// US, CANADA, COSTA RICA
export const TRIAL_ALLOWED_COUNTRIES = ['US', 'CA', 'CR'];
