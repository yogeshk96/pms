app.controller("SurveyHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);


});