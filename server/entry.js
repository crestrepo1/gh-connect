require('dotenv').config();

process.env.NODE_CONFIG_DIR = `${__dirname}/config`;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('@babel/register');
require('babel-polyfill');
require('./app.js');
