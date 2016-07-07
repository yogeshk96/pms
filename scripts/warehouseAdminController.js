app.controller('WarehouseAdminHomeController',function($scope,$rootScope,$http) {

});

app.controller('WarehouseAdminIssueReportController',function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.Dates=Dates;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_list_all',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.stores=result;
	});

	$scope.generate_report=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_issue_report_store',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{dates:$scope.dates,store:$scope.mainstore}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.mats=result;
			console.log(result);
		});
	}

	$scope.view_dc=function(mat)
	{
		$scope.mainissue=angular.copy(mat);
		$("#GeneratePoModal").modal('show');
	}
});

app.controller('WarehouseAdminReceiptReportController',function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.Dates=Dates;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_list_all',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.stores=result;
	});

	$scope.generate_report=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_receipt_report_store',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{dates:$scope.dates,store:$scope.mainstore}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.mats=result;
			console.log(result);
		});
	}

	$scope.view_dc=function(mat)
	{
		$scope.mainissue=angular.copy(mat);
		$("#GeneratePoModal").modal('show');
	}

});

app.controller('WarehouseAdminReconReportController',function($scope,$http,$rootScope,$state,Logging,Dates){

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_list_all',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.stores=result;
	});

	$scope.fil=function(mat){
		if(mat.credit!='0.000' || mat.debit!='0.000' || mat.damaged!='0.000')
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	$scope.generate_report=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_recon_report_store',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{dates:$scope.dates,store:$scope.mainstore}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.mats=result;
		});
	}

	$scope.totals=function(mat)
	{
		return Math.round((parseFloat(mat.credit)-parseFloat(mat.debit))*1000)/1000;
	}

});

app.controller('WarehouseAdminPersonWiseReportController',function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.Dates=Dates;
	$scope.issuematto="subcontractor";
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_storelist',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.stores=result[0];
		$scope.subcons=result[1];
		$scope.thirdparties=result[2];
	});

	$scope.fil=function(mat){
		if(mat.credit!='0.000' || mat.debit!='0.000' || mat.damaged!='0.000')
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	$scope.generate_report=function(){
		if($scope.issuematto=='subcontractor' && !$scope.mainsubcon)
		{
			swal("Please select a subcontactor.");
		}
		else if($scope.issuematto=='thirdparty' && !$scope.maintpty)
		{
			swal("Please select a third party.");
		}
		else
		{
				$rootScope.showloader=true;
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/get_recon_report_indi',
					headers:{'JWT-AuthToken':localStorage.pmstoken},
					data:{dates:$scope.dates,type:$scope.issuematto,subcon:$scope.mainsubcon,tpty:$scope.maintpty}
				}).success(function(result){
					$rootScope.showloader=false;
					$scope.mats=result;
				});
		}
	}

	$scope.totals=function(mat)
	{
		return Math.round((parseFloat(mat.credit)-parseFloat(mat.debit))*1000)/1000;
	}
});

app.controller('WarehouseAdminStockReportController',function($scope,$http,$rootScope,$state,Logging,Dates){
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_list_all',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.stores=result;
	});

	$scope.generate_report=function(){
		$http({
			method:'GET',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			url:$rootScope.requesturl+'/getinventorydata_store',
			params:{store:$scope.mainstore.id}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.inventorydata = result;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
		});
	}
});

app.controller('WarehouseAdminMaterialReportController',function($scope,$http,$rootScope,$state,Logging,Dates){
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_all_mats',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.matcats=result;
	});

	$scope.generate_report=function(){
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_mat_store_data',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{mat:$scope.mainmat.id}
		}).success(function(result){
			$scope.stores=result;
		});
	}
});