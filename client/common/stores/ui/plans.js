import { action, observable } from 'mobx';

export default class PlansClass {
    // current index of visible slide
    @observable visibleSlideIndex = 0;
    // number of slides (starting at 0)
    @observable slideLength = 2;
    // array containing expanded questions
    @observable expandedQuestions = [];
    // array containing expanded plans
    @observable expandedOffers = [];
    // set visible slide
    @action setVisibleSlideIndex(num) {
        if (typeof num === 'number') {
            this.visibleSlideIndex = num;
        }
    }
    // set number of slides
    @action setSlideLength(num) {
        if (typeof num === 'number') {
            this.slideLength = num;
        }
    }
    // expand or collapse questions
    @action expandCollapseQuestions(id) {
        // check to see if id exists in array of expanded offers
        const index = this.expandedQuestions.indexOf(id);
        // if item exists in array, remove it
        if (index > -1) {
            this.expandedQuestions.splice(index, 1);
        } else {
            // otherwise add it to list of expanded offers
            this.expandedQuestions = [id];
        }
    }

    // expand or collapse plan
    @action expandCollapsePlan(id) {
        // check to see if id exists in array of expanded offers
        const index = this.expandedOffers.indexOf(id);
        // if item exists in array, remove it
        if (index > -1) {
            return this.expandedOffers.splice(index, 1);
        }
        // otherwise add it to list of expanded offers
        return this.expandedOffers.push(id);
    }
}
