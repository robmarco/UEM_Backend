angular.module("DeliveryApp")
	.controller("LoginCtrl", function($scope, $location, socket, user){

		$scope.model = {
			"nickname": null
		};

		socket.on("delivery:login:ok", function(){
			user.setNickname($scope.model.nickname);
			$location.path("/deliver");
		});

		$scope.loginAction = function(){
			socket.emit("delivery:login:request", {
				nickname: $scope.model.nickname
			});
		};

	})