/**
 * Utility methods for parsing rsql units and operation units.
 *	When pass in keys map: 
 *		use key to validate rsql operation unit, when not in key set, throw error;
 *		use value to build loopback query, replace rsql operation unit key.
 */
var logger = require('./logger');
var objUtils = require('./obj-utils')
var rsqlParser = require('node-rsql-parser');

var parserUtils = exports;

parserUtils.loopbackWhere = function(rsqlString, keys) {
	var loopbackWhere = {};
 	var _where = {};  	 	

  	var rsqlUnits = rsqlParser.parsing(rsqlString);

  	if (rsqlUnits.or) {
  		// Build loopback query where.or array
  		var _or = [];
  		_where.or = _or;
  		parseRsqlUnits(rsqlUnits.or, _or, keys);
  	}
  	else if (rsqlUnits.and) {
  		// Build loopback query where.and array
  		var _and = [];
  		_where.and = _and;
  		parseRsqlUnits(rsqlUnits.and, _and, keys);
  	}
  	else {
  		// rsql units should just contains a single operation unit
  		logger.log('debug', 'rsqlUnits contains one operationUnit');
  		_where = parseOperationUnit(rsqlUnits, keys);
  	}

  	// assign after _where has final value
  	loopbackWhere.where = _where;
  	// parsing result
  	logger.debug("LoopBack where clouse -", loopbackWhere);

  	return loopbackWhere;
}

function parseRsqlUnits(operationUnits, _or_and, keys) {
	logger.debug('rsql2loopback.parseRsqlUnits() operation units -', operationUnits);
	var _element;
	for(var i=0; i<operationUnits.length; i++) {
		logger.debug('typeof unit i-' + i, typeof operationUnits[i]);
		if (typeof operationUnits[i] === 'object') {
			var section = {};
			// this unit contains array of units
			if (operationUnits[i].or) {
				var _or = [];
				section.or = _or;
				parseRsqlUnits(operationUnits[i].or, _or, keys);
			} 
			else if (operationUnits[i].and) {
				var _and = [];
				section.and = _and
				parseRsqlUnits(operationUnits[i].and, _and, keys);
			}
			else {
				// An object in an array that contains just one unit should never happen
				logger.error('section did not contains any array', operationUnits[i]);
				//throw err;
			}
			// add object to the array
			_or_and.push(section);
		}
		else {
			// this unit is an operation unit
			_element = parseOperationUnit(operationUnits[i], keys);
			_or_and.push(_element);
		}
	}
}

/**
 *	Parsing the operation unit of rsql query string to build 
 *	the element of loopback query.
 *	Replace operation key with corresponding value in keys map.
 */
function parseOperationUnit(unitString, keys) {
	var unitMap;
	var element = {};
	var operator = rsqlParser.getOperator(unitString);
	var operatorMap = buildOperatorMap();
	var key;

	if (!operator) {
		return element;
	}

	if (operator === '==') {
		unitMap = rsqlParser.tokenizeOperator(unitString, operator);
		// Build array elements for _and or _or
		// unit operation that contains key but no value will be ignored
      	if (unitMap.value) {
      		// resolve key base on keys map
      		key = resolveKey(unitMap.key, keys);
      		// '==' --> key: value
      		element[key] = unitMap.value;
      	}
	}
	else {
		// operators need common operation logic
    	unitMap = rsqlParser.tokenizeOperator(unitString, operator);
		// Build array elements for _and or _or
		// unit operation that contains key but no value will be ignored
      	if (unitMap.value) {
      		// resolve key base on keys map
      		key = resolveKey(unitMap.key, keys);
      		// build only when contains both key and value
      		var operation = {}
      		operation[operatorMap.get(operator)] = unitMap.value;
      		element[key] = operation;
      	}
    }

    logger.debug('operator - ' + operator + ' unitMap - ', unitMap);
    logger.debug('element for operation unit -', element);
    return element;
}

/**
 *	Check if the operation key is in keys map?
 *		yes: replace the operation key with corresponding value in the map
 *		no: throw error 
 *	When keys map is null or empty: use opKey
 */
function resolveKey(opKey, keys) {
	if (objUtils.isEmpty(keys)) {
		return opKey;
	}
	else {
		var key = keys[opKey];
		if (key) {
			return key;
		}
		else {
			throw 'There is an unvalid key -' + opKey + '- in rsql string.'
		}
	}
}

/**
 *	Build an operater map between rsql and loopback query.
 *	rsql operators = ['==', '!=', '<', '=lt=', '<=', '=le=', '>', '=gt=', '>=', '=ge=', '=in=', '=out='];
 	;	and
	, 	or
	==	:
	!=  neq
	<  		lt
	=lt= 	lt
	<=  	lte
	=le=  	lte
	>  		gt
	=gt=  	gt
	>=  	gte
	=ge=  	gte
	=in=  	inq
	=out= 	nin
 */
function buildOperatorMap() {
	var operatorMap = new Map();

	operatorMap.set('==', ':');
	operatorMap.set('!=', 'neq');
	operatorMap.set('<', 'lt');
	operatorMap.set('=lt=', 'lt');
	operatorMap.set('<=', 'lte');
	operatorMap.set('=le=', 'lte');
	operatorMap.set('>', 'gt');
	operatorMap.set('=gt=', 'gt');
	operatorMap.set('>=', 'gte');
	operatorMap.set('=ge=', 'gte');
	operatorMap.set('=in=', 'inq');
	operatorMap.set('=out=', 'nin');

	return operatorMap;
}