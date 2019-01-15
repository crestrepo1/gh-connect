import { action, observable } from 'mobx';
import axios from 'axios';

// get url params
// import { ghNls } from '~/common/globals.js';

// import { modalStore } from '~/common/stores/ui/modal.js';

class NumberLockSessionClass {
    @observable NLS;
    @observable NLSerror = false;

    constructor() {
        // get NLS from query string
        // const nls = ghNls();
        // if there is a NLS in the query string
        // if (nls) {
        //     // set it as our NLS
        //     return this.setNumberLockSessionId(nls);
        // }
        // otherwise get a  new number lock session ID
        return this.getNumberLockSession();
    }

    // get number lock session from API
    @action getNumberLockSession() {
        // remove NLS error
        this.setNLSError(false);
        // get a new NLS ID since we don't already have one
        axios.post('/api/NumberlockSession/')
            .then((response) => {
                // set NLS with response data
                return this.setNumberLockSessionId(response.data.SessionId);
            }).catch((err) => {
                this.setNLSError(true);
                // open fatal error modal
                // modalStore.setModalOptions({
                //     isModalOpen: true,
                //     isModalClosable: false,
                //     modalType: 'medium',
                //     childComponentString: 'fatalErrorModal'
                // });
                // catch errors from sources other than API
                return err;
            });
    }

    // set Number Lock error
    @action setNLSError(bool) {
        // if bool exists and is a boolean
        if (typeof bool === 'boolean') {
            this.NLSerror = bool;
        }
    }

    // set Number Lock Session Id
    @action setNumberLockSessionId(sessionId) {
        if (typeof sessionId === 'string' && sessionId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            this.NLS = sessionId;
        } else {
            this.setNLSError(true);
        }
    }
}

const numberLockSessionStore = new NumberLockSessionClass();
export { numberLockSessionStore, NumberLockSessionClass };
