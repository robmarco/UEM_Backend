var Tshirt 	= require('../models/tshirt');
var redis 	= require('redis'),
    client 	= redis.createClient();
var async 	= require('async');
var ttl 	= 86400; // Number of secs in a day
var passport = require('passport');

/*
 * Local Routes Requests
 * ========================================== 
 */
exports.index = function(req,res) {
    res.render('products/', {
        user: req.user
    });
};

exports.show = function(req, res) {
    res.render('products/show', {   
        user: req.user,
        tshirt: req.params.id
    });
};

exports.add = function(req, res) {
    res.render('products/new', {
        user: req.user
    });
}

/*
 * API Requests
 * ========================================== 
 */
exports.getAllProducts = function(req, res) {
    console.log("GET - /products");
    Tshirt.find(function(err, results){
        if (!err)
            res.send({ status: 'OK', tshirts: results });
        else {
            res.statusCode = 500;
            res.send(res.statusCode, {error: err.message });
        }

    });
};

exports.getProductById = function(req, res) {
    console.log('GET - /products/:id');

    Tshirt.findById(req.params.id, function(err, tshirt) {
        if (tshirt) {
            var hot_key = "hot." + req.params.id;
            addProductHoyKeyValue(hot_key);
            res.send( { status: 'OK', tshirt: tshirt});
        } else {
            res.statusCode = 404;
            res.send(res.statusCode, { error: 'Not Found' });
        }
    });
};

exports.addProduct = function(req, res) {
    console.log('POST - /products');
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
            console.log('Product added successfully');
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

exports.updateProduct = function(req, res) {
    console.log('PUT - /products/:id');
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
                    console.log('Product updated successfully');
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

exports.deleteProduct = function(req, res) {
    console.log('DELETE - /products/:id');

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

exports.hotProduct = function(req, res) {
    console.log('GET - Products/hot');

    client.keys("hot.*", function(err,keys){
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.send(res.statusCode, { error: err.message });
        } else {
            if (keys.length == 0) {
                console.log('There is no hot products yet');
                res.statusCode = 404;
                res.send(res.statusCode, { error: 'There is no hot products yet'});
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
                                console.log('Hot product not found');
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


// Private methods

function addProductHoyKeyValue(hot_key) {

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
    