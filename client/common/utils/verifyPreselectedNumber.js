import { ghUi, ghE164, ghSms, ghPreselectedNumberType } from '~/common/globals.js';

// verify preselected number
export default function verifyPreselectedNumber(type) {
    const UI = ghUi();
    const E164 = ghE164();
    const IsSMSEnabled = ghSms();
    const PreselectedNumberType = ghPreselectedNumberType();
    // pattern to test numbers against (letters are acceptable in Custom Toll Free)
    const pattern = type.toLowerCase().indexOf('toll free') ? /[^0-9a-zA-Z]/g : /[^0-9]/g;
    // if UI number that matches valid pattern
    // if E164 number that matches valid pattern
    // if IsSMSEnabled flag is there and not null
    // if type matches preselected type
    if (
        UI &&
        (UI.replace(pattern, '').length === 10 || UI.replace(pattern, '').length === 11) &&
        E164 &&
        E164.match(/^\+?[1-9]\d{1,14}$/) &&
        IsSMSEnabled !== null
        && (type && PreselectedNumberType && decodeURI(PreselectedNumberType.toLowerCase()) === type.toLowerCase())
    ) {
        // return valid preselected number
        return true;
    }
    // return invalid preselected number
    return false;
}
