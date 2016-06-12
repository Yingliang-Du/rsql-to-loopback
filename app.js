var express = require('express');
var rsqlParser = require('node-rsql-parser');
var rsql2Loopback = require('.');
var logger = require('node-rsql-parser/src/logger');

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
   console.log(req.params);
   console.log(req.query);
   var rsqlString = req.query.q;

//   res.send(JSON.stringify(rsqlParser.parsing(rsqlString), null, 4));
   res.send(JSON.stringify(rsql2Loopback(rsqlString), null, 4));
   res.end();
});

// telling Express to use the Routes we have defined above
app.use("/", router);

// Start the server on specified port
app.listen(3002, function() {
  console.log("Live at Port 3002");
});