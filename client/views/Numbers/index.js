// Import Dependencies
import React, { Component } from 'react';
// Import Stylesheet
// import styles from './numbers.css';

import { observer, inject } from 'mobx-react';

@inject('numberLockSessionStore')
@observer
export default class Numbers extends Component {

    render() {

        return (
            <section>
                numbers view
            </section>
        );
    }
}
