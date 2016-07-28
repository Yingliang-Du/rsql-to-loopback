'use strict';

module.exports = {
	convert: require('node-rsql-parser/src/rsql-to-loopback'),
	convert4keys: require('./src/rsql-to-loopback-for-keys')
};