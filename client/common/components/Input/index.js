import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

// Import Local Styles
import styles from './input.css';

export default class Input extends React.Component {

    escapeRegExp(text) { // escapes characters in a string, so regExp works
        return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : undefined;
    }

    verifyCharacter(e) {
        let re;
        let reDis;
        const allow = this.escapeRegExp(this.props.allowedCharacters);
        const disallow = this.escapeRegExp(this.props.disallowedCharacters);
        const regExpressions = {
            alphaOnly: 'A-Za-z',
            alphaNumericOnly: 'A-Za-z0-9',
            numericOnly: '0-9',
            latinOnly: 'A-zÀ-ÖØ-öø-ÿ',
            latinNumericOnly: 'A-zÀ-ÖØ-öø-ÿ0-9'

        };

        if (this.props.restrictCharacters) {
            re = new RegExp(`[${regExpressions[this.props.restrictCharacters]}${allow}]`, 'g');
            reDis = new RegExp(`[^${disallow}]`, 'g');
            if (!re.test(e.key)) {
                e.preventDefault();
            }
            if (disallow !== undefined) {
                if (!reDis.test(e.key)) {
                    e.preventDefault();
                }
            }
        }

        // for input type number, make max work correctly so it limits characters
        if (typeof this.props.max === 'number') {
            if (e.target.value.length >= this.props.max) {
                e.preventDefault();
            }
        }
    }

    render() {
        const { autoComplete, onChange, id, name, mask,
            maxLength, max, placeholder, warning, type,
            error, defaultValue, guide, pattern, onWheel,
            onBlur, onFocus, disabled, inputMode } = this.props;

        if (this.props.mask) {
            return (
                <MaskedInput
                    {...{
                        autoComplete,
                        disabled,
                        guide,
                        id,
                        inputMode,
                        mask,
                        max,
                        maxLength,
                        name,
                        onBlur,
                        onChange,
                        onFocus,
                        onWheel,
                        pattern,
                        placeholder,
                        type
                    }}
                    className={`${styles.input} ${error ? styles.error : ''} ${warning ? styles.warning : ''}`}
                    onKeyPress={e => this.verifyCharacter(e)}
                    ref={(input) => { this.textInput = input; }}
                    value={defaultValue}
                />
            );
        }
        return (
            <input
                {...{
                    autoComplete,
                    disabled,
                    id,
                    inputMode,
                    max,
                    maxLength,
                    name,
                    onBlur,
                    onChange,
                    onFocus,
                    onWheel,
                    pattern,
                    placeholder,
                    type
                }}
                className={`${styles.input} ${error ? styles.error : ''} ${warning ? styles.warning : ''}`}
                onKeyPress={e => this.verifyCharacter(e)}
                ref={(input) => { this.textInput = input; }}
                value={defaultValue}
            />
        );
    }
}

Input.defaultProps = {
    autoComplete: 'on'
};

Input.propTypes = {
    allowedCharacters: PropTypes.string,
    autoComplete: PropTypes.string,
    defaultValue: PropTypes.string,
    disallowedCharacters: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    max: PropTypes.number,
    minCharacters: PropTypes.number,
    placeholder: PropTypes.string,
    restrictCharacters: PropTypes.string,
    type: PropTypes.string.isRequired
};
