var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
  order:    	{ type: String },
  status:   	{ type: String, 
            		enum:  ['pending', 'accepted', 'terminated']
            	},
  user: 		{ type: String },
  dealer: 		{ type: String }, 
  created_at: 	{ type: Date, default: Date.now }    
});

Order.path('order').required(true);
Order.path('status').required(true);

module.exports = mongoose.model('Order', Order);