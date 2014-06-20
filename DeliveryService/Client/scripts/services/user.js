angular.module("DeliveryApp")
	.factory("user", function(){

		var nickname = null;

		function getNickname(){
			return nickname;
		};

		function setNickname(nick){
			nickname = nick;
		};

		return {
			"getNickname": getNickname,
			"setNickname": setNickname
		};

	})