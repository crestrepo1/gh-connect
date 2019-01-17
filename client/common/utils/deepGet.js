// adapted into a more readable form from:
// https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
// Use on an object or array to fetch deeply nested values
/* e.g.
    deepGet(
        { response: { data: ['foo'] } },
        ['response', 'data', 0]
    ) === 'foo'
*/
// valid keys within keysList include: strings for property keys, or numbers for array items

export default function (rootCollection, keysList = []) {
    if (!Array.isArray(keysList)) throw Error('Path was not provided as an array of valid keys');
    return keysList.reduce(
        (parent, child) => (parent && parent[child] ? parent[child] : null),
        rootCollection
    );
}
