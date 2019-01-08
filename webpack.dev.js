const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// config files
const baseConfig = require('./webpack.common.js');

// webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

// Production module exports
module.exports = merge(
    baseConfig,
    {
        output: {
            // has to match webpack dev server path i.e. localhost:8080
            // required so that css loads url() and fonts in dev, removed for production
            publicPath: 'http://localhost:8080/'
        },
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            // --content-base is which directory is being served
            contentBase: path.resolve(__dirname, 'client'),
            /* When using the HTML5 History API,
            the index.html page will likely have be served in place of any 404 */
            historyApiFallback: true,
            // open in browser at localhost:8080
            hot: true,
            quiet: true,
            stats: 'errors-only',
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new DashboardPlugin(dashboard.setData),
        ],
    }
)
