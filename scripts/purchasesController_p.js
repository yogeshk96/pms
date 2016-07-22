
app.controller("PurchasesDispathController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	
	

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});

	$scope.hideall = function()
	{
		$scope.showdibox = false;
		$scope.showinsbox = false;
		$scope.showdiboxdets = false;
		$scope.dinumber = "";
	}

	$scope.changevend = function() {

		$scope.showinsbox = false;
		$scope.showinsdets = false;
		$scope.insnumber = "";
		$scope.dinumber = "";

		$rootScope.showloader=true;

		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_polist',
		params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
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
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').trigger("chosen:updated");
			// });

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.remove_dimat = function(key) {
		// console.log(key);
		// console.log($scope.didetails.dimat[key]);
		// console.log($scope.inspdetails.insmat);

		for (var i = 0; i < $scope.inspdetails.insmat.length; i++) {
			if($scope.inspdetails.insmat[i]['material_id']==$scope.didetails.dimat[key]['material_id'])
			{
				$scope.inspdetails.insmat[i]['dispatch_quantity'] = parseFloat($scope.inspdetails.insmat[i]['dispatch_quantity']) - parseFloat($scope.didetails.dimat[key]['quantity']);

				for (var j = 0; j < $scope.didetails.dimat[key]['dieachpomat'].length; j++) {
					
					
					for (var m = 0; m < $scope.inspdetails.insmat[i]['inseachpomat'].length; m++) {

						if($scope.inspdetails.insmat[i]['inseachpomat'][m]['inspection_po_id']==$scope.didetails.dimat[key]['dieachpomat'][j]['dispatch_po_id'])
						{
							$scope.inspdetails.insmat[i]['inseachpomat'][m]['dispatch_quantity'] = parseFloat($scope.inspdetails.insmat[i]['inseachpomat'][m]['dispatch_quantity']) - parseFloat($scope.didetails.dimat[key]['dieachpomat'][j]['dispatch_quantity']);
						}

					};
				};
			}
		};

		$scope.didetails.dimat.splice(key, 1);
	}

	
	
	$scope.adddismattomainarr = function()
	{
		
		var material_flag = 0;
		var po_flag = 0;
		var one;
		var two;

		if($scope.inspdetails.insmat.length==0)
		{
			swal("Cannot Add dispatch quantity, please add inspection quantity first!");
		}
		else
		{
			for (var i = 0; i < $scope.inspdetails.insmat.length; i++) {
				if($scope.inspdetails.insmat[i]['material_id']==$scope.inspomat.material_id)
				{
					material_flag = 1;
					one = i;
					for (var m = 0; m < $scope.inspdetails.insmat[i]['inseachpomat'].length; m++) {
						if($scope.inspdetails.insmat[i]['inseachpomat'][m]['inspection_po_id']==$scope.mainpo.id)
						{
							po_flag = 1;
							two = m;
						}
					};
				}
			};

			if(material_flag == 0 && po_flag==0)
			{
				swal('Cannot find this material in this inspection!  Add it in inspections');
			}
			else if(material_flag==1 && po_flag ==0)
			{
				swal('Cannot find this PO in the inspection! Add it in inspections');
			}
			else if(!$scope.mainpo)
			{
				swal("Please select a PO.");
			}
			else if(!$scope.inspomat)
			{	
				swal("Please select a material.");
			}		
			else if(!$rootScope.digitcheck.test($scope.inspomat.dispatch)) {

				swal("Please enter digits in current dispatch quantity.");
				$scope.inspomat.dispatch = "";
			}
			else if(material_flag==1 && po_flag ==1)
			{
				
				
				var comp = parseFloat($scope.inspdetails.insmat[one]['inseachpomat'][two]['dispatch_quantity']) + parseFloat($scope.inspomat.dispatch);
				
				if(parseFloat($scope.inspomat.dispatch)>parseFloat($scope.inspdetails.insmat[one]['inseachpomat'][two]['approved_quantity']))
				{
					
					swal("Dispatch quantity cannot be greater than approved quantity for this PO!");
				}
				else if(comp>parseFloat($scope.inspdetails.insmat[one]['inseachpomat'][two]['approved_quantity']))
				{
					
					 swal("Dispatch quantity cannot be greater than approved quantity for this PO!");
				}
				else if($scope.inspomat.dispatch==0)
				{
					swal("Dispatch quantity cannot be 0!");
				} 
				else if(!$scope.inspomat.dispatch)
				{
					swal("Enter Dispatch Quantity");
				}
				// else if(!$scope.inspomat.deliveryadd)
				// {
				// 	swal("Enter Delivery Address");
				// }//check for alphabets as well
				else
				{
					
					
					var mflag = 0;
					var pflag = 0;
					for (var i = 0; i < $scope.didetails.dimat.length; i++) { //loop over didetails array and push into that
						if($scope.didetails.dimat[i]['material_id'] == $scope.inspomat.material_id)
						{
							mflag = 1;
							for (var j = 0; j < $scope.didetails.dimat[i]['dieachpomat'].length; j++) {
								if($scope.didetails.dimat[i]['dieachpomat'][j]['dispatch_po_id']==$scope.mainpo.id)
								{
									pflag = 1;
								}
							};

							if(pflag==0)
							{
								// //add shit
								
								//form arrays and add totals
								var eachpomat = {'dispatch_quantity':$scope.inspomat.dispatch,'dispatch_po_id':$scope.mainpo.id,'inspid':$scope.insnumber,'po_material_id':$scope.inspomat.material_id,'id':'','pom_table_id':$scope.inspomat.id};

								eachpomat['podets'] = {'id':$scope.mainpo.id,'po_no':$scope.mainpo.po_no};
							
								$scope.didetails['dimat'][i]['dieachpomat'].push(eachpomat);	
								
								//add this to total
								$scope.didetails['dimat'][i]['quantity'] = 
								parseFloat($scope.didetails['dimat'][i]['quantity']) + 
								parseFloat($scope.inspomat.dispatch);
								

							}
						}
					};

				
					if(mflag==0&&pflag==0)
					{
						var newmatarr = {};
						newmatarr = {'quantity':$scope.inspomat.dispatch,'material_id':$scope.inspomat.material_id,'id':'','internal_di':'0.00'};
						//add mat des
						newmatarr['matdes'] = {'name':$scope.inspomat.storematerial.name,'units':$scope.inspomat.storematerial.units};



						//add po wise dets
						var eachpomat = {'dispatch_quantity':$scope.inspomat.dispatch,'dispatch_po_id':$scope.mainpo.id,'inspid':$scope.insnumber,'po_material_id':$scope.inspomat.material_id,'id':'','pom_table_id':$scope.inspomat.id};

						eachpomat['podets'] = {'id':$scope.mainpo.id,'po_no':$scope.mainpo.po_no};
						// $scope.didetails['dimat'][i]['dieachpomat'] = [];
						// $scope.didetails['dimat'][i]['dieachpomat'].push(eachpomat);	

						
						newmatarr['dieachpomat'] = [];
						newmatarr['dieachpomat'].push(eachpomat);

						// $scope.didetails['dimat'] = [];
						$scope.didetails['dimat'].push(newmatarr);
					}
					else if(mflag==1&&pflag==1)
					{
						
						swal("You have already added DI Qty to this inspection in this Dispatch reference, cant add more than once!Remove existing and add agian");
					}

					if(pflag!=1) // add totals into insp array
					{	
						$scope.inspdetails.insmat[one]['inseachpomat'][two]['dispatch_quantity'] = 
						angular.copy(parseFloat($scope.inspdetails.insmat[one]['inseachpomat'][two]['dispatch_quantity']) + parseFloat($scope.inspomat.dispatch));
						$scope.inspdetails.insmat[one]['dispatch_quantity'] = angular.copy(parseFloat($scope.inspdetails.insmat[one]['dispatch_quantity']) + parseFloat($scope.inspomat.dispatch));
						

						$rootScope.showloader = true; //fooling the user just for fun!!!!
						$timeout(function(){
							$rootScope.showloader = false;
						},2000);
						// console.log($scope.didetails);

					}

					
				}




			}

			console.log($scope.didetails);
			
		}
	}

	$scope.savedidata = function()
	{
		// console.log($scope.didetails.dispatch_date);
		// if($scope.didetails.dimat.length==0)
		// {
		// 	swal('Please add di qty to save!');
		// }
		// else if(!$scope.didetails.dispatch_date || $scope.didetails.dispatch_date=='0000-00-00')
		// {
		// 	swal('Please enter Dispatch approval date!');
		// }
		// else if($scope.didetails.didocs.length==0)
		// {
		// 	swal('Please add DI Documents!');
		// }
		// else
		
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/savedi_data_final',
			data:{insp:$scope.inspdetails,iid:$scope.insnumber,di:$scope.didetails,diid:$scope.dinumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			if(result=='yes')
			{
				swal('successfully saved DI Details');
				window.location.reload();
				// $scope.didetails.complete_flag = 1;
			}
		});
		
		
	}

	$scope.dichangefunc = function()
	{
		$scope.showdiboxdets = true;
		$rootScope.showloader=true;
		for (var i = 0; i < $scope.dilist.length; i++) {
			if($scope.dilist[i]['id']==$scope.dinumber)
			{
				$scope.didetails = $scope.dilist[i];
				break;
			}
		};

		if(!$scope.didetails['dimat'])
		{
			$scope.didetails['dimat'] = [];
		}
		
		console.log($scope.didetails);
		
		if($scope.didetails.callraise)
		{
			
			if($scope.didetails.callraise.manual_flag=='0')
			{
				
				$scope.didetails.callraise.raisedate = $scope.didetails.callraise.created_at.substr(0,10);
				$scope.didetails.callraise.raisedate = $scope.didetails.callraise.raisedate.split("-").reverse().join("-");
			}
			else
			{
				$scope.didetails.callraise.raisedate = $scope.didetails.callraise.manual_date.split("-").reverse().join("-");
			}	
		}

		$rootScope.showloader=false;
	}

	$scope.inschangefunc = function()
	{
		$scope.showdibox = false;
		$scope.showdiboxdets = false;

		$rootScope.showloader=true;
		for (var i = 0; i < $scope.inslist.length; i++) {
			if($scope.inslist[i]['id']==$scope.insnumber)
			{
				$scope.inspdetails = $scope.inslist[i];
				break;
			}
		};


		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_poslinked_toins',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.polist = result;
		});

		// $rootScope.showloader=false;
	}

	$scope.uploaddidoc=function(files){

		// console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']

	}


	$scope.add_di_doc=function(dtype){

		// console.log('12');

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					
					$scope.didetails.didocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					
					// console.log($scope.didetails);

					// document.getElementById('file_dispatch').value=null;					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		}
	}

	$scope.remove_didoc=function(path, key) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				

				$scope.didetails.didocs.splice(key, 1);
				swal("Deleted!", "Your file has been deleted.", "success"); 
				
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});


		
	}



	$scope.getinslist = function()
	{
		// console.log('12');
		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else if(!$scope.ponumber) {

			swal("Please select a PO.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_vendor_inspection_ref',
			data:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid, ponumber:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result.length == 0)
				{
					swal("There are no Inspection References for this vendor!");
				}
				else
				{
					$scope.inslist = result;
					$scope.showinsbox = true;
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').on('change',function(){
			// 		$scope.ponumber=$(this).val();
			// 		$scope.$apply();
			// 	});
			// });
		}
	}


	$scope.getdisdata = function()
	{
		// console.log($scope.insnumber);
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_dispatches_list',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.dilist = result;
			$scope.showdibox = true;

		});
	}

	
});


app.controller("PurchasesDepInspectionController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	var insshow = [];

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});

	$scope.getinslist = function()
	{
		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else if(!$scope.ponumber) {

			swal("Please select PO.")
		} else {

			$rootScope.showloader=true;

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_vendor_inspection_ref',
			data:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid, ponumber:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				if(result.length == 0)
				{
					swal("There are no Inspection References for this vendor!");
				}
				else
				{
					$scope.inslist = result;
					$scope.showinsbox = true;
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').on('change',function(){
			// 		$scope.ponumber=$(this).val();
			// 		$scope.$apply();
			// 	});
			// });
		}
	}

	$scope.changevend = function() {

		$scope.showinsbox = false;
		$scope.showinsdets = false;
		$scope.insnumber = "";

		$rootScope.showloader=true;

		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_polist',
		params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
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
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').trigger("chosen:updated");
			// });

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.hideall = function()
	{
		$scope.showinsbox = false;
		$scope.showinsdets = false;
		$scope.insnumber = "";
	}

	$scope.changetotalappro = function()
	{
		
		// console.log('12');
		for (var i = 0; i < $scope.inspdetails.insmat.length; i++) {
			for (var j = 0; j < $scope.inspdetails.insmat[i]['inseachpomat'].length; j++) {
				var total = 0;
				if(!$scope.inspdetails.insmat[i]['inseachpomat'][j]['approved_quantity'])
				{
					$scope.inspdetails.insmat[i]['inseachpomat'][j]['approved_quantity'] = 0;
				}
				if(parseFloat($scope.inspdetails.insmat[i]['inseachpomat'][j]['approved_quantity'])>parseFloat($scope.inspdetails.insmat[i]['inseachpomat'][j]['inspected_quantity']))
				{
					swal('Approved quantity cant be greater than inspected quantity!');
					$scope.inspdetails.insmat[i]['inseachpomat'][j]['approved_quantity'] = 0;
					break;
				}
				else
				{
					total+=parseFloat($scope.inspdetails.insmat[i]['inseachpomat'][j]['approved_quantity']);
				}
			};
			console.log(total);
			$scope.inspdetails.insmat[i]['approved_quantity'] = total;
		};
	}

	$scope.saveinspection = function()
	{

		// console.log($scope.inspdetails);
		$scope.changetotalappro();

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/saveinspection_details_total',
			data:{dat:$scope.inspdetails,vendor:$scope.vendorid,project:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$rootScope.showloader=false;

			if(result['res']=='yes')
			{
				swal("successufully saved inspection details!");
				window.location.reload();
			}
			else if(result['res']=='both')
			{
				swal("Could not save inspection, Please upload GTP drawings for the added materials and upload PO documents for the POs in this inspection!");
			}
			else if(result['res']=='nogtp')
			{
				swal('Could not save inspection, Please upload GTP drawings for these materials and vendor combinations', result['mat'], "warning");
			}
			else if(result['res']=='nopodocs')
			{
				swal('Could not save inspection, Please upload PO docs for these POs');
			}

			
		});
	}

	$scope.inschangefunc = function()
	{
		$rootScope.showloader=true;
		for (var i = 0; i < $scope.inslist.length; i++) {
			if($scope.inslist[i]['id']==$scope.insnumber)
			{
				$scope.inspdetails = $scope.inslist[i];
				break;
			}
		};

		
		if($scope.inspdetails.callraise)
		{
			
			if($scope.inspdetails.callraise.manual_flag=='0')
			{
				
				$scope.inspdetails.callraise.raisedate = $scope.inspdetails.callraise.created_at.substr(0,10);
				$scope.inspdetails.callraise.raisedate = $scope.inspdetails.callraise.raisedate.split("-").reverse().join("-");
			}
			else
			{
				$scope.inspdetails.callraise.raisedate = $scope.inspdetails.callraise.manual_date.split("-").reverse().join("-");
			}	
		}
		
		
		$scope.showinsdets = true;
		$scope.inspomat = "";

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_poslinked_toins',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$rootScope.showloader=false;
			$scope.polist = result;
		});

		
	}

	$scope.cleardets = function()
	{
		$scope.inspomat = "";
	}


	$scope.remove_inspmat = function(index)
	{
		$scope.inspdetails['insmat'].splice(index,1);
		console.log($scope.inspdetails);
	}

	$scope.addinspmattomainarr  = function()
	{

		if(!$scope.mainpo)
		{
			swal("Please select a PO.");
		}
		else if(!$scope.inspomat)
		{	
			swal("Please select a material.");
		}		
		else if(!$rootScope.digitcheck.test($scope.inspomat.current_inspected)) {

			swal("Please enter digits in current inspected quantity.");
			$scope.inspomat.current_inspected = "";
		}
		else if($scope.inspomat.current_approved && !$rootScope.digitcheck.test($scope.inspomat.current_approved))
		{
			
			swal("Please enter digits in current approved quantity.");
			$scope.inspomat.current_approved = "";
			 
		}
		else if(!$scope.inspomat.current_inspected)
		{
			swal("Please enter current inspected quantity.");
		}
		// else if(parseFloat($scope.inspomat.current_inspected)>parseFloat($scope.inspomat.quantity))
		// {
		// 	swal("current inspected quantity cant be greater than total purchased quantity");
		// }
		else if(parseFloat($scope.inspomat.current_approved)>parseFloat($scope.inspomat.current_inspected))
		{
			swal("Approved quantity cant be greater than inspected quantity.");
		}
		// else if((parseFloat($scope.inspomat.current_approved) + parseFloat($scope.inspomat.approved_quantity)) > parseFloat($scope.inspomat.quantity))
		// {
		// 	swal("Approved qty cant be greater than purchased qty!");
		// }
		else
		{
			var poflag = 0;
			var matflag = 0;

			// console.log('12');

			if(!$scope.inspomat.current_approved)
			{
				$scope.inspomat.current_approved = 0;
			}

			$rootScope.showloader=true;
			if($scope.inspdetails['insmat'].length>0)
			{
				for (var i = 0; i < $scope.inspdetails['insmat'].length; i++) {
					if($scope.inspdetails['insmat'][i]['material_id']==$scope.inspomat.material_id)
					{
						matflag = 1;
						//check if PO no already exists
						for (var j = 0; j < $scope.inspdetails['insmat'][i]['inseachpomat'].length; j++) {
							if($scope.inspdetails['insmat'][i]['inseachpomat'][j]['inspection_po_id'] == $scope.inspomat.purchase_order_id)
							{
								swal('This material PO combination already exists,please remove it and then add again!');
								poflag = 1; //po is also there
								break;
							}
						};
						
						if(poflag==0)
						{
							//console
							var newmatarr = {'inspected_quantity':$scope.inspomat.current_inspected,'approved_quantity':$scope.inspomat.current_approved,'inspection_po_id':$scope.mainpo['id'],'po_material_id':$scope.inspomat.material_id,'id':'','pom_table_id':$scope.inspomat.id};

							newmatarr['podets'] = {'id':$scope.mainpo.id,'po_no':$scope.mainpo.po_no};
						
							$scope.inspdetails['insmat'][i]['inseachpomat'].push(newmatarr);	
							//add this to total
							$scope.inspdetails['insmat'][i]['approved_quantity'] = 
							parseFloat($scope.inspdetails['insmat'][i]['approved_quantity']) + 
							parseFloat($scope.inspomat.current_approved);

							$scope.inspdetails['insmat'][i]['inspected_quantity'] = 
							parseFloat($scope.inspdetails['insmat'][i]['inspected_quantity']) + 
							parseFloat($scope.inspomat.current_inspected);

							// $scope.inspdetails = "";

						}
					}
				};

				if(matflag==0 && poflag==0 )
				{
					//add both
					// console.log('12');
					var totmatarr = {};
					totmatarr = {'approved_quantity':$scope.inspomat.current_approved,'inspected_quantity':$scope.inspomat.current_inspected,'material_id':$scope.inspomat.material_id,'id':'','dispatch_quantity':'0.00'};
					//add mat des
					totmatarr['matdes'] = {'name':$scope.inspomat.storematerial.name,'units':$scope.inspomat.storematerial.units};



					//add po wise dets
					var newmatarr = {};
					newmatarr = {'inspected_quantity':$scope.inspomat.current_inspected,'approved_quantity':$scope.inspomat.current_approved,'inspection_po_id':$scope.mainpo['id'],'po_material_id':$scope.inspomat.material_id,'id':'','pom_table_id':$scope.inspomat.id};
					newmatarr['podets'] = {'id':$scope.mainpo.id,'po_no':$scope.mainpo.po_no};

					
					totmatarr['inseachpomat'] = [];
					totmatarr['inseachpomat'].push(newmatarr);

					$scope.inspdetails['insmat'].push(totmatarr);
					console.log($scope.inspdetails);
					
				}


			}
			else
			{
				//add both

				// make main array
				var totmatarr = {};
				totmatarr = {'approved_quantity':$scope.inspomat.current_approved,'inspected_quantity':$scope.inspomat.current_inspected,'material_id':$scope.inspomat.material_id,'id':'','dispatch_quantity':'0.00'};
				//add mat des
				totmatarr['matdes'] = {'name':$scope.inspomat.storematerial.name,'units':$scope.inspomat.storematerial.units};



				//add po wise dets
				var newmatarr = {};
				newmatarr = {'inspected_quantity':$scope.inspomat.current_inspected,'approved_quantity':$scope.inspomat.current_approved,'inspection_po_id':$scope.mainpo['id'],'po_material_id':$scope.inspomat.material_id,'id':'','pom_table_id':$scope.inspomat.id};
				newmatarr['podets'] = {'id':$scope.mainpo.id,'po_no':$scope.mainpo.po_no};

				
				totmatarr['inseachpomat'] = [];
				totmatarr['inseachpomat'].push(newmatarr);

				$scope.inspdetails['insmat'].push(totmatarr);

				

			}



			console.log($scope.inspdetails);
			
			$rootScope.showloader=false;
		}
	}


	$scope.remove_didoc=function(path) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$rootScope.showloader=true;
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				
				$rootScope.showloader=false;
				var checkpath = -1;
				for(var i=0; i<$scope.inspdetails.insdocs.length;i++) {

					if($scope.inspdetails.insdocs[i]['doc_url'] == path) {

						checkpath = i;
					}
				}

				if(checkpath != -1) {

					$scope.inspdetails.insdocs.splice(checkpath, 1);
					swal("Deleted!", "Your file has been deleted.", "success"); 
				} else {

					swal("Something went wrong.", "", "warning");
				}
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});
		
	}

	$scope.uploaddidoc=function(files){

		// console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']

	}

	$scope.add_di_doc=function(dtype)
	{
		console.log($scope.inspdetails);

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				console.log(data);

				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					if(dtype=="approved_inspection"){
						$scope.inspdetails.insdocs.push({'doc_type':4,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}else if(dtype=="inspection_report"){
						$scope.inspdetails.insdocs.push({'mime_type':$scope.fdType,'doc_type':2,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}else if(dtype=="inspection_call"){
						$scope.inspdetails.insdocs.push({'mime_type':$scope.fdType,'doc_type':1,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}
					// document.getElementById('file_dispatch').value=null;					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		}
	}

});

app.controller("PurchasesReportsPoTrackerController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	
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

	$scope.hidestuff = function()
	{
		$scope.shopobox =false;
		$scope.mainpo = '';
	}

	$scope.searchvendorpolist = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.pofromdate) {

			swal("Please select from date.");
		} else if(!$scope.potodate) {

			swal("Please select to date.");
		} else if($scope.pofromdate > $scope.potodate) {

			swal("'From' date cannot be greater than 'To' date.");
		} else {

			$scope.shopobox = true;
			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_polistdatewise',
			params:{vendorid:$scope.vendorid, projectid:$scope.projectid, pofromdate:$scope.pofromdate, potodate:$scope.potodate},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.polist = [];
				} else {

					$scope.polist = result[0];
					$scope.polist.unshift({ po_no: "All", id: "All" });
					console.log($scope.polist)
					// $scope.totalpocost = result[1];
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}



});


app.controller("RoadPermitController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){

	$scope.roadpermit = {};
	$scope.roadpermit.materials = [];
	$scope.roadpermit.docs = [];
	$scope.invoice = [];
	$scope.invoice.docs = [];
	$scope.addedrps = [];
	
	$scope.roadpermit.invoices = [];

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});	

	$scope.addmattorparray = function()
	{
		var newmatarr = {'matid':$scope.mainmat.matid,'quantity':$scope.vehqty,'idimatids':$scope.mainmat.intdimatids,'name':$scope.mainmat.name,'units':$scope.mainmat.uom};

		$scope.roadpermit.materials.push(newmatarr);
		
		$scope.addedrps.push($scope.roadpermit);
		console.log($scope.addedrps);
		// console.log($scope.mainmat);
	}

	$scope.inschangefunc = function()
	{
		
		$scope.showall_dets = false;
		$scope.showdibox = false;
		$scope.dinumber = "";
		$scope.showrpdets = false;
	}

	$scope.hideall = function()
	{
		$scope.showdibox = false;
		$scope.showall_dets = false;
		$scope.showinsbox = false;
		$scope.insnumber = "";
		$scope.dinumber = "";
		$scope.showrpdets = false;
	}


	$scope.addinvoices = function()
	{
		if(!$scope.invoice.no)
		{
			swal('Enter Invoice No');
		}
		else if(!$scope.invoice.date)
		{
			swal('Enter Invoice Date');
		}
		else if(!$scope.invoice.quantity)
		{
			swal('Enter Invoice Quantity');
		}
		else if(!$scope.invoice.value)
		{
			swal('Enter Invoice  Value');
		}
		else if($scope.invoice.docs.length==0)
		{
			swal('Upload Invoice Docs');
		}
		else
		{
			$scope.invoice.formatdate = $scope.invoice.date.split("-").reverse().join("-");
			var newinvoicearr = {'no':$scope.invoice.no,'date':$scope.invoice.date,'quantity':$scope.invoice.quantity,'value':$scope.invoice.value,'docs':$scope.invoice.docs,'formatdate':$scope.invoice.formatdate};
			$scope.roadpermit.invoices.push(newinvoicearr);
			$scope.invoice = [];
			$scope.invoice.docs = [];
		}

	}

	$scope.uploaddidoc=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']
	}

	$scope.add_di_doc=function(dtype){

		

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					
					if(dtype=='rpinvoice')
					{
						$scope.invoice.docs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
					}
					else if(dtype=='roadpermitdocs')
					{
						$scope.roadpermit.docs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
					}
					
					
					// console.log($scope.didetails);

					// document.getElementById('file_dispatch').value=null;					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		}
	}

	$scope.remove_didoc=function(path, key,type) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				
				if(type=='rpinvoice')
				{
					$scope.invoice.docs.splice(key, 1);
				}
				else if(type=='rpmaininvoice')
				{
					$scope.roadpermit.invoices.splice(key, 1);
				}
				else if(type=='roadpermitdocs')
				{
					$scope.roadpermit.docs.splice(key, 1);
				}
				
				swal("Deleted!", "Your file has been deleted.", "success"); 
				
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		});	
	}

	$scope.raiseroadpermit = function()
	{
		console.log($scope.roadpermit);

		if($scope.roadpermit.materials.length==0)
		{
			swal('Please add materials');
		}
		else if($scope.roadpermit.invoices.length==0)
		{
			swal('Please add invoices!');
		}
		else if(!$scope.roadpermit.raisedate)
		{
			swal('Please enter road permit raise date!');
		}
		else if(!$scope.roadpermit.validtill)
		{
			swal('Please enter road permit valid till date!');
		}
		else if(!$scope.roadpermit.rpno)
		{
			swal('Please enter road permit no!');
		}
		else if($scope.roadpermit.docs.length==0)
		{
			swal('Please add road permit docs!');
		}
		else if(!$scope.roadpermit.truckno)
		{
			swal('Please enter road permit truck no!');
		}
		else if(!$scope.roadpermit.checkpost)
		{
			swal('Please enter check post likely to cross!');
		}
		else if(!$scope.roadpermit.transportername)
		{
			swal('Please enter transportername!');
		}
		else
		{
			// console.log($scope.idiids);
			// console.log($scope.roadpermit);

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raise_road_permit',
				data:{data:$scope.roadpermit,iid:$scope.insnumber,diid:$scope.disnumber,idis:$scope.idiids},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				// $scope.projectlist = result;
				if(result=='yes')
				{	
					swal('Road Permit Saved successfully!');
					$scope.roadpermit = {};
					$scope.roadpermit.materials = [];
					$scope.roadpermit.docs = [];
					$scope.invoice = [];
					$scope.invoice.docs = [];
					
					$scope.roadpermit.invoices = [];

				}
			});	
		}		
		


	}

	$scope.addmattorp = function()
	{
		var matflag = 0;

		for (var i = 0; i < $scope.roadpermit.materials.length; i++) {
			if($scope.roadpermit.materials[i]['matid']==$scope.mainmat.matid)
			{
				matflag =1;
			}
		};


		if(!$scope.mainmat)
		{
			swal('Please select material to add!');
		}
		else if(!$scope.vehqty)
		{
			swal('Please enter quantity to add');
		}
		else if(parseFloat($scope.vehqty)>parseFloat($scope.mainmat.quantity) - parseFloat($scope.mainmat.road_permit_quantity))
		{
			swal('Quantity cannot be greater than max adding quantity');
		}
		else if(matflag==1)
		{
			swal('You have already added this material, plese remove it and add agian!');
		}
		else
		{
			var newmatarr = {'matid':$scope.mainmat.matid,'quantity':$scope.vehqty,'idimatids':$scope.mainmat.intdimatids,'name':$scope.mainmat.name,'units':$scope.mainmat.uom};

			$scope.roadpermit.materials.push(newmatarr);
			// console.log($scope.roadpermit);
		}
	}

	$scope.removerpmat = function(key)
	{
		$scope.roadpermit.materials.splice(key, 1);
	}

	$scope.idichangefunc = function()
	{
		
		var materials_array = [];
		$scope.materials = [];
		var newmat_array = [];
		$scope.mainmat = "";
		$scope.roadpermit.materials = [];
		$scope.vehqty = "";
		$scope.showrpdets = true;
		$scope.idiids = [];
		

		for (var i = 0; i < $scope.idinumbers.length; i++) {
			for (var j = 0; j < $scope.idinumbers[i]['intdimat'].length; j++) {
				if($scope.idinumbers[i]['intdimat'][j]['di_material_id'] in materials_array)
				{
					materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']]['quantity'] = parseFloat(materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']]['quantity']) + parseFloat($scope.idinumbers[i]['intdimat'][j]['quantity']);
					materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']]['intdimatids'].push($scope.idinumbers[i]['intdimat'][j]['id']);
					materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']]['road_permit_quantity'] = parseFloat(materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']]['road_permit_quantity']) + parseFloat($scope.idinumbers[i]['intdimat'][j]['road_permit_quantity']);
				}
				else
				{
					materials_array[$scope.idinumbers[i]['intdimat'][j]['di_material_id']] = {'name':$scope.idinumbers[i]['intdimat'][j]['matdes']['name'],'quantity':$scope.idinumbers[i]['intdimat'][j]['quantity'],'intdimatids':[$scope.idinumbers[i]['intdimat'][j]['id']],'road_permit_quantity':$scope.idinumbers[i]['intdimat'][j]['road_permit_quantity'],'uom':$scope.idinumbers[i]['intdimat'][j]['matdes']['units'],'matid':$scope.idinumbers[i]['intdimat'][j]['di_material_id']};

				}
				$scope.idiids.push($scope.idinumbers[i]['intdimat'][j]['id']);

			};
		};
		

		angular.forEach(materials_array,function(key,value){
			newmat_array.push([key,value]);
		});
		// console.log(newmat_array);

		$scope.materials = angular.copy(newmat_array);

		// console.log($scope.idiids);

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_roadpermits_data',
			data:{idis:$scope.idiids},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.aroadpermits = result;
			
		});	
		
	}

	$scope.getinslist = function()
	{
		// console.log('12');
		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_inspection_ref',
			params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result.length == 0)
				{
					swal("There are no Inspection References for this vendor!");
				}
				else
				{
					$scope.inslist = result;
					$scope.showinsbox = true;
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').on('change',function(){
			// 		$scope.ponumber=$(this).val();
			// 		$scope.$apply();
			// 	});
			// });
		}
	}

	$scope.getdisdata = function()
	{
		// console.log($scope.insnumber);
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_dispatches_list',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$rootScope.showloader=false;
			$scope.dilist = result;
			$scope.showdibox = true;

		});
	}


	$scope.dichangefunc = function()
	{
		$scope.showdiboxdets = true;
		$scope.showall_dets = true;
		$scope.showrpdets = false;

		$rootScope.showloader=true;
		for (var i = 0; i < $scope.dilist.length; i++) {
			if($scope.dilist[i]['id']==$scope.dinumber)
			{
				$scope.didetails = $scope.dilist[i];
				$scope.didetails.internaldidocs = [];
				break;
			}
		};

		for (var i = 0; i < $scope.didetails.intdi.length; i++) {
			if($scope.didetails.intdi[i]['manual_flag']=='0')
			{
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['created_at'].substr(0,10);
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['raisedate'].split("-").reverse().join("-");
			}
			else
			{
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['manual_date'].split("-").reverse().join("-");
			}
		};

		$rootScope.showloader=false;
	}

});	


app.controller("PurchasesReportsVendorRepController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.matlist = result;

	});

	$scope.changevendorrepradio = function()
	{
		$rootScope.showloader=true;
		if($scope.vendrepradio=='vendorwise')
		{
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_vendor_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				$scope.vendorlist = result;

			});
		}
		else if($scope.vendrepradio=='matwise')
		{
			$scope.matvendorlist = [];
			$rootScope.showloader=false;
			$scope.matid = '';
		}
	}

	$scope.getvendorslist = function()
	{
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_vend_list',
			params:{dat:$scope.matid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.matvendorlist = result;

		});
	}
});	

app.controller("PurchasesInternalDIController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	$scope.payterms = {};
	$scope.payterms['payment_type'] = "PDC";
	$scope.actype = "existing";
	$scope.file_attachments = [];
	$scope.old_flag = 0;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;
		

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_stores_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.storeslist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_site_areas_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.siteareaslist = result;

	});


	$scope.calculatelcinterest = function() {

		if(!$scope.payterms['lc_time_period']) {

			swal("Please enter LC time period.");
		} else {

			var intrstval = (parseFloat($scope.payterms['lc_interest_percentage'])*parseFloat($scope.totalmatcost)/36500)*parseInt($scope.payterms['lc_time_period']);

			$scope.payterms['lc_interest_value'] = parseFloat(intrstval).toFixed(2);
		}
	}

	$scope.calculate_vendor_sse_interest = function() {

		if(!$scope.payterms['lc_time_period']) {

			swal("Please enter LC time period.");
		} else if(parseInt($scope.payterms['lc_interest_days_vendor']) > parseInt($scope.payterms['lc_time_period'])) {

			swal("Interest days of vendor cannot be greater than LC time period.");
			$scope.payterms['lc_interest_days_vendor'] = 0;
		} else if(!$scope.payterms['lc_interest_percentage']) {

			swal("Please enter LC interest %.");
		} else if(!$scope.payterms['lc_interest_days_vendor']) {

			swal("Please enter interest days on vendor.");
		} else {

			var lcintsse = parseInt($scope.payterms['lc_time_period'])-parseInt($scope.payterms['lc_interest_days_vendor']);

			$scope.payterms['lc_interest_days_sse'] = lcintsse;

			var intrstvalvendor = (parseFloat($scope.payterms['lc_interest_percentage'])*parseFloat($scope.totalmatcost)/36500)*parseInt($scope.payterms['lc_interest_days_vendor']);

			var intrstvalsse = (parseFloat($scope.payterms['lc_interest_percentage'])*parseFloat($scope.totalmatcost)/36500)*parseInt($scope.payterms['lc_interest_days_sse']);

			$scope.payterms['interest_amount_vendorac'] = parseFloat(intrstvalvendor).toFixed(2);
			$scope.payterms['interest_amount_sselac']= parseFloat(intrstvalsse).toFixed(2);
		}
	}

	$scope.changeoflctimeperiod = function() {

		if($scope.payterms['lc_interest_days_vendor']) {

			var lcintsse = parseInt($scope.payterms['lc_time_period'])-parseInt($scope.payterms['lc_interest_days_vendor']);

			$scope.payterms['lc_interest_days_sse'] = lcintsse;

			var intrstvalvendor = (parseFloat($scope.payterms['lc_interest_percentage'])*parseFloat($scope.totalmatcost)/36500)*parseInt($scope.payterms['lc_interest_days_vendor']);

			var intrstvalsse = (parseFloat($scope.payterms['lc_interest_percentage'])*parseFloat($scope.totalmatcost)/36500)*parseInt($scope.payterms['lc_interest_days_sse']);

			$scope.payterms['interest_amount_vendorac'] = parseFloat(intrstvalvendor).toFixed(2);
			$scope.payterms['interest_amount_sselac']= parseFloat(intrstvalsse).toFixed(2);
		}
	}

	$scope.caltotalpaycost = function(indipomat, pomat) {


		var totalprevqty = angular.copy(parseFloat(indipomat.currentpayqty)+parseFloat(indipomat.payment_qty));
		if(parseFloat(indipomat.currentpayqty) > parseFloat(indipomat.pendingpayqty)) {

			swal("Current payment quantity cannot be greater than the pending payment quantity.");
			indipomat.currentpaycost = 0;
			indipomat.currentpaycostn = 0;
			indipomat.currentpayqty = 0;
		}
		else if(totalprevqty > indipomat.quantity) {

			swal("Total quantity cannot be greater than the purchase quantity.");
			indipomat.currentpaycost = 0;
			indipomat.currentpaycostn = 0;
			indipomat.currentpayqty = 0;
		} else {

			indipomat.currentpaycost = angular.copy(parseFloat(indipomat.currentpayqty)*parseFloat(indipomat.unit_rate_taxed));
			indipomat.currentpaycost = angular.copy(indipomat.currentpaycost.toFixed(2));

			indipomat.currentpaycostn = angular.copy(parseFloat(indipomat.currentpayqty)*parseFloat(indipomat.unit_rate));
			indipomat.currentpaycostn = angular.copy(indipomat.currentpaycostn.toFixed(2));

			if(!indipomat.currentpayqty) {

				indipomat.currentpaycost = 0;
				indipomat.currentpaycostn = 0;
			}

		}

		
		var thistotalmatcost = 0;
		var thistotalmatcostn = 0;
		var currentpaycostcheck = 0;
	

		angular.forEach(pomat.pomaterials, function(thisinnpom) {

			if(!thisinnpom.currentpayqty) {

				thisinnpom.currentpaycost = 0;
				thisinnpom.currentpaycostn = 0;
			}

			if(thisinnpom.currentpayqty > 0) {

				currentpaycostcheck++;
			}

			thistotalmatcost += parseFloat(thisinnpom['currentpaycost']);
			thistotalmatcostn += parseFloat(thisinnpom['currentpaycostn']);

		});



		$scope.currentpaycostcheck = angular.copy(currentpaycostcheck);

		pomat.totalmatcost = angular.copy(thistotalmatcost.toFixed(2));
		pomat.totalmatcostn = angular.copy(thistotalmatcostn.toFixed(2));

		var totalmatcost = 0;
		var totalmatcostn = 0;

		var totaltaxcostn = 0;
		angular.forEach($scope.pomateriallist, function(inpomat) {

			angular.forEach(inpomat.pomaterials, function(innpom) {

				if(!innpom.currentpayqty) {

					innpom.currentpaycost = 0;
					innpom.currentpaycostn = 0;
				}

				totalmatcost = angular.copy(totalmatcost+parseFloat(innpom['currentpaycost']));
				totalmatcostn = angular.copy(totalmatcostn+parseFloat(innpom['currentpaycostn']));

			});

			var totaltaxcost = 0;

			angular.forEach(inpomat.taxes, function(innpot) {
				console.log("xx");
				console.log(innpot);
				var totalcurpay = 0;
				if(parseFloat(innpot.value) > 0) {
					if(parseFloat(innpot.value) > 0 && innpot.tax_id != 11) {
						
						angular.forEach(innpot.taxmaterials, function(innpotm) {

							if(innpotm.material_id != 0){

								angular.forEach(inpomat.pomaterials, function(innpom) {

									if(innpotm.material_id == innpom.id) {

										if(!innpom.currentpayqty) {

											innpom.currentpayqty = 0;
										}
										totalcurpay += parseFloat(innpom.currentpayqty)*parseFloat(innpom.unit_rate);
									}
								});
							} else {

								angular.forEach(inpomat.taxes, function(innpot2) {

									if(innpotm.purchase_taxes_id == innpot2.id) {

										totalcurpay += parseFloat(innpot2.newtaxvalue);
									}

								});
							}

						});

						innpot.newtaxvalue = (parseFloat(innpot.taxpercentage)*parseFloat(totalcurpay))/100;
					} else if(innpot.tax_id == 11 && innpot.lumpsum != 1){

						angular.forEach(inpomat.pomaterials, function(innpomm) {

							totalcurpay += parseFloat(innpomm.currentpayqty)*innpomm.freightinsurance_rate;
						});
						
						innpot.newtaxvalue = parseFloat(totalcurpay).toFixed(2);
					} else if(innpot.lumpsum == 1) {
						var totmqty = 0;
						angular.forEach(inpomat.pomaterials, function(innpomm) {

							totmqty += parseFloat(innpomm.quantity);
						});
						var indimqty = angular.copy(parseFloat(innpot.value)/totmqty);
						angular.forEach(inpomat.pomaterials, function(innpomm) {

							totalcurpay += parseFloat(innpomm.currentpayqty)*indimqty;
						});
						innpot.newtaxvalue = parseFloat(totalcurpay).toFixed(2);
					}
				} else {

					innpot.newtaxvalue = 0;
				}

				totaltaxcost += parseFloat(innpot.newtaxvalue);
			});

				totaltaxcostn += totaltaxcost;

				inpomat.totaltaxcost = angular.copy(totaltaxcost.toFixed(2));
		});
		$scope.totalmatcost = angular.copy(totalmatcost.toFixed(2));
		$scope.totalmatcostn = angular.copy(totalmatcostn.toFixed(2));
		$scope.totaltaxcostn = angular.copy(totaltaxcostn.toFixed(2));

		$scope.netcost = parseFloat($scope.totalmatcostn)+parseFloat($scope.totaltaxcostn);
		$scope.netcost = Math.round($scope.netcost*100)/100;

		if($scope.payterms['interest_amount_vendorac']) {

			$scope.calculatelcinterest();

			$scope.calculate_vendor_sse_interest();
		}


	}


	$scope.save_payment = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.ponumber){

			swal("Please select a purchase order.");
		} else if($scope.actype == "existing" && !$scope.vendoraccid){

			swal("Please select a bank account.")
		} else if($scope.actype == "new" && !$scope.accountno){

			swal("Please enter bank account number.")
		} else if($scope.actype == "new" && !$scope.ifsccode){

			swal("Please enter IFSC code.")
		} else if($scope.actype == "new" && !$scope.bankname){

			swal("Please enter bank name.")
		} else if($scope.actype == "new" && !$scope.bankbranch){

			swal("Please enter bank branch.")
		} else {

			$rootScope.showloader=true;
			var vendccid = "";
			if($scope.vendoraccid) {

				vendccid = $scope.vendoraccid.id;
			}

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/save_payments',
			data:{pomateriallist:$scope.pomateriallist, payterms:$scope.payterms, actype:$scope.actype, bank_name:$scope.bankname, bank_branch:$scope.bankbranch, ifsc_code:$scope.ifsccode, account_number:$scope.accountno, vendoraccid:vendccid, vendorid:$scope.vendorid.id, ponos:$scope.ponumber, indiid:$scope.internaldiid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result != 0) {

					$scope.memono = result['memono'];
					$scope.today = result['date'];
					$scope.uniqmat = result['pomaterials'];
					$scope.poinfo = result['poinfo'];
					$scope.userinfo = result['userinfo'];
					$scope.payid = result['payid'];
					$scope.totalmatcostinwords = angular.copy(getwords(parseFloat($scope.netcost)));

					$("#paymentModal").modal("show");
					
					setTimeout( function(){
						var htmlcontent = $(document).find(".paymentcontent").html();

						$http({
						method:'POST',
						url:'html2pdf/paymentpdf.php',
						data:{payid:result['payid'], htmlcontent:htmlcontent},
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						}).
						success(function(resultin){

							$scope.interofmemourl = resultin;
							$scope.file_attachments.push({'doc_url':resultin, 'doc_name':'INTERMEMO-'+$scope.payid,'mime_type':'pdf'});
						});
					}, 3000);

					
				}
				console.log(result);

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}


	$scope.submit_payment=function() {

		if($scope.paymentraisetype=='manual' && !$scope.paymentdate) {

			swal("Please select payment raise date.");
		} else {

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/submit_payments',
			data:{file_attachments:$scope.file_attachments, payid:$scope.payid, paymentraisetype:$scope.paymentraisetype, paymentdate:$scope.paymentdate, interofmemourl:$scope.interofmemourl, to:$scope.to, cc:$scope.cc, subject:$scope.subject, emailcontent:$scope.emailcontent},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				if(result != 0) {
					swal({ 
					  title: "Success",
					   text: "Payment details saved successfully.",
					    type: "success" 
					  },
					  function(){
					    location.reload();
					});
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

		}
	}


	$scope.changevend = function() {

		$scope.showinsbox = false;
		$scope.showinsdets = false;
		$scope.insnumber = "";
		$scope.dinumber = "";

		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_info',
			params:{vendorid:$scope.vendorid.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.vendordetails = result;

		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_polist',
		params:{'vendorid':$scope.vendorid.id, 'projectid':$scope.projectid.id},
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
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').trigger("chosen:updated");
			// });

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.hideall = function()
	{
		$scope.showdibox = false;
		$scope.showall_dets = false;
		$scope.showinsbox = false;
		$scope.insnumber = "";
		$scope.dinumber = "";
	}


	$scope.getinslist = function()
	{
		// console.log('12');
		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else if(!$scope.ponumber) {

			swal("Please select a ponumber.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_vendor_inspection_ref',
			data:{'vendorid':$scope.vendorid.id, 'projectid':$scope.projectid.id, ponumber:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result.length == 0)
				{
					swal("There are no Inspection References for this vendor!");
				}
				else
				{
					$scope.inslist = result;
					$scope.showinsbox = true;
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').on('change',function(){
			// 		$scope.ponumber=$(this).val();
			// 		$scope.$apply();
			// 	});
			// });
		}
	}


	$scope.showprevintdi =function(x)
	{
		if(x=='show')
		{
			$scope.showprev = true;
		}
		else if(x=='hide')
		{
			$scope.showprev = false;
		}
		
	}

	$scope.inschangefunc = function()
	{
		
		$scope.showall_dets = false;
		$scope.showdibox = false;
		$scope.dinumber = "";
	}

	$scope.addidittotals = function(data, y)
	{
		// console.log(data);
		var total = 0;
		for (var i = 0; i < data['dieachpomat'].length; i++) {
			if(!data['dieachpomat'][i]['new_internal_di_quantity'])
			{
				data['dieachpomat'][i]['new_internal_di_quantity'] = 0;
			}
			var pendingindi = Math.round((parseFloat(data['dieachpomat'][i]['dispatch_quantity']) - parseFloat(data['dieachpomat'][i]['internal_di_quantity']))*10000)/10000;
			console.log(pendingindi);
			if(parseFloat(data['dieachpomat'][i]['new_internal_di_quantity']) > pendingindi)
			{
				swal('New Internal DI quantity exceeds maximum internal DI quantity!');
				data['dieachpomat'][i]['new_internal_di_quantity'] = 0;
				// break;
			}
			total += parseFloat(data['dieachpomat'][i]['new_internal_di_quantity']);
			
			// total += parseFloat(data['dieachpomat'][i]['new_internal_di_quantity']);
		};
		data['total_internal_di'] = total;
		// console.log(total);

		angular.forEach($scope.pomateriallist, function(inpo){

			angular.forEach(inpo['pomaterials'], function(inpomat){
				if(data.matdes.id == inpomat.material_id && y.podets.id==inpo.id) {

					inpomat.currentpayqty = angular.copy(y.new_internal_di_quantity);

					$scope.caltotalpaycost(inpomat, inpo);
				}

			});
		});
	}

	$scope.deldimat = function(data)
	{

		$rootScope.showloader=true;
		// console.log(data);
		var nflag = 0;
		for (var i = 0; i < data.intdimat.length; i++) {
			for (var j = 0; j < data.intdimat[i]['intdipo'].length; j++) {
				if(parseFloat(data.intdimat[i]['intdipo'][j]['already_received'])>0)
				{
					nflag = 1;
				}
			};
		};

		if(nflag==1)
		{
			swal('Some of the materials are already received, cant delete now!');
		}
		else
		{
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/del_dimat_totals',
				data:{dat:data,iid:$scope.insnumber,diid:$scope.dinumber},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result=='yes')
				{
					swal('Deleted successfully');
					window.location.reload();
				}
				
			});
		}
		
	}

	$scope.changeinternaldi = function(data)
	{
		// console.log('12');
		// console.log(data);
		// console.log($scope.didetails.dimat[]);
		var total = 0;
		for (var i = 0; i < data.intdipo.length; i++) {
			for (var j = 0; j < $scope.didetails.dimat[0]['dieachpomat'].length; j++) {
				if($scope.didetails.dimat[0]['dieachpomat'][j]['dispatch_po_id']==data.intdipo[i]['po_id'])
				{
					if(!data.intdipo[i]['quantity'])
					{
						data.intdipo[i]['quantity'] = 0;
					}

					if(parseFloat($scope.didetails.dimat[0]['dieachpomat'][j]['dispatch_quantity']) - parseFloat($scope.didetails.dimat[0]['dieachpomat'][j]['internal_di_quantity']) < parseFloat(data.intdipo[i]['quantity']))
					{
						swal('Internal DI quantity cant exceed max internal DI limit!');
						data.intdipo[i]['quantity'] = 0;
					}
				}

			};
			total+=parseFloat(data.intdipo[i]['quantity']);
		};
		data.quantity = total;
	}

	$scope.getdisdata = function()
	{
		// console.log($scope.insnumber);
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_dispatches_list',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$rootScope.showloader=false;
			$scope.dilist = result;
			console.log(result);
			$scope.showdibox = true;

		});
	}


	$scope.dichangefunc = function()
	{
		$scope.showdiboxdets = true;
		$scope.showall_dets = true;
		$rootScope.showloader=true;
		for (var i = 0; i < $scope.dilist.length; i++) {
			if($scope.dilist[i]['id']==$scope.dinumber)
			{
				$scope.didetails = $scope.dilist[i];
				$scope.didetails.internaldidocs = [];
				break;
			}
		};
		$scope.pomateriallists = [];
		
		for(var j=0;j<$scope.didetails.dimat.length;j++) {

			for(var k=0; k<$scope.didetails.dimat[j]['dieachpomat'].length;k++) {
				if(!$scope.pomateriallists[$scope.didetails.dimat[j]['dieachpomat'][k]['podets']['id']]) {

					$scope.pomateriallists[$scope.didetails.dimat[j]['dieachpomat'][k]['podets']['id']] = [];
				}
				console.log($scope.didetails.dimat[j]['dieachpomat'][k]['podets']['id']);
				$scope.pomateriallists[$scope.didetails.dimat[j]['dieachpomat'][k]['podets']['id']].push($scope.didetails.dimat[j]['dieachpomat'][k]['podets']);
			}
		}
		$scope.pomateriallist = [];
		var checkmatarr = [];
		angular.forEach($scope.pomateriallists, function(inpo){
			angular.forEach(inpo, function(inpo2){
				if(checkmatarr.indexOf(inpo2.id) == -1) {
					$scope.pomateriallist.push(inpo2);
					checkmatarr.push(inpo2.id);
				}
			});
		});
		console.log($scope.pomateriallists);
		for (var i = 0; i < $scope.didetails.intdi.length; i++) {
			if($scope.didetails.intdi[i]['manual_flag']=='0')
			{
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['created_at'].substr(0,10);
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['raisedate'].split("-").reverse().join("-");
			}
			else
			{
				$scope.didetails.intdi[i]['raisedate'] = $scope.didetails.intdi[i]['manual_date'].split("-").reverse().join("-");
			}
		};

		angular.forEach($scope.pomateriallist, function(inpomat) {
			if(inpomat['csref']) {
				angular.forEach(inpomat['csref']['csrefdet'], function(incsref){
					if(incsref.csvendor) {
						if(incsref.csvendor.vendor_id == $scope.vendorid){

							$scope.payterms = angular.copy(incsref['csquotations']);
						}
					}
				});
			}
			angular.forEach(inpomat.pomaterials, function(innpom) {

				$scope.caltotalpaycost(innpom, inpomat);
			});
		});

		$rootScope.showloader=false;
	}

	$scope.uploaddidoc=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']
	}

	$scope.add_di_doc=function(dtype){

		

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					
					$scope.didetails.internaldidocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
					
					// console.log($scope.didetails);

					// document.getElementById('file_dispatch').value=null;					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		}
	}

	$scope.remove_didoc=function(path, key) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				

				$scope.didetails.internaldidocs.splice(key, 1);
				swal("Deleted!", "Your file has been deleted.", "success"); 
				
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});
		
	}

	$scope.raiseidimanual  = function()
	{
		// var aflag = 0;
		
		var nflag = 1;
		// var gflag = 0;

		for (var i = 0; i < $scope.didetails.dimat.length; i++) {
			for (var j = 0; j < $scope.didetails.dimat[i]['dieachpomat'].length; j++) {
				if(parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['new_internal_di_quantity']) > 0)
				{	
					nflag = 0; // no int di qty added what so ever fools!
					break;
				}
				
			};
		};

		// for (var i = 0; i < $scope.didetails.dimat.length; i++) {
		// 	var total = 0;
		// 	for (var j = 0; j < $scope.didetails.dimat[i]['dieachpomat'].length; j++) {

		// 		var intdi = parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['internal_di_quantity']);
		// 		var nintdi = parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['new_internal_di_quantity']);
		// 		var di = parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['dispatch_quantity']);

		// 		if(nintdi>(di-intdi))
		// 		{
		// 			gflag = 1;
		// 			break;
		// 		}
		// 		else
		// 		{
		// 			total+=parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['new_internal_di_quantity']);
		// 		}
		// 	};
		// 	$scope.didetails.dimat[i]['total_internal_di'] = total;
		// };

		// console.log(aflag);

		if(nflag==0)
		{

			if(!$scope.projectid) {

			swal("Please select a project.");
			} else if(!$scope.vendorid) {

				swal("Please select a vendor.");
			} else if(!$scope.ponumber){

				swal("Please select a purchase order.");
			} else if($scope.actype == "existing" && !$scope.vendoraccid){

				swal("Please select a bank account.")
			} else if($scope.actype == "new" && !$scope.accountno){

				swal("Please enter bank account number.")
			} else if($scope.actype == "new" && !$scope.ifsccode){

				swal("Please enter IFSC code.")
			} else if($scope.actype == "new" && !$scope.bankname){

				swal("Please enter bank name.")
			} else if($scope.actype == "new" && !$scope.bankbranch){

				swal("Please enter bank branch.")
			} else if(!$scope.refdate)
			{
				swal('Please enter Internal DI Raise Date!');
			}
			else if($scope.didetails.internaldidocs.length==0)
			{
				swal('Please upload Internal DI Docs!');
			}
			// else if(!$scope.refname)
			// {
			// 	swal('Please Enter Internal DI Reference Name');
			// }
			else if(!$scope.dloctype)
			{
				swal('Please select delivery location type');
			}
			else if($scope.dloctype=='store' && !$scope.storeid)
			{
				swal('Please select store location to deliver');
			}
			else if($scope.dloctype=='site' && !$scope.siteareaid)
			{
				swal('Please select site location to deliver');
			}
			else
			{
				if($scope.dloctype=='site')
				{
					var delid = $scope.siteareaid;
				}
				else if($scope.dloctype=='store')
				{
					var delid = $scope.storeid;
				}

				// console.log($scope.didetails);
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/post_internal_di_manual',
					data:{dat:$scope.didetails,date:$scope.refdate,iid:$scope.insnumber,dtype:$scope.dloctype,deliverylocid:delid,vendorid:$scope.vendorid.id, old_flag:$scope.old_flag},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					// console.log(result);
					$scope.internaldiid = result;
					$scope.save_payment();					

				});

			}	
		}
		else if(nflag ==1)
		{
			swal('Please enter atleast one Internal DI quantity to add!');
		}
	}

	$scope.raiseidimail  = function()
	{
		// var aflag = 0;
		// console.log($scope.didetails);
		var nflag = 1;
		// var gflag = 0;

		for (var i = 0; i < $scope.didetails.dimat.length; i++) {
			for (var j = 0; j < $scope.didetails.dimat[i]['dieachpomat'].length; j++) {
				if(parseFloat($scope.didetails.dimat[i]['dieachpomat'][j]['new_internal_di_quantity']) > 0)
				{	
					nflag = 0; // no int di qty added what so ever fools!
					break;
				}
				
			};
		};

	

		if(nflag==0)
		{

			if($scope.didetails.internaldidocs.length==0)
			{
				swal('Please upload Internal DI Docs!');
			}
			// else if(!$scope.refname)
			// {
			// 	swal('Please Enter Internal DI Reference Name');
			// }
			else if(!$scope.to)
			{
				swal('Please Enter TO Email');
			}
			else if(!$scope.subject)
			{
				swal('Please Enter Email Subject');
			}
			else if(!$scope.emailcontent)
			{
				swal('Please Enter Email Content');
			}
			else if(!$scope.dloctype)
			{
				swal('Please select delivery location type');
			}
			else if($scope.dloctype=='store' && !$scope.storeid)
			{
				swal('Please select store location to deliver');
			}
			else if($scope.dloctype=='site' && !$scope.siteareaid)
			{
				swal('Please select site location to deliver');
			}
			else
			{
				if($scope.dloctype=='site')
				{
					var delid = $scope.siteareaid;
				}
				else if($scope.dloctype=='store')
				{
					var delid = $scope.storeid;
				}

				// console.log($scope.didetails);
				
				$rootScope.showloader=true;
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/post_internal_di_mail',
					data:{dat:$scope.didetails,date:$scope.refdate,iid:$scope.insnumber,to:$scope.to,cc:$scope.cc,subject:$scope.subject,content:$scope.emailcontent,attachments:$scope.didetails.internaldidocs,vendorid:$scope.vendorid.id,dtype:$scope.dloctype,deliverylocid:delid, old_flag:$scope.old_flag},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					console.log(result);
					$rootScope.showloader=false;
					
					if(result != 0) 
					{

						if(result['failedmail'].length > 0) {
							var htm = "";

							for(var j=0; j<result['failedmail'].length;j++) {

								htm = htm+(j+1)+")"+result['failedmail'][j];
							}

							swal("Following email ID failed. Please send mail to these email ids manually "+htm, "warning");

						} else {
							$scope.internaldiid = result['indiid'];
							$scope.save_payment();
						}
					}

				});

			}	
		}
		else if(nflag ==1)
		{
			swal('Please enter atleast one Internal DI quantity to add!');
		}
	}


	$scope.uploaddidoc=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']

	}

	$scope.add_payment_doc=function(){

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/payments'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				if(data[0]=='success')
				{
					$rootScope.showloader=false;

					$scope.file_attachments.push({'doc_url':$scope.requesturl+'/uploads/payments/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});

					// console.log($scope.file_attachments);					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
			});

			
		}

	}

	function getwords(e){if(parseInt(e) == 0) { return "ZERO";} else {
			e = e.toString();
		var splite = e.split(".");
			e = splite[0];

			if(splite[1]=='00')
			{
				var u='';
			}
			else
			{
				if(splite[1]) {
					var u=' RUPEES '+getnum(splite[1])+' PAISE';
				} else {

					var u='';
				}
			}


		var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t+' '+u}
	function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t}}


});

app.controller("PurchasesDispatchRefController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	$scope.file_attachments = [];
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});


	$scope.changevend = function() {

		$scope.showinsbox = false;
		$scope.showinsdets = false;
		$scope.insnumber = "";

		$rootScope.showloader=true;

		$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_polist',
		params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
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
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').trigger("chosen:updated");
			// });

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}


	$scope.remove_didoc=function(path) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				
				var checkpath = -1;
				for(var i=0; i<$scope.file_attachments.length;i++) {

					if($scope.file_attachments[i]['doc_url'] == path) {

						checkpath = i;
					}
				}

				if(checkpath != -1) {

					$scope.file_attachments.splice(checkpath, 1);
					swal("Deleted!", "Your file has been deleted.", "success"); 
				} else {

					swal("Something went wrong.", "", "warning");
				}
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});


		
	}

	$scope.uploaddidoc=function(files){

		// console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']

	}

	$scope.add_di_doc=function(dtype){

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;

					$scope.file_attachments.push({'doc_type':5,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});

					// console.log($scope.file_attachments);					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
			});

			
		}
	}

	$scope.createrefmanual = function()
	{
		// console.log($scope.refdate);
		if(!$scope.refdate)
		{
			swal("Please enter Call Raise Date");
		}
		else 
		{

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raisedispcallmanual',
				data:{attachments:$scope.file_attachments,date:$scope.refdate,insp:$scope.insnumber, vendor:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result['res']==1)
				{

					$scope.refdate = "";
					$scope.file_attachments = [];
					$scope.getdisdata();
					swal({ 
					  title: "Success",
					   text: "successfully saved Details. Dispatch Ref No: "+result['disrefno'],
					    type: "success" 
					  },
					  function(){
					    location.reload();
					});
				}
				else
				{
					swal('Something went wrong!');
				}
				
			});
		}
	}

	$scope.createref = function()
	{
		if(!$scope.to)
		{
			swal("Please enter 'to' email id");
		}
		else if(!$scope.subject)
		{
			swal("Please enter email subject");
		}
		else if(!$scope.emailcontent)
		{
			swal("Please enter email content");
		}
		else 
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raisedicall',
				data:{to:$scope.to,cc:$scope.cc,subject:$scope.subject, emailcontent:$scope.emailcontent,attachments:$scope.file_attachments,vendor:$scope.vendorid,project:$scope.projectid,insp:$scope.insnumber},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result != 0) {

					$scope.to = '';
					$scope.cc = '';
					$scope.subject = '';
					$scope.emailcontent = '';
					$scope.file_attachments = [];
					$scope.getdisdata();
					if(result['failedmail'].length > 0) {
						var htm = "";

						for(var j=0; j<result['failedmail'].length;j++) {

							htm = htm+(j+1)+")"+result['failedmail'][j];
						}

						swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Inspection Call Raise No: "+result['ICRno'], "warning");
					} else {

						swal({ 
						  title: "Success",
						   text: "successfully saved Details. Dispatch Ref No: "+result['disrefno'],
						    type: "success" 
						  },
						  function(){
						    location.reload();
						});
					}
				}
			});
		}
	}

	$scope.hideall = function()
	{
		$scope.showinsbox = false;
	}


	$scope.getinslist = function()
	{
		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else {

			$rootScope.showloader=true;

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_vendor_inspection_ref',
			data:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid, ponumber:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result.length == 0)
				{
					swal("There are no Inspection References for this vendor!");
				}
				else
				{
					$scope.inslist = result;
					$scope.showinsbox = true;
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// $.getScript('/chosen/chosen.jquery.js',function(){
			// 	$('.chosen-selectpolist').on('change',function(){
			// 		$scope.ponumber=$(this).val();
			// 		$scope.$apply();
			// 	});
			// });
		}
	}

	$scope.getdisdata = function()
	{
		// console.log($scope.insnumber);
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_dispatches_list',
			params:{dat:$scope.insnumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.dilist = result;
			$scope.showdidets = true;

		});
	}
});

app.controller("ManInternalDIController",function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){

	var intdiarr = [];
	$scope.intdidocs = [];
	$scope.dloctype = 'store';
	$scope.callraisetype = 'manual';
	$scope.intdiarray = [];

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		console.log(result);
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		console.log(result);
		$rootScope.showloader=false;
		$scope.projectlist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_stores_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.storeslist = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_site_areas_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result);
		$rootScope.showloader=false;
		$scope.siteareaslist = result;

	});

	$scope.showprevintdi =function(x)
	{
		if(x=='show')
		{
			$scope.showprev = true;
		}
		else if(x=='hide')
		{
			$scope.showprev = false;
		}
		
	}


	$scope.raisemanidimanual  = function()
	{
		
		if($scope.intdidocs.length==0)
		{
			swal('Please upload Internal DI Docs!');
		}
		else if(!$scope.refdate)
		{
			swal('Please enter Internal DI Raise Date!');
		}
		else if(!$scope.dloctype)
		{
			swal('Please select delivery location type');
		}
		else if($scope.dloctype=='store' && !$scope.storeid)
		{
			swal('Please select store location to deliver');
		}
		else if($scope.dloctype=='site' && !$scope.siteareaid)
		{
			swal('Please select site location to deliver');
		}
		else if($scope.intdiarray.length==0)
		{
			swal('Please add materials to raise internal DI');
		}
		else
		{
			if($scope.dloctype=='site')
			{
				var delid = $scope.siteareaid;
			}
			else if($scope.dloctype=='store')
			{
				var delid = $scope.storeid;
			}

			// console.log($scope.didetails);
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/post_maninternal_di_manual',
				data:{dat:$scope.intdiarray,date:$scope.refdate,dtype:$scope.dloctype,deliverylocid:delid,vendorid:$scope.vendorid,docs:$scope.intdidocs,projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				swal({ 
				  title: "Success",
				   text: "successfully saved Internal DI quantity",
				    type: "success" 
				  },
				  function(){
				  	window.location.reload();
				    //$state.go('user.purchases.payments', {'indiid':result});
				});

			});

		}	
	}

	$scope.raisemanidimail  = function()
	{
		if(!$scope.to)
		{
			swal('Please Enter TO Email');
		}
		else if(!$scope.subject)
		{
			swal('Please Enter Email Subject');
		}
		else if(!$scope.emailcontent)
		{
			swal('Please Enter Email Content');
		}
		else if($scope.intdidocs.length==0)
		{
			swal('Please upload Internal DI Docs!');
		}
		else if(!$scope.dloctype)
		{
			swal('Please select delivery location type');
		}
		else if($scope.dloctype=='store' && !$scope.storeid)
		{
			swal('Please select store location to deliver');
		}
		else if($scope.dloctype=='site' && !$scope.siteareaid)
		{
			swal('Please select site location to deliver');
		}
		else if($scope.intdiarray.length==0)
		{
			swal('Please add materials to raise internal DI');
		}
		else
		{
			if($scope.dloctype=='site')
			{
				var delid = $scope.siteareaid;
			}
			else if($scope.dloctype=='store')
			{
				var delid = $scope.storeid;
			}

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/post_maninternal_di_mail',
				data:{dat:$scope.intdiarray,dtype:$scope.dloctype,deliverylocid:delid,vendorid:$scope.vendorid,to:$scope.to,cc:$scope.cc,subject:$scope.subject,content:$scope.emailcontent,attachments:$scope.intdidocs},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				
				if(result != 0) 
				{

					if(result['failedmail'].length > 0) {
						var htm = "";

						for(var j=0; j<result['failedmail'].length;j++) {

							htm = htm+(j+1)+")"+result['failedmail'][j];
						}

						swal("Following email ID failed. Please send mail to these email ids manually "+htm, "warning");

					} else {

						swal("Internal DI sent & Saved", "success");
						swal({ 
						  title: "Success",
						   text: "successfully saved Internal DI quantity",
						    type: "success" 
						  },
						  function(){
						    $state.go('user.purchases.payments', {'indiid':result['indiid']});
						});	
					}
				}

			});

		}	
	
		
	}



	$scope.remove_didoc=function(path,index) {

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$rootScope.showloader=true;
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_docs',
			data:{'path':path},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				
				$rootScope.showloader=false;
				$scope.intdidocs.splice(index, 1);
				swal("Deleted!", "Your file has been deleted.", "success"); 

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});
		
	}

	$scope.uploaddidoc=function(files){

		// console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']

	}

	$scope.add_di_doc=function(dtype)
	{
		// console.log($scope.inspdetails);

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:$scope.fd,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/didocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$rootScope.showloader=false;
				console.log(data);

				// console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					$scope.intdidocs.push({'mime_type':$scope.fdType,'doc_type':1,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					
					// document.getElementById('file_dispatch').value=null;					
				}
				else
				{
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		}
	}

	$scope.getpoquantities = function()
	{
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_pos_vend_link_data',
			params:{vendorid:$scope.vendorid,projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			$scope.polist = result[0];
			$scope.intdilist = result[1];

			for (var i = 0; i < $scope.intdilist.length; i++) {

				$scope.intdilist[i]['raisedate']= $scope.intdilist[i].created_at.substr(0,10);
				$scope.intdilist[i]['raisedate'] = $scope.intdilist[i].raisedate.split("-").reverse().join("-");

			};
			
			console.log($scope.intdilist);

			$scope.showidicontent = true;
		});

	}

	$scope.update_blurqty = function(data,fulldata)
	{
		console.log(fulldata);
		if(parseFloat(data.quantity)<parseFloat(data.already_received))
		{
			swal("IDI quantity cant be less than already received quantity!");
			data.quantity = 0;
		}
		
		for (var i = 0; i < fulldata.intdimat.length; i++) {
			
			var total = 0
			for (var j = 0; j < fulldata.intdimat[i]['intdipo'].length; j++) {
				
				total+= parseFloat(fulldata.intdimat[i]['intdipo'][j]['quantity']);

			};
			fulldata.intdimat[i]['quantity'] = total;
		};
	}

	$scope.updatedimat = function(data)
	{
		$rootScope.showloader=true;
		console.log(data);
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/update_idi_items',
			data:{dat:data},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			// console.log(result);
			$rootScope.showloader=false;
			if(result=='yes')
			{
				swal('updated successfully');
				window.location.reload();
			}
			
		});
	}


	$scope.addmattointarr = function()
	{
		// console.log($scope.inspomat);

		if(!$scope.inspomat.current_intdi)
		{
			swal('Please enter current internal DI quantity!');
		}
		else if(!$rootScope.digitcheck.test($scope.inspomat.current_intdi))
		{
			swal('Please enter digits in current internal DI quantity!');
		}
		else if($scope.inspomat.current_intdi>parseFloat($scope.inspomat.quantity) - parseFloat($scope.inspomat.internal_di_quantity))
		{
			swal('Current internal DI quantity cant be greater than maximum allowed internal DI quantity!');
		}
		else if($scope.inspomat.current_intdi==0)
		{
			swal('Current internal DI quantity cant be zero!');
		}
		else if(!$scope.mainpo)
		{
			swal('Please select PO');
		}
		else if(!$scope.inspomat)
		{
			swal('Please select material');
		}
		else
		{
			console.log($scope.intdiarray);
			var poflag = 0;
			if($scope.intdiarray.length>0)
			{
				for (var i = 0; i < $scope.intdiarray.length; i++) {
					if($scope.intdiarray[i]['matid']==$scope.inspomat.material_id)
					{
						//check for po
						for (var j = 0; j < $scope.intdiarray[i]['pos'].length; j++) {
							if($scope.intdiarray[i]['pos'][j]['poid']==$scope.mainpo.id)
							{
								poflag = 1;
								break;
							}
						};

						if(poflag==1)
						{
							swal('you have already added this material PO combination! Remove it and add agian!');
							break;
						}	
						else
						{
							var poarr = {'poid':$scope.mainpo.id,'intdiqty':$scope.inspomat.current_intdi,'pono':$scope.mainpo.po_no,'pomid':$scope.inspomat.id};
							$scope.intdiarray[i]['pos'].push(poarr);
							$scope.intdiarray[i]['total'] = parseFloat($scope.intdiarray[i]['total']) + parseFloat($scope.inspomat.current_intdi);
						}
						
					}
					else
					{
						//create new mat
						console.log($scope.inspomat);
						var poarr = {'poid':$scope.mainpo.id,'intdiqty':$scope.inspomat.current_intdi,'pono':$scope.mainpo.po_no,'pomid':$scope.inspomat.id};
						var matarr = {'matid':$scope.inspomat.material_id,'matdes':$scope.inspomat.storematerial.name,'total':$scope.inspomat.current_intdi,'units':$scope.inspomat.storematerial.units};
						matarr['pos'] = [];
						matarr['pos'].push(poarr);
					}

				};
				$scope.inspomat = "";
				$scope.mainpo = "";
				$scope.intdiarray.push(matarr);
			}
			else
			{
				var poarr = {'poid':$scope.mainpo.id,'intdiqty':$scope.inspomat.current_intdi,'pono':$scope.mainpo.po_no,'pomid':$scope.inspomat.id};
				var matarr = {'matid':$scope.inspomat.material_id,'matdes':$scope.inspomat.storematerial.name,'total':$scope.inspomat.current_intdi,'units':$scope.inspomat.storematerial.units};
				matarr['pos'] = [];
				matarr['pos'].push(poarr);
				$scope.intdiarray.push(matarr);
				$scope.inspomat = "";
				$scope.mainpo = "";
			}

		}
		
	}

	$scope.removemat = function(idx)
	{
		 $scope.intdiarray.splice(idx, 1);
	}

	$scope.cleardets = function()
	{
		$scope.inspomat = "";
	}

	$scope.deldimat = function(data)
	{

		$rootScope.showloader=true;
		// console.log(data);
		var nflag = 0;
		for (var i = 0; i < data.intdimat.length; i++) {
			for (var j = 0; j < data.intdimat[i]['intdipo'].length; j++) {
				if(parseFloat(data.intdimat[i]['intdipo'][j]['already_received'])>0)
				{
					nflag = 1;
				}
			};
		};

		if(nflag==1)
		{
			swal('Some of the materials are already received, cant delete now!');
		}
		else
		{
			swal({   title: "Are you sure you want to remove this?",   text: "You cant access it again. Do you want to continue?",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/del_dimat_totals',
					data:{dat:data,iid:$scope.insnumber,diid:$scope.dinumber},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					// console.log(result);
					$rootScope.showloader=false;
					if(result=='yes')
					{

						swal({ 
						  title: "Success",
						   text: "Deleted successfully.",
						    type: "success" 
						  },
						  function(){
						    location.reload();
						});
					}
					
				});
			});
		}
		
	}

});