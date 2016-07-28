/**
 *	Convert RSQL query string to loopback search criteria.
 */
var logger = require('./logger');
var parserUtils = require('./parser-utils');

module.exports = function(rsqlString) {
	// build loopback where clause
 	return parserUtils.loopbackWhere(rsqlString);
}
