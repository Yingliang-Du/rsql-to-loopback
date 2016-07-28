var express = require('express');
var bodyParser = require('body-parser');
var rsql2loopback = require('.');
var logger = require('./src/logger');

var app = express();
var router = express.Router();

/**
 *	define the Router middle layer, which will be executed before any other routes. 
 *	This route will be used to print the type of HTTP request the particular Route 
 *	is referring to.
 */
router.use(function (req,res,next) {
  logger.log('info', "/" + req.method);
  next();
});

// endpoint for testing rsql parsing
// url: http://localhost:3002/rsql?q=objname=='ObjectName'
router.get('/rsql', function(req, res) {

   // print out the request
   logger.debug('req.params', req.params);
   logger.debug('req.query', req.query);
   var rsqlString = req.query.q;

   res.send(JSON.stringify(rsql2loopback.convert(rsqlString), null, 4));
   res.end();
});

/**
 * endpoint for testing rsql post request with body contains keys map
 */
app.use(bodyParser.json());
router.post('/rsql', function(req, res) {

   // print out the request
   logger.debug('req.params', req.params);
   logger.debug('req.query', req.query);
   logger.debug('req.body', req.body);
   var rsqlString = req.query.q;
   var keys = req.body;

   res.send(JSON.stringify(rsql2loopback.convert4keys(rsqlString, keys), null, 4));
   res.end();
});

// telling Express to use the Routes we have defined above
app.use("/", router);

// Start the server on specified port
app.listen(3002, function() {
  console.log("Live at Port 3002");
});