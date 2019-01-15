// Import Dependencies
import React, { Component } from 'react';
import axios from 'axios';
// Global css files
import '~/common/styles/reset.css';
import '~/common/styles/default.css';

// import BrowserRouter
import { BrowserRouter } from 'react-router-dom';

import Header from '~/common/components/Header';

class App extends Component {
    componentDidMount() {
        axios.post('/api/NumberlockSession/')
            .then((response) => {
                console.log(response);
            }).catch((err) => {
                return err;
            });
    }

    render() {
        return (
            // insert router
            <BrowserRouter>
                <main>
                    <Header />
                    Hello World!!!!
                </main>
            </BrowserRouter>
        );
    }
}

// this is imported in the entry.js file
export default App;
