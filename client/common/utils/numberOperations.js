import isPlainObject from 'lodash/isPlainObject';

const types = {
    UI: {
        test: num => /^\(\d{3}\) [A-Z0-9]{3}-[A-Z0-9]{4}$/.test(num),
        extract: num => num.substring(1, 4),
        translate: {
            E164: num => `+1${num.replace(/\D/g, '')}`
        }
    },
    E164: {
        test: num => /^\+1\d{10}$/.test(num),
        extract: num => num.substring(2, 5),
        translate: {
            UI: num => `(${num.substring(2, 5)}) ${num.substring(5, 8)}-${num.substring(8)}`
        }
    }
};

// takes a number string
// returns a number type or null if none can be deduced
export const deduceNumberType = (number) => {
    if (typeof number !== 'string') return null;

    for (const key of Object.keys(types)) { // eslint-disable-line
        if (types[key].test(number)) return key;
    }

    // number type could not be deduced
    return null;
};

// takes number string (either UI or E164 format) or a typical number object
// returns area code as a string, or an empty string if operation failed
export const extractAreaCode = (number, type) => {
    if (isPlainObject(number)) {
        // received a number object with a possible valid type within
        for (const key of Object.keys(types)) { // eslint-disable-line
            if (
                number[key] &&
                types[key].test(number[key])
            ) return types[key].extract(number[key]);
        }
    }

    if (typeof number !== 'string') return '';

    // received a number string
    if (
        type &&
        type in types &&
        types[type].extract // check if type has an extract function
    ) return types[type].extract(number); // type was explicitly provided

    const numberType = deduceNumberType(number);

    if (
        numberType &&
        types[numberType].extract
    ) return types[numberType].extract(number); // type must be deduced

    // area code could not be extracted
    return '';
};

// takes number string and the types to translate from (optional) and to
// returns converted number as a string, or an empty number if operation failed
export function convertNumberFormat(number, from, to) {
    if (!(
        typeof number === 'string' &&
        from in types
    )) return '';

    if (
        arguments.length === 3 &&
        to in types
    ) return types[from].translate[to](number);

    // from is actually to, deduce the from with number
    const toType = from;
    const fromType = deduceNumberType(number);
    if (fromType) {
        if (fromType === toType) return number; // no translation needed
        if (
            types[fromType].translate &&
            types[fromType].translate[toType]
        ) return types[fromType].translate[toType](number);
    }

    // type could not be deduced or number could not be translated
    return '';
}
