var express = require('express'),
  mongoose 	= require('mongoose'),
  fs 		= require('fs'),
  config 	= require('./config/config'),
  passport 	= require('passport'),
  flash    	= require('connect-flash');

// Database connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('Unable to connect to database at ' + config.db);
});

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

app.listen(config.port);
console.log('Mom! My server is running on port ' + config.port);