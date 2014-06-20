var express = require('express'),
  mongoose 	= require('mongoose'),
  fs 		= require('fs'),
  config 	= require('./config/config'),
  passport 	= require('passport'),
  flash    	= require('connect-flash');

// Database connection

// Domain for Database
var domain = require('domain');
var d = domain.create();

d.on('error', function(err){
  console.log('Product Service - Unable to connect to database at', err.message);
});

d.run(function(){
  mongoose.connect(config.db);

});

// Connection to database without domains
// mongoose.connect(config.db);
// var db = mongoose.connection;
// db.on('error', function () {
//   throw new Error('Unable to connect to database at ' + config.db);
// });

// Loading models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

// Pass passport for configuration
require('./config/passport')(passport); 

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app, passport);

// Log for Memory Usage
var usage = require('usage');
setInterval(function() {
    var m_total = process.memoryUsage();
    console.log("Memory usage: " + m_total.heapUsed + " from " + m_total.heapTotal);
}, 10000);

app.listen(config.port);
console.log('Mom! My server is running on port ' + config.port);