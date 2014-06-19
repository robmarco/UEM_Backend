var express = require('express');
var passport = require('passport');
var flash    = require('connect-flash');
var engine = require('ejs-locals');


module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.engine('ejs', engine);  // use ejs-locals for all ejs templates:
    app.set('view engine', 'ejs');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.methodOverride());
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
    
    // required for passport
    app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    app.use(app.router);
    // app.use(function(req, res) {
    //   res.status(404).render('404', { title: '404' });
    // });
  });
};
