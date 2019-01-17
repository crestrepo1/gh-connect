import React from 'react';
import PropTypes from 'prop-types';

// Import Local Styles
import styles from './select.css';

export default class Select extends React.Component {
    state = {
        isFocus: false
    }

    setFocusState() {
        this.setState({ isFocus: true });
    }

    setBlurState() {
        this.setState({ isFocus: false });
    }

    render() {
        const { name, label, error, hint, children, disabled, onChange, value, selected } = this.props;

        return (
            <div className={styles.wrapper}>
                <div className={`${styles['select-wrapper']} ${selected ? styles.selected : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''} ${this.state.isFocus ? styles.focused : ''}`}>
                    <label className={`${styles['select-label']} ${error ? styles.selectedError : ''}`} htmlFor={name}>{label}</label>
                    <select
                        className={`${styles.select} ${error ? styles.selectedError : ''} ${this.state.isFocus ? styles['focused-input'] : ''}`}
                        disabled={disabled || false}
                        id={name}
                        name={name}
                        onBlur={() => this.setBlurState()}
                        onChange={onChange}
                        onFocus={() => this.setFocusState()}
                        value={value}
                    >
                        {children}
                    </select>

                </div>
                {error &&<div className={styles['error-message']}>{error}</div>}
                {hint && <div className={styles.hint}>{hint}</div>}
            </div>
        );
    }
}

Select.propTypes = {
    onChange: PropTypes.func,
    children: PropTypes.node,
    error: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
};
