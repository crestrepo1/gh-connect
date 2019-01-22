import { observable, action } from 'mobx';

export default class TollFreeClass {
    // type of numbers to show (Custom Toll Free or Toll Free)
    @observable viewType = 'Custom Toll Free';

    // set view type (which content to show in toll free page)
    @action setViewType(str) {
        if (typeof str === 'string') {
            this.viewType = str;
        }
    }
}
