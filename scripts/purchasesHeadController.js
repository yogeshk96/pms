app.controller("PurchasesHeadHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

});

app.controller("PurchasesApprovePoController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;

		$scope.vendorlist.unshift({ name: "All", id: "All" });

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
		$scope.projectlist.unshift({ name: "All", id: "All" });

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/getuserinfo',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.thisuserinfo = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	
	$scope.getcommafun = function(num){

		return Commas.getcomma(num);
	}

	$scope.searchvendorpolist = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_pending_polist',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.vendorpolist = [];
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.getpoinfo = function(poid) {

		$rootScope.showloader=true;

		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_po_info',
		params:{pono:poid},
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			if(result == 0) {

				swal("Purchased Order No doesnot exist.");
				$scope.ponodetails = [];
			} else {
				$scope.companydetails = [];

				$scope.ponodetails = result;
				var totalval = 0;
				$scope.pomateriallistnew = [];
				$scope.pomateriallistnewpre = {};

				angular.forEach($scope.ponodetails[0]['pomaterials'],function(pomat){

					if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]) {
							
						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']] = {};
					
						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = "";
						if(pomat['storematerial']['inversestore']) {
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['inversestore']['type'];
						} else {

							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['type'];
						}
						if(pomat['storematerial']['parent_id'] != 0) {

							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = pomat['storematerial']['inversestore']['name'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materialid'] = pomat['storematerial']['inversestore']['id'];
							
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['mainuomid'] = pomat['store_material_main_uom_id'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['uomid'] = pomat['store_material_uom_id'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['id'] = pomat['id'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['units'] = pomat['storematerial']['matuom'][0]['stmatuom']['uom'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['freightinsurance_rate'] = pomat.freightinsurance_rate;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['inspected_quantity'] = pomat.inspected_quantity;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['approved_quantity'] = pomat.approved_quantity;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['dispatch_quantity'] = pomat.dispatch_quantity;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['internal_di_quantity'] = pomat.internal_di_quantity;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['payment_qty'] = pomat.payment_qty;
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['remarks'] = pomat.remarks;
						}
						if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials']) {
						
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'] = [];
						}

					}

					if($scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] == 3) {

						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['unitrate'] = pomat['unit_rate'];
						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['qty'] = pomat['quantity'];
						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['valueofgoods'] = pomat['value_of_goods'];
						angular.forEach(pomat.fabmat,function(pomatfab){

							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomatfab['storemat']['name'], 'uom':pomatfab['storemainuom']['stmatuom']['uom'], 'uomid':pomatfab['store_material_uom_id'], 'qty':pomatfab['qty'], 'materialid':pomatfab['store_material_id']});
						});

					} else {

						$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomat['storematerial']['name'], 'uom':pomat['storematerial']['matuom'][0]['stmatuom']['uom'], 'qty':pomat['quantity'], 'unitrate':pomat['unit_rate'], 'valueofgoods':pomat['value_of_goods'], 'materialid':pomat['material_id'], 'freightinsurance_rate':pomat.freightinsurance_rate, 'inspected_quantity':pomat.inspected_quantity, 'approved_quantity':pomat.approved_quantity, 'dispatch_quantity':pomat.dispatch_quantity, 'internal_di_quantity':pomat.internal_di_quantity, 'payment_qty':pomat.payment_qty, 'remarks':pomat.remarks, 'uomid':pomat.store_material_uom_id});
					}											
					totalval = totalval+parseInt(pomat['value_of_goods']);
					pomat['value_of_goods'] = Commas.getcomma(Math.round(pomat['value_of_goods']).toString());

				});
				var l=1;
				angular.forEach($scope.pomateriallistnewpre,function(pomatnew){

					$scope.pomateriallistnew[l] = pomatnew;
					l++;
				});

				angular.forEach($scope.pomateriallistnew,function(pomat){
							
					if(pomat.type == 3) {

						$scope.showanexure = true;
					}
				});
				$scope.totalvalue = Commas.getcomma(Math.round(totalval).toString());;
				$scope.ponodetails[0]['totalvalue'] = Commas.getcomma(Math.round(totalval).toString());
			}
			$scope.ponodetails[0]['total_inwords'] = getwords(Math.round($scope.ponodetails[0]['total_cost']));
			$scope.ponodetails[0]['total_cost'] = Commas.getcomma(Math.round($scope.ponodetails[0]['total_cost']).toString());

			$("#VendorPoModal").modal("show");

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.changepostatus = function(status) {

		$rootScope.showloader = true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/changepostatus',
			data:{status:status, poid:$scope.ponodetails[0]['id']},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader = false;

			if(result == 1){

				if(status == 1) {

					swal("PO approved", "", "success");
				} else if(status == 2){

					swal("PO rejected", "", "error");
				}
				$scope.searchvendorpolist();
				$("#VendorPoModal").modal("hide");
			}
		});	
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }


});

app.controller("PurchasesHeadApproveCSController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	// $scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

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
	$scope.getprojectwiseenquiries = function(){
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_enquiry_list',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{projectid:$scope.project.id}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.enquirylist = result;
			console.log(result);

		});

	};

	$scope.approverejcs = function(status) {
		$rootScope.showloader = true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/approverejcs',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{csrefid:$scope.csref.id, status:status, vendetails:$scope.selectedVendors, cshodremarks:$scope.cshodremarks}
		}).
		success(function(result){
			$rootScope.showloader=false;
			console.log(result);
			if(result == 1) {
				$scope.enquirylist = [];
				$scope.enquiry = "";
				$scope.generatecs = false;
				$scope.enquirydetails = [];
				$scope.vendorsorted = false;
				$scope.getprojectwiseenquiries();

				swal("CS Approved", "", "success");
			}
		});
	}

	$scope.checkcspending = function(csref) {

		if(csref.status == 0) {

			return true;
		} else {

			return false;
		}
	}

	$scope.checkcsapproved = function(csref) {

		if(csref.status == 1) {

			return true;
		} else {

			return false;
		}
	}

	$scope.generaterefcs = function() {

		if(!$scope.csref) {

			swal("Please select a CS Reference.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_ref_details',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{csrefid:$scope.csref.id, projectid:$scope.project.id}
			}).
			success(function(result){

				$scope.enquirydetails = result[0];
				$scope.enqmattypes = result[1].join(",");
				$scope.boqdet = result[3];
				$scope.indentdet = result[4];
				$scope.indenttot = result[5];
				$scope.latestindent = result[6];
			
				var selectedVendors = {};
				angular.forEach($scope.enquirydetails,function(enqdet){

						var tempNetValue = parseFloat(angular.copy(enqdet.net_value_taxed));
						selectedVendors[tempNetValue]=enqdet;
				});

				$scope.selectedVendors = selectedVendors;

				$scope.generatecs = 1;
				var csmaterials = {};
				var boqmaterials = {};
				var vsquo = {};
				var vstax = {};
				var dummy = {'field':'','rows':1,'cols':1,'class':'','style':''};
				var dummyquotterms = {'field':'','rows':1,'cols':1,'class':'quotterms','style':''};
				var subproj_no = 1; //$scope.project.subprojects.length?$scope.project.subprojects.length:1;

				var vspayterms = {};
				vspayterms["a"] = [{'field':"Payment Terms",'rows':1,'cols':3+(2*subproj_no),'class':'quotterms text-left bold-font','style':''},dummyquotterms,dummyquotterms,dummyquotterms];
				// vspayterms["b"] = [{'field':"Payment Type",'rows':1,'cols':3+(2*subproj_no),'class':'text-left bold-font','style':''},dummyquotterms,dummyquotterms,dummyquotterms];
				vspayterms["c"] = [{'field':"Advance Payment",'rows':1,'cols':3+(2*subproj_no),'class':'quotterms text-left bold-font','style':''},dummyquotterms,dummyquotterms,dummyquotterms];
				vspayterms["d"] = [{'field':"Balance Payment",'rows':1,'cols':3+(2*subproj_no),'class':'quotterms text-left bold-font','style':''},dummyquotterms,dummyquotterms,dummyquotterms];
				vspayterms["e"] = [{'field':"Interest Amount in Rs (SSEL - Vendor)",'rows':1,'cols':3+(2*subproj_no),'class':'quotterms text-left bold-font','style':''},dummyquotterms,dummyquotterms,dummyquotterms];

				var grand_total = {};
				var total_exworks = {};
				angular.forEach($scope.selectedVendors,function(vendor){
					// csmaterials[vendor.]
					grand_total[vendor.vendor_id] = 0;
					total_exworks[vendor.vendor_id] = 0;
					angular.forEach(vendor.materials,function(material){
						if(csmaterials[material.material_id] == undefined){
							csmaterials[material.material_id] = material.materialdetails;
							csmaterials[material.material_id]['quantity'] = material.quantity;
						}
						if(boqmaterials[material.material_id] == undefined){
							boqmaterials[material.material_id] = material.boqmaterial;
						}
					});
					angular.forEach(vendor.taxes,function(vtax){
						vstax[vtax.tax_id] = [{'field':'Taxes - '+vtax.taxdetails.tax,'rows':1,'cols':3+(2*subproj_no),'class':'text-left bold-font','style':''},dummy,dummy,dummy];
					});
					angular.forEach(vendor.quotationterms,function(qterm){
						if(qterm.quotation_default_term_id.length == 1){qterm.quotation_default_term_id = '0'+qterm.quotation_default_term_id}
						vsquo[qterm.quotation_default_term_id] = [{'field':qterm.quotationdefault.termtitle,'rows':1,'cols':3+(2*subproj_no),'class':'text-left bold-font','style':''},dummy,dummy,dummy];
					});
				});

				var cs = [
							[//0
								{'field':'Vendor Name','rows':1,'cols':3+2*subproj_no,'class':'text-right bold-font','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
							],
							[//1
								{'field':'Vendor Contact Person','rows':1,'cols':3+2*subproj_no,'class':'text-right bold-font','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
							],
							[//2
								{'field':'Vendor Contact Phone','rows':1,'cols':3+2*subproj_no,'class':'text-right bold-font','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
								{'field':'','rows':1,'cols':1,'class':'','style':''},
							],
							[//3
								{'field':'','rows':1,'cols':3,'class':'','style':''},
								{'field':'BOQ Quantity','rows':1,'cols':subproj_no,'class':'text-center bold-font','style':'vertical-align:middle;'},
								{'field':'Total previous Indent Qty','rows':1,'cols':subproj_no,'class':'text-center bold-font','style':'vertical-align:middle;'},
								{'field':'Total Current Indent Qty','rows':2,'cols':1,'class':'text-center bold-font','style':'vertical-align:middle;'},
								{'field':'Budget Rate','rows':2,'cols':1,'class':'text-center bold-font','style':'vertical-align:middle;'},
								{'field':'Budget Amount','rows':2,'cols':1,'class':'text-center bold-font','style':'vertical-align:middle;'},
							],
							[//4
								{'field':'S No','rows':1,'cols':1,'class':'text-center bold-font','style':''},
								{'field':'Item Description','rows':1,'cols':1,'class':'text-center bold-font','style':''},
								{'field':'Unit','rows':1,'cols':1,'class':'text-center bold-font','style':''},
							],
						];

				var count = 0;
				var count2=0;
				var vsfew = [];
				// var vsquo = [];
			    var csheadings = [
			    					[
			    						{'field':'Offered FOR D','rows':2,'cols':1,'class':'text-center bold-font','style':'vertical-align:middle;'},
			    						{'field':'Negotiation','rows':1,'cols':3,'class':'text-center bold-font','style':''}
		    						],
			    					[
				    					{'field':'Ex-Works','rows':1,'cols':1,'class':'text-center bold-font','style':''},
				    					{'field':'FORD','rows':1,'cols':1,'class':'text-center bold-font','style':''},
				    					{'field':'Total Amount','rows':1,'cols':1,'class':'text-center bold-font','style':''},
			    					],
		    					];
				var sno = 1;
				var total_totqty=0;
				var total_indentqty=0;
				var total_bdgtamt=0;
				var total_ford=0;

				var matarr = [];

				angular.forEach(csmaterials,function(matinfo,matid){
					vsfew = [];
					// vsquo = {};
					var dummyrow = [{'field':'','rows':1,'cols':1,'class':'','style':''},{'field':'','rows':1,'cols':1,'class':'','style':''},{'field':'','rows':1,'cols':1,'class':'','style':''},];
					dummyrow[0]['field'] = sno;
					dummyrow[1]['field'] = matinfo.name;
					dummyrow[2]['field'] = matinfo.units;
					var totqty = 0;
					var bdgtrate = 0;
					if(!boqmaterials[matid]){
						boqmaterials[matid] = [];
						boqmaterials[matid]['qty'] = 0;
						boqmaterials[matid]['budget_rate'] = 0;
					}
					for(var j=0;j<2;j++){
						if($scope.project.subprojects.length){
							//for(var i =0;i<$scope.project.subprojects.length;i++){

								// console.log($scope.project.subprojects[i]);
								if(count < 2){
									var x = angular.copy(dummy);
									x['field'] = $scope.project.name.substr(0,3);
									x['class'] = "text-center text-uppercase bold-font";
									cs[4].push(x);
									count++
								}
								// if($scope.project.id == 5) {

								// 	if(j==0){
								// 		var y = angular.copy(dummy);
								// 		if($scope.boqdet[matid]) {
								// 			y['field'] = parseFloat($scope.boqdet[matid][$scope.project.subprojects[i]['id']]['qty']).toFixed(2);
								// 		} else {
								// 			y['field'] = 0;
								// 		}
								// 		bdgtrate = parseFloat(boqmaterials[matid]['budget_rate']).toFixed(2);
								// 		dummyrow.push(y);
								// 	}
								// 	if(j==1){
								// 		var y = angular.copy(dummy);
								// 		if($scope.indentdet[matid]) {
								// 			y['field'] = parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]['qty']).toFixed(2);
								// 		} else {

								// 			y['field'] = 0;
								// 		}
								// 		if($scope.indentdet[matid]) {
								// 		totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]['qty']);
								// 		// total_totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]['qty']);

											
								// 		}
								// 		dummyrow.push(y);										
								// 	}
								// } else {
									//for(var k=0;k<$scope.project.subprojects[i]['multiplier'].length;k++){
										
										//change here for subprojects also
										if(j==0){
											var y = angular.copy(dummy);
											if($scope.boqdet[matid]) {
												y['field'] = parseFloat($scope.boqdet[matid]['qty']).toFixed(2);
											} else {
												y['field'] = 0;
											}
											
											dummyrow.push(y);
										}
										if(j==1){

											var y = angular.copy(dummy);
											if($scope.boqdet[matid]) {
												y['field'] = parseFloat($scope.boqdet[matid]['previndent']).toFixed(2);
											} else {
												y['field'] = 0;
											}
											// bdgtrate = parseFloat($scope.boqdet[matid]['budget_rate']).toFixed(2);
											dummyrow.push(y);

										}
										bdgtrate = parseFloat($scope.boqdet[matid]['budget_rate']).toFixed(2);
										// 	var y = angular.copy(dummy);
										// 	if($scope.indentdet[matid]) {
										// 		y['field'] = parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['multiplier'][k]['id']]['qty']).toFixed(2);
										// 	} else {

										// 		y['field'] = 0;
										// 	}
										// 	if($scope.indentdet[matid]) {
										// 	totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['multiplier'][k]['id']]['qty']);
										// 	total_totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['multiplier'][k]['id']]['qty']);
												
										// 	}
										// 	dummyrow.push(y);										
										// }
									//}
								//}
							// };
						}
						// else{//this else loop is not rqd and will not run
						// 	if(j==0){
						// 		var y = angular.copy(dummy);
						// 		y['field'] = boqmaterials[matid]['qty'];
						// 		dummyrow.push(y);
						// 	}
						// 	if(j==1){
						// 		var y = angular.copy(dummy);
						// 		y['field'] = csmaterials[matid]['quantity'];
						// 		totqty += parseFloat(csmaterials[matid]['quantity']);
						// 		total_totqty += parseFloat(csmaterials[matid]['quantity']);
						// 		//total_indentqty += parseFloat($scope.indenttot[matid]);
						// 		dummyrow.push(y);										
						// 	}

						// }

					}

					var tq = angular.copy(dummy);
					if(!$scope.latestindent[matid]) {
						$scope.latestindent[matid]['currentindent'] = 0;
					}
					tq.field = parseFloat($scope.latestindent[matid]['currentindent']).toFixed(2);
					totqty = parseFloat($scope.latestindent[matid]['currentindent']).toFixed(2);
					dummyrow.push(tq);
					total_totqty += parseFloat(totqty);
					
					// var pi = angular.copy(dummy);
					// pi.field = parseFloat($scope.indenttot[matid])-parseFloat(totqty.toFixed(2));
					// dummyrow.push(pi);

					var br = angular.copy(dummy);
					br.field = bdgtrate;
					dummyrow.push(br);

					var ba = angular.copy(dummy);
					ba.field = (bdgtrate*totqty).toFixed(2);
					total_bdgtamt += parseFloat(ba.field);
					dummyrow.push(ba);
					var si=1;
					var L1amt = 0;

					//sorting by key
					var sortedarr = Object.keys($scope.selectedVendors).sort();

					function sortNumber(a,b) {
					    return a - b;
					}

					sortedarr.sort(sortNumber);
					$scope.vendorsorted = angular.copy(sortedarr);
					var countven = 0;
					sortedarr.forEach(function(vi) {

						if(countven == 0) {

							$scope.selectedVendors[vi]['selected'] = true;
							countven++;
						}
						total_ford = 0;

						if(count2<1){

							var x = angular.copy(dummy);
							x.field = $scope.selectedVendors[vi].vendordetails.name;
							x.class = "text-center text-uppercase";
							x.cols =4;
							cs[0].push(x);
							var x = angular.copy(dummy);
							x.field = $scope.selectedVendors[vi].vendordetails.contact_person;
							x.class = "text-center text-uppercase";
							x.cols =4;
							cs[1].push(x);
							var x = angular.copy(dummy);
							x.field = $scope.selectedVendors[vi].vendordetails.phoneno;
							x.class = "text-center text-uppercase";
							x.cols =4;
							cs[2].push(x);

							cs[3].push(csheadings[0][0],csheadings[0][1]);
							cs[4].push(csheadings[1][0],csheadings[1][1],csheadings[1][2]);
							// if($scope.selectedVendors[vi].taxes.length==0){
							angular.forEach(vstax,function(vtax,vtaxid){
								var x = angular.copy(dummy);
								x.field = '-';
								x.cols=2;
								x.class = "text-center";
								vstax[vtaxid].push(x,x);
							});
							// }else{
							angular.forEach($scope.selectedVendors[vi].taxes,function(vtax){
								var tamt = angular.copy(dummy);
								var tpcent = angular.copy(dummy);
								tamt.field = vtax.tax_amount;
								tamt.class = "text-center";
								tamt.cols = 2;
								if(vtax.tax_percentage != '0.00') {
									tpcent.field = vtax.tax_percentage+" %";
								}
								if(vtax.description != "" && vtax.tax_percentage != '0.00'){

									tpcent.field = tpcent.field+" ( "+vtax.description+ ")";
								}
								else if(vtax.description != "" && vtax.tax_percentage == '0.00'){

									tpcent.field = vtax.description;
								}
								tpcent.class = "text-center";
								tpcent.cols = 2;
								// vstax[vtax.tax_id].push(tamt,tpcent);
								//grand_total = grand_total+parseFloat(vtax.tax_amount);
								vstax[vtax.tax_id][vstax[vtax.tax_id].length-1] = tamt;
								vstax[vtax.tax_id][vstax[vtax.tax_id].length-2] = tpcent;
								// vstax[vtax.tax_id].push(tamt,tpcent);
							});
						}
						if(count2<$scope.selectedVendors[vi].materials.length){
							var offerD = angular.copy(dummy);
							var exworks = angular.copy(dummy);
							var ford = angular.copy(dummy);
							var total = angular.copy(dummy);
							angular.forEach($scope.selectedVendors[vi].materials,function(mat){
								if(mat.material_id == matid){
									offerD.field = parseFloat(mat['quotation_taxed_rate']);
									exworks.field = parseFloat(mat['quotation_unit_rate']);
									ford.field = parseFloat(mat['quotation_taxed_rate']);

									total_exworks[$scope.selectedVendors[vi]['vendor_id']] += exworks.field*totqty;
									total_ford += ford.field*totqty;
									grand_total[$scope.selectedVendors[vi]['vendor_id']] += total_ford;
								}
							});
						offerD.class = "text-center";
						exworks.class = "text-center";
						ford.class = "text-center";

						total.field = (totqty*ford.field).toFixed(2);
						total.class = "text-center";
						vsfew = vsfew.concat([
												{'field':'','rows':1,'cols':1,'class':'','style':''},
												{'field':total_exworks[$scope.selectedVendors[vi]['vendor_id']].toFixed(2),'rows':1,'cols':1,'class':'text-center bold-font','style':''},
												{'field':'','rows':1,'cols':1,'class':'text-center bold-font','style':''},
												{'field':grand_total[$scope.selectedVendors[vi]['vendor_id']].toFixed(2),'rows':1,'cols':1,'class':'text-center bold-font','style':''}
											]);
						dummyrow.push(offerD,exworks,ford,total);
						}

						if(count2==($scope.selectedVendors[vi].materials.length-1)){
							angular.forEach(vspayterms,function(vspt,vsptid){
								var x = angular.copy(dummyquotterms);
								x.class = 'text-center';
								x.cols = '4';
								switch (vsptid) {
									case 'a':
										var qpt_description='';
										if($scope.selectedVendors[vi]['quotpayterms']['payment_type'] == 'PDC'){
											qpt_description = $scope.selectedVendors[vi]['quotpayterms']['pdc_time_period']+" days "+$scope.selectedVendors[vi]['quotpayterms']['payment_type'];
										}else if($scope.selectedVendors[vi]['quotpayterms']['payment_type'] == 'LC'){
											qpt_description = $scope.selectedVendors[vi]['quotpayterms']['lc_time_period']+" days "+$scope.selectedVendors[vi]['quotpayterms']['payment_type']+", ";
											if($scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_sse'] != '0'){
												qpt_description += $scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_sse'] +" days interest in SSEL's A/c";
											}
											if($scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_sse'] != '0' && $scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_vendor'] != '0'){
												qpt_description += " & "
											}
											
											if($scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_vendor'] != '0'){
												qpt_description += $scope.selectedVendors[vi]['quotpayterms']['lc_interest_days_vendor'] +" days interest in Vendor's A/c";
											}
											qpt_description += " ("+$scope.selectedVendors[vi]['quotpayterms']['lc_interest_percentage']+" % )";
										}else if($scope.selectedVendors[vi]['quotpayterms']['payment_type'] == 'BG'){
											qpt_description = $scope.selectedVendors[vi]['quotpayterms']['bg_time_period']+" "+$scope.selectedVendors[vi]['quotpayterms']['payment_type']+" days";
										}else{
											qpt_description = $scope.selectedVendors[vi]['quotpayterms']['payment_type']+" - "+$scope.selectedVendors[vi]['quotpayterms']['direct_payment_desc'];
										}
										x.field = qpt_description;
										
										break;
									// case 'b':
									// 	x.field = $scope.selectedVendors[vi]['quotpayterms']['payment_type'];
										
									// 	break;
									case 'c':
										x.field = $scope.selectedVendors[vi]['quotpayterms']['payment_advance']+"%";
										
										break;
									case 'd':
										x.field = $scope.selectedVendors[vi]['quotpayterms']['payment_balance'];
										
										break;
									case 'e':
										x.field = "SSE - "+$scope.selectedVendors[vi]['quotpayterms']['interest_amount_sselac']+"  | +Vendor - "+$scope.selectedVendors[vi]['quotpayterms']['interest_amount_vendorac'];
										grand_total[$scope.selectedVendors[vi]['vendor_id']] += parseFloat($scope.selectedVendors[vi]['quotpayterms']['interest_amount_sselac']);
										
										break;
								}
								vspayterms[vsptid].push(x);
							});
							angular.forEach($scope.selectedVendors[vi].quotationterms,function(quo){
								var x = angular.copy(dummyquotterms);
								if(quo.quotation_default_term_id == '15'){
									quo.term_desc = grand_total[$scope.selectedVendors[vi]['vendor_id']].toFixed(2);
								}
								if(quo.quotation_default_term_id == '17'){
									quo.term_desc = grand_total[$scope.selectedVendors[vi]['vendor_id']].toFixed(2);
									x.class = "bold-font ";
								}
								if(quo.quotation_default_term_id == '18'){
									if(si==1){
										L1amt = parseFloat(grand_total[$scope.selectedVendors[vi]['vendor_id']]);
									}
									quo.term_desc = parseFloat(grand_total[$scope.selectedVendors[vi]['vendor_id']] - L1amt).toFixed(2);
								}
								if(quo.quotation_default_term_id == '19'){
									if(parseInt(total_bdgtamt) != 0) {
										quo.term_desc = (((parseFloat(total_bdgtamt) - parseFloat(grand_total[$scope.selectedVendors[vi]['vendor_id']]))/parseFloat(total_bdgtamt))*100).toFixed(2)+" %";
									} else {

										quo.term_desc = "-";
									}
								}
								if(quo.quotation_default_term_id == '21'){
									quo.term_desc = 'L'+si;
								}
								x.field = quo.term_desc;
								x.class += " text-center";
								x.cols = 4;
								vsquo[quo.quotation_default_term_id].push(x);
								if(quo.quotation_default_term_id == '10'){
									angular.forEach(vstax,function(vtax,vtaxid){
										vsquo[quo.quotation_default_term_id+vtaxid] = vtax;
									});
								}
								if(quo.quotation_default_term_id == '01'){
									angular.forEach(vspayterms,function(vspt,vsptid){
										vsquo[quo.quotation_default_term_id+vsptid] = vspt;
									});
								}
							});

							
						}
						si++;
						// console.log(matid)

					});
					count2++;

					cs.push(dummyrow);
					sno++;
				});
				
				cs.push(
					[
						{'field':'Total Amount in Rs.','rows':1,'cols':3+(2*subproj_no),'class':'text-center bold-font','style':''},
						{'field':total_totqty,'rows':1,'cols':1,'class':'text-center bold-font','style':''},
						{'field':'','rows':1,'cols':1,'class':'text-center bold-font','style':''},
						{'field':(total_bdgtamt).toFixed(2),'rows':1,'cols':1,'class':'text-center bold-font','style':''},
					].concat(vsfew),
					
					[{'field':'Terms & Conditions','rows':1,'cols':3+(2*subproj_no)+3+(4*$scope.selectedVendorsCount),'class':'text-left bold-font','style':'font-size:12px;'}]
				);
				
				Object.keys(vsquo).sort().forEach(function(q){
					cs.push(vsquo[q]);
				});
				$scope.cs = cs;

				$rootScope.showloader=false;


			});

		}
	}




});

app.controller("PurchasesHeadClosePoController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;

	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$rootScope.showloader=true;

	$scope.count = 0;

	$scope.getcommafun = function(num){

		return Commas.getcomma(num);
	}
	$scope.countpowise = 0;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;

		$scope.vendorlist.unshift({ name: "All", id: "All" });

	});

	$scope.getpolist = function() {
		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_polist',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.polist = [];
				} else {

					$scope.polist = result[0];

				}

			});
		}
	}

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
		$scope.projectlist.unshift({ name: "All", id: "All" });

	});

	
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/getuserinfo',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.thisuserinfo = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.closingqtychange = function(pomat, pomatnew) {

		if(!pomat.requested_closing_qty) {

			pomat.requested_closing_qty = pomat.qty;
		} else if(parseFloat(pomat.requested_closing_qty) > parseFloat(pomat.qty)) {

			swal("Quantity cannot be greater than the PO quantity.");
			pomat.requested_closing_qty = pomat.qty;
		} 
		// else if(parseFloat(pomat.requested_closing_qty) < parseFloat(pomat.internal_di_quantity)) {

		// 	swal("You cannot close with quantity less than internal di quantity.");
		// 	pomat.requested_closing_qty = pomat.qty;
		// }
		else {

			if(pomatnew.type==3 && !pomat.unitrate) {

				if(!$rootScope.digitcheck.test(pomat.requested_closing_qty)) {

					swal("Please enter digits in quantity.");
					pomat.requested_closing_qty = "";
					pomat.valueofgoods = 0;
				}

			} else {
				var inspectqty = 0;
				if(!$rootScope.digitcheck.test(pomat.requested_closing_qty)) {

					swal("Please enter digits in quantity.");
					pomat.requested_closing_qty = "";
					pomat.valueofgoods = 0;
				} else {
					
					pomat.valueofgoods = angular.copy(parseFloat(pomat.unitrate)*parseFloat(pomat.requested_closing_qty));
				}
			}
			$scope.altermatntax();
		}
	}

	$scope.altermatntax = function() {

		var totalpovalueofgoods = 0, totalvaluethis = 0;

		for(var i=0; i<$scope.taxdetails.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] != 0) {

					var checktaxmat = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){

						if(pomat.type == 3){

							if(pomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {

								if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

									$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
								}

								$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(pomat.valueofgoods));
								taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
								checktaxmat++;
							}
						} else{

							angular.forEach(pomat['materials'],function(inpomat){
								if(inpomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {

									if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

										$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
									}


									$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(inpomat.valueofgoods));
									taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
									checktaxmat++;
								}
							});
						}
				
						
					});

					if(checktaxmat == 0){

						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
					}
				} else {

					var checktaxtax = 0;
					console.log($scope.taxdetails[i]['taxmaterials'][j]['tax']['id']);
					for(var k=0; k<$scope.taxdetails.length;k++){
								
						if($scope.taxdetails[k]['id'] == $scope.taxdetails[i]['taxmaterials'][j]['tax']['id']) {

							if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

								$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
							}

							$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy($scope.taxdetails[k]['taxamount']);

							taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);

							checktaxtax++;
						}


					}

					if(checktaxtax == 0) {

						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
					}

				}
								
			}

			if($scope.taxdetails[i]['lumpsum'] == 1) {

				if($scope.taxdetails[i]['tax_id'] == 11) {

					var totalfreightcost = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){

						angular.forEach(pomat.materials,function(inpomat){

							if(!inpomat['freightinsurance_rate']) {

								inpomat['freightinsurance_rate'] = 0;
							}
							totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
						});
					});

					taxamount = totalfreightcost;
				} else {

					taxamount = $scope.taxdetails[i]['taxamount'];

				}
			}

			$scope.taxdetails[i]['taxamount'] = angular.copy(taxamount);
			if(taxamount > 0) {

				var taxamountfinal = ($scope.taxdetails[i]['taxpercentage']*taxamount)/100;
				taxamountfinal = taxamountfinal.toFixed(2);
				if($scope.taxdetails[i]['lumpsum'] == 0) {

					$scope.taxdetails[i]['taxamount'] = taxamountfinal;
				}
				
				if($scope.taxdetails[i]['taxtype'] == "discount") {

					totalpovalueofgoods = totalpovalueofgoods - parseFloat($scope.taxdetails[i]['taxamount']);
				} else {

					totalpovalueofgoods = totalpovalueofgoods + parseFloat($scope.taxdetails[i]['taxamount']);
				}
			}

		}

		angular.forEach($scope.pomateriallistnew,function(pomat){

			if(pomat.type == 3) {
				totalpovalueofgoods = totalpovalueofgoods+parseFloat(pomat.valueofgoods);
				totalvaluethis= totalvaluethis+parseFloat(pomat.valueofgoods);

			} else {

				angular.forEach(pomat.materials,function(inpomat){

					totalpovalueofgoods = totalpovalueofgoods+parseFloat(inpomat.valueofgoods);
					totalvaluethis= totalvaluethis+parseFloat(inpomat.valueofgoods);
				});		
				
			}
		});

		totalpovalueofgoods = totalpovalueofgoods.toFixed(2);
		totalvaluethis = totalvaluethis.toFixed(2);

		$scope.totalvalueofgoods = totalpovalueofgoods;
		$scope.totalvalue = totalvaluethis;
		$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods).toString());
	}

	$scope.raisecloseporequest = function() {

		if(!$scope.closeporemarks) {

			swal("Please write remarks for the request of closing PO.");
		} else {

			$rootScope.showloader = true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raisecloseporequest',
				data:{poid:$scope.ponodetails['id'], pomateriallistnew:$scope.pomateriallistnew, remarks:$scope.closeporemarks, taxdetails:$scope.taxdetails},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader = false;
				if(result == 1) {

					swal({ 
					  title: "Success",
					   text: "Request for closing PO has been raised.",
					    type: "success" 
					  },
					  function(){
					    location.reload();
					});
						
				}
			});
		}
	}

	$scope.searchvendorpolist = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_approved_polist',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.vendorpolist = [];
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.getpoinfo = function(poid) {

		$scope.ponodetails = [];
		$scope.pomateriallistnew = [];
		$scope.pomateriallistnewpre = {};
		$scope.pono = false;
		$scope.editmat = null;
		

		$rootScope.showloader=true;
		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_pomain_info',
		params:{pono:poid},
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			
			$rootScope.showloader=false;
			$scope.allshow =true;
			
			
			$scope.ponoshow = true;
			$scope.ponodetails = result;
			$scope.ponodetails.cdate = $scope.ponodetails.po_date.substr(0,10);
			$scope.ponodetails.cdate = $scope.ponodetails.cdate.split("-").reverse().join("-");
			var thispoid = result['id'];
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_material_types',
				params:{projectid:$scope.ponodetails.project.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(resultmat){

				$rootScope.showloader=false;
				$scope.materials = resultmat;

				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_pomateriallist',
					headers:{'JWT-AuthToken':localStorage.pmstoken},
					params:{pono:thispoid},
				}).
				success(function(poresult){

					$scope.pomateriallist = poresult;
					$scope.pomateriallistnewpre = {};
					var totaloriginalcost = 0;
					angular.forEach($scope.pomateriallist,function(pomat){
						angular.forEach($scope.materials, function(inmattype){
							angular.forEach(inmattype.submaterials, function(inmat){
								if(pomat.material_id == inmat.id) {
									inmat.showmat = true;
									if(pomat['storematerial']['inversestore']) {

										var thistype = pomat['storematerial']['inversestore']['type'];
									} else {

										var thistype = pomat['storematerial']['type'];
									}
									if(thistype == 2) {
										angular.forEach($scope.materials, function(ininmattype){
											angular.forEach(ininmattype.submaterials, function(ininmat){
												if(inmat.parent_id == ininmat.id) {
													ininmat.showmat = true;
												}
											})
										});
									}
								}
							});
						});

						if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]) {
						
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']] = {};
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = "";
							if(pomat['storematerial']['inversestore']) {
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['inversestore']['type'];
							} else {
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['type'];
							}
							if(pomat['indenttotal']) {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_indent_qty'] = pomat['indenttotal']['total_indent_qty'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_po_qty'] = pomat['indenttotal']['total_po_qty'];
							} else {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_indent_qty'] = 0;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_po_qty'] = 0;
							}
							if(pomat['storematerial']['parent_id'] != 0) {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = pomat['storematerial']['inversestore']['name'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materialid'] = pomat['storematerial']['inversestore']['id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['mainuomid'] = pomat['store_material_main_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['uomid'] = pomat['store_material_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['id'] = pomat['id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['units'] = pomat['storematerial']['matuom'][0]['stmatuom']['uom'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['freightinsurance_rate'] = pomat.freightinsurance_rate;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['inspected_quantity'] = pomat.inspected_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['approved_quantity'] = pomat.approved_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['dispatch_quantity'] = pomat.dispatch_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['internal_di_quantity'] = pomat.internal_di_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['payment_qty'] = pomat.payment_qty;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['remarks'] = pomat.remarks;
							}
							if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials']) {
							
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'] = [];
							}

						}

						if($scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] == 3) {

							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['unitrate'] = pomat['unit_rate'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['valueofgoods'] = pomat['value_of_goods'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['qty'] = pomat['quantity'];
							angular.forEach(pomat.fabmat,function(pomatfab){

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomatfab['storemat']['name'], 'uom':pomatfab['storemainuom']['stmatuom']['uom'], 'uomid':pomatfab['store_material_uom_id'], 'qty':pomatfab['qty'], 'materialid':pomatfab['store_material_id'], 'wt_per_pole':pomatfab['matdetails']['wt_per_pole'], 'wt_per_pc':pomatfab['matdetails']['wt_per_pc']});
							});
						} else {
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomat['storematerial']['name'], 'uom':pomat['storematerial']['matuom'][0]['stmatuom']['uom'], 'qty':pomat['quantity'], 'unitrate':pomat['unit_rate'], 'valueofgoods':pomat['value_of_goods'], 'materialid':pomat['material_id'], 'freightinsurance_rate':pomat.freightinsurance_rate, 'inspected_quantity':pomat.inspected_quantity, 'approved_quantity':pomat.approved_quantity, 'dispatch_quantity':pomat.dispatch_quantity, 'internal_di_quantity':pomat.internal_di_quantity, 'payment_qty':pomat.payment_qty, 'remarks':pomat.remarks, 'uomid':pomat.store_material_uom_id, 'total_po_qty':pomat['indenttotal']['total_po_qty'], 'total_indent_qty':pomat['indenttotal']['total_indent_qty'], "id":pomat['id']});
						}						
						totaloriginalcost = totaloriginalcost+parseInt(pomat.value_of_goods);
					});
					var l=1;
					angular.forEach($scope.pomateriallistnewpre,function(pomatnew){
						if(pomatnew['type'] == 1){

							$scope.pomateriallistnew[0] = pomatnew;
						} else {

							$scope.pomateriallistnew[l] = pomatnew;
							l++;
						}
					});
					$scope.totalcostwords = getwords(Math.round($scope.ponodetails['total_cost']).toString());
					
					$scope.totalvalue = totaloriginalcost;
					$http({
					method:'GET',
						url:$rootScope.requesturl+'/get_potaxes',
						headers:{'JWT-AuthToken':localStorage.pmstoken},
						params:{pono:thispoid},
					}).
					success(function(poresultin){

						$scope.taxdetails = poresultin;
						
						$scope.totalvalueofgoods = angular.copy($scope.ponodetails['total_cost']);
						angular.forEach($scope.taxdetails,function(potax){

							angular.forEach($scope.alltaxes, function(intax){

								if(potax.tax_id == intax.id) {

									intax.showtax = true;
								}
							});	
							potax.taxtitle = potax.name;
							potax.taxtype = potax.type;
							potax.taxamount = potax.value;
							potax.taxdescription = potax.tax_desc;
							potax.inclusivetaxpercentage = potax.inclusive_taxpercentage;
							potax.selected = false;
							angular.forEach(potax.taxmaterials, function(potaxmat) {

								if(potaxmat.material_id != 0) {

									potaxmat.material_id = angular.copy(potaxmat.mat.material_id);
									if(!potaxmat.tax) {
										potaxmat.tax = {};
									}
									potaxmat.tax['tax_id'] = potax.tax_id;
								} else {

									potaxmat.tax['id'] = potaxmat.purchase_taxes_id;
								}
							});

						});
						
					});

				});
			});
				

			$http({
			method:'GET',
				url:$rootScope.requesturl+'/get_pospecialterms',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{pono:thispoid},
			}).
			success(function(specialresult){

				$scope.specialterms = specialresult;

				angular.forEach($scope.specialterms,function(pospecial){
						
					pospecial.termtitle = pospecial.name;
					pospecial.termdesc = pospecial.condition;
					
				});

				
			});
			
			
			$scope.transporttype = angular.copy($scope.ponodetails['transporttype']);
			$scope.deliverylocation = angular.copy($scope.ponodetails['deliverylocation']);
			$scope.billingaddress = angular.copy($scope.ponodetails['billingaddress']);
			$scope.transportmode = angular.copy($scope.ponodetails['transport_mode']);
			$scope.reference = angular.copy($scope.ponodetails['reference']);
			$scope.termsncondition = angular.copy($scope.ponodetails['termsnconditions']);
								

			$("#VendorPoModal").modal("show");

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
		
	}

	$scope.changeporeporttype = function() {

		$scope.vendorpolist = false;
		$scope.ponodetails = [];
		$scope.sortby = 'id';

		

		if($scope.poorderreportopt=='podatewise' && $scope.count == 0) {
			$scope.sortby = 'po_date';

			$scope.count = $scope.count+1;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_project_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.projectlist = result;
				$.getScript('/chosen/chosen.jquery.js',function(){
					var config2 = {
						'.chosen-selectproject2'           : {},
						'.chosen-selectproject2-deselect'  : {allow_single_deselect:true},
						'.chosen-selectproject2-no-single' : {disable_search_threshold:10},
						'.chosen-selectproject2-no-results': {no_results_text:'Oops, nothing found!'},
						'.chosen-selectproject2-width'     : {width:'95%'}
					}
					for (var selector in config2) {
						$(selector).chosen(config2[selector]);
					}
				});

			});
			
		}

		
		$(".chosen-selectproject2").val('').trigger('chosen:updated');
		$(".chosen-selectproject1").val('').trigger('chosen:updated');
		$(".chosen-selectpolist").val('').trigger('chosen:updated');
		$(".chosen-select").val('').trigger('chosen:updated');
	}


	$scope.searchdatewisepolist = function() {

		if($(".chosen-selectproject2").val() == '? undefined:undefined ?') {

			swal("Please select a project.");
		} else if(!$scope.pofromdate) {

			swal("Please select 'From' date.");
		} else if(!$scope.potodate) {

			swal("Please select 'To' date.");
		} else if($scope.pofromdate > $scope.potodate) {

			swal("'From' date cannot be greater than 'To' date.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_datewise_polist',
			params:{fromdate:$scope.pofromdate, todate:$scope.potodate, projectid:$(".chosen-selectproject2").val()},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("No purchase orders found for the selected project between the selected date.");
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}

		
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});

app.controller("PurchasesHeadApproveClosePoController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;

	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$rootScope.showloader=true;

	$scope.count = 0;

	$scope.getcommafun = function(num){

		return Commas.getcomma(num);
	}
	$scope.countpowise = 0;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;

		$scope.vendorlist.unshift({ name: "All", id: "All" });

	});

	$scope.getpolist = function() {
		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_polist',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.polist = [];
				} else {

					$scope.polist = result[0];

				}

			});
		}
	}

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
		$scope.projectlist.unshift({ name: "All", id: "All" });

	});

	
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/getuserinfo',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.thisuserinfo = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.searchvendorpolist = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_closerequested_polist',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any pending request for closing of PO for the selected project.");
					$scope.vendorpolist = [];
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.approvecloseporequest = function(status) {

		if(!$scope.hodcloseporemarks) {

			swal("Please enter remarks for approving or rejecting request.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/approvecloseporequest',
			data:{status:status, poid:$scope.ponodetails['id'], pomateriallistnew:$scope.pomateriallistnew, remarks:$scope.hodcloseporemarks, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {
					if(status == 1) {

						var msg = "Close PO request Approved.";
					}else {

						var msg = "Close PO request Rejected.";
					}
					swal({ 
					  title: "Success",
					   text: msg,
					    type: "success" 
					  },
					  function(){
					    $scope.searchvendorpolist();
					    $scope.$apply();
					});
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.getpoinfo = function(poid) {

		$scope.ponodetails = [];
		$scope.pomateriallistnew = [];
		$scope.pomateriallistnewpre = {};
		$scope.pono = false;
		$scope.editmat = null;
		

		$rootScope.showloader=true;
		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_pomain_info',
		params:{pono:poid},
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			
			$rootScope.showloader=false;
			$scope.allshow =true;
			
			
			$scope.ponoshow = true;
			$scope.ponodetails = result;
			$scope.ponodetails.cdate = $scope.ponodetails.po_date.substr(0,10);
			$scope.ponodetails.cdate = $scope.ponodetails.cdate.split("-").reverse().join("-");
			var thispoid = result['id'];
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_material_types',
				params:{projectid:$scope.ponodetails.project.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(resultmat){

				$rootScope.showloader=false;
				$scope.materials = resultmat;

				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_pomateriallist',
					headers:{'JWT-AuthToken':localStorage.pmstoken},
					params:{pono:thispoid},
				}).
				success(function(poresult){

					$scope.pomateriallist = poresult;
					$scope.pomateriallistnewpre = {};
					var totaloriginalcost = 0;
					angular.forEach($scope.pomateriallist,function(pomat){
						angular.forEach($scope.materials, function(inmattype){
							angular.forEach(inmattype.submaterials, function(inmat){
								if(pomat.material_id == inmat.id) {
									inmat.showmat = true;
									if(pomat['storematerial']['inversestore']) {

										var thistype = pomat['storematerial']['inversestore']['type'];
									} else {

										var thistype = pomat['storematerial']['type'];
									}
									if(thistype == 2) {
										angular.forEach($scope.materials, function(ininmattype){
											angular.forEach(ininmattype.submaterials, function(ininmat){
												if(inmat.parent_id == ininmat.id) {
													ininmat.showmat = true;
												}
											})
										});
									}
								}
							});
						});

						if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]) {
						
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']] = {};
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = "";
							if(pomat['storematerial']['inversestore']) {
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['inversestore']['type'];
							} else {
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['type'];
							}
							if(pomat['indenttotal']) {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_indent_qty'] = pomat['indenttotal']['total_indent_qty'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_po_qty'] = pomat['indenttotal']['total_po_qty'];
							} else {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_indent_qty'] = 0;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['total_po_qty'] = 0;
							}
							if(pomat['storematerial']['parent_id'] != 0) {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = pomat['storematerial']['inversestore']['name'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materialid'] = pomat['storematerial']['inversestore']['id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['mainuomid'] = pomat['store_material_main_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['uomid'] = pomat['store_material_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['id'] = pomat['id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['units'] = pomat['storematerial']['matuom'][0]['stmatuom']['uom'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['freightinsurance_rate'] = pomat.freightinsurance_rate;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['inspected_quantity'] = pomat.inspected_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['approved_quantity'] = pomat.approved_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['dispatch_quantity'] = pomat.dispatch_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['internal_di_quantity'] = pomat.internal_di_quantity;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['payment_qty'] = pomat.payment_qty;
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['remarks'] = pomat.remarks;
							}
							if(!$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials']) {
							
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'] = [];
							}

						}

						if($scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] == 3) {

							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['unitrate'] = pomat['unit_rate'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['valueofgoods'] = pomat['value_of_goods'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['qty'] = pomat['quantity'];
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['requested_closing_qty'] = pomat['requested_closing_qty'];
							angular.forEach(pomat.fabmat,function(pomatfab){

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomatfab['storemat']['name'], 'uom':pomatfab['storemainuom']['stmatuom']['uom'], 'uomid':pomatfab['store_material_uom_id'], 'qty':pomatfab['qty'], 'materialid':pomatfab['store_material_id'], 'wt_per_pole':pomatfab['matdetails']['wt_per_pole'], 'wt_per_pc':pomatfab['matdetails']['wt_per_pc']});
							});
						} else {
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomat['storematerial']['name'], 'uom':pomat['storematerial']['matuom'][0]['stmatuom']['uom'], 'qty':pomat['quantity'], 'unitrate':pomat['unit_rate'], 'valueofgoods':pomat['value_of_goods'], 'materialid':pomat['material_id'], 'freightinsurance_rate':pomat.freightinsurance_rate, 'inspected_quantity':pomat.inspected_quantity, 'approved_quantity':pomat.approved_quantity, 'dispatch_quantity':pomat.dispatch_quantity, 'internal_di_quantity':pomat.internal_di_quantity, 'payment_qty':pomat.payment_qty, 'remarks':pomat.remarks, 'uomid':pomat.store_material_uom_id, 'total_po_qty':pomat['indenttotal']['total_po_qty'], 'total_indent_qty':pomat['indenttotal']['total_indent_qty'], "id":pomat['id'], "requested_closing_qty":pomat['requested_closing_qty']});
						}						
						totaloriginalcost = totaloriginalcost+parseInt(pomat.value_of_goods);
					});
					var l=1;
					angular.forEach($scope.pomateriallistnewpre,function(pomatnew){
						if(pomatnew['type'] == 1){
							
							$scope.pomateriallistnew[0] = pomatnew;
						} else {

							$scope.pomateriallistnew[l] = pomatnew;
							l++;
						}
					});
					
					$scope.totalvalue = totaloriginalcost;
					$http({
					method:'GET',
						url:$rootScope.requesturl+'/get_potaxes',
						headers:{'JWT-AuthToken':localStorage.pmstoken},
						params:{pono:thispoid},
					}).
					success(function(poresultin){

						$scope.taxdetails = poresultin;
						
						$scope.totalvalueofgoods = angular.copy($scope.ponodetails['total_cost']);
						angular.forEach($scope.taxdetails,function(potax){

							angular.forEach($scope.alltaxes, function(intax){

								if(potax.tax_id == intax.id) {

									intax.showtax = true;
								}
							});	
							potax.taxtitle = potax.name;
							potax.taxtype = potax.type;
							if(potax.lumpsum==1) {

								potax.taxamount = potax.lumpsum_requested_value;
							} else {
								potax.taxamount = potax.value;
							}
							potax.taxdescription = potax.tax_desc;
							potax.inclusivetaxpercentage = potax.inclusive_taxpercentage;
							potax.selected = false;
							angular.forEach(potax.taxmaterials, function(potaxmat) {

								if(potaxmat.material_id != 0) {

									potaxmat.material_id = angular.copy(potaxmat.mat.material_id);
									if(!potaxmat.tax) {
										potaxmat.tax = {};
									}
									potaxmat.tax['tax_id'] = potax.tax_id;
								} else {

									potaxmat.tax['id'] = potaxmat.purchase_taxes_id;
								}
							});

						});

						angular.forEach($scope.pomateriallistnew,function(pomatnew){
							if(pomatnew['type'] == 1){
								angular.forEach(pomatnew['materials'], function(inmat){

									$scope.closingqtychange(inmat,pomatnew);
								});
							} else {
								if(pomatnew['type'] == 3){

									$scope.closingqtychange(pomatnew,pomatnew);
								} else {

									angular.forEach(pomatnew['materials'], function(inmat){

										$scope.closingqtychange(inmat,pomatnew);
									});
								}
							}
						});
						
					});

				});
			});
				

			$http({
			method:'GET',
				url:$rootScope.requesturl+'/get_pospecialterms',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{pono:thispoid},
			}).
			success(function(specialresult){

				$scope.specialterms = specialresult;

				angular.forEach($scope.specialterms,function(pospecial){
						
					pospecial.termtitle = pospecial.name;
					pospecial.termdesc = pospecial.condition;
					
				});

				
			});
			
			
			$scope.transporttype = angular.copy($scope.ponodetails['transporttype']);
			$scope.deliverylocation = angular.copy($scope.ponodetails['deliverylocation']);
			$scope.billingaddress = angular.copy($scope.ponodetails['billingaddress']);
			$scope.transportmode = angular.copy($scope.ponodetails['transport_mode']);
			$scope.reference = angular.copy($scope.ponodetails['reference']);
			$scope.termsncondition = angular.copy($scope.ponodetails['termsnconditions']);
								

			$("#VendorPoModal").modal("show");

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
		
	}

	$scope.closingqtychange = function(pomat, pomatnew) {

		if(!pomat.requested_closing_qty) {

			pomat.requested_closing_qty = pomat.qty;
		} else if(parseFloat(pomat.requested_closing_qty) > parseFloat(pomat.qty)) {

			swal("Quantity cannot be greater than the PO quantity.");
			pomat.requested_closing_qty = pomat.qty;
		} else {

			if(pomatnew.type==3 && !pomat.unitrate) {

				if(!$rootScope.digitcheck.test(pomat.requested_closing_qty)) {

					swal("Please enter digits in quantity.");
					pomat.requested_closing_qty = "";
					pomat.valueofgoods = 0;
				}

			} else {
				var inspectqty = 0;
				if(!$rootScope.digitcheck.test(pomat.requested_closing_qty)) {

					swal("Please enter digits in quantity.");
					pomat.requested_closing_qty = "";
					pomat.valueofgoods = 0;
				} else {
					
					pomat.valueofgoods = angular.copy(parseFloat(pomat.unitrate)*parseFloat(pomat.requested_closing_qty));
				}
			}
			$scope.altermatntax();
		}
	}

	$scope.altermatntax = function() {

		var totalpovalueofgoods = 0, totalvaluethis = 0;

		for(var i=0; i<$scope.taxdetails.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] != 0) {

					var checktaxmat = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){

						if(pomat.type == 3){

							if(pomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {

								if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

									$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
								}

								$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(pomat.valueofgoods));
								taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
								checktaxmat++;
							}
						} else{

							angular.forEach(pomat['materials'],function(inpomat){
								if(inpomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {

									if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

										$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
									}


									$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(inpomat.valueofgoods));
									taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
									checktaxmat++;
								}
							});
						}
				
						
					});

					if(checktaxmat == 0){

						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
					}
				} else {

					var checktaxtax = 0;

					for(var k=0; k<$scope.taxdetails.length;k++){
								
						if($scope.taxdetails[k]['id'] == $scope.taxdetails[i]['taxmaterials'][j]['tax']['id']) {

							if(!$scope.taxdetails[i]['taxmaterials'][j]['tax']) {

								$scope.taxdetails[i]['taxmaterials'][j]['tax'] = [];
							}

							$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy($scope.taxdetails[k]['taxamount']);

							taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);

							checktaxtax++;
						}


					}

					if(checktaxtax == 0) {

						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
					}

				}
								
			}

			if($scope.taxdetails[i]['lumpsum'] == 1) {

				if($scope.taxdetails[i]['tax_id'] == 11) {

					// var totalfreightcost = 0;

					// angular.forEach($scope.pomateriallistnew,function(pomat){

					// 	angular.forEach(pomat.materials,function(inpomat){

					// 		if(!inpomat['freightinsurance_rate']) {

					// 			inpomat['freightinsurance_rate'] = 0;
					// 		}
					// 		totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
					// 	});
					// });

					taxamount = $scope.taxdetails[i]['lumpsum_requested_value'];
				} else {

					taxamount = $scope.taxdetails[i]['taxamount'];

				}
			}

			$scope.taxdetails[i]['taxamount'] = angular.copy(taxamount);

			if(taxamount > 0) {

				var taxamountfinal = ($scope.taxdetails[i]['taxpercentage']*taxamount)/100;
				taxamountfinal = taxamountfinal.toFixed(2);
				if($scope.taxdetails[i]['lumpsum'] == 0) {

					$scope.taxdetails[i]['taxamount'] = taxamountfinal;
				}
				
				if($scope.taxdetails[i]['taxtype'] == "discount") {

					totalpovalueofgoods = totalpovalueofgoods - parseFloat($scope.taxdetails[i]['taxamount']);
				} else {

					totalpovalueofgoods = totalpovalueofgoods + parseFloat($scope.taxdetails[i]['taxamount']);
				}
			}

		}

		angular.forEach($scope.pomateriallistnew,function(pomat){

			if(pomat.type == 3) {
				totalpovalueofgoods = totalpovalueofgoods+parseFloat(pomat.valueofgoods);
				totalvaluethis= totalvaluethis+parseFloat(pomat.valueofgoods);

			} else {

				angular.forEach(pomat.materials,function(inpomat){

					totalpovalueofgoods = totalpovalueofgoods+parseFloat(inpomat.valueofgoods);
					totalvaluethis= totalvaluethis+parseFloat(inpomat.valueofgoods);
				});		
				
			}
		});

		totalpovalueofgoods = totalpovalueofgoods.toFixed(2);
		totalvaluethis = totalvaluethis.toFixed(2);

		$scope.totalvalueofgoods = totalpovalueofgoods;
		$scope.totalvalue = totalvaluethis;
		$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods).toString());
	}

	$scope.searchdatewisepolist = function() {

		if($(".chosen-selectproject2").val() == '? undefined:undefined ?') {

			swal("Please select a project.");
		} else if(!$scope.pofromdate) {

			swal("Please select 'From' date.");
		} else if(!$scope.potodate) {

			swal("Please select 'To' date.");
		} else if($scope.pofromdate > $scope.potodate) {

			swal("'From' date cannot be greater than 'To' date.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_datewise_polist',
			params:{fromdate:$scope.pofromdate, todate:$scope.potodate, projectid:$(".chosen-selectproject2").val()},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("No purchase orders found for the selected project between the selected date.");
				} else {

					$scope.vendorpolist = result[0];
					$scope.totalpocost = result[1];
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});