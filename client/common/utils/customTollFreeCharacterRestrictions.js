export default function customTollFreeCharacterRestrictions(value) {
    // if string
    if (typeof value === 'string') {
        // pattern to replace value against
        const regex = /[^A-Za-z0-9*]+/;
        // replace values against regex
        return value.replace(regex, '');
    }
    // otherwise return value as is
    return value;
}
