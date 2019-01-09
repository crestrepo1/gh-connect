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
                plugins: [
                    ["babel-plugin-root-import", { "rootPathSuffix": "client" }],
                ]
            },
        },
    };
};

// Configure Font loader
const configureFontLoader = () => {
    return {
        test: /\.(ttf|eot|woff2?)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    };
};

const baseConfig = {
    name: pkg.name,
    entry: {
        index: './client/entry.js'
    },
    module: {
        rules: [
            configureBabelLoader(pkg.browserslist.legacyBrowsers),
            configureFontLoader(),

        ]
    },
    plugins: [
    ]
}

module.exports = baseConfig;
