import React from 'react';

export function findTermIndex(numberWithoutSpecialCharacters, term) {
    // variable holding index of term
    let index = -1;
    // temp variable holding term
    let tempTerm = term.toUpperCase();

    // remove * from search term
    tempTerm = tempTerm.replace(/\*/ig, '');

    // loop for term index
    while (tempTerm.length > 0 && index < 0) {
        index = numberWithoutSpecialCharacters.search(tempTerm);
        // if term isn't found or we've got no letters left
        if (index < 0) {
            // strip off the last character and search again
            tempTerm = tempTerm.substring(0, tempTerm.length - 1);
        }
    }
    return index;
}

// highlight ui formatted number
export default function highlightCustomTollFreeLetters(number, term) {
    // if number exists
    if (typeof number === 'string' && typeof term === 'string') {
        // otherwise it could be a mix of letters and numbers
        // and arent able to easily match against letters
        // remove all special characters (force uppercase)
        const numberWithoutSpecialCharacters = number.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        // get term index
        const termIndex = findTermIndex(numberWithoutSpecialCharacters, term.toUpperCase());
        // if term exists
        if (termIndex >= 0) {
            // length of term
            const termLength = term.length;
            // where to end
            const termIndexPlusLength = termIndex + termLength;
            // prefix
            const prefix = numberWithoutSpecialCharacters.substring(0, 3);
            // numbers before search term
            const beforeTerm = numberWithoutSpecialCharacters.substring(3, termIndex);
            // term
            const termSubstring = numberWithoutSpecialCharacters.substring(termIndex, termIndexPlusLength);
            // after term
            const afterTerm = (termIndexPlusLength !== numberWithoutSpecialCharacters.length ? numberWithoutSpecialCharacters.substr(termIndexPlusLength, numberWithoutSpecialCharacters.length) : '');
            // return formatted element
            return (
                <span>
                    {`(${prefix}) ${beforeTerm}`}
                    <em>{termSubstring}</em>
                    {afterTerm}
                </span>
            );
        }
    }
    // otherwise just return input
    return number;
}
