const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// config files
const baseConfig = require('./webpack.common.js');

// webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();
const HtmlWebpackPlugin = require('html-webpack-plugin');

const configureCss = () => {
    return {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    localIdentName: '[name]__[local]',
                    modules: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: './postcss.config.js'
                    }
                }
            }
        ]
    }
}

// Configure Html webpack
const configureHtml = () => {
    return {
        template: './client/index.html',
    };
};

// Production module exports
module.exports = merge(
    baseConfig,
    {
        output: {
            path: path.resolve(__dirname, 'client'),
            filename: `bundle.js`,
        },
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            // // --content-base is which directory is being served
            contentBase: path.resolve(__dirname, 'client'),
            inline: true,
            /* When using the HTML5 History API,
            the index.html page will likely have be served in place of any 404 */
            historyApiFallback: true,
            // open in browser at localhost:8080
            hot: true,
            // quiet: true,
            stats: 'errors-only',
        },
        module: {
            rules: [
                configureCss()
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin(configureHtml()),
            new DashboardPlugin(dashboard.setData),
        ],
    }
)
