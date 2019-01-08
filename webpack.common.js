const path = require('path');
const pkg = require('./package.json');

// Configure Babel loader
const configureBabelLoader = (browserList) => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env', {
                        modules: false,
                        useBuiltIns: 'entry',
                        targets: {
                            browsers: browserList,
                        },
                    }
                    ],
                    "@babel/preset-react"
                ],
            },
        },
    };
};

const baseConfig = {
    name: pkg.name,
    entry: {
        index: './client/entry.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `js/bundle.[name].[hash].js`,
    },
    module: {
        rules: [
            configureBabelLoader(pkg.browserslist.legacyBrowsers)
        ]
    },
    plugins: [
    ]
}

module.exports = baseConfig;
