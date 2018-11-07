const timeout = require('express-timeout-handler');
const express= require('express');
const bodyParser=require("body-parser");
const mongoose = require('./dbConfig/mongoose');
const app=express();
let options = {
 
  // Optional. This will be the default timeout for all endpoints.
  // If omitted there is no default timeout on endpoints
  timeout: 10000,
 
  // Optional. This function will be called on a timeout and it MUST
  // terminate the request.
  // If omitted the module will end the request with a default 503 error.
  onTimeout: function(req, res) {
    res.status(503).send('Service unavailable. Please retry.');
  },
 
  // Optional. Define a function to be called if an attempt to send a response
  // happens after the timeout where:
  // - method: is the method that was called on the response object
  // - args: are the arguments passed to the method
  // - requestTime: is the duration of the request
  // timeout happened
  onDelayedResponse: function(req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`);
  },
 
  // Optional. Provide a list of which methods should be disabled on the
  // response object when a timeout happens and an error has been sent. If
  // omitted, a default list of all methods that tries to send a response
  // will be disable on the response object
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
};
app.use(timeout.handler(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let transactionRouter=require('./routes/createTransaction');
//app.use('/createTransaction',transactionRouter);
//app.use('/getRecurringTransaction',transactionRouter);
app.use('/',transactionRouter);


app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json( {
            message: err.message, 
            error: err
        });
     });


app.listen(1984,()=>{
	console.log("server started");
});