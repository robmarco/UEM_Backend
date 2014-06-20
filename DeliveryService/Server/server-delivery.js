var express = require('express'),
  mongoose 	= require('mongoose'),
  fs 		    = require('fs'),
  config 	  = require('./config/config');

// Database Connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

var server = app.listen(config.port, function(){
	console.log("Dad! Delivery Service listenning at ", config.port);
	var socket = require("./app/services/socket.js");
	socket.connection(server);
});

