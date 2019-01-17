// This file is used to display the global error modal for fatal errors
// It should be called from inside stores

import { modalStore } from '~/common/stores/ui/modal.js';

export default function (opts = {}) {
    modalStore.setModalOptions({
        childComponentString: opts.childComponentString || 'fatalErrorModal',
        isModalClosable: opts.isModalClosable || false,
        modalType: opts.modalType || 'medium',
        isModalOpen: opts.isModalOpen || true
    });
}
