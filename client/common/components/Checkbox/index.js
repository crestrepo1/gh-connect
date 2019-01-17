import React from 'react';
import PropTypes from 'prop-types';

// Import Local Styles
import styles from './checkbox.css';

const Checkbox = (props) => {
    const { size, checked, onClick } = props;
    return (
        <a
            className={`${
                styles.wrapper} ${
                size ? styles[`wrapper--${size}`] : ''} ${
                checked ? styles['wrapper--checked'] : ''
            }`}
            onClick={onClick}
            tabIndex="0"
        ></a>
    );
};

Checkbox.propTypes = {
    size: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func
};

Checkbox.defaultProps = {
    checked: false
};

export default Checkbox;
