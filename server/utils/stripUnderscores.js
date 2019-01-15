// we never need this underscore key from jsonp calls
// underscore breaks model validation in PAPI
export default function stripUnderscores(queryStringObject) {
    const qs = queryStringObject;
    // if query string exists
    if (Object.keys(qs).length) {
        // delete the underscore callback param
        delete qs._;
        // set first query with a question mark
        let queryString = '?';
        // loop through query string object
        Object.keys(qs).forEach((v) => {
            // set query string
            queryString = `${queryString}${v}=${qs[v]}&`;
        });
        return queryString.slice(0, -1);
    }
    // otherwise return empty string
    return '';
}
