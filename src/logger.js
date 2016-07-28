var logger = require('node-rsql-parser/src/logger');

module.exports = logger;

// override log level
logger.debugLevel = 'debug';	// turn debug on when develop locally
//logger.debugLevel = 'info';		// turn debug off when publish