// Import Dependencies
import React, { Component } from 'react';
import axios from 'axios';
// Global css files
import '~/common/styles/reset.css';
import '~/common/styles/default.css';

// import BrowserRouter
import { BrowserRouter } from 'react-router-dom';

import Header from '~/common/components/Header';

// Import route Components
import Routes from '~/Routes.js';

export default class App extends Component {


    render() {
        return (
            // insert router
            <BrowserRouter>
                <main>
                    <Header />
                    <Routes />
                </main>
            </BrowserRouter>
        );
    }
}
