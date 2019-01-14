import React from 'react';
import PropTypes from 'prop-types';

// Import Local Styles
import styles from './centering.css';


const Centering = (props) => {
    const { children } = props;

    return (
        <section className={styles.wrapper}>
            {children}
        </section>
    );
};

Centering.propTypes = {
    children: PropTypes.node
};

export default Centering;
