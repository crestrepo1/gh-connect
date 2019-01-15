// Import Dependencies
import React from 'react';
import { inject, observer } from 'mobx-react';
// Global css files
import '~/common/styles/reset.css';
import '~/common/styles/default.css';

// import BrowserRouter
import { BrowserRouter } from 'react-router-dom';

import Header from '~/common/components/Header';

// Import route Components
import Routes from '~/Routes.js';

@inject('numberLockSessionStore')
@observer
export default class App extends React.Component {
    render() {
        const { NLS } = this.props.numberLockSessionStore;
        return (
            // insert router
            <BrowserRouter>


                <main>
                    <Header />
                    {NLS
                        ?

                        <Routes />
                        :
                        // loading spinner
                        <div>
                            loading
                        </div>
                    }
                </main>

            </BrowserRouter>
        );
    }
}
