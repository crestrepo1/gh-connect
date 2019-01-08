const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const git = require('git-rev-sync');
const moment = require('moment');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

// config files
const baseConfig = require('./webpack.common.js');
const pkg = require('./package.json');

// Configure file banner
const configureBanner = () => {
    return {
        banner: [
            '/*!',
            ' * @project        ' + 'GH Connect',
            ' * @name           ' + '[filebase]',
            ' * @author         ' + pkg.author.name,
            ' * @build          ' + moment().format('llll') + ' ET',
            ' * @release        ' + git.long() + ' [' + git.branch() + ']',
            ' * @copyright      Copyright (c) ' + moment().format('YYYY') + ' LogMeIn',
            ' *',
            ' */',
            ''
        ].join('\n'),
        raw: true
    };
};

// Configure Html webpack
const configureHtml = () => {
    return {
        template: './client/index.html',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            keepClosingSlash: true,
            minifyURLs: true
        },
    };
};

// Configure Bundle Analyzer
const configureBundleAnalyzer = () => {
    return {
        analyzerMode: 'static',
        reportFilename: 'report.html',
    };
};

// Configure terser
const configureTerser = () => {
    return {
        cache: true,
        parallel: true,
        sourceMap: true
    };
};

const configureOptimization = (buildType) => {
    return {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'thirdparty',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new TerserPlugin(
                configureTerser()
            )
        ]
    }
}

// Production module exports
module.exports = merge(
        baseConfig,
        {
            output: {
                publicPath: './'
            },
            mode: 'production',
            devtool: 'source-map',
            optimization: configureOptimization(),
            plugins: [
                new CleanWebpackPlugin('build'),
                new HtmlWebpackPlugin(configureHtml()),
                new BundleAnalyzerPlugin(
                    configureBundleAnalyzer(),
                ),
                new webpack.optimize.AggressiveMergingPlugin(),
                new webpack.BannerPlugin(
                    configureBanner()
                ),
            ],
        }
    )
