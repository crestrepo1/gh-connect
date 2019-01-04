
// webpack.settings.js - webpack settings config

// node modules
require('dotenv').config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: "GH Connect",
    copyright: "LogmeIn Inc.",
    paths: {
        src: {
            base: "./client/",
            css: "./client/common/styles",
        },
        dist: {
            base: "./build/",
            clean: [
                "./img",
                "./criticalcss",
                "./css",
                "./js"
            ]
        },
        templates: "./templates/"
    },
    urls: {
        publicPath: () => process.env.PUBLIC_PATH || "/dist/",
    },
    vars: {
        cssName: "styles"
    },
    entries: {
        "app": "/entry.js"
    },
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
        host: () => process.env.DEVSERVER_HOST || "localhost",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: ""
    },
    purgeCssConfig: {
        paths: [
            "./templates/**/*.{twig,html}",
            "./src/vue/**/*.{vue,html}"
        ],
        whitelist: [
            // add files here that should be ignored by purgeCss
            ""
        ],
        whitelistPatterns: [],
        extensions: [
            "html",
            "js"
        ]
    },
    createSymlinkConfig: [
        {
            origin: "img/favicons/favicon.ico",
            symlink: "../favicon.ico"
        }
    ],
    // webappConfig: {
    //     logo: "./src/img/favicon-src.png",
    //     prefix: "img/favicons/"
    // },
};
