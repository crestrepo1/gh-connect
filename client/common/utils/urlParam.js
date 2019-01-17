// get URL params
export default function UrlParam(name, format = 'alphaNumericOnly', allowedChar = '', disallowChar = '') {
    // find url params
    const match = RegExp(`[?&]_?${name}=([^&]*)`).exec(window.location.search);
    const formatObj = {
        alphaNumericOnly: 'A-Za-z0-9',
        numericOnly: '0-9',
        alphaOnly: 'A-Za-z'

    };

    // escapes characters in a string, so regExp works
    function escapeRegExp(text) {
        return text ? text.replace(/[-[\]{}()*+?.,%\\^$|#\s]/g, '\\$&') : '';
    }

    // wrap in try catch so decodeURIComponent doesn't throw and uncaught error
    try {
        // scape allowed and disallowed characters
        const allow = escapeRegExp(allowedChar);
        const disallow = escapeRegExp(disallowChar);
        // if url params and decoding
        const res = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        // create reg exp to match agaist
        const re = new RegExp(`^[${formatObj[format]}${allow}]*$`);
        const reDis = new RegExp(`[${disallow}]`);

        // if there is no value to the param, throw error
        if (!res) {
            throw new Error('no param value');
        }

        // check query string for allowed characters
        if (!re.test(res)) {
            throw new Error('invalid characters');
        }
        // check for disallowed characters
        if (disallow) {
            if (reDis.test(res)) {
                throw new Error('disallowed characters');
            }
        }
        // return params
        if (res) {
            return res;
        }
    } catch (err) {
        // silently fail
    }
    // if no matches return false
    return false;
}
