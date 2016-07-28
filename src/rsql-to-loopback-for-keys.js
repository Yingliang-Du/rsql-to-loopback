/**
 * This method take rsqlString and a map with key-value pair as parameters.
 * 	Only keys in the map are allowed in rsqlString
 *	The values in the map will be used to build loopback query
 */
const assert = require('type-assert');
var logger = require('./logger');
var parserUtils = require('./parser-utils');

module.exports = function(rsqlString, keys) {
	logger.debug('keys type -->' + typeof keys + ' values -->', keys);
 	assert(keys).is('Object');

 	// build loopback where clause
 	return parserUtils.loopbackWhere(rsqlString, keys);
}