var app = angular.module("DeliveryApp", [
	"ngRoute"
]);

app.config(function($routeProvider){

	$routeProvider
		.when("/", {
			templateUrl: "views/main.html",
			controller: "MainCtrl"
		})
		.when("/login", {
			templateUrl: "views/login.html",
			controller: "LoginCtrl"
		})
		.when("/deliver", {
			templateUrl: "views/deliver.html",
			controller: "DeliverCtrl"
		})		
		.otherwise({
			redirectTo: "/"
		});
});