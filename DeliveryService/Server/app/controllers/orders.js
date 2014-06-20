var mongoose = require('mongoose');
var Order   = require('../models/order.js');
var socket  = require('../services/socket.js');

exports.createOrder = function(req, res){
	console.log("Delivery Service - Creating Order after checkout");
	console.log("POST with Params: req.body.order (%d), req.body.user_id (%d)", req.body.order, req.body.user_id);
  	
  	// Cross domain request. We need to set res.headers
	res.header('Access-Control-Allow-Origin', "*"); 
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  	res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');

  	// Create a new Order with those params received
	var order = new Order({
		order:    req.body.order,
		status:   'pending', // First time, this order status is pending
		user:     req.body.user_id
	});

	order.save(function(err){
		if (!err) {
			console.log("Delivery Service - Order created successfully");
			// Broadcast to all delivers this order
			socket.newOrder(order._id);
			res.statusCode = 200;
			res.send({ status: res.statusCode, order: order });

		} else {
			console.log("Delivery Service - Error creating an order");
			if (err.name == 'ValidationError') {
				res.statusCode = 400;
				res.send({status: res.statusCode, error: 'Validation Error - Wrong POST REQ params'});
			} else {
				res.statusCode = 500;
				res.send({status: res.statusCode, error: 'Server Error'});
			}
			console.log(err.message);
		}
	});

};