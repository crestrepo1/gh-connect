import { action, observable } from 'mobx';

export default class TestingClass {
    // test variation to be tested agaist
    @observable testVersion = '';

    // set test variation
    @action setTestVersion(version) {
        if (typeof version === 'string' && version.length > 0) {
            // this is only for the signup trial
            if (version === 'Control') {
                this.testVersion = 0;
            } else {
                // otherwise set testVersion to string
                this.testVersion = version;
            }
        }
    }
}
