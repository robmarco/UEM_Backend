var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'server-delivery'
    },
    port: 8081,
    db: 'mongodb://localhost/serverdelivery-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'server-delivery'
    },
    port: 8081,
    db: 'mongodb://localhost/serverdelivery-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'server-delivery'
    },
    port: 8081,
    db: 'mongodb://localhost/serverdelivery-production'
  }
};

module.exports = config[env];
