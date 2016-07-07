app.controller("ProfileDetailsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$scope.editProfile=0;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_user_profile',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.usermain=result;
	});

	$scope.editDetails=function(user){
		// console.log(user)
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/edit_user_profile',
			params:user,
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.editProfile=0;
			// console.log(result)
			// $scope.usermain=result;
		});
	}
});

app.controller("ProfilePasswordController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.change_password=function(){
		if($scope.password.new!=$scope.password.confirm)
		{
			swal('New password and confirm password are not same.');
		}
		else if($scope.password.new==$scope.password.old)
		{
			swal('Your new password cannot be the same as your old password');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/change_password',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:$scope.password
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result[0]=='Success')
				{
					$scope.password={};
				}
				swal(result[1]);
			});
		}
	}
});