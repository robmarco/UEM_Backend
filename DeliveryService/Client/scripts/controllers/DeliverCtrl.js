angular.module("DeliveryApp")
	.controller("DeliverCtrl", function($scope, socket, user, $location){

		$scope.model = {
			nickname : user.getNickname(),
			buffer: []		
		};

		// Redirect if user not logged in
		if ($scope.model.nickname == null){
			$location.path("/");
		}

		// Receive a new Order
		socket.on("delivery:order:neworder", function(data){
			console.log("Delivery Client - New Order: " + data);
			console.log(data);

			$scope.model.buffer.push({
				timestamp: new Date(),
				order: data.order,
				status: "pending",
				deliveryMan: ""
			});
		});

	});