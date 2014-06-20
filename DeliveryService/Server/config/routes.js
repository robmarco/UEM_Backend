module.exports = function(app){

	//Orders route
	var order = require('../app/controllers/orders');
	app.post('/api/order', order.createOrder);

};
