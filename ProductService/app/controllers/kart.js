var Kart 	= require('../models/kart');
var Tshirt 	= require('../models/tshirt');
var redis 	= require('redis'),
    client 	= redis.createClient();
var ttl 	= 300; // 5 minutes for expiration time
//var kart_id = 'kart.' + 1; // We are using IP as kart identifier. Care with that - IP conflicts?

/*
 * Local Server Requests
 * ========================================== 
 */
exports.show = function(req, res) {
    res.render('kart/index', {
        user: req.user
    });
};

/*
 * API Requests
 * ========================================== 
 */
exports.showKart = function(req, res) {
    console.log('GET - /api/kart/:user_id');
    console.log('Params: %d', req.params.user_id);

    if (req.params.user_id) {
        var kart_id = 'kart.' + req.params.user_id;

        client.hgetall(kart_id, function(err, items){
            if (err) {
                res.statusCode = 500;
                res.send(res.statusCode, {error: err.message});
            } else {
                
                if (items == null)
                    res.send({ status: 'OK', items: [] });
                else
                    res.send({ status: 'OK', items: items })
            }
        });    
    } else {
        res.statusCode = 404;
        console.log("Error - user not logged logged in");
        res.send(res.statusCode, { error: "Error user not logged in"});
    }
};

exports.addProductToKart = function(req, res) {
    console.log('POST - /kart');
    console.log('Params: %d %d %d', req.body.user_id, req.body.id, req.body.amount);

    if (!req.body.id || !req.body.amount || !req.body.user_id) {
        res.statusCode = 404;
        console.log(Date.now());
        res.send(res.statusCode, { error: "Not product id, product amount or user_id detected"});
    } else {
        var kart_id = 'kart.' + req.body.user_id;

        Tshirt.findById(req.body.id, function(err, tshirt){
            if (err) {
                res.statusCode = 500;
                res.send(res.statusCode, { error: err.message });
            } else {
                if (!tshirt) {
                    res.statusCode = 404;
                    res.send(res.statusCode, { error: 'Product not found'});
                } else {

                    client.hmset(kart_id, req.body.id, req.body.amount, function(err){
                       if (err) {
                           console.log('Error creating Redis hashkey for addProduct');
                           res.statusCode = 500;
                           res.send(res.statusCode, {error: err.message });
                       } else {
                           console.log('Product add to kart successfully');
                           res.send ({ status: 'OK', message: 'Product added successfully to the cart' });
                       }
                    });

                    client.expire(kart_id, ttl);
                }

            }
        });
    }
};

exports.deleteProductToKart = function(req, res) {
    console.log('DELETE - /kart/:user_id/:id');    

    if (req.params.user_id) {
        var kart_id = 'kart.' + req.params.user_id;

        if (req.params.id) {
            client.hdel(kart_id, req.params.id, function(err, productsDeleted){
                if (err) {
                    res.statusCode = 500;
                    res.send(res.statusCode, { error: err.message });
                } else {
                    if (productsDeleted == 0) {
                        console.log('Deleting item. Product not found');
                        res.statusCode = 404;
                        res.send(res.statusCode, { error: 'Product not found'});
                    } else {
                        console.log('Product deleted from the kart successfully');
                        res.send({ status: 'OK', nessage: 'Product removed successfully from the cart'});
                    }
                }
            });        
        }
        
    } else {
        res.statusCode = 404;
        console.log("Error - user not logged logged in");
        res.send(res.statusCode, { error: "Error user not logged in"});
    }

};