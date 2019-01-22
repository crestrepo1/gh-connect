import React from 'react';
import PropTypes from 'prop-types';

// Import Local Styles
import styles from './headerGroup.css';

const HeaderGroup = (props) => {
    const { children, paddingTop } = props;

    return (
        <hgroup className={`${styles['header-group']} ${paddingTop ? styles['padding-top'] : ''}`}>
            {children}
        </hgroup>
    );
};

HeaderGroup.propTypes = {
    children: PropTypes.node
};

export default HeaderGroup;
