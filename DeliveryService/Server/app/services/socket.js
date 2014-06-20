var io;

exports.connection = function (server) {
	io = require("socket.io").listen(server);

	io.sockets.on("connection", function(socket){
	 	// Request Login Acccess
		socket.on("delivery:login:request", function(data){
			console.log("Delivery - New DeliveryMan connected: " + data.nickname);
			socket.emit("delivery:login:ok");
		});
	});
};

exports.newOrder = function (orderId){
	console.log("Delivery Service - New Order incomming - %d " + orderId);

	io.sockets.emit("delivery:order:neworder", {
		order: orderId,
		status: "pending"
	});
};