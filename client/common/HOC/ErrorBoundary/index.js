
// Import Dependencies
import React from 'react';

export default class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    }

    componentDidCatch() {
        // Display loading spinner
        this.setState({ hasError: true });
    }

    render() {
        return this.state.hasError ?
            <h1>OOPS!</h1>
            :
            this.props.children;
    }
}
