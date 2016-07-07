app.controller("PlanningHeadHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

});

app.controller("ApproveIndentController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    $scope.today = dd+'/'+mm+'/'+yyyy;
	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.getindentreport = function() {

		if(!$scope.indentid) {

			swal("Please select a indent.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getindentdet',
				params:{indentid:$scope.indentid.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.indentlist = result;
				console.log(result);
			});
		}

		if($scope.project) {
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_sub_projects',
				params:{projectid:$scope.project.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				// $rootScope.showloader=false;
				$scope.subprojects = result;
				console.log($scope.subprojects);

				var submultiplier = [];
				var x = 0;

				angular.forEach($scope.subprojects,function(subp){

					angular.forEach(subp.multiplier,function(subpmulti){
						submultiplier[x] = {};
						submultiplier[x]['multiplier_name'] = subpmulti.multiplier_name;
						x++;

					});
				});
				$scope.submultiplier = angular.copy(submultiplier);
			});
			
		}
	}

	$scope.changeinqty = function(indiq) {

		var totalindent = parseFloat(indiq['subscheduleprojindent'][0]['indentqtyedit'])+parseFloat(indiq['subscheduleprojmatqty'][0]['total_indent_qty']);
		if(totalindent > parseFloat(indiq['subscheduleprojmatqty'][0]['qty'])) {

			swal("Indent quantity exceeding the max limit.", "", "warning");
			indiq['subscheduleprojindent'][0]['indentqtyedit'] = angular.copy(indiq['subscheduleprojindent'][0]['indent_qty']);
		}

		console.log(totalindent);
	}

	$scope.saveindentchanges = function(matdet) {

		matdet.editindimat = false;
	}

	$scope.approveindent = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/approveindent',
			data:{indentid:$scope.indentid.id, indentlist:$scope.indentlist},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			console.log(indata);	
			$scope.printindent = true;
			// swal({ 
			//   title: "Success",
			//    text: "Indent approved successfully.",
			//     type: "success" 
			//   },
			//   function(){
			//     location.reload();
			// });
	
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
	}
	$scope.editindent = function(matin, key) {
		$scope.thiskey = angular.copy(key);
		if(!$scope.indentlist[$scope.thiskey]['matindentdet']) {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getmatindentinfo',
				params:{indentid:$scope.indentid.id, matid:matin.material_id, projectid:$scope.project.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				$scope.indentlist[$scope.thiskey]['matindentdet'] = result;
				angular.forEach($scope.indentlist[$scope.thiskey]['matindentdet'], function(indiin){

					angular.forEach(indiin.subschprojqty, function(inprojq){
						inprojq.maxindentlim = Math.round((parseFloat(inprojq['subscheduleprojmatqty'][0]['qty'])-parseFloat(inprojq['subscheduleprojmatqty'][0]['total_indent_qty']))*1000)/1000;
					})
				})
				$("#AddMaterialModal").modal("show");
				console.log(result);

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		} else {

			$("#AddMaterialModal").modal("show");
		}
	}

	$scope.addtothisact = function() {
		console.log($scope.thiskey);
		console.log($scope.indentlist);
		var totalqty = 0;
		angular.forEach($scope.indentlist[$scope.thiskey]['matindentdet'], function(inmat) {

			angular.forEach(inmat.subschprojqty, function(inqty) {

				totalqty = parseFloat(totalqty) + parseFloat(inqty['subscheduleprojindent'][0]['indentqtyedit']);
			});
		});

		$scope.indentlist[$scope.thiskey]['indent_qty'] = angular.copy(totalqty);
		$scope.thiskey = "";
		$("#AddMaterialModal").modal("hide");
	}

	$scope.rejectindent = function() {

		if(!$scope.remarks) {

			swal("Please write reason for rejecting indent.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/rejectindent',
				data:{indentid:$scope.indentid.id, "remarks":$scope.remarks},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(indata){
				$rootScope.showloader=false;
				console.log(indata);	
				swal({ 
				  title: "Success",
				   text: "Indent rejected successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
		
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				//Logging.validation(status);
			});

		}
	}


});



app.controller("PendingIndentController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    $scope.today = dd+'/'+mm+'/'+yyyy;
	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.getpendingindentreport = function() {

		if(!$scope.projectid) {

			swal("Please select a indent.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getpendingindentdet',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.indentpendinglist = result;
				console.log(result);
			});
		}
	}

});


app.controller("ApprovedIndentController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    $scope.today = dd+'/'+mm+'/'+yyyy;
	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.getindentreport = function() {

		if(!$scope.indentid) {

			swal("Please select a indent.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getindentdet',
				params:{indentid:$scope.indentid.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.indentlist = result;
				console.log(result);
			});
		}
	}

});