app.controller("MainController",function($scope,$http,$rootScope,$state){
	$scope.title="SSEL PMS";
	$scope.$on("changeTitle",function(event,data){
		$scope.title=data;
	});
	$rootScope.requesturl="/api/public";
	$rootScope.digitcheck=/^\d*\.?\d*$/;
	$rootScope.loginerrormsg=false;
	$rootScope.showloader = false;

});

app.controller("HomeController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.main.data.title);
	$scope.user = {};
	$scope.loginerrormsg = false;
	$rootScope.showloader=false;

	$scope.login = function() {
		if(!$scope.user) {
			$scope.loginerrormsg="Please enter username and password."
		}
		else if(!$scope.user.username){
			$scope.loginerrormsg = "Please enter username.";
		} else if(!$scope.user.password) {
			$scope.loginerrormsg = "Please enter password.";
		} else {
			$scope.loginerrormsg = false;
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/login',
				data:$scope.user
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				if(result['statusCode'] == "202") {
					localStorage.pmstoken = result['message'];
					$state.go('user.module');
				} else {
					$scope.loginerrormsg = result['message'];
				}
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
	}

	if(localStorage.pmstoken) {
		$state.go('user.module');
	}

});

app.controller("WelcomeController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$rootScope.showloader=true;
	$http({
		method:'GET',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		url:$rootScope.requesturl+'/checkuser'
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.userinfo = result;
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});

});

app.controller("LoginController",function($scope,$http,$rootScope,$state, Logging){
	if(localStorage.pmstoken) {
		$http({
			method:'GET',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			url:$rootScope.requesturl+'/getuserinfo'
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.userinfo = result;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
	} else {
		$state.go('login');
	}

	$scope.logout = function() {
		Logging.logout();
	}

});

app.controller("SidebarController",function($scope,$http,$rootScope,$state, Logging){
	if(localStorage.pmstoken) {
		$scope.state = $state;
		$scope.currentview = $state.current.name;
		var currentstate = $state.current.name;
		var parentstatearr = currentstate.split(".");
		var parentstate = parentstatearr[1];
		$http({
			method:'GET',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			url:$rootScope.requesturl+'/getsidebar',
			params:{slug:parentstate}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.menuitems = result;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/getuserinfo',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;

			$scope.thisuserinfo = result;
			console.log(result);

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	} else {
		$state.go('login');
	}

	
});

