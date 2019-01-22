import { action, observable } from 'mobx';
import { BREAKPOINT_SMALL, BREAKPOINT_MEDIUM, BREAKPOINT_LARGE } from '~/common/utils/consts.js';

const upperBoundBreakpoint = (width) => {
    const orderedBreakpoints = [BREAKPOINT_SMALL, BREAKPOINT_MEDIUM, BREAKPOINT_LARGE];
    const breakpoint = orderedBreakpoints.find(bp => bp.value > width);

    return breakpoint ? breakpoint.name : null;
};

export default class ResponsiveClass {
    @observable breakpointSubscribers = 0;
    @observable sizeSubscribers = 0;
    @observable upperBoundBreakpoint = upperBoundBreakpoint(window.innerWidth);
    @observable innerWidth = window.innerWidth;
    @observable innerHeight = window.innerHeight;
    @observable outerWidth = window.outerWidth;
    @observable outerHeight = window.outerHeight;

    @action subscribe(subscribeBreakpoint, subscribeSize) {
        if (subscribeBreakpoint) this.breakpointSubscribers = this.breakpointSubscribers + 1;

        if (subscribeSize) this.sizeSubscribers = this.sizeSubscribers + 1;
    }

    @action unsubscribe(subscribeBreakpoint, subscribeSize) {
        if (subscribeBreakpoint && this.breakpointSubscribers > 0) {
            this.breakpointSubscribers = this.breakpointSubscribers - 1;
        }

        if (subscribeSize && this.sizeSubscribers > 0) {
            this.sizeSubscribers = this.sizeSubscribers - 1;
        }
    }

    @action updateSize() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.outerWidth = window.outerWidth;
        this.outerHeight = window.outerHeight;
    }

    @action updateBreakpoint() {
        this.upperBoundBreakpoint = upperBoundBreakpoint(window.innerWidth);
    }
}
