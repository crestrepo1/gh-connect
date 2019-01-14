module.exports = {
    extends: [
        './best-practices.js',
        './errors.js',
        './node.js',
        './style.js',
        './variables.js',
        './es6.js',
        './imports.js'
    ].map(require.resolve),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalDecorators: true
        }
    },
    rules: {
        strict: 'error'
    },
    "settings": {
        "react": {
        "version": "detect", // React version. "detect" automatically picks the version you have installed.
        },
    }

};
