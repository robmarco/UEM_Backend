var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wasHotSchema = new Schema({
	product_id 	: { type: String },
  	created 	: { type: Date, default: Date.now }
});

wasHotSchema.path('product_id').required(true);

module.exports = mongoose.model('WasHot', wasHotSchema);