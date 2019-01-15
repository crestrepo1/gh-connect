/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
// import strict mode for mobx

// import mobx stores
import stores from '~/common/stores/stores.js';

// Import root app
import App from './App';

const MOUNT_NODE = document.getElementById('app');

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>,
    MOUNT_NODE,
);

