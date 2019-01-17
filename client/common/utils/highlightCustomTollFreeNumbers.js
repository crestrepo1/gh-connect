import React from 'react';
import { findTermIndex } from './highlightCustomTollFreeLetters.js';

// map of letters to numbers
export const numberMap = {
    A: 2,
    B: 2,
    C: 2,
    D: 3,
    E: 3,
    F: 3,
    G: 4,
    H: 4,
    I: 4,
    J: 5,
    K: 5,
    L: 5,
    M: 6,
    N: 6,
    O: 6,
    P: 7,
    Q: 7,
    R: 7,
    S: 7,
    T: 8,
    U: 8,
    V: 8,
    W: 9,
    X: 9,
    Y: 9,
    Z: 9
};


// highlight ui formatted number
export default function highlightCustomTollFreeNumbers(number, term) {
    // if number exists
    if (typeof number === 'string' && typeof term === 'string') {
        // otherwise it could be a mix of letters and numbers
        // and arent able to easily match against letters
        // remove all special characters (force uppercase)
        const numberWithoutSpecialCharacters = number.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        // get term index
        const termIndex = findTermIndex(numberWithoutSpecialCharacters, term.toUpperCase());
        // if term exists
        if (termIndex > -1) {
            // split the string into array, and replace numbers
            const numberWithoutLetters = numberWithoutSpecialCharacters.split('').map((value) => {
                // if letter
                if (numberMap[value]) {
                    // return number
                    return numberMap[value];
                }
                // otherwise return value
                return value;
            // join back into a string
            }).join('');
            // length of term
            const termLength = term.length;
            // where to end
            const termIndexPlusLength = termIndex + termLength;
            // prefix
            const prefix = numberWithoutLetters.substring(0, 3);
            // numbers before search term
            let beforeTerm = numberWithoutLetters.substring(3, termIndex);
            // term substring
            let termSubstring = numberWithoutLetters.substring(termIndex, termIndexPlusLength);
            // after term
            let afterTerm = (termIndexPlusLength !== numberWithoutLetters.length ? numberWithoutLetters.substring(termIndexPlusLength, numberWithoutLetters.length) : '');
            // case where term, before, or after term is split by dash
            let termSplitWithDash;
            let beforeSplitWithDash;
            let afterSplitWithDash;
            let termExactlyAfterDash;

            // if term is split by dash, split it into two parts
            if (termIndex < 6 && termIndexPlusLength > 6) {
                termSubstring = numberWithoutLetters.substring(termIndex, 6);
                termSplitWithDash = numberWithoutLetters.substring(6, termIndexPlusLength);
            }
            // if before term is more than 3 then the dash is in the middle of it
            if (beforeTerm.length > 3) {
                beforeTerm = numberWithoutLetters.substring(3, 6);
                beforeSplitWithDash = numberWithoutLetters.substring(6, termIndex);
            }

            // if before term is exactly 3, then the dash is right after the before term
            if (beforeTerm.length === 3) {
                beforeTerm = numberWithoutLetters.substring(3, 6);
                termExactlyAfterDash = true;
            }

            // if after term is more than 4, then the dash is in the middle of it
            if (afterTerm.length > 4) {
                afterTerm = numberWithoutLetters.substring(termIndexPlusLength, 6);
                afterSplitWithDash = numberWithoutLetters.substring(6, numberWithoutLetters.length);
            }

            // split with dash in the middle
            if (termSplitWithDash) {
                return (
                    <span>
                        {`(${prefix}) `}
                        {beforeTerm}
                        <em>{termSubstring}</em>
                        -
                        <em>{termSplitWithDash}</em>
                        {afterTerm}
                    </span>
                );
            }

            // if dash is before the term
            if (beforeSplitWithDash) {
                // return formatted element
                return (
                    <span>
                        {`(${prefix}) `}
                        {beforeTerm}
                        -
                        {beforeSplitWithDash}
                        <em>{termSubstring}</em>
                        {afterTerm}
                    </span>
                );
            }

            // if dash is right before term
            if (termExactlyAfterDash) {
                // return formatted element
                return (
                    <span>
                        {`(${prefix}) `}
                        {beforeTerm}
                        -
                        <em>{termSubstring}</em>
                        {afterTerm}
                    </span>
                );
            }

            // if dash is after the term
            if (afterSplitWithDash) {
                // return formatted element
                return (
                    <span>
                        {`(${prefix}) `}
                        {beforeTerm}
                        <em>{termSubstring}</em>
                        {afterTerm}
                        -
                        {afterSplitWithDash}
                    </span>
                );
            }
        }
    }
    // otherwise just return input
    return number;
}
