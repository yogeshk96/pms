app.controller("BillingHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
});

app.controller("BillingClientController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
});

app.controller("BillingSubContractorController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
});

app.controller("BillingRecoveryController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.recoverytype = 'addrecovery';
});

app.controller("BillingSupplyController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.tabledata = [];
	$scope.costsummary = [];
	$scope.taxdetails = [];
	$scope.billmainarr = [];
	$scope.taxcaltype = "percentage";
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		params:{projectid:$scope.projectid},
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.materials = result;
	});
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_billing_taxes',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.alltaxes = result;
	});

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_companydetails',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.companyinfo = result;
		console.log(result);
	});

	$scope.get_material_activities = function() {
		var matcheck = 0;
		angular.forEach($scope.costsummary, function(incost) {

			if(incost.materialid == $scope.submat.id) {

				matcheck++;
			}
		});
		if(matcheck > 0) {

			swal("Material already added.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_material_activities',
				params:{projectid:$scope.projectid, materialid:$scope.submat.id, subprojectid:$scope.subprojectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.filedata = result;
				console.log(result);
			});
		}
	}

	$scope.projchange = function(){

		if($scope.projectid) {
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_sub_projects',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.subprojects = result;
				var submultiplier = [];
				var x = 0;
				angular.forEach($scope.subprojects,function(subp){

					angular.forEach(subp.multiplier,function(subpmulti){
						submultiplier[x] = subpmulti;
						x++;
					});
				});
				$scope.submultiplier = angular.copy(submultiplier);
			});
			
		}
	}
	$scope.currentbilledblur = function(filein) {
		var totqty = 0;
		angular.forEach(filein.qty, function(indifqty) {

			totqty = parseFloat(totqty)+parseFloat(indifqty['current_billed_qty']);
		});
		filein.total_current_billed_qty = angular.copy(totqty);
	}

	$scope.addacttotable = function() {
		var totmatqty = 0;
		var totmatcost = 0;
		angular.forEach($scope.filedata, function(infile){

			angular.forEach(infile.sub, function(ininfile){

				angular.forEach(ininfile.qty, function(ifile){
					totmatqty = totmatqty+parseFloat(ifile['current_billed_qty']);
					if($scope.billtype == 1){

						totmatcost = totmatcost+(parseFloat(ifile['current_billed_qty'])*parseFloat(ininfile.supply_rate));
					} else {

						totmatcost = totmatcost+(parseFloat(ifile['current_billed_qty'])*parseFloat(ininfile.fi_rate));
					}
				});
			});
		});
		$scope.costsummary.push({"materialid":$scope.submat.id, "matname":$scope.submat.name, "totalbillqty":totmatqty, "totalbillcost":totmatcost});
		var totalbillcost = 0
		angular.forEach($scope.costsummary, function(incostsum){

			totalbillcost = totalbillcost+parseFloat(incostsum.totalbillcost);
		});
		$scope.totalbillcost = angular.copy(totalbillcost);

		$scope.tabledata.push($scope.filedata);
		$scope.filedata = [];
		$scope.calulatebillnet();
	}

	$scope.showcostsummaryclick = function() {

		$scope.showcostsummary = true;

		// Set the effect type
	    var effect = 'slide';

	    // Set the options for the effect type chosen
	    var options = { direction: 'right' };

	    // Set the duration (default: 400 milliseconds)
	    var duration = 500;

	    $('#summarybox').toggle(effect, options, duration);
	}

	$scope.hidecostsummaryclick = function() {

		// Set the effect type
	    var effect = 'slide';

	    // Set the options for the effect type chosen
	    var options = { direction: 'right' };

	    // Set the duration (default: 400 milliseconds)
	    var duration = 500;

	    $('#summarybox').toggle(effect, options, duration);
	    
	    setTimeout(function(){ 
	    	$scope.showcostsummary = false;
	    	$scope.$apply();
	    }, 500);

	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}

	$scope.addtotax = function() {

		if(!$scope.billtaxdetails) {

			swal("Please select a type.");
		} else if($scope.taxcaltype!="lumpsum" && !$scope.billtaxdetails.percentage) {

			swal("Please enter tax percentage.");
		} else if($scope.taxcaltype=="lumpsum" && !$scope.billtaxdetails.amount) {

			swal("Please enter lumpsum amount.");
		} else {

			if($scope.taxcaltype == "percentage") {

				$scope.billtaxdetails.amount = (parseFloat($scope.billtaxdetails.percentage)*parseFloat($scope.totalbillcost))/100;
			}
			
			$scope.taxdetails.push({'id':$scope.billtaxdetails.id, 'name':$scope.billtaxdetails.name, 'amount':$scope.billtaxdetails.amount, 'type':$scope.billtaxdetails.type});
			$scope.calulatebillnet();
			angular.forEach($scope.alltaxes, function(int){

				if(int.id==$scope.billtaxdetails.id) {

					int.showtax = true;
				}
			});	
			$scope.billtaxdetails = "";
		}
	}

	$scope.calulatebillnet = function() {
		var netbillcost = angular.copy($scope.totalbillcost);
		angular.forEach($scope.taxdetails, function(intax){
			if(intax.type == 1) {//tax
				netbillcost = netbillcost+parseFloat(intax.amount);
			} else {
				netbillcost = netbillcost-parseFloat(intax.amount);
			}
		});

		$scope.netbillcost = angular.copy(netbillcost);
	}

	$scope.removetaxrow = function(key, id) {

		angular.forEach($scope.alltaxes, function(int){

			if(int.id==id) {

				int.showtax = false;
			}
		});	

		$scope.taxdetails.splice(key, 1);
		$scope.calulatebillnet();
	}

	$scope.savebillingdetails = function() {

		if($scope.totalbillcost == 0) {

			swal("Bill cannot be saved for zero cost.");
		} else {

			angular.forEach($scope.tabledata, function(intab){

				angular.forEach(intab, function(inntab){
					var checkact = 0;
					angular.forEach($scope.billmainarr, function(inbill){

						if(inbill.id == inntab.id) {

							if(!inbill.sub){

								inbill.sub = [];
							}

							angular.forEach(inntab.sub, function(itab){
								var iqtybill = 0;
								angular.forEach(itab.qty, function(iqty){

									if(iqty.current_billed_qty > 0) {

										iqtybill = iqtybill+parseFloat(iqty.current_billed_qty);
									}
								});
								if(iqtybill > 0) {
									itab.totalbillqty = angular.copy(iqtybill);
									inbill.sub.push(itab);
								}
							});
							
							checkact++;
						}
					});
					if(checkact == 0) {

						
						$scope.billmainarr.push({'id':inntab.id,'srno':inntab.srno, 'desc':inntab.desc, 'sub':[]});
						angular.forEach(inntab.sub, function(itab){
							var iqtybill = 0;
							angular.forEach(itab.qty, function(iqty){

								if(iqty.current_billed_qty > 0) {

									iqtybill = iqtybill+parseFloat(iqty.current_billed_qty);
								}
							});
							if(iqtybill > 0) {
								itab.totalbillqty = angular.copy(iqtybill);

								$scope.billmainarr[$scope.billmainarr.length-1]['sub'].push(itab);
							}
						});

					}
				});
			});

			for(var i=$scope.billmainarr.length-1;i>=0;i--){

				if($scope.billmainarr[i]['sub'].length == 0) {

					$scope.billmainarr.splice(i, 1);
				}
			}
		}

		console.log($scope.billmainarr);
	}

});

