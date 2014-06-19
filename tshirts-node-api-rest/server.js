/**
 * Created by Roberto Marco
 */

// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

    // As workers come up.
    cluster.on('listening', function(worker, address) {
      console.log("A worker with #"+ worker.id +" is now connected to " + address.address + ":" + address.port);
    });


} else {
    // Code to run if we're in a worker process
    // Including dependencies
    var express = require('express'),
        app = express(),
        mongoose = require('mongoose');


    // Configure for all environments
    app.configure(function(){
        app.use(express.bodyParser());      // JSON Parser
        app.use(express.methodOverride());  // Override HTTP methods
        app.use(app.router);                // Define new routes
    });

    // Error handling - error hadnling middleware are defined just like regular middleware,
    // however must be defined with an arity of 4, that is the signature (err, req, res, next)

    function errorHandler(err, req, res, next) {
        res.status(500);
        res.render('error', { error: err });
    }

    routes = require('./routes/tshirts')(app);
    routes = require('./routes/karts')(app);

    // Connection to MongoDB
    mongoose.connect('mongodb://localhost/tshirts', function(err, res){
        if (err)
            console.log('Error connecting to database. ' + err);
        else
            console.log('Connected to database.');
    });

    // Server prepare and listen
    var server = app.listen(3000, function(){
        console.log('Node Server running on port %d', server.address().port);
    });
    console.log('Worker ' + cluster.worker.id + ' running');
}


