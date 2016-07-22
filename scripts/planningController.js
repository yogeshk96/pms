app.controller("PlanningHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

});

app.controller("BoqBomMappingController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.matmapped = [];
	$scope.maptable = [];
	$scope.schtype = 1;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

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
						submultiplier[x] = {};
						submultiplier[x]['multiplier_name'] = subpmulti.multiplier_name;
						x++;

					});
				});

				$scope.submultiplier = angular.copy(submultiplier);
				console.log($scope.submultiplier);

				
			});
			
		}
		
	}


	$scope.uploadboqfile=function(files){

		//console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.get_boq_file_info=function(){

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
				'filepath':'uploads/boqdocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$scope.filedat = [];
				
				console.log(data);
				if(data[0] == "success") {
					$http({
						method:'GET',
						url:$scope.requesturl+'/get_boq_file_data',
						params:{filename:data[1], projectid:$scope.projectid, schtype:$scope.schtype},
						headers:{'JWT-AuthToken':localStorage.pmstoken}
					}).
					success(function(indata){
						$rootScope.showloader=false;
						console.log(indata);
						$scope.filedata = indata;
						
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
					});

					$http({
						method:'GET',
						url:$rootScope.requesturl+'/get_material_types',
						headers:{'JWT-AuthToken':localStorage.pmstoken},
					}).
					success(function(result){

						$scope.materials = result;
						
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
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

	
	$scope.materialchange = function(filein) {
		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:filein.materialtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			filein.submaterials = result.submaterials;
			filein.submat = {'value':'select'};

		});
	}

	$scope.addmattoact = function(matt) {

		$scope.thisfile = matt;
		
		$("#AddMaterialModal").modal('show');
		$scope.maptable = [];
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_types',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.materials = result;
			$scope.thisfile.thisqtyy = angular.copy(matt.tot_qty);
			$scope.thisfile.thisunitqty = angular.copy(matt.unit_qty);
			console.log($scope.thisfile);

			if(matt.matmapped) {

				$scope.maptable = angular.copy(matt.matmapped);
				
			}
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

	}

	$scope.addtomaptable = function() {

		if(!$scope.thisfile.materialtype) {

			swal("Please select a material type.");
		} else if(!$scope.thisfile.submat) {

			swal("Please select a material.");
		} else if(!$scope.thisfile.thisunitqty) {

			swal("Please enter material unit quantity.");
		} else if(!$scope.thisfile.thisqtyy) {

			swal("Please enter material quantity.");
		} else {

			$scope.maptable.push({'matid':$scope.thisfile.submat.id, 'materialdesc':$scope.thisfile.submat.name, 'uom':$scope.thisfile.submat.units, 'qty':$scope.thisfile.thisqtyy, 'unitqty':$scope.thisfile.thisunitqty});
		}
	}

	$scope.removerow = function(key) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$scope.maptable.splice(key, 1);	
			$scope.$apply();	
			swal("Deleted!", "Material has been deleted.", "success"); 
		});


		
	}

	$scope.addtothisact = function() {

		$scope.thisfile.matmapped = angular.copy($scope.maptable);
		$("#AddMaterialModal").modal('hide');
		$scope.maptable = [];

	}

	$scope.removeactrow = function(key, filedsub) {

		swal({   title: "Are you sure you want to delete this activity?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			console.log(filedsub);

			filedsub.splice(key, 1);
			$scope.$apply();
			swal("Deleted!", "Your activity has been deleted.", "success"); 

		});

	}

	$scope.addactivitytoproject = function() {

		$rootScope.showloader=true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_activity_to_project',
			data:{filedata:$scope.filedata, projectid:$scope.projectid, schtype:$scope.schtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			console.log(result);
			if(result == 1) {

				swal({ 
				  title: "Success",
				   text: "Activity saved successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
			} else {

				swal("Something went wrong", "", "danger");
			}

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}
});


app.controller("EditBoqBomMappingController",function($scope,$http,$rootScope,$state,Logging,$timeout){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.matmapped = [];
	$scope.maptable = [];
	$scope.schtype = 1;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.schtypechange = function() {

		$scope.filedata = [];
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

	$scope.matchangethis = function() {

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_activity_group_list',
			params:{projectid:$scope.projectid, matid:$scope.thisfile.submat.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.activitygrouplist = result;
			console.log(result);
		});
	}

	$scope.duplicateactivity = function(filed) {
		var tempfiled = angular.copy(filed);
		tempfiled.id = 0;
		$rootScope.showloader=true;
		$scope.filedata.unshift(tempfiled);
		$rootScope.showloader=false;
		console.log($scope.filedata);
	}

	$scope.get_boq_file_info=function(){

		$rootScope.showloader=true;
		
		$http({
			method:'GET',
			url:$scope.requesturl+'/get_boq_edit_data',
			params:{projectid:$scope.projectid, schtype:$scope.schtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			if(indata == 0) {

				swal("No activities found.");
			} else {
				$scope.filedata = indata;
			}
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_types',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.materials = result;
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});		
			
	}

	$scope.calculateallvariables = function(indiq, key) {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/calculateactivityvarqty',
			data:{activityinfo:indiq, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			$scope.filedata[key] = angular.copy(indata);
			console.log(indata);
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
	
	}

	
	$scope.materialchange = function(filein) {
		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:filein.materialtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			filein.submaterials = result.submaterials;
			filein.submat = {'value':'select'};

		});
	}

	$scope.addmattoact = function(matt) {

		$scope.thisfile = matt;
		
		$("#AddMaterialModal").modal('show');
		$scope.maptable = [];
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_types',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.materials = result;
			$scope.thisfile.thisqtyy = angular.copy(matt.tot_qty);
			$scope.thisfile.thisunitqty = angular.copy(matt.unit_qty);

			if(matt.matmapped) {

				$scope.maptable = angular.copy(matt.matmapped);
				console.log($scope.maptable);
			}
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

	}

	$scope.addtomaptable = function() {

		if(!$scope.thisfile.materialtype) {

			swal("Please select a material type.");
		} else if(!$scope.thisfile.submat) {

			swal("Please select a material.");
		} else if(!$scope.thisfile.thisqtyy) {

			swal("Please enter material quantity.");
		} else if($scope.thisfile.activitygroupcheck && !$scope.thisfile.subsubactivity) {

			swal("Please select a activity.");
		} else {
			$rootScope.showloader = true;

			$timeout(function(){
				$rootScope.showloader = false;
			}, 1000);

			var submatarr = [];
			var actgridarr = [];
			if($scope.thisfile.activitygroupcheck && $scope.thisfile.subsubactivity) {
				var actqty = 1;
				if($scope.thisfile.subsubactivity.thisactqtyy) {
					actqty = angular.copy($scope.thisfile.subsubactivity.thisactqtyy);
				}
				actgridarr.push({"id":$scope.thisfile.subsubactivity.id, "qty":actqty, "name":$scope.thisfile.subsubactivity.name});
				angular.forEach($scope.thisfile.subsubactivity.material, function(indisubact) {
					angular.forEach(indisubact.submaterial, function(insub){
						var mname = "";
						if(insub.storelevel1mat.msmat) {

							mname = insub.storelevel1mat.msmat.name;
						}
						var totqty = parseFloat(insub.storelevel1mat.qty_per_pole)*parseFloat($scope.thisfile.subsubactivity.thisactqtyy);
						submatarr.push({'matid':insub.material_level1_id, 'matname':insub.storelevel1mat.storematerial.name, 'msmatname':mname, 'qty_per_pole':insub.storelevel1mat.qty_per_pole, 'thisactqty':$scope.thisfile.subsubactivity.thisactqtyy, "totqty":totqty, "ere_code":insub.storelevel1mat.ere_code, "dwg_code":insub.storelevel1mat.dwg_code});
					});
				});
				var checkmat = 0;
				angular.forEach($scope.maptable, function(indimap){

					if(indimap.matid == $scope.thisfile.submat.id){

						angular.forEach($scope.thisfile.subsubactivity.material, function(indisubact) {
							angular.forEach(indisubact.submaterial, function(insub){
								var totqty = parseFloat(insub.storelevel1mat.qty_per_pole)*parseFloat($scope.thisfile.subsubactivity.thisactqtyy);
								indimap.submatarr.push({'matid':insub.material_level1_id, 'matname':insub.storelevel1mat.storematerial.name, 'msmatname':insub.storelevel1mat.msmat.name, 'qty_per_pole':insub.storelevel1mat.qty_per_pole, 'thisactqty':$scope.thisfile.subsubactivity.thisactqtyy, "totqty":totqty, "ere_code":insub.storelevel1mat.ere_code, "dwg_code":insub.storelevel1mat.dwg_code});
							});
						});
						indimap.actgridarr.push({"id":$scope.thisfile.subsubactivity.id, "qty":$scope.thisfile.subsubactivity.thisactqtyy, "name":$scope.thisfile.subsubactivity.name});
						checkmat++;
					}
				});
				if(checkmat == 0) {
					$scope.maptable.push({'matid':$scope.thisfile.submat.id, 'materialdesc':$scope.thisfile.submat.name, 'uom':$scope.thisfile.submat.units, 'qty':$scope.thisfile.thisqtyy, 'unitqty':$scope.thisfile.thisunitqty, 'actgroupcheck':$scope.thisfile.activitygroupcheck, 'actgridarr': actgridarr, 'submatarr':submatarr});
				}

			} else {
				$scope.maptable.push({'matid':$scope.thisfile.submat.id, 'materialdesc':$scope.thisfile.submat.name, 'uom':$scope.thisfile.submat.units, 'qty':$scope.thisfile.thisqtyy, 'unitqty':$scope.thisfile.thisunitqty, 'actgroupcheck':$scope.thisfile.activitygroupcheck, 'actgridarr': actgridarr, 'submatarr':submatarr});
			}
		}
	}


	$scope.removerow = function(key) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$scope.maptable.splice(key, 1);	
			$scope.$apply();	
			swal("Deleted!", "Material has been deleted.", "success"); 
		});


		
	}

	$scope.addtothisact = function() {

		$scope.thisfile.matmapped = angular.copy($scope.maptable);
		$("#AddMaterialModal").modal('hide');
		$scope.maptable = [];

	}

	$scope.removeactrow = function(key, filedsub) {

		swal({   title: "Are you sure you want to delete this activity?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			console.log(filedsub);

			filedsub.splice(key, 1);
			$scope.$apply();
			swal("Deleted!", "Your activity has been deleted.", "success"); 

		});

	}

	$scope.removeactgrp = function(pomat, key) {

		pomat.actgridarr.splice(key, 1);
	}

	$scope.editactivitytoproject = function() {

		$rootScope.showloader=true;
		flag=0;
		// for(var i=0;i<$scope.filedata.length;i++)
		// {
		// 	for(var j=0;j<$scope.filedata[i].sub.length;j++)
		// 	{
		// 		if($scope.filedata[i].sub[j].supply_rate==0)
		// 		{
		// 			swal('Please give supply rate for '+$scope.filedata[i].sub[j].srno);
		// 			flag=1;
		// 			break;
		// 		}
		// 	}
		// 	if(flag==1)
		// 	{
		// 		break;
		// 	}
		// }
		if(flag==1)
		{
			$rootScope.showloader=false;
		}
		else
		{
			 var resultcount = 0;
			for(var y=0; y<$scope.filedata.length; y++) {
				var filearr = [];
				filearr.push($scope.filedata[y]);
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/edit_activity_to_project',
					data:{filedata:filearr, projectid:$scope.projectid, schtype:$scope.schtype},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){

					

					console.log(result);

					if(result == 1) {
						resultcount++;
						if(resultcount == $scope.filedata.length) {
							$rootScope.showloader=false;
							swal({ 
							  title: "Success",
							   text: "Activity saved successfully.",
							    type: "success" 
							  },
							  function(){
							    location.reload();
							});
						}
					} else {
						$rootScope.showloader=false;
						swal("Something went wrong", "", "danger");
					}

				}).error(function(data,status){
					console.log(data+status);
					$rootScope.showloader=false;
					$rootScope.showerror=true;
					//Logging.validation(status);
				});

			}
		}

	}

	$scope.editmrow = function(pomat) {

		pomat['editactm'] = true;
	}
	$scope.savemrow = function(pomat) {

		pomat['editactm'] = false;
		var totalqt = parseFloat($scope.thisfile.thisqtyy)/parseFloat($scope.thisfile.thisunitqty)
		pomat['qty'] = angular.copy(parseFloat(totalqt)*parseFloat(pomat['unitqty']));
	}
});

app.controller("BoqReportController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
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

	$scope.getactivitydata = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_activity_mat_data',
			params:{projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.activitydata = result;
			console.log(result);			
		});

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/getsubprojboq',
			data:{projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			console.log(result);			
		});
	}

	$scope.editmatactivity = function(subactarr, matdet) {

		$rootScope.showloader=true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_activity_edit_data',
			data:{actidarr:subactarr, matid:matdet['id']},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.actmatdata = result;	
			console.log(result);	
			$("#EditActivityMaterialModal").modal("show");	
		});
	}

	$scope.savethismat = function(filein) {
		if(parseFloat(filein.matmapped[0]['editqty']) == parseFloat(filein.matmapped[0]['qty'])) {

			filein.editthismat = false;
		} else if(parseFloat(filein.matmapped[0]['editqty']) != parseFloat(filein.matmapped[0]['qty']) && !filein.matmapped[0]['editreason']) {

			swal("Please write reason for this change.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/edit_subschedule_mat',
				data:{actdet:filein},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				filein.editthismat = false;
				$scope.getactivitydata();
				console.log(result);	
			});

			
		}
	}


	$scope.savebudgetrate = function() {

		$rootScope.showloader=true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/save_budget_rate',
			data:{projectid:$scope.projectid, activitydata:$scope.activitydata},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			if(result == 1) {

				swal({ 
				  title: "Success",
				   text: "Budget rate saved successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
			} else {

				swal("Something went wrong", "", "danger");
			}
		});
	}

	$scope.addmattoact = function(matt) {

		$scope.thisfile = matt;
		// $("#AddMaterialModal").modal('show');
		$scope.maptable = [];
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_types',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.materials = result;
			$scope.thisfile.thisqtyy = angular.copy(matt.tot_qty);
			$scope.thisfile.thisunitqty = angular.copy(matt.unit_qty);
			console.log($scope.thisfile);
			if(matt.matmapped) {
				$scope.maptable = angular.copy(matt.matmapped);
			}
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

	}

	$scope.addtomaptable = function() {

		if(!$scope.thisfile.materialtype) {

			swal("Please select a material type.");
		} else if(!$scope.thisfile.submat) {

			swal("Please select a material.");
		} else if(!$scope.thisfile.thisqtyy) {

			swal("Please enter material quantity.");
		} else {

			$scope.maptable.push({'matid':$scope.thisfile.submat.id, 'materialdesc':$scope.thisfile.submat.name, 'uom':$scope.thisfile.submat.units, 'qty':$scope.thisfile.thisqtyy, 'unitqty':$scope.thisfile.thisunitqty});
			$scope.thisfile.materialtype = "";
			$scope.thisfile.submat = "";
		}
	}

	$scope.removerow = function(key) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$scope.maptable.splice(key, 1);	
			$scope.$apply();	
			swal("Deleted!", "Material has been deleted.", "success"); 
		});
	}

	$scope.addtothisact = function() {

		$scope.thisfile.matmapped = angular.copy($scope.maptable);
		$("#AddMaterialModal").modal('hide');
		$scope.maptable = [];
	}

	$scope.saveactivitymat = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/saveactivitymat',
			data:{actmatdata:$scope.actmatdata},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$scope.getactivitydata();
			$("#EditActivityMaterialModal").modal("hide");
			$rootScope.showloader=false;
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
	}


});


app.controller("RaiseIndentController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.indentmateriallist = [];

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
				'.chosen-select'           : {},
				'.chosen-select-deselect'  : {allow_single_deselect:true},
				'.chosen-select-no-single' : {disable_search_threshold:10},
				'.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
				'.chosen-select-width'     : {width:'95%'}
			}
			for (var selector in config2) {
				$(selector).chosen(config2[selector]);
			}
		});

	});

	$scope.getboqmaterials = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_boq_mat_data',
			params:{projectid:$(".chosen-select").val()},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			$scope.activitydata = result;			

		});
	}


	$scope.checktotalindent = function() {

		var totalindent = parseFloat($scope.indentmat.current_indent_qty)+parseFloat($scope.indentmat.total_indent_qty);
		if(totalindent > $scope.indentmat.qty) {

			$scope.indentmat.current_indent_qty = 0;

			swal("Total indent quantity cannot be greater than the total BOQ quantity.");
		}
	}

	$scope.addtoindenttable = function() {

		if(!$scope.indentmat.current_indent_qty) {

			swal("Please enter current indent quantity");
		} else if(!$scope.indentmat.buy_by) {

			swal("Please buy by date");
		} else {

			$scope.indentmateriallist.push({"boq_material_id":$scope.indentmat.id, "name":$scope.indentmat.material.name, "total_boq_qty":$scope.indentmat.qty, "total_indent_qty":$scope.indentmat.total_indent_qty, "current_indent_qty":$scope.indentmat.current_indent_qty, "buy_by":$scope.indentmat.buy_by  });

			$scope.indentmat = [];
		}
	}

	$scope.removerow  = function(key) {

		$scope.indentmateriallist.splice(key, 1);
	}

	$scope.addtoindent = function() {


		$rootScope.showloader=true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/insert_indent',
			data:{projectid:$(".chosen-select").val(), indentmaterials:$scope.indentmateriallist},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			if(result == 1) {

				swal({ 
				  title: "Success",
				   text: "Indent raised successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
			} else {

				swal("Something went wrong", "", "danger");
			}			

		});
	}


});

app.controller("CopyActivitiesController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);


	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.projectlist = result;

	});

	$scope.copyactivity = function() {

		if(!$scope.sourceprojectid){

			swal("Please select source project.");
		} else if(!$scope.destprojectid){

			swal("Please select destination project.");
		} else {

			$rootScope.showloader = true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/copyactivity',
				params:{sourceprojectid:$scope.sourceprojectid, destprojectid:$scope.destprojectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;

				console.log(result);

				if(result == 0) {

					swal("Activity already exists for the destination project.", "", "error");
				} else if(result == 2) {

					swal("No activities to copy from source project.", "", "error");
				} else {

					swal("Activities copied successfully.", "", "success");
				}

			});
		}
	}


});

app.controller("ActivitySheetController",function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.dateconv = function(datethis){

		return Dates.getDate(datethis);
	}

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

	$scope.mainactivityinfo = [];

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$scope.projectlist = result;
	});

	// $scope.addmattoact = function(matt) {

		
	// 	console.log("x");
	// 	console.log(matt);
	// 	$scope.thisfile = matt;
	// 	$("#AddMaterialModal").modal('show');
	// 	$scope.maptable = [];
	// 	if(matt.matmapped) {
	// 		$scope.maptable = angular.copy(matt.matmapped);
	// 	}

	// }

	$scope.saveeditmat = function(pomat) {

		pomat.editindimat=false;
		var totindi =0;
		angular.forEach(pomat.projqty, function(indiq){
			indiq['indiqtycurrentindent'] = angular.copy(indiq['indiqtycurrentindentpre']);

			totindi = angular.copy(parseFloat(totindi)+parseFloat(indiq['indiqtycurrentindentpre']));
		});
		pomat.totalprojqty = angular.copy(totindi);
		$scope.thisfile.tot_qty = angular.copy(totindi);
		
	}

	$scope.get_boq_file_info=function(){
		$scope.mainactivityinfo = [];
		$scope.activityinfo = [];

		if(!$scope.projectid) {

			swal("please select project.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_boq_edit_data',
				params:{projectid:$scope.projectid, schtype:1},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(indata){
				$rootScope.showloader=false;
				console.log(indata);
				$scope.activitylist = indata;

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
							submultiplier[x] = {};
							submultiplier[x]['multiplier_name'] = subpmulti.multiplier_name;
							x++;

						});
					});
					$scope.submultiplier = angular.copy(submultiplier);

					
				});
				
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				//Logging.validation(status);
			});

		}


	}
	$scope.addtothisact = function() {

		$scope.thisfile.matmapped = angular.copy($scope.maptable);
		console.log($scope.thisfile.matmapped);
		$("#AddMaterialModal").modal('hide');
		$scope.maptable = [];

	}

	$scope.addactivitiytotable = function() {

		$scope.mainactivityinfo.push($scope.activityinfo);
		$scope.activityinfo = "";
		console.log($scope.mainactivityinfo);
	}

	$scope.addmattoact = function(matt) {

		$scope.thisfile = matt;
		
		$("#AddMaterialModal").modal('show');
		$scope.maptable = [];
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_types',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.materials = result;
			$scope.thisfile.thisqtyy = angular.copy(matt.tot_qty);
			$scope.thisfile.thisunitqty = angular.copy(matt.unit_qty);
			if(matt.matmapped) {
				$scope.maptable = angular.copy(matt.matmapped);
				console.log($scope.maptable);
				angular.forEach($scope.maptable, function(indimap) {

					angular.forEach(indimap.projqty, function(inmap){

						inmap['indiqtycurrentindentpre'] = angular.copy(inmap['currentindentqty']);
					});
				});
				
			}
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

	}

	$scope.matindiindenthange = function(indiq) {
		console.log(indiq);

		var totq = parseFloat(indiq['indiqtycurrentindentpre'])+parseFloat(indiq['total_indent_qty']);
		if(totq > parseFloat(indiq['qty'])) {

			swal("Indent quantity cannot be greater than the max limit.");
			indiq['indiqtycurrentindentpre'] = 0;
		}
	}

	$scope.addtomaptable = function() {

		if(!$scope.thisfile.materialtype) {

			swal("Please select a material type.");
		} else if(!$scope.thisfile.submat) {

			swal("Please select a material.");
		} else if(!$scope.thisfile.thisqtyy) {

			swal("Please enter material quantity.");
		} else {

			$scope.maptable.push({'matid':$scope.thisfile.submat.id, 'materialdesc':$scope.thisfile.submat.name, 'uom':$scope.thisfile.submat.units, 'qty':$scope.thisfile.thisqtyy, 'unitqty':$scope.thisfile.thisunitqty});
			$scope.thisfile.materialtype = "";
			$scope.thisfile.submat = "";
		}
	}

	$scope.removerow = function(key) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$scope.maptable.splice(key, 1);	
			$scope.$apply();	
			swal("Deleted!", "Material has been deleted.", "success"); 
		});		
	}

	$scope.removeact = function(key) {

		swal({   title: "Are you sure you want to delete this activity?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$scope.mainactivityinfo.splice(key, 1);
			$scope.$apply();
			swal("Deleted!", "Your activity has been deleted.", "success"); 

		});

	}

	$scope.calculateallvariables = function(indiq) {

		// var pendingqty = indiq['indiqty']-indiq['total_indent_qty'];
		// if(indiq['indiqtycurrentindent'] > pendingqty) {

		// 	swal("Indent quantity cannot be greater than the pending LOA quantity.");
		// 	indiq['indiqtycurrentindent'] = 0;
		// }
		console.log($scope.activityinfo);
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/calculateactivityvar',
			data:{activityinfo:$scope.activityinfo, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			if(indata == 0) {

				swal("One or more material's indent quantity for project/sub project exceeded the max LOA quantity.");
			} else {
				$scope.activityinfo = angular.copy(indata);
				console.log(indata);
			}
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
	
	}

	$scope.changeindiqty = function(filein) {

		var totalsubqty = 0;

		angular.forEach(filein.qty,function(inqty){

			totalsubqty += parseFloat(inqty['indiqty']);
		});

		angular.forEach(filein.matmapped,function(inmat){

			inmat.qty = totalsubqty;
		});

		filein.tot_qty = totalsubqty;
	}

	$scope.generatesampleboq = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/generatesmapleboq',
			data:{activityinfo:$scope.mainactivityinfo, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			$scope.activitydata = indata;
			$("#BoqModal").modal("show");
			console.log(indata);
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
	}

	$scope.saveindent = function() {

		if(!$scope.buy_from) {

			swal("Please select a buy from date.");
		} else if(!$scope.buy_to) {

			swal("Please select a buy before date.");
		} else if($scope.buy_from > $scope.buy_to) {

			swal("Buy from date cannot be greater than to date.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/saveindent',
				data:{activityinfo:$scope.mainactivityinfo, projectid:$scope.projectid, buy_from:$scope.buy_from, buy_to:$scope.buy_to, actdata:$scope.activitydata},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(indata){
				$rootScope.showloader=false;
				console.log(indata);	
				$scope.indentinf = indata;
				$("#BoqModal").modal("show");
		
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				//Logging.validation(status);
			});
			$scope.generatesampleboq();	
		}
	}



});

app.controller('PlanningWorkOrderController',function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	$scope.project={};
	$scope.project.type='work';
	$scope.create_workorder=function(){
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_workorder',
			data:$scope.project,
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).success(function(result){
			$scope.project={};
			swal('Work Order Created');
		});
	}
});

app.controller('PlanningCreateBoqController',function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_workorders',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.works=result;
	});

	$scope.get_workorder_data=function(){
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_workorder_data',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{workid:$scope.project.id}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.mats=result;
			$scope.mainproject=angular.copy($scope.project);
		});
	}

	$scope.removemat=function(submat){
		if(submat.indent_qty==0)
		{
			submat.showmat=false;
			submat.quantity=0;
			submat.indent_qty=0;
		}
		else
		{
			swal('You cannot remove this material');
		}

	}

	$scope.save_boq=function(){
		var flag=0;
		for(var i=0;i<$scope.mats.length;i++)
		{
			for(var j=0;j<$scope.mats[i].submaterials.length;j++)
			{
				if($scope.mats[i].submaterials[j].showmat)
				{
					if(parseFloat($scope.mats[i].submaterials[j].indent_qty)>parseFloat($scope.mats[i].submaterials[j].quantity))
					{
						swal('BOQ quantity is less than Indent quantity for '+$scope.mats[i].submaterials[j].name);
						flag=2;
						break;
					}
					else
					{
						flag=1;
					}
				}
			}
			if(flag==2)
			{
				break;
			}
		}
		if(flag==0)
		{
			swal('Please enter materials to add to BOQ');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/save_work_boq',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{workid:$scope.mainproject.id,mats:$scope.mats}
			}).success(function(result){
				$rootScope.showloader=false;
				swal('BOQ saved');
			});
		}
	}

	$scope.addtotable=function(){
		$scope.submat.showmat=true;
		$scope.submat.quantity=0;
		$scope.submat.indent_qty=0;
		$scope.submat.boquom=angular.copy($scope.matuom);
		$scope.materialtype="";
		$scope.submat="";
		$scope.matuom='';
	}

	$scope.hidemat=function(mat)
	{
		if(mat.showmat)
		{
			return false;
		}
		else {
			return true;
		}
	}

	$scope.showmat=function(mat)
	{
		if(mat.showmat)
		{
			return true;
		}
		else {
			return false;
		}
	}

	$scope.showcat=function(cat)
	{
		var flag=0;
		for(var i=0;i<cat.submaterials.length;i++)
		{
			if(cat.submaterials[i].showmat)
			{
				flag=1;
				break;
			}
		}
		if(flag==1)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
});

app.controller('PlanningEditIndentController',function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_workorder_indents',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.works=result;
	});

	$scope.addtotable=function(){
		if(parseFloat($scope.mainmat.newindentqty)+parseFloat($scope.mainmat.indent_qty)>parseFloat($scope.mainmat.quantity))
		{
			swal('Please check your total indent quantity');
		}
		else
		{
			$scope.mainmat.added=true;
			$scope.mainmat.mainqty=angular.copy($scope.mainmat.newindentqty);
			$scope.mainmat="";
		}
	}

	$scope.get_workorder_data=function(){
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_workorder_indent_details',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{indentid:$scope.indent.id}
		}).success(function(result){
			$scope.mats=result;
			// console.log(result);
			console.log(result);
		});
	}

	$scope.hidemat=function(mat)
	{
		if(mat.added)
		{
			return false;
		}
		else {
			return true;
		}
	}

	$scope.showmat=function(mat)
	{
		if(mat.added)
		{
			return true;
		}
		else {
			return false;
		}
	}


	$scope.removemat=function(mat){
		mat.added=false;
	}

	$scope.showtable=function(){
		if($scope.mats)
		{
			var flag=0;
			for(var i=0;i<$scope.mats.length;i++)
			{
				if($scope.mats[i].added)
				{
					flag=1;
					break;
				}
			}
			if(flag==1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
});

app.controller('PlanningWorkIndentController',function($scope,$http,$rootScope,$state,Logging,$timeout, Commas,Dates){
	$rootScope.showloader=true;
	$scope.works=[];
	$scope.lock_work=false;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_workorders',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.works=result;
	});

	$scope.get_workorder_data=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_workorder_details',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{workid:$scope.works}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.lock_work=true;
			$scope.mats=result;
			console.log(result);
		});
	}

	$scope.addworkorder=function(){
		$scope.project.added=true;
		$scope.project="";
	}

	$scope.removework=function(work){
		work.added=false;
	}

	$scope.hidework=function(work)
	{
		if(work.added)
		{
			return false;
		}
		else {
			return true;
		}
	}

	$scope.showwork=function(work)
	{
		if(work.added)
		{
			return true;
		}
		else {
			return false;
		}
	}

	$scope.show_work_table=function(){
		var flag=0;
		for(var i=0;i<$scope.works.length;i++)
		{
			if($scope.works[i].added)
			{
				return true;
			}
		}
		return false;
	}

	$scope.saveindent=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/save_work_indent',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{indent:$scope.indent,mats:$scope.mats}
		}).success(function(result){
			// $rootScope.showloader=false;
			// console.log(result);
			swal('Indent Raised');
			window.location.reload();
		});
	}

	$scope.hidemat=function(mat)
	{
		if(mat.added)
		{
			return false;
		}
		else {
			return true;
		}
	}

	$scope.showmat=function(mat)
	{
		if(mat.added)
		{
			return true;
		}
		else {
			return false;
		}
	}

	$scope.removemat=function(mat){
		mat.added=false;
	}

	$scope.showmainmat=function(mat){		
		for(var i=0;i<mat.workdata.length;i++)
		{
			if(mat.workdata[i].added)
			{
				return true;
			}
		}
		return false;
	}

	$scope.hidemainmat=function(mat){		
		for(var i=0;i<mat.workdata.length;i++)
		{
			if(!mat.workdata[i].added)
			{
				return true;
			}
		}
		return false;
	}

	$scope.showtable=function(){
		if($scope.mats)
		{
			var flag=0;
			for(var i=0;i<$scope.mats.length;i++)
			{
				for(var j=0;j<$scope.mats[i].workdata.length;j++)
				{
					if($scope.mats[i].workdata[j].added)
					{
						flag=1;
						break;
					}
				}
				if(flag==1)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			if(flag==1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	$scope.totqty=function(mat)
	{
		var tot=0.000;
		for(var i=0;i<mat.workdata.length;i++)
		{
			if(mat.workdata[i].added)
			{
				tot=tot+parseFloat(mat.workdata[i].quantity);
			}
		}
		return tot;
	}

	$scope.totiqty=function(mat)
	{
		var tot=0.000;
		for(var i=0;i<mat.workdata.length;i++)
		{
			if(mat.workdata[i].added)
			{
				tot=tot+parseFloat(mat.workdata[i].indent_qty);
			}
		}
		return tot;
	}

	$scope.totmqty=function(mat)
	{
		var tot=0.000;
		for(var i=0;i<mat.workdata.length;i++)
		{
			if(mat.workdata[i].added)
			{
				tot=tot+parseFloat(mat.workdata[i].mainqty);
			}
		}
		return tot;
	}

	$scope.addtotable=function(){
		if(parseFloat($scope.mainwork.newindentqty)+parseFloat($scope.mainwork.indent_qty)>parseFloat($scope.mainwork.quantity))
		{
			swal('Please check your total indent quantity');
		}
		else
		{
			$scope.mainwork.added=true;
			$scope.mainwork.mainqty=angular.copy($scope.mainwork.newindentqty);
			$scope.mainwork="";
		}
	}
});

app.controller("UploadSupplyRateController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.generate_supply_rate_file = function() {

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/generate_supply_rate_file',
			params:{projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$scope.hidedownload = false;
			$scope.filepath = result;
			$rootScope.showloader=false;
		});
	}
	$scope.uploadsupplyfile=function(files){

		//console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.Updatesupplyrate=function(){

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
				'filepath':'uploads/supplyrates'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$scope.filedat = [];
				if(data[0] == "success") {
					$scope.filenamesupply = data[1];
					$http({
						method:'GET',
						url:$scope.requesturl+'/update_supply_file_data',
						params:{filename:$scope.filenamesupply},
						headers:{'JWT-AuthToken':localStorage.pmstoken}
					}).
					success(function(indata){
						$rootScope.showloader=false;
						$scope.filedata = indata;						
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
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

	$scope.savesupplyrate=function(){

		if(!$scope.filedata)
		{
			swal('Upload file.');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/savesupplyrate',
				data:{filename:$scope.filenamesupply},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(indata){
				$rootScope.showloader=false;
				swal({ 
				  title: "Success",
				   text: "Supply rates uploaded successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
				
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

});
app.controller("UploadIndentController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.dateconv = function(datethis){

		return Dates.getDate(datethis);
	}

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

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.uploadindentfile=function(files){

		//console.log(files[0]);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.getindentdata=function(){

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.fd)
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
				'filepath':'uploads/indents'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$scope.filedat = [];
				if(data[0] == "success") {
					$scope.filenameindent = data[1];
					$http({
						method:'POST',
						url:$scope.requesturl+'/get_indent_file_data',
						data:{filename:$scope.filenameindent, projectid:$scope.projectid, schtype:1},
						headers:{'JWT-AuthToken':localStorage.pmstoken}
					}).
					success(function(indata){
						$scope.activityinfo = indata		

						$http({
							method:'POST',
							url:$scope.requesturl+'/calculateactivityvarall',
							data:{activityinfo:$scope.activityinfo, projectid:$scope.projectid},
							headers:{'JWT-AuthToken':localStorage.pmstoken}
						}).
						success(function(inindata){
							$scope.mainactivityinfo = angular.copy(inindata);
							$http({
								method:'POST',
								url:$scope.requesturl+'/generatesmapleboq',
								data:{activityinfo:$scope.mainactivityinfo, projectid:$scope.projectid},
								headers:{'JWT-AuthToken':localStorage.pmstoken}
							}).
							success(function(indata){
								$rootScope.showloader=false;
								$scope.activitydata = indata;
								$("#BoqModal").modal("show");
							}).error(function(data,status){
								console.log(data+status);
								$rootScope.showloader=false;
								//Logging.validation(status);
							});
							

							
						}).error(function(data,status){
							console.log(data+status);
							$rootScope.showloader=false;
							//Logging.validation(status);
						});
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
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

	$scope.saveindent = function() {

		
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/saveindent',
			data:{activityinfo:$scope.mainactivityinfo, projectid:$scope.projectid, buy_from:$scope.buy_from, buy_to:$scope.buy_to, actdata:$scope.activitydata},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
		}).
		success(function(indata){
			$rootScope.showloader=false;
			console.log(indata);	
			swal("Indent raised successfully", "","success");
			$scope.indentinf = indata;
	
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			//Logging.validation(status);
		});
		
	}


});

app.controller("ActivityGroupingController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.pomateriallistnew = {};
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

	$scope.projectchange = function() {

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

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_activity_group_list',
			params:{projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.actgrplist = result;
		});

	}
	$scope.matchange = function() {
		
		if($scope.submat.type!=1) {
			angular.forEach($scope.submat.level1mat, function(indimat){

				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});

			$scope.selectall = true;
		}
	}

	$scope.selectallclick = function() {

		var checkselect = !$scope.isselectallsub();
		angular.forEach($scope.submat.level1mat, function(indimat){

			indimat.selected = checkselect;
		});
	}

	$scope.isselectallsub = function(){

		if($scope.submat) {

			var countselect = 0;

			angular.forEach($scope.submat.level1mat, function(indimat){

				if(indimat.selected) {

					countselect++;
				}
			});

			if($scope.submat.level1mat.length == countselect) {

				return true;
			} else {

				return false;
			}
		}
	}


	$scope.addtotable = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.activityname) {

			swal("Please enter activity name.");
		}
		else if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.quantity && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.quantity) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.uomval) {

			swal("Please select a uom.");
		} else {
			
			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if($scope.submat.id == inmat.id) {

						inmat.showmat = true;
					}
				});
			});

			$rootScope.showloader=true;

			if($scope.submat.type != 1) {
				var uomcount = 1, qtycount = 1;

				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						if(!indimat.uom) {

							uomcount=0;
						}
						if(!indimat.qtythis || indimat.qtythis == 0) {

							qtycount=0;
						}

					}

				});

				if(uomcount == 0) {

					swal("Please select UOM for all selected materials.");
				} else if(qtycount == 0){

					swal("Please enter quantity for all selected materials.");
				} else {

					var pomatlen = Object.keys($scope.pomateriallistnew).length;
					pomatlen += 1;

					$scope.pomateriallistnew[pomatlen] = {};

					$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
					$scope.pomateriallistnew[pomatlen]['materialid'] = $scope.submat.id;
					$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;
					
					$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.uomval.id;
					if($scope.submat.type == 3){

						$scope.pomateriallistnew[pomatlen]['quantity'] = $scope.quantity;
					} else {

						$scope.pomateriallistnew[pomatlen]['quantity'] = "";
					}
					$scope.pomateriallistnew[pomatlen]['materials'] = [];					
					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected){
							var mname = "";
							if(indimat.msmat) {

								mname = indimat.msmat.name;
							}
							$scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "materialid":indimat.storematerial.id, "level1matid":indimat.id, "qty_per_pole":indimat.qty_per_pole, "wt_per_pole":indimat.wt_per_pole, "msmatname":mname});
						}

					});
					$scope.materialtype = "";
					$scope.submat = "";
				}

			} else {

				if(!$scope.pomateriallistnew[0]) {

					$scope.pomateriallistnew[0] = {};
					$scope.pomateriallistnew[0]['type'] = $scope.submat.type;
					$scope.pomateriallistnew[0]['materials'] = [];
				}
				$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.uomval.stmatuom.uom, "uomid":$scope.uomval.id, "qty":$scope.quantity, "materialid":$scope.submat.id});
				$scope.materialtype = "";
				$scope.submat = "";
			}	
			$rootScope.showloader=false;			
		}

	}

	$scope.saveactivitygroup = function() {

		if(!$scope.pomateriallistnew) {

			swal("Please add atleast one material to the activity.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/saveactivitygroup',
				data:{projectid:$scope.projectid, matlist:$scope.pomateriallistnew, activityname:$scope.activityname},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);

				if(result == 1) {

					swal({ 
					  title: "Success",
					   text: "Activity group added successfully.",
					    type: "success" 
					  },
					  function(){
					    location.reload();
					});
					
				}

			});
		}
	}

});

app.controller("ScheduleMaterialsController",function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$scope.dateconv = function(datethis){

		return Dates.getDate(datethis);
	}

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

	$scope.mainactivityinfo = [];

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$scope.projectlist = result;
	});

	$scope.get_boq_file_info=function(){
		$scope.mainactivityinfo = [];
		$scope.activityinfo = [];

		if(!$scope.projectid) {

			swal("please select project.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_boq_edit_data',
				params:{projectid:$scope.projectid, schtype:1},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(indata){
				$rootScope.showloader=false;
				console.log(indata);
				$scope.activitylist = indata;

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
							submultiplier[x] = {};
							submultiplier[x]['multiplier_name'] = subpmulti.multiplier_name;
							x++;

						});
					});
					$scope.submultiplier = angular.copy(submultiplier);

					
				});
				
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				//Logging.validation(status);
			});

		}


	}

	
});


app.controller("RaiseIndentNonBillableController",function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.dateconv = function(datethis){

		return Dates.getDate(datethis);
	}

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

		$scope.projectlist = result;
		$rootScope.showloader=false;
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$scope.materials = result;
		$rootScope.showloader=false;
		
	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});
	$scope.matchange = function() {

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_indent',
			params:{projectid:$scope.projectid, matid:$scope.submat.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$scope.submat.totalindentraised = result[0];
			$scope.submat.tobepurchased = result[1];
			$rootScope.showloader=false;
			
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.savenonbillindent = function() {

		if(!$scope.submat.currentindentqty) {

			swal("Please enter current indent qty.");
		} else {

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/savenonbillindent',
				data:{projectid:$scope.projectid, matdet:$scope.submat},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.matchange();
				$scope.submat.currentindentqty = 0;
				swal("Indent raised successfully.", "", "success");
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}
	
});
