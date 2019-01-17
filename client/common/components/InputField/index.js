import React from 'react';

import Input from '~/common/components/Input';

import styles from './inputField.css';


export default class InputField extends React.Component {
    state = {
        isFocus: false
    }

    setFocusState(e) {
        this.setState({ isFocus: true });
        this.props.onFocus(e);
    }

    setBlurState(e) {
        this.setState({ isFocus: false });
        this.props.onBlur(e);
    }


    render() {
        const { id, label, error, hint, defaultValue, wrapperClass, warning } = this.props;

        return (
            <div className={`${styles.wrapper} ${wrapperClass ? styles[wrapperClass] : ''}`}>
                <Input
                    {...this.props}
                    onBlur={e => this.setBlurState(e)}
                    onFocus={e => this.setFocusState(e)}
                />
                <label className={`${styles.label} ${defaultValue ? styles.min : ''} ${error ? styles.error : ''} ${warning ? styles.warning : ''}`} htmlFor={id}>{label}</label>
                {error && <div className={styles['error-message']}>{error}</div>}
                {hint && this.state.isFocus && <div className={styles.hint}>{hint}</div>}
                {warning && <div className={styles['warning-message']}>{warning}</div>}
            </div>
        );
    }
}
å
