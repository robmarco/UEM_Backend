/**
 * Created by Roberto Marco
 */

module.exports = function(app) {

    var Tshirt = require('../models/tshirt');
    var WasHot = require('../models/washot');
    var redis = require('redis'),
        client = redis.createClient();
    var async = require('async');

    var ttl = 86400; // Number of secs in a day

    getAllTshirts = function(req, res) {
        console.log("GET - /tshirts");
        Tshirt.find(function(err, results){
            if (!err)
                res.send({ status: 'OK', tshirts: results });
            else {
                res.statusCode = 500;
                res.send(res.statusCode, {error: err.message });
            }

        });
    };

    getTshirtById = function(req, res) {
        console.log('GET - /tshirts/:id');

        Tshirt.findById(req.params.id, function(err, tshirt) {
            if (tshirt) {
                var hot_key = "hot." + req.params.id;
                addTshirtHoyKeyValue(hot_key);

                // Save what's hot in mongoDB
                var washot = new WasHot({
                  product_id : req.params.id
                });

                washot.save(function(err) {
                  if(!err) {
                    console.log("WasHot created");
                  } 
                  else {
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    res.statusCode = 500;
                    res.send('Internal error(%d): %s',res.statusCode,err.message);
                  }            
                });

                res.send( { status: 'OK', tshirt: tshirt});
            } else {
                res.statusCode = 404;
                res.send(res.statusCode, { error: 'Not Found' });
            }
        });
    };

    addTshirt = function(req, res) {
        console.log('POST - /tshirts');
        console.log(req.body);

        var tshirt = new Tshirt({
            model:  req.body.model,
            images: req.body.images,
            style:  req.body.style,
            size:   req.body.size,
            color:  req.body.color,
            price:  req.body.price,
            description: req.body.description
        });

        tshirt.save(function(err){
            if (!err) {
                console.log('Tshirt added successfully');
                res.send({ status: 'OK', tshirt: tshirt});
            } else {
                console.log(err.message);

                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send(res.statusCode, {error: 'Validation Error'});
                } else {
                    res.statusCode = 500;
                    res.send(res.statusCode, {error: 'Server Error'});

                }
            }
        });
    };

    updateTshirt = function(req, res) {
        console.log('PUT - /tshirts/:id');
        console.log(req.body)

        Tshirt.findById(req.params.id, function(err, tshirt){
            if (!tshirt) {
                res.statusCode = 404;
                res.send(res.statusCode, { error: 'Not Found' });
            } else {
                if (req.body.model  != null) tshirt.model   = req.body.model;
                if (req.body.images != null) tshirt.images  = req.body.images;
                if (req.body.style  != null) tshirt.style   = req.body.style;
                if (req.body.size   != null) tshirt.size    = req.body.size;
                if (req.body.color  != null) tshirt.color   = req.body.color;
                if (req.body.price  != null) tshirt.price   = req.body.price;
                tshirt.modified_at = Date.now();

                tshirt.save(function(err){
                    if (!err) {
                        console.log('Tshirt updated successfully');
                        res.send({ status: 'OK', tshirt:tshirt});
                    } else {
                        console.log(err.message);

                        if (err.message == 'ValidationError') {
                            res.statusCode = 400;
                            res.send(res.statusCode, { error: err.message })
                        } else {
                            res.statusCode = 500;
                            res.send(res.statusCode, { error: err.message });
                        }
                    }
                });
            }

        });
    };

    deleteTshirt = function(req, res) {
        console.log('DELETE - /tshirts/:id');

        Tshirt.findById(req.params.id, function(err, tshirt){
            if (!tshirt) {
                res.statusCode = 404;
                res.send(404, { error: 'Not found' });
            } else {
                tshirt.remove(function(err){
                    if (!err) {
                        console.log('Tshirt removed successfully');
                        res.send({ status: 'OK' });
                    } else {
                        console.log(err.message);
                        res.statusCode = 500;
                        res.send(500, { error: 'Server error' });
                    }
                });
            }
        });
    };

    hotTshirt = function(req, res) {
        console.log('GET - Tshirts/hot');

        client.keys("hot.*", function(err,keys){
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.send(res.statusCode, { error: err.message });
            } else {

                if (keys.length == 0) {
                    console.log('There is no hot tshirts yet');
                    res.statusCode = 404;
                    res.send(res.statusCode, { error: 'There is no hot tshirts yet'});
                } else {
                    var hotTshirts = [];
                    var asyncTasks = [];

                    // How to push elements async
                    // http://justinklemm.com/node-js-async-tutorial/

                    keys.forEach(function(value){

                        tshirt_id = value.substring(4);

                        asyncTasks.push(function(callback){
                            Tshirt.findById(tshirt_id, function(err,tshirt){
                                if (err) {
                                    console.log('Hot Tshirt not found');
                                    res.statusCode = 500;
                                    res.send(res.statusCode, { error: err.message });

                                } else {
                                    hotTshirts.push(tshirt);
                                }
                            });
                            // Async call is done - alert via callback
                            callback();
                        });

                        asyncTasks.push(function(callback){
                            // Set a timeout for 3 seconds
                            setTimeout(function(){
                                // It's been 0.5 seconds, alert via callback
                                callback();
                            }, 500);
                        });

                        async.parallel(asyncTasks, function(){
                           res.send(hotTshirts);
                        });
                    });
                }
            }

        });
    };

    washotTshirt = function(req, res) {
        var date = new Date();
        if (((req.params.monthstart < 1) || (req.params.monthstart > 12)) || ((req.params.monthend < 1) || (req.params.monthend > 12)))
        {
          log.error("Incorrect month");
          res.statusCode = 404;
          return res.send("Incorrect month");
        }    
        if (((req.params.daystart < 1) || (req.params.daystart > 31)) || ((req.params.dayend < 1) || (req.params.dayend > 31)))
        {
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if (((req.params.monthstart == 4) || (req.params.monthstart == 6) || (req.params.monthstart == 9) || (req.params.monthstart == 11)) 
             && (req.params.daystart > 30))
        {
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if (((req.params.monthend == 4) || (req.params.monthend == 6) || (req.params.monthend == 9) || (req.params.monthend == 11)) 
             && (req.params.dayend > 30))
        {
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if((req.params.monthstart == 2) && 
           (((req.params.yearstart % 400) == 0) || ((req.params.yearstart % 4) == 0)) && ((req.params.yearstart % 100) != 0) 
           && (req.params.daystart > 29))
        {
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if((req.params.monthend == 2) && 
           (((req.params.yearend % 400) == 0) || ((req.params.yearend % 4) == 0)) && ((req.params.yearend % 100) != 0) 
           && (req.params.dayend > 29))
        {
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if((req.params.monthstart == 2) && ((req.params.yearstart % 100) == 0) && (req.params.daystart > 29)){
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if((req.params.monthend == 2) && ((req.params.yearend % 100) == 0) && (req.params.dayend > 29)){
          log.error("Incorrect day");
          res.statusCode = 404;
          return res.send("Incorrect day");
        }
        if ((req.params.yearstart < 2000) || (req.params.yearend < 2000)) {
          log.error("Year should be bigger than 2000");
          res.statusCode = 404;
          return res.send("Year should be bigger than 2000");
        }
        if (req.params.yearend < req.params.yearstart) {
          log.error("Year end shouldn't be smaller than year start");
          res.statusCode = 404;
          return res.send("Year end shouldn't be smaller than year start");
        } 
        else if ((req.params.yearstart == req.params.yearend) && (req.params.monthend < req.params.monthstart)) {
          log.error("Month end shouldn't be smaller than month start");
          res.statusCode = 404;
          return res.send("Month end shouldn't be smaller than month start");
        }
        else if ((req.params.monthstart == req.params.monthend) && (req.params.dayend < req.params.daystart)) {
          log.error("Day end shouldn't be smaller than day start");
          res.statusCode = 404;
          return res.send("Day end shouldn't be smaller than day start");
        }

        var dateStart = new Date();
        dateStart.setUTCFullYear(req.params.yearstart);
        dateStart.setUTCMonth(req.params.monthstart);
        dateStart.setUTCDate(req.params.daystart);
        var dateEnd = new Date();
        dateEnd.setUTCFullYear(req.params.yearend);
        dateEnd.setUTCMonth(req.params.monthend);
        dateEnd.setUTCDate(req.params.dayend);        

        WasHot.find({created : {"$gte" : dateStart, "$lt" : dateEnd }}, function (err, washots) {
          if (washots.length == 0) {
            log.info("No find washots");
            res.statusCode = 204;
            return res.send({ "status" : "notFound", "error" : "No find washots" });
          }
          if(!err) {            
            res.statusCode = 200;
            res.send({ "status" : "ok", "washots" : washots });
          } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
          }
        });
    };


    // Private methods

    addTshirtHoyKeyValue = function(hot_key) {

        client.get(hot_key, function(err,value){
            if (value) {
                client.incr(hot_key, function(err){
                    if (err)
                        console.log('Error incrementing key_value: ' + err);
                    else {
                        console.log('Pair key-value incremented successfully');

                        // Update hot_key expiration time
                        client.expire(hot_key, ttl, function(err){
                            if (err)
                                console.log('Error updating key_value expiration time: ' + err);
                            else
                                console.log('Pair key_value expiration time updated successfully');
                        });
                    }
                });
            } else {
                // if value not found, we create the key
                client.set(hot_key, 1, 'EX', ttl, function(err) {
                    if (err)
                        console.log('Error creating key_value: ' + err);
                    else
                        console.log('Pair of key-value created successfully');
                });
            }
        });
    };


    // Routes functions
    app.get('/tshirts', getAllTshirts);
    app.get('/tshirts/:id', getTshirtById);
    app.post('/tshirts', addTshirt);
    app.put('/tshirts/:id', updateTshirt);
    app.delete('/tshirts/:id', deleteTshirt);
    app.get('/hot', hotTshirt);
    app.get('/washot/:yearstart/:monthstart/:daystart/:yearend/:monthend/:dayend', washotTshirt);
};