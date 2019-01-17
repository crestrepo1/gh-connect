import { ghUi, ghE164, ghSms } from '~/common/globals.js';

// return preselected number object
export default function preselectedNumberObject() {
    const UI = ghUi();
    const E164 = ghE164();
    const IsSMSEnabled = ghSms();

    return {
        UI,
        E164,
        IsSMSEnabled: Boolean(IsSMSEnabled)
    };
}
