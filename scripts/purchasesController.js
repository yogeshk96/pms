app.controller("PurchasesHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
});
app.controller("PurchasesVendorRegistrationController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.vendor = [];
	$scope.materialtype = 'select';
	$scope.submaterials = [];
	$scope.vendor.materialvalues = [];
	$scope.vendor.type = 0;
	$scope.vendor.accountdetails = [];
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.materials = result;
	});
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.vendorlist = result;
	});
	$scope.toggleSelection = function toggleSelection(sub) {

		if(sub.type == 1 || sub.type == 3) {
		    var idx = $scope.vendor.materialvalues.indexOf(sub.id);
		    // is currently selected
		    if (idx > -1) {
		      $scope.vendor.materialvalues.splice(idx, 1);
		    }
		    // is newly selected
		    else {
		      $scope.vendor.materialvalues.push(sub.id);
		    }
		} else {

			if(sub.level1mat.length > 0) {

				angular.forEach(sub.level1mat, function(inlevelmat){
					
					inlevelmat.selected = true;
					var idx = $scope.vendor.materialvalues.indexOf(inlevelmat.storematerial.id);
				    // is currently selected
				    if (idx > -1) {

				      $scope.vendor.materialvalues.splice(idx, 1);
				    }
				    // is newly selected
				    else {
				      $scope.vendor.materialvalues.push(inlevelmat.storematerial.id);
				    }
				});
			}
		}
	};

	$scope.addmaterialbox = function() {

		$rootScope.showloader=true;
		var x = 0;
		angular.forEach($scope.submaterials,function(subm){
					
				if(subm.id == $scope.materialtype.id) {

					x=1;
				}
		});
		if(x==0) {
			$scope.submaterials.unshift($scope.materialtype);	
		}
		$rootScope.showloader=false;
	}

	$scope.matfilter = function(smat){

		if(smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)){

			return true;
		} else {

			return false;
		}
	}

	$scope.registervendor = function() {

		if(!$scope.vendor.name) {

			swal("Please enter vendor name.");
		} else if(!$scope.vendor.email && !$scope.vendor.email2) {

			swal("Please enter atleast one Email ID.");
		} else if(!$scope.vendor.contact_person) {

			swal("Please enter contact person name.");
		} else if(!$scope.vendor.phoneno && !$scope.vendor.phoneno2) {

			swal("Please enter atleast one phone number.");
		} else if(!$scope.vendor.address) {

			swal("Please enter vendor address.");
		} else if($scope.vendor.materialvalues.length == 0) {

			swal("Please select a material type.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/put_vendor_info',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{name:$scope.vendor.name, email:$scope.vendor.email,email2:$scope.vendor.email2, phoneno: $scope.vendor.phoneno, phoneno2:$scope.vendor.phoneno2, address:$scope.vendor.address, materialvalues:$scope.vendor.materialvalues, type:$scope.vendor.type, cin:$scope.vendor.cin, tin:$scope.vendor.tin, pan:$scope.vendor.pan, contact_person:$scope.vendor.contact_person, servicetaxno:$scope.servicetaxno, accountdetails:$scope.vendor.accountdetails, vat:$scope.vendor.vat, cst:$scope.vendor.cst, excise_registration_no:$scope.vendor.excise_registration_no }
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Vendor code already exists.", "", "warning");

				} else {

					swal("Vendor registered successfully!", "", "success");
					window.location.reload();
				}
				
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

		}
	}

	$scope.addaccountdetails = function() {

		if(!$scope.accountno) {

			swal("Please enter bank account number.");
		} else if(!$scope.ifsccode) {

			swal("Please enter IFSC code.");
		} else if(!$scope.bankname) {

			swal("Please enter bank name.");
		} else if(!$scope.bankbranch) {

			swal("Please enter bank branch.");
		} else {

			$scope.vendor.accountdetails.push({"bank_name":$scope.bankname, "bank_branch":$scope.bankbranch, "ifsc_code":$scope.ifsccode, "account_number":$scope.accountno});

			$scope.accountno= "";
			$scope.bankname = "";
			$scope.bankbranch = "";
			$scope.ifsccode = "";
		}
	}

	$scope.removeacrow = function(key) {

		$scope.vendor.accountdetails.splice(key, 1);
	}

	$scope.selectall = function(submat){
		if(submat.submaterials && submat.submaterials.length){
			var x = !$scope.isallselected(submat);
			
			angular.forEach(submat.submaterials,function(sm){
				
				sm.selected = x;
				if(sm.parent_id == 0 || sm.parent_id == sm.id) {
					$scope.toggleSelection(sm);
				}
			});
		}else{
			return false;
		}
	};

	$scope.isallselected = function(submat){
		if(submat.submaterials && submat.submaterials.length){
			var count = 0;
			angular.forEach(submat.submaterials,function(sm){
				if(sm.selected){
					count++;
				}
			});
			if(count == submat.submaterials.length){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	};

});

app.controller("PurchasesSendEnquiryController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.materialtype = 'select';
	$scope.materialtypedata = false;
	$scope.attachmenttype = 'same';
	$scope.enquirytype = "normal";
	$scope.selectedvalues = [];
	$scope.enqmateriallist = [];
	$scope.materialvendorslist = [];
	$scope.materialvendorslistli = [];
	$scope.fd = [];
	$scope.sameattachementdocs = [];
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.materials = result;
		
	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
	});

	$scope.changeattachmenttype = function() {

		$scope.sameattachementdocs = [];
	}


	$scope.uploadsameattachment=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd.push({"formdata":formdata, "filetype":files[0].type});
		$scope.sameattachementdocs.push({'doc_name':files[0].name});
		document.getElementById('file_sameattachment').value=null;
		
	}

	$scope.removevenenqdoc = function(parentkey, key, path) {

		swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/removesysdocs',
				data:{path:path},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){

				$scope.materialvendorslist[parentkey]['enqdocs'].splice(key, 1);
				swal("File deleted", "", "success");
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		});
	}

	$scope.uploaddifferentattachment=function(element, vendor){

		$scope.$apply(function(scope) {
	        var enqfile = element.files[0];
	        var formdata = new FormData();
			formdata.append('file', enqfile);
			$rootScope.showloader = true;
	    	$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:formdata,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/enquirydocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$scope.filedat = [];
				$rootScope.showloader = false;
				if(data[0]=='success')
				{

					if(!vendor.enqdocs) {

						vendor.enqdocs = [];
					}
					vendor.enqdocs.push({'doc_url':$scope.requesturl+'/uploads/enquirydocs/'+data[1], 'doc_name':data[2]+"."+data[4], 'mime_type':enqfile.type});

					$('.file_differentattachment').val(null);
					
				}
				else
				{
					$rootScope.showloader=false;
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
	    });	
	}

	$scope.matchange = function() {

		if($scope.submat.type==2) {

			$scope.quantity = 1;
			angular.forEach($scope.submat.level1mat, function(indimat){

				indimat.qtythis = angular.copy(indimat.qty);
				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});
			$scope.selectallmat = true;
		}
	}

	$scope.remove_sameattachmentdoc = function(key) {

		$scope.sameattachementdocs.splice(key, 1);
		$scope.fd.splice(key, 1);
	}

	$scope.matfilter = function(smat){

		if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			return true;
		} else {

			return false;
		}
	}
	$scope.getgoodscost = function() {

		angular.forEach($scope.submat.level1mat, function(indimat){

			if(indimat.selected) {

				indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty);
			}
		});
	}
	$scope.sendenquirypre=function(){

		if($scope.selectedvalues.length == 0) {

			swal("Please select atleast one vendor.");
		} else if(!$scope.subject) {

			swal("Please enter subject.");
		} else if(!$scope.emailcontent) {

			swal("Please enter email content.");
		} else {

			$rootScope.showloader=true;

			if($scope.fd.length == 0) {

					$rootScope.showloader=false;

					$scope.sendenquiry();

			} else {

				angular.forEach($scope.fd,function(filedata){
								
					$http({
						method:'POST',
						url:$scope.requesturl+'/uploaddocs',
						data:filedata.formdata,
						headers:{'Content-Type': undefined,
						'JWT-AuthToken':localStorage.pmstoken,
						'filepath':'uploads/enquirydocs'},
						transformRequest: function(data) {return data;}
					}).
					success(function(data){
						$scope.filedat = [];
						
						if(data[0]=='success')
						{

							angular.forEach($scope.selectedvalues,function(venlist){
								if(!venlist.enqdocs) {

									venlist.enqdocs = [];
								}

								venlist.enqdocs.push({'doc_url':$scope.requesturl+'/uploads/enquirydocs/'+data[1], 'doc_name':data[2]+"."+data[4], 'mime_type':filedata.filetype});
							});

							if($scope.selectedvalues[0].enqdocs.length == $scope.fd.length) {

								$rootScope.showloader=false;

								$scope.sendenquiry();
							}
							
						}
						else
						{
							$rootScope.showloader=false;
							swal(data[1]);
						}
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
					});

				});

			}

		}
			
	}
	$scope.toggleSelection = function(vendor) {

		var vendorcheck = -1;

		if($scope.selectedvalues.length == 0) {

			$scope.selectedvalues.push(vendor);
		} else {

			for(var i=0; i<$scope.selectedvalues.length; i++) {


				if($scope.selectedvalues[i]['id'] == vendor.id) {
					vendorcheck = i;
				}
			}

			if(vendorcheck == -1) {

				$scope.selectedvalues.push(vendor);
			} else {

				$scope.selectedvalues.splice(vendorcheck, 1);
			}
		}

	    if($("#selectall").attr("totcount") == $scope.selectedvalues.length) {

	    	$("#selectall").prop('checked', true);
	    } else {

	    	$("#selectall").prop('checked', false);
	    }
	};

	$scope.selectall = function() {
		
		if($("#selectall").prop('checked')) {

			$(".childcheckbox").prop('checked', true);
			$scope.selectedvalues = [];
			
			angular.forEach($scope.materialvendorslist,function(enqven){
						
				$scope.selectedvalues.push(enqven);
			});
		} else {
			$scope.selectedvalues = [];
			$(".childcheckbox").prop('checked', false);
		}
	}

	$scope.materialchange = function() {
		$scope.quantity = "";
		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.materialtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			$scope.submaterials = result.submaterials;
			$scope.submat = {'value':'select'};

		});
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
			if($scope.submat.level1mat) {

				if($scope.submat.level1mat.length == countselect) {

					return true;
				} else {

					return false;
				}
			}
		}
	}
	$scope.addmattotable = function() {
		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.quantity){

			swal("Please enter material quantity.");
		} else {
			$rootScope.showloader=true;

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if($scope.submat.id == inmat.id) {

						inmat.showmat = true;
					}
				});
			});

			var matidarr = [];

			if($scope.submat.type == 2){
				console.log($scope.submat);
				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected) {

						matidarr.push({'id':indimat.storematerial.id, 'quantity':indimat.qtythis, 'units':indimat.uom.stmatuom.uom, 'uomid':indimat.uom.id, 'name':indimat.storematerial.name});
					}
				});
			} else {

				matidarr.push({'id':$scope.submat.id, 'quantity':$scope.quantity, 'units':$scope.uomval.stmatuom.uom, 'uomid':$scope.uomval.id, 'name':$scope.submat.name});
			}
			

				$http({
					method:'POST',
					url:$rootScope.requesturl+'/get_material_vendors',
					data:{submatid:matidarr},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){

					$rootScope.showloader=false;
					$scope.materialvendors = result;
					if($scope.materialvendors.length == 0){

						swal("No vendors found for the selected material.");
					} else {

						for(var k=0;k<matidarr.length;k++) {

							$scope.enqmateriallist.push({"id":matidarr[k]['id'], "name":matidarr[k]['name'], "quantity":matidarr[k]['quantity'], "units":matidarr[k]['units'], "uomid":matidarr[k]['uomid']});
						}
						$scope.novendor = false;

						angular.forEach($scope.materialvendors,function(ven){

							angular.forEach(ven.materials,function(inven){
								if($scope.materialvendorslist.length == 0) {

									$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
									$scope.materialvendorslistli.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":"<li>"+inven.materials.name+"</li>", "matid":[inven.materials.id]});
								} else {

									var count = -1;

									for(var i = 0; i < $scope.materialvendorslist.length; i++) {
									   if($scope.materialvendorslist[i].id === ven.id) {
									   	 count = i;
									   }
									}

									if(count != -1) {

										$scope.materialvendorslist[count]['material'] = $scope.materialvendorslist[count]['material']+"=> "+inven.materials.name;
										$scope.materialvendorslistli[count]['material'] = $scope.materialvendorslistli[count]['material']+"<li> "+inven.materials.name+"</li>";
										$scope.materialvendorslist[count]['matid'].push(inven.materials.id);
										$scope.materialvendorslistli[count]['matid'].push(inven.materials.id);
									} else {

										$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
										$scope.materialvendorslistli.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":"<li>"+inven.materials.name+"</li>", "matid":[inven.materials.id]});
									}

								}
							});
						});

					}

				});
				$scope.submat = [];
				$scope.quantity = 0;			
		}
	}

	$scope.removeenqmat = function(j, enqmat) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materialvendorslist, function(inmatven){

				angular.forEach($scope.materials, function(inmattype2){

					angular.forEach(inmattype2.submaterials, function(inmat2){

						if(inmatven.matid == inmat2.id) {

							inmat2.showmat = false;
						}
					});
				});
			});
			var matlength = $scope.materialvendorslist.length;
			var iarr = [];
			for(var i = 0; i < matlength; i++) {

				if( $scope.materialvendorslist[i]['material'].indexOf("=> "+enqmat.name) != "-1"){

					 $scope.materialvendorslist[i]['material'] = $scope.materialvendorslist[i]['material'].replace("=> "+enqmat.name, "");
					 $scope.materialvendorslistli[i]['material'] = $scope.materialvendorslistli[i]['material'].replace(enqmat.name, "");
				} else if( $scope.materialvendorslist[i]['material'].indexOf(enqmat.name) != "-1"){

					 $scope.materialvendorslist[i]['material'] = $scope.materialvendorslist[i]['material'].replace(enqmat.name, "");
					 $scope.materialvendorslistli[i]['material'] = $scope.materialvendorslistli[i]['material'].replace(enqmat.name, "");
				}

				if( $scope.materialvendorslist[i]['material'] == "") {

					iarr.push(i);
				}
				var indexthis = $scope.materialvendorslist[i]['matid'].indexOf(enqmat.id);
				$scope.materialvendorslist[i]['matid'].splice(indexthis, 1);
				var indexthis = $scope.materialvendorslistli[i]['matid'].indexOf(enqmat.id);
				$scope.materialvendorslistli[i]['matid'].splice(indexthis, 1);
			}
			var count = 0;
			for(var k in iarr) {

				$scope.materialvendorslist.splice(iarr[k]-count, 1);
				$scope.materialvendorslistli.splice(iarr[k]-count, 1);
				
				count++;
			}
			$scope.enqmateriallist.splice(j, 1);

			$scope.$apply();
			swal("Material deleted.", "", "success");

		});

		
	}

	$scope.sendenquiry = function() {

		if(!$scope.cc) {

			$scope.cc="";
		}
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/sendenquiry',
			data:{subject:$scope.subject, emailcontent:$scope.emailcontent, vendorlist:$scope.selectedvalues, cc:$scope.cc, enqmateriallist:$scope.enqmateriallist, projectids:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			if(result != 0) {

				$scope.enqno = result['enqno'];
				if(result['failedmail'].length > 0) {
					var htm = "";

					for(var j=0; j<result['failedmail'].length;j++) {

						htm = htm+(j+1)+")"+result['failedmail'][j];
					}

					swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Enquiry No: "+result['enqno'], "warning");
				} else {

					swal("Enquiry sent", "Enquiry No: "+result['enqno'], "success");
				}
			}

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

		
	}

});




app.controller("PurchasesReSendEnquiryController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.materialtype = 'select';
	$scope.materialtypedata = false;
	$scope.attachmenttype = 'same';

	$scope.enquirytype = "resend";

	$scope.selectedvalues = [];
	$scope.enqmateriallist = [];
	$scope.materialvendorslist = [];
	$scope.materialvendorslistli = [];
	$scope.fd = [];
	$scope.sameattachementdocs = [];

	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.materials = result;
		
	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;

	});

	$scope.changeattachmenttype = function() {

		$scope.sameattachementdocs = [];
	}


	$scope.uploadsameattachment=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd.push({"formdata":formdata, "filetype":files[0].type});
		$scope.sameattachementdocs.push({'doc_name':files[0].name});
		document.getElementById('file_sameattachment').value=null;
		
	}

	$scope.removevenenqdoc = function(parentkey, key, path) {

		swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/removesysdocs',
				data:{path:path},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){

				$scope.materialvendorslist[parentkey]['enqdocs'].splice(key, 1);
				swal("File deleted", "", "success");
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			
		});
	}
	$scope.projectchange = function(){
		if(!$scope.projectid) {
			$scope.submat == "select";
			$scope.enqmateriallist= [];
			$scope.materialvendorslist = [];
			$scope.selectedvalues = [];
		} else {

			$rootScope.showloader=true;

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_project_enquiry_list',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.enquirylist = result;

			});
		}
		
	}

	$scope.getenquirydetails = function() {

		$scope.selectedvalues = [];
		$scope.enqmateriallist = [];
		$scope.materialvendorslist = [];
		$scope.fd = [];
		$scope.sameattachementdocs = [];

		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_enquiry_details_id_enq',
			params:{enqid:$scope.enquiryid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).success(function(result){
			$scope.enquirydetailsven = result[0];

			var matidarr = [], matcheckarr = [];
			angular.forEach($scope.enquirydetailsven, function(indimat) {

				angular.forEach(indimat.materials, function(inmat) {
					if(matcheckarr.indexOf(inmat.materialdetails.id) == -1) {
						matidarr.push({'id':inmat.materialdetails.id, 'quantity':inmat.quantity, 'units':inmat.storematuom.stmatuom.uom, 'uomid':inmat.store_material_uom_id, 'name':inmat.materialdetails.name});
						matcheckarr.push(inmat.materialdetails.id);
					}
				});
			});
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/get_material_vendors',
				data:{submatid:matidarr},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.materialvendors = result;
				if($scope.materialvendors.length == 0){

					swal("No vendors found for the selected material.");
				} else {

					for(var k=0;k<matidarr.length;k++) {

						$scope.enqmateriallist.push({"id":matidarr[k]['id'], "name":matidarr[k]['name'], "quantity":matidarr[k]['quantity'], "units":matidarr[k]['units'], "uomid":matidarr[k]['uomid']});
					}
					$scope.novendor = false;

					angular.forEach($scope.materialvendors,function(ven){

						angular.forEach(ven.materials,function(inven){
							if($scope.materialvendorslist.length == 0) {

								$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
								$scope.materialvendorslistli.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":"<li>"+inven.materials.name+"</li>", "matid":[inven.materials.id]});
							} else {

								var count = -1;

								for(var i = 0; i < $scope.materialvendorslist.length; i++) {
								   if($scope.materialvendorslist[i].id === ven.id) {
								   	 count = i;
								   }
								}

								if(count != -1) {

									$scope.materialvendorslist[count]['material'] = $scope.materialvendorslist[count]['material']+"=> "+inven.materials.name;
									$scope.materialvendorslistli[count]['material'] = $scope.materialvendorslistli[count]['material']+"<li>"+inven.materials.name+"</li>";
									$scope.materialvendorslist[count]['matid'].push(inven.materials.id);
									$scope.materialvendorslistli[count]['matid'].push(inven.materials.id);
								} else {

									$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
									$scope.materialvendorslistli.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":"<li>"+inven.materials.name+"</li>", "matid":[inven.materials.id]});
								}

							}
						});
					});

				}

			});
			$rootScope.showloader=false;
		}).error(function(result){
			$rootScope.showloader=false;
			console.log(result);

		});
	}

	$scope.uploaddifferentattachment=function(element, vendor){

		$scope.$apply(function(scope) {
	        var enqfile = element.files[0];
	        var formdata = new FormData();
			formdata.append('file', enqfile);
			$rootScope.showloader = true;
	    	$http({
				method:'POST',
				url:$scope.requesturl+'/uploaddocs',
				data:formdata,
				headers:{'Content-Type': undefined,
				'JWT-AuthToken':localStorage.pmstoken,
				'filepath':'uploads/enquirydocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){
				$scope.filedat = [];
				$rootScope.showloader = false;
				if(data[0]=='success')
				{

					if(!vendor.enqdocs) {

						vendor.enqdocs = [];
					}
					vendor.enqdocs.push({'doc_url':$scope.requesturl+'/uploads/enquirydocs/'+data[1], 'doc_name':data[2]+"."+data[4], 'mime_type':enqfile.type});

					$('.file_differentattachment').val(null);
					
				}
				else
				{
					$rootScope.showloader=false;
					swal(data[1]);
				}
			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
	    });

		
	}

	$scope.remove_sameattachmentdoc = function(key) {

		$scope.sameattachementdocs.splice(key, 1);
		$scope.fd.splice(key, 1);
	}

	$scope.matchange = function() {

		if($scope.submat.type==2) {

			$scope.quantity = 1;
			angular.forEach($scope.submat.level1mat, function(indimat){

				indimat.qtythis = angular.copy(indimat.qty);
				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});
			$scope.selectallmat = true;
		}
	}
	$scope.matfilter = function(smat){

		if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			return true;
		} else {

			return false;
		}
	}
	$scope.getgoodscost = function() {

		angular.forEach($scope.submat.level1mat, function(indimat){

			if(indimat.selected) {

				indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty);
			}
		});
	}

	$scope.sendenquirypre=function(){

		if($scope.selectedvalues.length == 0) {

			swal("Please select atleast one vendor.");
		} else if(!$scope.subject) {

			swal("Please enter subject.");
		} else if(!$scope.emailcontent) {

			swal("Please enter email content.");
		} else {

			$rootScope.showloader=true;

			if($scope.fd.length == 0) {

					$rootScope.showloader=false;

					$scope.sendenquiry();

			} else {

				angular.forEach($scope.fd,function(filedata){
								
					$http({
						method:'POST',
						url:$scope.requesturl+'/uploaddocs',
						data:filedata.formdata,
						headers:{'Content-Type': undefined,
						'JWT-AuthToken':localStorage.pmstoken,
						'filepath':'uploads/enquirydocs'},
						transformRequest: function(data) {return data;}
					}).
					success(function(data){
						$scope.filedat = [];
						
						if(data[0]=='success')
						{

							angular.forEach($scope.selectedvalues,function(venlist){
								if(!venlist.enqdocs) {

									venlist.enqdocs = [];
								}

								venlist.enqdocs.push({'doc_url':$scope.requesturl+'/uploads/enquirydocs/'+data[1], 'doc_name':data[2]+"."+data[4], 'mime_type':filedata.filetype});
							});

							if($scope.selectedvalues[0].enqdocs.length == $scope.fd.length) {

								$rootScope.showloader=false;

								$scope.sendenquiry();
							}
							
						}
						else
						{
							$rootScope.showloader=false;
							swal(data[1]);
						}
					}).error(function(data,status){
						console.log(data+status);
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
					});

				});

			}

		}
			
	}

	
	$scope.toggleSelection = function(vendor) {

		var vendorcheck = -1;

		if($scope.selectedvalues.length == 0) {

			$scope.selectedvalues.push(vendor);
		} else {

			for(var i=0; i<$scope.selectedvalues.length; i++) {


				if($scope.selectedvalues[i]['id'] == vendor.id) {
					vendorcheck = i;
				}
			}

			if(vendorcheck == -1) {

				$scope.selectedvalues.push(vendor);
			} else {

				$scope.selectedvalues.splice(vendorcheck, 1);
			}
		}

	    if($("#selectall").attr("totcount") == $scope.selectedvalues.length) {

	    	$("#selectall").prop('checked', true);
	    } else {

	    	$("#selectall").prop('checked', false);
	    }
	};

	$scope.selectall = function() {
		
		if($("#selectall").prop('checked')) {

			$(".childcheckbox").prop('checked', true);
			$scope.selectedvalues = [];
			
			angular.forEach($scope.materialvendorslist,function(enqven){
						
				$scope.selectedvalues.push(enqven);
			});
		} else {
			$scope.selectedvalues = [];
			$(".childcheckbox").prop('checked', false);
		}
	}

	$scope.materialchange = function() {
		$scope.quantity = "";
		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.materialtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			$scope.submaterials = result.submaterials;
			$scope.submat = {'value':'select'};

		});
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
			if($scope.submat.level1mat) {

				if($scope.submat.level1mat.length == countselect) {

					return true;
				} else {

					return false;
				}
			}
		}
	}
	$scope.addmattotable = function() {
		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.quantity){

			swal("Please enter material quantity.");
		} else {
			$rootScope.showloader=true;

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if($scope.submat.id == inmat.id) {

						inmat.showmat = true;
					}
				});
			});

			var matidarr = [];

			if($scope.submat.type == 2){

				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected) {

						matidarr.push({'id':indimat.storematerial.id, 'quantity':indimat.qtythis, 'units':indimat.uom.stmatuom.uom, 'uomid':indimat.uom.id, 'name':indimat.storematerial.name});
					}
				});
			} else {

				matidarr.push({'id':$scope.submat.id, 'quantity':$scope.quantity, 'units':$scope.uomval.stmatuom.uom, 'uomid':$scope.uomval.id, 'name':$scope.submat.name});
			}
			

				$http({
					method:'POST',
					url:$rootScope.requesturl+'/get_material_vendors',
					data:{submatid:matidarr},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){

					$rootScope.showloader=false;
					$scope.materialvendors = result;
					if($scope.materialvendors.length == 0){

						swal("No vendors found for the selected material.");
					} else {

						for(var k=0;k<matidarr.length;k++) {

							$scope.enqmateriallist.push({"id":matidarr[k]['id'], "name":matidarr[k]['name'], "quantity":matidarr[k]['quantity'], "units":matidarr[k]['units'], "uomid":matidarr[k]['uomid']});
						}
						$scope.novendor = false;

						angular.forEach($scope.materialvendors,function(ven){

							angular.forEach(ven.materials,function(inven){
								if($scope.materialvendorslist.length == 0) {

									$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
								} else {

									var count = -1;

									for(var i = 0; i < $scope.materialvendorslist.length; i++) {
									   if($scope.materialvendorslist[i].id === ven.id) {
									   	 count = i;
									   }
									}

									if(count != -1) {

										$scope.materialvendorslist[count]['material'] = $scope.materialvendorslist[count]['material']+"=> "+inven.materials.name;
										$scope.materialvendorslist[count]['matid'].push(inven.materials.id);
										$scope.materialvendorslistli[count]['material'] = $scope.materialvendorslistli[count]['material']+"<li>"+inven.materials.name+"</li>";
										$scope.materialvendorslistli[count]['matid'].push(inven.materials.id);
									} else {

										$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":inven.materials.name, "matid":[inven.materials.id]});
										$scope.materialvendorslist.push({"id":ven.id,"name":ven.name,"emailid":ven.emailid, "material":"<li>"+inven.materials.name+"</li>", "matid":[inven.materials.id]});
									}

								}
							});
						});

					}

				});
				$scope.submat = [];
				$scope.quantity = 0;			
		}
	}

	$scope.removeenqmat = function(j, enqmat) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materialvendorslist, function(inmatven){

				angular.forEach($scope.materials, function(inmattype2){

					angular.forEach(inmattype2.submaterials, function(inmat2){

						if(inmatven.matid == inmat2.id) {

							inmat2.showmat = false;
						}
					});
				});
			});
			var matlength = $scope.materialvendorslist.length;
			var iarr = [];
			for(var i = 0; i < matlength; i++) {

				if( $scope.materialvendorslist[i]['material'].indexOf("=> "+enqmat.name) != "-1"){

					$scope.materialvendorslist[i]['material'] = $scope.materialvendorslist[i]['material'].replace("=> "+enqmat.name, "");
					$scope.materialvendorslistli[i]['material'] = $scope.materialvendorslistli[i]['material'].replace(enqmat.name, "");
				} else if( $scope.materialvendorslist[i]['material'].indexOf(enqmat.name) != "-1"){

					$scope.materialvendorslist[i]['material'] = $scope.materialvendorslist[i]['material'].replace(enqmat.name, "");
					$scope.materialvendorslistli[i]['material'] = $scope.materialvendorslistli[i]['material'].replace(enqmat.name, "");
				}

				if( $scope.materialvendorslist[i]['material'] == "") {

					iarr.push(i);
				}
				var indexthis = $scope.materialvendorslist[i]['matid'].indexOf(enqmat.id);
				$scope.materialvendorslist[i]['matid'].splice(indexthis, 1);
				var indexthis = $scope.materialvendorslistli[i]['matid'].indexOf(enqmat.id);
				$scope.materialvendorslistli[i]['matid'].splice(indexthis, 1);
			}
			var count = 0;
			for(var k in iarr) {

				$scope.materialvendorslist.splice(iarr[k]-count, 1);
				$scope.materialvendorslistli.splice(iarr[k]-count, 1);
				
				count++;
			}
			$scope.enqmateriallist.splice(j, 1);

			$scope.$apply();
			swal("Material deleted.", "", "success");

		});

		
	}

	$scope.sendenquiry = function() {

		
		if(!$scope.cc) {

			$scope.cc="";
		}

		$rootScope.showloader=true;

		$http({
			method:'POST',
			url:$rootScope.requesturl+'/resendenquiry',
			data:{subject:$scope.subject, emailcontent:$scope.emailcontent, vendorlist:$scope.selectedvalues, cc:$scope.cc, enqmateriallist:$scope.enqmateriallist, projectids:$scope.projectid, enquiryid:$scope.enquiryid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			if(result != 0) {

				$scope.enqno = result['enqno'];
				if(result['failedmail'].length > 0) {
					var htm = "";

					for(var j=0; j<result['failedmail'].length;j++) {

						htm = htm+(j+1)+")"+result['failedmail'][j];
					}

					swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Enquiry No: "+result['enqno'], "warning");
				} else {

					swal("Enquiry sent", "Enquiry No: "+result['enqno'], "success");
				}
			}

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

		
	}

});

app.controller("PurchasesRaiseOrderController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.ponew = [];
	$scope.addmat = [];
	$scope.transporttype = 'self';
	$scope.taxtype = 'tax';
	$scope.potype = 1;
	$scope.inclusivecheck = false;
	$scope.taxcaltype = 'percentage';
	$scope.pomateriallist = [];
	$scope.pomateriallistnew = {};
	$scope.taxdetails = [];
	$scope.specialterms = [];
	$scope.csid = "";
	$rootScope.showloader=true
	$scope.totalvalueofgoods = 0;
	$scope.totalvalue = 0;
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.alltaxes = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
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

	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_special_terms',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader = false;

		$scope.specialterms = result;

	});

	$scope.enqmattypecheck = function(mat) {
		if(mat && $scope.vendorid) {
			var x = 0;
			console.log($scope.vendorid.csvendor.materials);
			angular.forEach($scope.vendorid.csvendor.materials, function(ininven){
				if(ininven.materialdetails.parent_id != 0) {

					if(ininven.materialdetails.parent.type == 2) {

						if(mat.id == ininven.materialdetails.parent.category_id) {

							x++;
						}
					} else {

						if(mat.id == ininven.materialdetails.category_id) {

							x++;
						}
					}
				} else {
					if(mat.id == ininven.materialdetails.category_id) {

						x++;
					}
				}
			});

			if(x>0){

				return true;
			} else {

				return false;
			}
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

	});

	

	$scope.projectchange = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_cs',
			params:{projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$scope.enqlist = result;
			var cslistpre = [];
			if($scope.enqlist.length > 0) {
				angular.forEach($scope.enqlist, function(inenq){

					angular.forEach(inenq.cs, function(incs){
						angular.forEach(incs.csref, function(incsref){
							cslistpre.push(incsref);
						});
					});	
				});	
				$scope.cslist = angular.copy(cslistpre);
				console.log($scope.cslist);

			} else {

				swal("No approved CS for the selected project.");
			}
		});

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_info',
			params:{project:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			var thistermcount = $scope.specialterms.length;
			var nextterm = thistermcount+1;
			var nextterm2 = nextterm+1;
			$scope.specialterms[thistermcount] = {};
			$scope.specialterms[nextterm] = {};
			
			$scope.specialterms[thistermcount]['termtitle'] = "LOA No";
			$scope.specialterms[thistermcount]['termdesc'] = result['loano'];
			$scope.specialterms[nextterm]['termtitle'] = "CLIENT";
			$scope.specialterms[nextterm]['termdesc'] = result['client'];
			if(result['project_term_name'] != "") {

				$scope.specialterms[nextterm2] = {};
				$scope.specialterms[nextterm2]['termtitle'] = "PROJECT NAME";
				$scope.specialterms[nextterm2]['termdesc'] = result['project_term_name'];
			}

			$scope.termsncondition = result['standard_terms'];
			$scope.billingaddress = result['billing_address'];

		});

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
	}

	$scope.matfilter = function(smat){

		if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			if(smat.type == 2) {
				var y = 0;
				angular.forEach(smat.level1mat, function(inlevelmat){

					angular.forEach($scope.vendorid.csvendor.materials, function(ininven){
						if(ininven.materialdetails.id == inlevelmat.store_material_id) {

							y++;
						}
					});
					
				});
				if(y>0) {

					return true;
				} else {

					return false;
				}
			} else {

				var x = 0;
				angular.forEach($scope.vendorid.csvendor.materials, function(ininven){
					if(smat.id == ininven.materialdetails.id) {

						x++;
					}
				});

				if(x>0){

					return true;
				} else {

					return false;
				}
			}

		} else {

			return false;
		}
	}

	$scope.matfiltersub = function(smat) {		
		if($scope.submat.type != 3) {
			var x = 0;
			angular.forEach($scope.vendorid.csvendor.materials, function(ininven){
				if(smat.storematerial.id == ininven.materialdetails.id) {

					x++;
					smat.showsubmat = true;
				}
			});

			if(x>0){

				return true;
			} else {

				return false;
			}
		} else {

			return true;
		}
		
	}

	$scope.matchange = function() {
		
		$scope.addmat.uomval = angular.copy($scope.submat.matuom[0]);
		if($scope.submat.type==2 || $scope.submat.type==3) {

			if($scope.submat.level1mat.length == 0) {

				swal("No fabrication material mapped for the selected project.");
				$scope.submat = "";
				return false;
			}

			$scope.addmat.quantity = 1;
			var calqty = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if($scope.submat.type==3) {
					indimat.qtythis = angular.copy(indimat.qty_per_pole);
					if(indimat.selected) {
						
						calqty += parseFloat(indimat.qty_per_pole)*parseFloat(indimat.wt_per_pole);
					}
				} else {

					indimat.unitrate = 0;
					indimat.valueofgoods = 0;

					if(indimat.indenttotal.length>0) {
						indimat.pendingindentqty = indimat.indenttotal[0]['total_indent_qty']-indimat.indenttotal[0]['total_po_qty'];
						if(indimat.pendingindentqty >= indimat.qty) {

							indimat.qtythis = angular.copy(indimat.qty);	
						} else {

							indimat.qtythis = 0;
						}
						
					} else {

						indimat.pendingindentqty = 0;
						indimat.qtythis = 0;
					}
					indimat.selected = true;
				}

				indimat.uom = angular.copy(indimat.storeuom);
			});

			if($scope.submat.type==3) {

				$scope.addmat.quantity = angular.copy(calqty);
				if($scope.submat.indenttotal.length>0) {
					$scope.pendingindentqty = angular.copy($scope.submat.indenttotal[0]['total_indent_qty']-$scope.submat.indenttotal[0]['total_po_qty']);
				} else {

					$scope.pendingindentqty = 0;
				}
			}
			// $scope.selectall = true;
		} else {
			
			if($scope.submat.indenttotal.length>0) {
				$scope.pendingindentqty = angular.copy($scope.submat.indenttotal[0]['total_indent_qty']-$scope.submat.indenttotal[0]['total_po_qty']);
			} else {

				$scope.pendingindentqty = 0;
			}
		}
	}
	$scope.levelmatclick = function(pomat) {

		if($scope.submat.type==3){

			if(!pomat.selected) {

				$scope.addmat.quantity = angular.copy(Math.round(($scope.addmat.quantity+(parseFloat(pomat.qtythis)*parseFloat(pomat.wt_per_pc))) * 1000)/1000);
			} else {

				$scope.addmat.quantity = angular.copy(Math.round(($scope.addmat.quantity-(parseFloat(pomat.qtythis)*parseFloat(pomat.wt_per_pc))) * 1000)/1000);
			}

			$scope.addmat.valueofgoods = angular.copy($scope.addmat.quantity*$scope.addmat.unitrate);
		} else {

			if(!pomat.selected) {

				if(!pomat.qtythis || !pomat.unitrate) {

					pomat.valueofgoods = 0;
				}
				$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods+pomat.valueofgoods);
			} else {

				if(!pomat.qtythis || !pomat.unitrate) {

					pomat.valueofgoods = 0;
				}
				$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods-pomat.valueofgoods);
			}

		}
	}

	$scope.selectallclick = function() {

		var checkselect = !$scope.isselectallsub();
		angular.forEach($scope.submat.level1mat, function(indimat){

			indimat.selected = checkselect;
		});
		var calqty = 0;
		var totalcostthis = 0;
		angular.forEach($scope.submat.level1mat, function(indimat){

			if(indimat.selected) {
				if($scope.submat.type==3) {

					calqty += parseFloat(indimat.qty_per_pole)*parseFloat(indimat.wt_per_pole);
				} else if($scope.submat.type == 2) {

					if(!indimat.qtythis || !indimat.unitrate) {

						indimat.valueofgoods = 0;
					}
					totalcostthis = angular.copy(totalcostthis+indimat.valueofgoods);
				}
			}
		});
		if($scope.submat.type==3){
			$scope.addmat.quantity = angular.copy(Math.round(calqty * 1000)/1000);
			if(!$scope.addmat.unitrate) {

				$scope.addmat.unitrate = 0;
			}
			$scope.addmat.valueofgoods = angular.copy($scope.addmat.quantity*$scope.addmat.unitrate);
		} else if($scope.submat.type == 2){

			$scope.addmat.valueofgoods = angular.copy(totalcostthis);
		}
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

		if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.billingaddress) {

			swal("Please enter billing address.");
		} else if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if($scope.addmat.quantity == 0 && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Quantity cannot be 0.");
		} else if(!$scope.addmat.quantity && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.quantity) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.addmat.unitrate && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter unit rate.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.unitrate) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in unit rate.");
		} else if(!$scope.addmat.uomval) {

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
				var uomcount = 0, qtycount = 0,	unitcount = 0, selectedcount = 0, vgoodscount = 0;;

				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected && indimat.showsubmat){

						if(indimat.uom) {

							uomcount++;
						}
						if(indimat.qtythis && indimat.qtythis != 0) {

							qtycount++;
						}
						if(indimat.unitrate && indimat.unitrate != 0) {

							unitcount++;
						}
						selectedcount++;
						if(indimat.valueofgoods== 0 || indimat.qtythis == 0){

							vgoodscount++;
						}

					}

				});

				if(vgoodscount > 0) {

					swal("Value of goods/quantity for selected material cannot be zero.Please enter some quantity and unitrate for all selected materials.");
				} else if(selectedcount == 0){

					swal("Please select atleast one material to add.");
				} else if(uomcount == 0) {

					swal("Please select UOM for all selected materials.");
				} else if(qtycount == 0){

					swal("Please enter quantity for all selected materials.");
				} else if(unitcount == 0 && $scope.submat.type == 2) {

					swal("Please enter unit rate for all selected materials.");
				} else {

					var pomatlen = Object.keys($scope.pomateriallistnew).length;
					pomatlen += 1;

					$scope.pomateriallistnew[pomatlen] = {};

					$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
					$scope.pomateriallistnew[pomatlen]['materialid'] = $scope.submat.id;
					$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;
					
					$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.addmat.uomval.id;
					if($scope.submat.type == 3){

						$scope.pomateriallistnew[pomatlen]['unitrate'] = $scope.addmat.unitrate;
						$scope.pomateriallistnew[pomatlen]['quantity'] = $scope.addmat.quantity;
					} else {

						$scope.pomateriallistnew[pomatlen]['unitrate'] = "";
						$scope.pomateriallistnew[pomatlen]['quantity'] = "";
					}
					$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.addmat.valueofgoods;
					$scope.pomateriallistnew[pomatlen]['units'] = $scope.addmat.uomval.stmatuom.uom;
					$scope.pomateriallistnew[pomatlen]['remarks'] = $scope.addmat.remarks;
					$scope.pomateriallistnew[pomatlen]['materials'] = [];
					
					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected && indimat.showsubmat){

							$scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "materialid":indimat.storematerial.id, "remarks":$scope.addmat.remarks, "qty_per_pole":indimat.qty_per_pole, "wt_per_pole":indimat.wt_per_pole, "level1matid":indimat.id});

							$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);

						}

					});

					$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
					$scope.altermatntax();

					$scope.addmat = [];
					$scope.materialtype = "";
					$scope.submat = "";
					$scope.pendingindentqty = 0;

				}

			} else {

				if(!$scope.pomateriallistnew[0]) {

					$scope.pomateriallistnew[0] = {};
					$scope.pomateriallistnew[0]['type'] = $scope.submat.type;
					$scope.pomateriallistnew[0]['materials'] = [];
				}
				$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.addmat.uomval.stmatuom.uom, "uomid":$scope.addmat.uomval.id, "qty":$scope.addmat.quantity, "unitrate":$scope.addmat.unitrate,"valueofgoods":$scope.addmat.valueofgoods, "materialid":$scope.submat.id, "remarks":$scope.addmat.remarks});

				$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.addmat.valueofgoods);
				$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
				$scope.altermatntax();
				$scope.addmat = [];
				$scope.materialtype = "";
				$scope.submat = "";
				$scope.pendingindentqty = 0;

			}	
			$rootScope.showloader=false;			
		}

	}

	$scope.getgoodscost = function(type) {

		if($scope.submat.type == 1 || $scope.submat.type == 3) {

			if($scope.submat.type == 3) {
				var calqty = 0;
				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						calqty += parseFloat(indimat.qtythis)*parseFloat(indimat.wt_per_pc);
					}
				});
				console.log(calqty);
				$scope.addmat.quantity = angular.copy(calqty);
				if($scope.addmat.quantity > $scope.pendingindentqty) {

					$scope.addmat.quantity = 0;
					$scope.addmat.valueofgoods = 0;
					swal("Quantity cannot be greater than pending indent quantity.");
					$scope.selectallclick();
					$scope.selectall = false;
				} else {
					if(!$scope.addmat.unitrate) {

						$scope.addmat.unitrate = 0;
					}
					$scope.addmat.valueofgoods = angular.copy(Math.round(calqty*$scope.addmat.unitrate*1000)/1000);
				}
			}

			if($scope.addmat.quantity > $scope.pendingindentqty) {

				$scope.addmat.quantity = 0;
				$scope.addmat.valueofgoods = 0;
				swal("Quantity cannot be greater than pending indent quantity.");
				
				$scope.selectallclick();
				$scope.selectall = false;
			} else {
				if($rootScope.digitcheck.test($scope.addmat.quantity) && $scope.addmat.quantity && $rootScope.digitcheck.test($scope.addmat.unitrate) && $scope.addmat.unitrate) {

					$scope.addmat.valueofgoods = parseFloat($scope.addmat.quantity)*parseFloat($scope.addmat.unitrate);
					$scope.addmat.valueofgoods = angular.copy(Math.round($scope.addmat.valueofgoods*1000)/1000);
				} else {

					$scope.addmat.valueofgoods = 0;
				}
			}
			

		} else {


			var totalvalthis = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if(indimat.selected) {
					if(indimat.qtythis > indimat.pendingindentqty) {

						indimat.qtythis = 0;
						swal("Quantity cannot be greater than pending indent quantity.");
						$scope.selectallclick();
						$scope.selectall = false;
					}
					
					if(!indimat.unitrate){

						indimat.unitrate = 0;
					}
					indimat.valueofgoods = angular.copy(Math.round((parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate))*1000)/1000);
					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));
				}

			});
			$scope.addmat.valueofgoods = angular.copy(Math.round(totalvalthis*1000)/1000);


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

								$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(pomat.valueofgoods));
								taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
								checktaxmat++;
							}
						} else{

							angular.forEach(pomat['materials'],function(inpomat){
								if(inpomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {
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
								
						if($scope.taxdetails[k]['id'] == $scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id']) {

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

				taxamount = $scope.taxdetails[i]['taxamount'];
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
	}

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;

		angular.forEach($scope.pomateriallistnew,function(pomat){

			angular.forEach(pomat.materials,function(inpomat){

				if(!inpomat['freightinsurance_rate']) {

					inpomat['freightinsurance_rate'] = 0;
				}
				totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
			});
		});
		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);
	}
	$scope.removerow = function(currentrow, matid, pomatnewmat, pomatnew, pomat) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if(matid == inmat.id) {

						inmat.showmat = false;
					}
				});
			});

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;
			if(pomatnew.type == 3) {

				var thisqtyindi = angular.copy(parseFloat(pomat.qty)*parseFloat(pomat.wt_per_pole));
				pomatnew.quantity = angular.copy(pomatnew.quantity-thisqtyindi);
				pomatnew.valueofgoods = angular.copy(pomatnew.quantity*pomatnew.unitrate);
			}

			pomatnewmat.splice(currentrow, 1);
			
			var countempty = 0;
			angular.forEach($scope.pomateriallistnew, function(inmattype){

				if(inmattype.materials.length == 0){
					countempty++;

					angular.forEach($scope.materials, function(inmattype2){

						angular.forEach(inmattype2.submaterials, function(inmat2){

							if(inmattype.materialid == inmat2.id) {

								inmat2.showmat = false;
							}
						});
					});
				}
			});
			if(Object.keys($scope.pomateriallistnew).length == countempty) {

				$scope.taxdetails = [];
			}
			$scope.altermatntax();
			$scope.selectall = false;
			$scope.$apply();
			swal("Material deleted successfully.", "", "success");

		});
	}

	$scope.changetaxtype = function() {

		$scope.taxmatarr = [];

		$scope.potaxdetails.selectedtaxvalue = 0;

		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

			angular.forEach($scope.pomateriallistnew, function(inpomat) {

				if(inpomat.type == 3) {

					if(inpomat.selected) {

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);
					}
				} else {

					angular.forEach(inpomat['materials'], function(ininpomat) {

						if(ininpomat.selected) {

							$scope.toggletaxselectlist(ininpomat['valueofgoods'], ininpomat['materialid'], 'po_material', ininpomat.selected);
						}

					});
				}

				
			});

			angular.forEach($scope.taxdetails, function(inpotax) {

				if(inpotax.selected) {

					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, 'po_tax', inpotax.selected);
				}
			});
		}
	}

	$scope.toggletaxselectlist = function(thiscost, id, type, taxmatselect){

		$rootScope.showloader=true;

		var totaltaxcost = 0;
		var matcheckthis = -1;

		if(type=="po_material") {
			

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
				if(id == $scope.taxmatarr[i]['material_id']) {

					matcheckthis = i;
				}
			}

			if(matcheckthis == -1) {

				var po_material_id = id;
				var tax_id = 0;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		} else {

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
				if(id == $scope.taxmatarr[i]['tax']['tax_id']) {

					matcheckthis = i;
				}
			}
			if(matcheckthis == -1) {

				var po_material_id = 0;
				var tax_id = id;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		}

		var thistaxvalue = 0;		
		
		angular.forEach($scope.taxmatarr,function(enqtax){
				
			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
		});

		$scope.totalcostfortax = angular.copy(totaltaxcost);
		if($scope.potaxdetails) {
			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
		}

		$rootScope.showloader=false;
	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}

	$scope.addtotax = function() {

		if(!$scope.potaxdetails) {

			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount amount.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in amount.");
		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount percentage.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in tax/discount percentage.");
		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select atleast one material to calculate tax/discount.");
		}else {

			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == $scope.potaxdetails.id) {

					inditax.showtax = true;
				}
			});

			var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);

			var lumpsum = 0;
			if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
				lumpsum=1;
				$scope.taxmatarr = [];
			} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
				lumpsum=1;
			}
			thistaxamount = thistaxamount.toFixed(2);
			
			$rootScope.showloader=true;

			if(!$scope.potaxdetails.inclusivepercentage) {

				$scope.potaxdetails.inclusivepercentage = 0;
			}
			$scope.taxdetails.push({"id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
			$scope.altermatntax();

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;
			console.log($scope.taxdetails);
			var maxelementcount = 0;

			angular.forEach($scope.pomateriallistnew,function(pomat){
					
				pomat.selected = false;
				angular.forEach(pomat.materials,function(inpomat){
					inpomat.selected = false;
				});
			});

			angular.forEach($scope.taxdetails,function(potax){
					
				potax.selected = false;
			});

			angular.forEach($scope.alltaxes,function(pomattax){
					
				pomattax.selectedtaxvalue = 0;
			});

			console.log($scope.taxdetails);

			$rootScope.showloader=false;
		}
	}

	$scope.selectallmattax = function(pomaterials, taxdetails){

		if(pomaterials){
			var x = !$scope.isallselected(pomaterials, taxdetails);

			if(x == true) {

				$scope.taxmatarr = [];
			}

			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						inpomat.selected = x;

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);

					});

				} else {


					pomat.selected = x;

					$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['materialid'], 'po_material', pomat.selected);
				}

			});

			angular.forEach(taxdetails,function(potax){
				potax.selected = x;

				$scope.toggletaxselectlist(potax.taxamount, potax.id, 'po_tax', potax.selected);
			});

		}else{
			return false;
		}
	};

	$scope.isallselected = function(pomaterials, taxdetails){
		if(pomaterials){
			var count = 0, totcount = 0;
			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						if(inpomat.selected) {

							count++;
						}

						totcount++;

					});

				} else {

					if(pomat.selected){

						count++;
					}
					totcount++;
				}

			});

			var taxcount = 0;

			angular.forEach(taxdetails,function(potax){
				if(potax.selected){
					count++;
					
				}
				taxcount++;
			});


			var totallength = taxcount+totcount;

			if(count == totallength){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	$scope.removetaxrow = function(currentrow, taxid) {

		swal({   title: "Are you sure you want to delete this tax?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == taxid) {

					inditax.showtax = false;
				}
			});

			$scope.taxdetails.splice(currentrow, 1);

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			$scope.altermatntax();
			$scope.$apply();
			swal("Tax deleted successfully", "", "warning");

		});
		
	}

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}

	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.generatepo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/generatepo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.vendorid.csvendor.vendordetails.id, projectid:$scope.projectid, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, pomanualdate:$scope.pomanualdate, ponothis:$scope.ponothis, potype:$scope.potype, csrefid:$scope.csid.id },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				if(result == 0) {

					swal("The entered Purcahse Order Number already exists.");
				} else {
					var totaloriginalcost = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){
							
						if(pomat.type == 3) {

							$scope.showanexure = true;
							totaloriginalcost = totaloriginalcost+parseInt(pomat.valueofgoods);
						} else {

							angular.forEach(pomat.materials, function(inpomat){

								totaloriginalcost = totaloriginalcost+parseInt(inpomat.valueofgoods);
							});
						}
					});
					$scope.totalvalueofgoods = angular.copy(Math.round($scope.totalvalueofgoods));
					$scope.totalcostwords = getwords($scope.totalvalueofgoods.toString());
					$scope.totalvalueofgoods = Commas.getcomma($scope.totalvalueofgoods);
					$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
					

					$scope.companyvendorinfo = result;
					$scope.pono = result['pono'];

					$("#GeneratePoModal").modal('show');
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}

	$scope.printpo = function() {

		var prtContent = document.getElementById("dd");
		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }
});

app.controller("PurchasesEditPoController",function($scope,$http,$rootScope,$state,Logging, Commas){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.addmat = [];
	$scope.ponoshow = false;
	$scope.taxtype = "tax";
	$scope.pomateriallist = [];
	$scope.taxdetails = [];
	$scope.amds = [];
	$scope.amds.amenddetails = [];
	$scope.inclusivecheck = false;
	$scope.taxcaltype = 'percentage';
	$scope.edittype = "amendment";
	$scope.pomateriallistnew = [];
	$scope.pomateriallistnewpre = {};
	$scope.amendnewtot=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='3')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].pomaterials.value_of_goods);
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}
	$scope.amendoldtot=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='2')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].oldpomaterials.value_of_goods)
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}

	$scope.amendnewtotfin=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='3')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].pomaterials.value_of_goods);
				}
				if($scope.amds.amenddetails[i].tax_id!='0')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].potaxes.value);
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}
	$scope.amendoldtotfin=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='2')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].oldpomaterials.value_of_goods)
				}
				if($scope.amds.amenddetails[i].tax_id!='0')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].oldpotaxes.value);
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}
	$scope.showamendmat = function() {
		var flag=0;
		for(i=0;i<$scope.amds.amenddetails.length;i++){
			if($scope.amds.amenddetails[i]['material_id'] != 0 || $scope.amds.amenddetails[i]['tax_id'] != 0) {
				flag = 1;
			}
		}
		if(flag==0) {
			return false;
		} else {
			return true;
		}
	}
	$scope.showamendterms = function() {

		var flag2=0;

		for(i=0;i<$scope.amds.amenddetails.length;i++){

			if($scope.amds.amenddetails[i]['po_term_name']) {

				flag2 = 1;
			}
		}

		if(flag2==0) {

			return false;
		} else {

			return true;
		}
	}
	$scope.enqmattypecheck = function(mat) {
		if(mat && $scope.ponodetails.csref) {
			var x = 0;
			angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
				angular.forEach(inven.csvendor.materials, function(ininven){
					if(mat.id == ininven.materialdetails.category_id) {

						x++;
					}
				});
			});
			if(x>0){

				return true;
			} else {

				return false;
			}
		}
	}
	
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

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.alltaxes = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.searchpo = function() {
		$scope.ponodetails = [];
		$scope.pomateriallistnew = [];
		$scope.pomateriallistnewpre = {};
		$scope.pono = false;
		$scope.editmat = null;
		if(!$scope.purchaseid) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_pomain_info',
			params:{pono:$scope.purchaseid,type:$scope.edittype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				
				$rootScope.showloader=false;
				$scope.allshow =true;
				if(result == 0) {

					$scope.ponodetails = [];
					swal("Purchase Order Number doesnot exist.", "", "warning");
				}
				else if(result=='dateover')
				{
					$scope.ponodetails = [];
					swal("Cant edit PO because the edit date is over.", "", "warning");
					$scope.allshow = false;
				}
				else {
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
							console.log(poresult);
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
										$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['uomid'] = pomat['storematerial']['matuom'][0]['stmatuom']['id'];
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
									$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomat['storematerial']['name'], 'uom':pomat['storematerial']['matuom'][0]['stmatuom']['uom'], 'qty':pomat['quantity'], 'unitrate':pomat['unit_rate'], 'valueofgoods':pomat['value_of_goods'], 'materialid':pomat['material_id'], 'freightinsurance_rate':pomat.freightinsurance_rate, 'inspected_quantity':pomat.inspected_quantity, 'approved_quantity':pomat.approved_quantity, 'dispatch_quantity':pomat.dispatch_quantity, 'internal_di_quantity':pomat.internal_di_quantity, 'payment_qty':pomat.payment_qty, 'remarks':pomat.remarks, 'uomid':pomat.store_material_uom_id, 'total_po_qty':pomat['indenttotal']['total_po_qty'], 'total_indent_qty':pomat['indenttotal']['total_indent_qty']});
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
				}					

			}).error(function(data,status){
				
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
    }

	$scope.matfilter = function(smat){

		if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			if(smat.type == 2) {

				var y = 0;

				angular.forEach(smat.level1mat, function(inlevelmat){

					if(inlevelmat.storematerial.parent_id ==  smat.id) {

						y++;
					}
				});
				if(y>0) {

					return true;
				} else {

					return false;
				}
			} else {

				var x = 0;
				angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
					angular.forEach(inven.csvendor.materials, function(ininven){
						if(smat.id == ininven.materialdetails.id) {

							x++;
						}
					});
				});
				if(x>0){

					return true;
				} else {

					return false;
				}
			}

		} else {

			return false;
		}
	}
	$scope.matfiltersub = function(smat) {		
		var x = 0;
		angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
			angular.forEach(inven.csvendor.materials, function(ininven){
				if(smat.storematerial.id == ininven.materialdetails.id) {

					x++;
				}
			});
		});
		if(x>0){

			return true;
		} else {

			return false;
		}
		
	}


	$scope.editrow = function(pomat) {

		pomat.editmat = true;
	}

	$scope.saverow = function(pomat, pomatnew) {

		if(pomatnew.type==3 && !pomat.unitrate) {

			if(!pomat.qty || pomat.qty == 0) {

				swal("Please enter some quantity.");
			} else if(!$rootScope.digitcheck.test(pomat.qty)) {

				swal("Please enter digits in quantity.");
				pomat.qty = 0;
				pomat.valueofgoods = 0;
			} else {

				var calqty = 0;
				angular.forEach(pomatnew['materials'], function(indimat){

					calqty += parseFloat(indimat.qty)*parseFloat(indimat.wt_per_pole);
				});
				var pendinginqty = pomatnew.total_indent_qty-pomatnew.total_po_qty;
				if(calqty > pendinginqty){

					swal("PO quantity cannot be greater than pending indent quantity.");
				} else if(parseFloat(calqty) < parseFloat(pomatnew.inspected_quantity)) {

					swal("Quantity cannot be less than inspected quantity.");
					pomatnew.qty = angular.copy(parseFloat(pomatnew.inspected_quantity));
					pomatnew.valueofgoods = angular.copy(parseFloat(pomatnew.qty)*parseFloat(pomatnew.unitrate));
				} else {
					pomatnew.qty = angular.copy(calqty);
					pomatnew.valueofgoods = angular.copy(parseFloat(pomatnew.qty)*parseFloat(pomatnew.unitrate));
				}
			}

		} else {
			var pendinginqty = pomat.total_indent_qty-pomat.total_po_qty;
			var inspectqty = 0;
			if(pomat.inspected_quantity){
				inspectqty = angular.copy(pomat.inspected_quantity);
			}
			console.log(pomat.qty+'='+inspectqty);
			if(!pomat.qty || pomat.qty == 0) {
				swal("Please enter some quantity.");
			} else if(!$rootScope.digitcheck.test(pomat.qty)) {

				swal("Please enter digits in quantity.");
				pomat.qty = 0;
				pomat.valueofgoods = 0;
			} else if(!pomat.unitrate || pomat.unitrate == 0) {

				swal("Please enter some unit rate.");
			} else if(!$rootScope.digitcheck.test(pomat.unitrate)) {

				swal("Please enter digits in unit rate.");
				pomat.unitrate = 0;
				pomat.valueofgoods = 0;
			} else if(parseFloat(pomat.qty) > parseFloat(pendinginqty)) {

				swal("PO quantity cannot be greater than pending indent quantity.");
				pomat.qty = 0;
				pomat.valueofgoods = 0;
			} else if(parseFloat(pomat.qty) < parseFloat(inspectqty)) {

				swal("Quantity cannot be less than inspected quantity.");
				pomat.qty = parseFloat(inspectqty);
				pomat.valueofgoods = angular.copy(parseFloat(pomat.unitrate)*parseFloat(pomat.qty));
			} else {
				
				pomat.valueofgoods = angular.copy(parseFloat(pomat.unitrate)*parseFloat(pomat.qty));
			}
		}
		$scope.altermatntax();
		pomat.editmat = false;
		
	}

	$scope.matchange = function() {
		
		if($scope.submat.type!=1) {

			$scope.addmat.quantity = 1;
			var calqty = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if($scope.submat.type==3) {

					indimat.qtythis = angular.copy(indimat.qty_per_pole);
					calqty += parseFloat(indimat.qty_per_pole)*parseFloat(indimat.wt_per_pole);
				} else {

					if(indimat.indenttotal.length>0) {
						indimat.pendingindentqty = indimat.indenttotal[0]['total_indent_qty']-indimat.indenttotal[0]['total_po_qty'];
						if(indimat.pendingindentqty >= indimat.qty) {

							indimat.qtythis = angular.copy(indimat.qty);	
						} else {

							indimat.qtythis = 0;
						}
						
					} else {

						indimat.pendingindentqty = 0;
						indimat.qtythis = 0;
					}
				}

				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});

			if($scope.submat.type==3) {

				$scope.addmat.quantity = angular.copy(calqty);
			}
			$scope.selectall = true;
		} else {
			
			if($scope.submat.indenttotal.length>0) {
				$scope.pendingindentqty = angular.copy($scope.submat.indenttotal[0]['total_indent_qty']-$scope.submat.indenttotal[0]['total_po_qty']);
				console.log($scope.submat.indenttotal.total_indent_qty);
			} else {

				$scope.pendingindentqty = 0;
			}
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

		if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.addmat.quantity && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.quantity) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.addmat.unitrate && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter unit rate.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.unitrate) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in unit rate.");
		} else if(!$scope.addmat.uomval) {

			swal("Please select a uom.");
		} else {

			swal({   title: "Are you sure you want to add new material?",   text: "All taxes will be removed. Do you want to continue?",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, add it!",   closeOnConfirm: false }, function(){ 

				$scope.taxdetails = [];
			
				angular.forEach($scope.materials, function(inmattype){

					angular.forEach(inmattype.submaterials, function(inmat){

						if($scope.submat.id == inmat.id) {

							inmat.showmat = true;
						}
					});
				});

				$rootScope.showloader=true;

				if($scope.submat.type != 1) {
					var uomcount = 0, qtycount = 0,	unitcount = 0, selectedcount = 0, vgoodscount = 0;;

					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected){

							if(indimat.uom) {

								uomcount++;
							}
							if(indimat.qtythis && indimat.qtythis != 0) {

								qtycount++;
							}
							if(indimat.unitrate && indimat.unitrate != 0) {

								unitcount++;
							}

							selectedcount++;
							if(indimat.valueofgoods== 0 || indimat.qtythis == 0){

								vgoodscount++;
							}

						}

					});

					if(vgoodscount > 0) {

						swal("Value of goods/quantity for selected material cannot be zero.Please enter some quantity and unitrate for all selected materials.");
					} else if(selectedcount == 0){

						swal("Please select atleast one material to add.");
					} else if(uomcount == 0) {

						swal("Please select UOM for all selected materials.");
					} else if(qtycount == 0){

						swal("Please enter quantity for all selected materials.");
					} else if(unitcount == 0 && $scope.submat.type == 2) {

						swal("Please enter unit rate for all selected materials.");
					} else {

						var pomatlen = $scope.pomateriallistnew.length;
						if(!pomatlen in $scope.pomateriallistnew) {
							pomatlen++;
						}
						$scope.pomateriallistnew[pomatlen] = {};
						$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
						$scope.pomateriallistnew[pomatlen]['materialid'] = $scope.submat.id;
						$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;

						$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.addmat.uomval.id;
						if($scope.submat.type == 3){
							if($scope.submat.indenttotal){
								$scope.pomateriallistnew[pomatlen]['total_indent_qty'] = $scope.submat.indenttotal[0]['total_indent_qty'];
							}
							$scope.pomateriallistnew[pomatlen]['unitrate'] = $scope.addmat.unitrate;
							$scope.pomateriallistnew[pomatlen]['quantity'] = $scope.addmat.quantity;
						} else {

							$scope.pomateriallistnew[pomatlen]['unitrate'] = "";
							$scope.pomateriallistnew[pomatlen]['quantity'] = "";
						}
						$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.addmat.valueofgoods;
						$scope.pomateriallistnew[pomatlen]['units'] = $scope.addmat.uomval.stmatuom.uom;
						$scope.pomateriallistnew[pomatlen]['remarks'] = $scope.addmat.remarks;
						$scope.pomateriallistnew[pomatlen]['materials'] = [];
						
						angular.forEach($scope.submat.level1mat, function(indimat){
							if(indimat.selected){
								$scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "materialid":indimat.storematerial.id, "remarks":$scope.addmat.remarks, "total_indent_qty":indimat.indenttotal[0]['total_indent_qty'], "total_po_qty":indimat.indenttotal[0]['total_po_qty']});
								$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);
							}
						});
						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
						$scope.altermatntax();
						$scope.addmat = [];
						$scope.materialtype = "";
						$scope.submat = "";
					}
				} else {
					if(!$scope.pomateriallistnew[0]) {
						$scope.pomateriallistnew[0] = {};
						$scope.pomateriallistnew[0]['type'] = $scope.submat.type;
						$scope.pomateriallistnew[0]['materials'] = [];
					}
					$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.addmat.uomval.stmatuom.uom, "uomid":$scope.addmat.uomval.id, "qty":$scope.addmat.quantity, "unitrate":$scope.addmat.unitrate,"valueofgoods":$scope.addmat.valueofgoods, "materialid":$scope.submat.id, "remarks":$scope.addmat.remarks, "total_indent_qty":$scope.submat.indenttotal[0]['total_indent_qty'], "total_po_qty":$scope.submat.indenttotal[0]['total_po_qty']});
					$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.addmat.valueofgoods);
					$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
					$scope.altermatntax();
					$scope.addmat = [];
					$scope.materialtype = "";
					$scope.submat = "";
				}	
				$rootScope.showloader=false;
				$scope.$apply();
				swal("Material added successfully", "", "success");
			});			
		}

	}

	$scope.getgoodscost = function(type) {

		if($scope.submat.type == 1 || $scope.submat.type == 3) {

			if($scope.submat.type == 3) {
				var calqty = 0;
				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						calqty += parseFloat(indimat.qtythis)*parseFloat(indimat.wt_per_pole);
					}
				});
				$scope.addmat.quantity = angular.copy(calqty);
				if($scope.addmat.quantity > $scope.pendingindentqty) {

					$scope.addmat.quantity = 0;
					$scope.addmat.valueofgoods = 0;
					swal("Quantity cannot be greater than pending indent quantity.");
				} else {
					if(!$scope.addmat.unitrate) {

						$scope.addmat.unitrate = 0;
					}
					$scope.addmat.valueofgoods = angular.copy(calqty*$scope.addmat.unitrate);
				}
			}

			if($scope.addmat.quantity > $scope.pendingindentqty) {

				$scope.addmat.quantity = 0;
				$scope.addmat.valueofgoods = 0;
				swal("Quantity cannot be greater than pending indent quantity.");
			} else {
				if($rootScope.digitcheck.test($scope.addmat.quantity) && $scope.addmat.quantity && $rootScope.digitcheck.test($scope.addmat.unitrate) && $scope.addmat.unitrate) {

					$scope.addmat.valueofgoods = parseFloat($scope.addmat.quantity)*parseFloat($scope.addmat.unitrate);
					$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods.toFixed(2));
				} else {

					$scope.addmat.valueofgoods = 0;
				}
			}
			

		} else {


			var totalvalthis = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if(indimat.selected) {
					if(indimat.qtythis > indimat.pendingindentqty) {

						indimat.qtythis = 0;
						swal("Quantity cannot be greater than pending indent quantity.");
					}
					
					if(!indimat.unitrate){

						indimat.unitrate = 0;
					}
					indimat.valueofgoods = angular.copy(parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate));
					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));
				}

			});
			$scope.addmat.valueofgoods = angular.copy(totalvalthis);


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
	}

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;

		angular.forEach($scope.pomateriallistnew,function(pomat){

			angular.forEach(pomat.materials,function(inpomat){

				if(!inpomat['freightinsurance_rate']) {

					inpomat['freightinsurance_rate'] = 0;
				}
				totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
			});
		});
		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);
	}

	$scope.removerow = function(pomat, pomatnew) {
		console.log(pomatnew);
		console.log($scope.pomateriallistnew);

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if(pomat.materialid == inmat.id) {

						inmat.showmat = false;
					}
				});
			});
			for(var i=pomatnew.materials.length-1; i>=0;i--){

				if(pomat.materialid == pomatnew.materials[i]['materialid']) {

					pomatnew.materials.splice(i, 1);
				}
			}
			if($scope.pomateriallistnew[0]) {

				var strt = 0;
			} else {

				var strt = 1;
			}
			for(var j=$scope.pomateriallistnew.length-1; j>=strt;j--){

				if($scope.pomateriallistnew[j]['materials'].length == 0) {

					$scope.pomateriallistnew.splice(j, 1);
				}
			}
			if($scope.pomateriallistnew.length == 0) {

				$scope.taxdetails = [];
			}
			$scope.altermatntax();
			$scope.$apply();

			swal("Material deleted successfully.", "", "success");

		});
	}

	
	$scope.changetaxtype = function() {

		$scope.taxmatarr = [];

		$scope.potaxdetails.selectedtaxvalue = 0;

		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

			angular.forEach($scope.pomateriallistnew, function(inpomat) {

				if(inpomat.type == 3) {

					if(inpomat.selected) {

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);
					}
				} else {

					angular.forEach(inpomat['materials'], function(ininpomat) {

						if(ininpomat.selected) {

							$scope.toggletaxselectlist(ininpomat['valueofgoods'], ininpomat['materialid'], 'po_material', ininpomat.selected);
						}

					});
				}

				
			});

			angular.forEach($scope.taxdetails, function(inpotax) {

				if(inpotax.selected) {

					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, 'po_tax', inpotax.selected);
				}
			});
		}
	}

	$scope.toggletaxselectlist = function(thiscost, id, type, taxmatselect){

		$rootScope.showloader=true;
		var totaltaxcost = 0;
		var matcheckthis = -1;
		if(type=="po_material") {
			
			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
				if(id == $scope.taxmatarr[i]['material_id']) {

					matcheckthis = i;
				}
			}

			if(matcheckthis == -1) {

				var po_material_id = id;
				var tax_id = 0;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		} else {

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
				if(id == $scope.taxmatarr[i]['tax']['tax_id']) {

					matcheckthis = i;
				}
			}
			if(matcheckthis == -1) {

				var po_material_id = 0;
				var tax_id = id;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		}

		var thistaxvalue = 0;		
		
		angular.forEach($scope.taxmatarr,function(enqtax){
				
			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
		});

		$scope.totalcostfortax = angular.copy(totaltaxcost);
		if($scope.potaxdetails) {
			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
		}

		$rootScope.showloader=false;

		console.log($scope.taxmatarr);
	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}

	$scope.addtotax = function() {

		if(!$scope.potaxdetails) {

			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount amount.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in amount.");
		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount percentage.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in tax/discount percentage.");
		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select atleast one material to calculate tax/discount.");
		}else {

			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == $scope.potaxdetails.id) {

					inditax.showtax = true;
				}
			});

			var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);
			var lumpsum = 0;
			if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
				lumpsum=1;
				$scope.taxmatarr = [];
			} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
				lumpsum=1;
			}
			thistaxamount = thistaxamount.toFixed(2);
			
			$rootScope.showloader=true;

			if(!$scope.potaxdetails.inclusivepercentage) {

				$scope.potaxdetails.inclusivepercentage = 0;
			}

			$scope.taxdetails.push({"id":$scope.potaxdetails.id,"tax_id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
			$scope.altermatntax();

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			var maxelementcount = 0;

			angular.forEach($scope.pomateriallist,function(pomat){
					
				pomat.selected = false;
			});

			angular.forEach($scope.taxdetails,function(potax){
					
				potax.selected = false;
			});

			angular.forEach($scope.alltaxes,function(pomattax){
					
				pomattax.selectedtaxvalue = 0;
			});

			$rootScope.showloader=false;
		}
	}

	$scope.selectallmattax = function(pomaterials, taxdetails){

		if(pomaterials){
			var x = !$scope.isallselected(pomaterials, taxdetails);

			if(x == true) {

				$scope.taxmatarr = [];
			}

			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						inpomat.selected = x;

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);

					});

				} else {


					pomat.selected = x;

					$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['materialid'], 'po_material', pomat.selected);
				}

			});

			angular.forEach(taxdetails,function(potax){
				potax.selected = x;

				$scope.toggletaxselectlist(potax.taxamount, potax.id, 'po_tax', potax.selected);
			});

		}else{
			return false;
		}
	};

	$scope.isallselected = function(pomaterials, taxdetails){
		if(pomaterials){
			var count = 0, totcount = 0;
			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						if(inpomat.selected) {

							count++;
						}

						totcount++;

					});

				} else {

					if(pomat.selected){

						count++;
					}
					totcount++;
				}

			});

			var taxcount = 0;

			angular.forEach(taxdetails,function(potax){
				if(potax.selected){
					count++;
					
				}
				taxcount++;
			});


			var totallength = taxcount+totcount;

			if(count == totallength){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	$scope.removetaxrow = function(currentrow, taxid) {

		console.log($scope.taxdetails);

		swal({   title: "Are you sure you want to delete this tax?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == taxid) {

					inditax.showtax = false;
				}
			});

			$scope.taxdetails.splice(currentrow, 1);

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			$scope.altermatntax();
			$scope.$apply();
			swal("Tax deleted successfully", "", "warning");

		});
		
	}

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}

	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.savepo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/savepo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.ponodetails.project.id, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$scope.purchaseid },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);

				$scope.amds=result[1];
				var totaloriginalcost = 0;

				angular.forEach($scope.pomateriallistnew,function(pomat){

					if(pomat.type == 3) {

						$scope.showanexure = true;
						
						pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
						totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
					} else {

						angular.forEach(pomat.materials,function(inpomat){

							inpomat.unitrate = Commas.getcomma(Math.round(inpomat.unitrate));
							totaloriginalcost = totaloriginalcost+parseInt(Math.round(inpomat.valueofgoods));
						});
					}
				});
				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

				$scope.companyvendorinfo = result[0];
				$scope.pono = result[0]['pono'];

				$("#GeneratePoModal").modal('show');

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


	$scope.editpo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/editpo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.ponodetails.project.id, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$scope.purchaseid },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;


				var totaloriginalcost = 0;

				angular.forEach($scope.pomateriallistnew,function(pomat){

					if(pomat.type == 3) {

						$scope.showanexure = true;
						
						pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
						totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
					} else {

						angular.forEach(pomat.materials,function(inpomat){

							inpomat.unitrate = Commas.getcomma(Math.round(inpomat.unitrate));
							totaloriginalcost = totaloriginalcost+parseInt(Math.round(inpomat.valueofgoods));
						});
					}
				});
				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

				$scope.companyvendorinfo = result;
				$scope.pono = result['pono'];

				$("#GeneratePoModal").modal('show');

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


	$scope.printpo = function() {

		var prtContent = document.getElementById("dd");
		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
	}



	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});


// app.controller("PurchasesRaiseOrderOldController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
// 	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

// 	$scope.transporttype = 'self';
// 	$scope.deliverylocation = 'single';
// 	$scope.taxtype = 'tax';
// 	$scope.potype = 1;
// 	$scope.inclusivecheck = false;

// 	$scope.taxcaltype = 'percentage';

// 	$scope.pomateriallist = [];

// 	$scope.taxdetails = [];

// 	$scope.specialterms = [];

// 	$rootScope.showloader=true

// 	$scope.totalvalueofgoods = 0;
// 	$scope.totalvalue = 0;
// 	$scope.pomateriallistnew = [];
// 	//$scope.pomateriallistnew[0] = [];

// 	$scope.matfilter = function(smat){

// 		if(smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)){

// 			return true;
// 		} else {

// 			return false;
// 		}
// 	}
	

// 	$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_tax_list',
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			$rootScope.showloader=false;

// 			$scope.alltaxes = result;

// 		}).error(function(data,status){
// 			console.log(data+status);
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			//Logging.validation(status);
// 		});

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/getuserinfo',
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			$rootScope.showloader=false;

// 			$scope.thisuserinfo = result;

// 		}).error(function(data,status){
// 			console.log(data+status);
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			//Logging.validation(status);
// 		});

// 	$rootScope.showloader = true;
// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_special_terms',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){
// 		$rootScope.showloader = false;

// 		$scope.specialterms = result;

// 	});

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_vendor_list',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;

// 		$scope.vendorlist = result;
		

// 	});

// 	$scope.checklump = function() {

// 		if($scope.taxcaltype == 'lumpsum') {

// 			$scope.potaxdetails.percentage = 0;
// 			$scope.potaxdetails.inclusivepercentage = 0;
// 		}
// 	}

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_project_list',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.projectlist = result;

// 	});

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_material_types',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.materials = result;
		
// 	});

// 	$scope.calculatetotalfreight = function() {

// 		var totalfreightcost = 0;


// 		angular.forEach($scope.pomateriallist,function(pomat){

// 			if(!pomat['freightinsurance_rate']) {

// 				pomat['freightinsurance_rate'] = 0;
// 			}
// 			totalfreightcost += parseFloat(pomat['qty'])*parseFloat(pomat['freightinsurance_rate']);
// 		});

// 		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);

// 	}

// 	$scope.getuom = function(id) {

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_material_uom',
// 			params:{materialid:id},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			$rootScope.showloader=false;

// 			$scope.uomval = result['units'];

// 		});
// 	}

// 	$scope.getgoodscost = function(type, submat) {

// 		if(!$scope.quantity && type != 'quantity' && type) {

// 			swal("Please enter quantity.");
// 		} else if(!$rootScope.digitcheck.test($scope.quantity) && type != 'unitrate' && type) {

// 			swal("Please enter digits in quantity.");
// 			$scope.quantity = "";
// 		}
// 		else if(!$scope.unitrate &&  type != 'quantity' &&  type != '') {

// 			swal("Please enter Unit Rate.");
// 		} else if(!$rootScope.digitcheck.test($scope.unitrate) && type != 'quantity' &&  type) {

// 			swal("Please enter digits in unit rate.");
// 			$scope.unitrate = "";
// 		} else {


// 			if(submat.type == 1) {

// 				$scope.valueofgoods = parseFloat($scope.quantity)*parseFloat($scope.unitrate);
// 				$scope.valueofgoods = angular.copy($scope.valueofgoods.toFixed(2));

// 			} else {

// 				var totalvalthis = 0;

// 				angular.forEach(submat.level1mat, function(indimat){

// 					if(type == 'quantity') {
// 						indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty);
// 					}
// 					if(submat.type == 3){

// 						indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty_per_pole);
// 					}
// 					if(!indimat.unitrate){

// 						indimat.unitrate = 0;
// 					}
// 					indimat.valueofgoods = angular.copy(parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate));

// 					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));

// 				});
// 				$scope.valueofgoods = angular.copy(totalvalthis);
// 			}
// 		}
// 	}

// 	$scope.aggcalval = function(pomat) {

// 		if(pomat.selected) {

// 			if(!$scope.valueofgoods){

// 				$scope.valueofgoods = 0;
// 			}

// 			if(pomat.unitrate && pomat.qtythis) {

// 				pomat.valueofgoods = angular.copy(parseFloat(pomat.qtythis)*parseFloat(pomat.unitrate));
// 				$scope.valueofgoods = angular.copy(parseFloat($scope.valueofgoods)+parseFloat(pomat.valueofgoods));
// 			}
// 		}
// 	}

// 	$scope.projectchange = function() {

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_project_info',
// 			params:{project:$scope.projectid},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			console.log(result);
// 			$rootScope.showloader=false;
// 			var thistermcount = $scope.specialterms.length;
// 			var nextterm = thistermcount+1;
// 			var nextterm2 = nextterm+1;
// 			$scope.specialterms[thistermcount] = {};
// 			$scope.specialterms[nextterm] = {};
			
// 			$scope.specialterms[thistermcount]['termtitle'] = "LOA No";
// 			$scope.specialterms[thistermcount]['termdesc'] = result['loano'];
// 			$scope.specialterms[nextterm]['termtitle'] = "CLIENT";
// 			$scope.specialterms[nextterm]['termdesc'] = result['client'];
// 			if(result['project_term_name'] != "") {

// 				$scope.specialterms[nextterm2] = {};
// 				$scope.specialterms[nextterm2]['termtitle'] = "PROJECT NAME";
// 				$scope.specialterms[nextterm2]['termdesc'] = result['project_term_name'];
// 			}

// 			$scope.termsncondition = result['standard_terms'];

// 		});
// 	}

// 	$scope.addtotable = function() {

// 		if(!$scope.vendorid) {

// 			swal("Please select a vendor.");
// 		} else if(!$scope.projectid) {

// 			swal("Please select a project.");
// 		} else if(!$scope.billingaddress) {

// 			swal("Please enter billing address.");
// 		} else if(!$scope.materialtype) {

// 			swal("Please select material type.");
// 		} else if(!$scope.submat) {

// 			swal("Please select material.");
// 		} else if(!$scope.quantity && $scope.submat.type == 1) {

// 			swal("Please enter material quantity.");
// 		} else if(!$rootScope.digitcheck.test($scope.quantity) && $scope.submat.type == 1) {

// 			swal("Please enter digits in quantity.");
// 		} else if(!$scope.unitrate && $scope.submat.type == 1) {

// 			swal("Please enter unit rate.");
// 		} else if(!$rootScope.digitcheck.test($scope.unitrate) && $scope.submat.type == 1) {

// 			swal("Please enter digits in unit rate.");
// 		} else if(!$scope.uomval) {

// 			swal("Please select a uom.");
// 		} else {

// 			var checkmat = 0;

// 			var checkaggmat = 0;

// 			angular.forEach($scope.pomateriallistnew,function(pomat){

// 				angular.forEach(pomat.materials,function(inpomat){

// 					if($scope.submat.type == 1) {

// 						if(inpomat['materialid'] == $scope.submat.id) {

// 							checkmat++;
// 						}
// 					} else {

// 						angular.forEach($scope.submat.level1mat, function(indimat){

// 							if(indimat.selected){

// 								if(inpomat['materialid'] == indimat.storematerial.id) {

// 									checkmat++;
// 									checkaggmat++;
// 								}
// 							}
// 						});
// 					}
					

// 				});
// 			});

// 			if(checkmat > 0) {

// 				if(checkaggmat > 0) {

// 					swal("Please uncheck the already added material for this aggregator/fabrication material.", "", "warning");
// 				} else {

// 					swal("Material already added.", "", "warning");
// 				}
// 			} else {
// 				$rootScope.showloader=true;

// 				if(!$scope.deliveryaddress) {

// 					$scope.deliveryaddress = "";				
// 				}

// 				var maxelementcount = 0;

// 				angular.forEach($scope.pomateriallist,function(pomat){
						
// 					if(pomat.elementcount > maxelementcount) {

// 						maxelementcount = pomat.elementcount;
// 					}
// 				});

// 				var thiselementcount = maxelementcount+1;

// 				if($scope.submat.type != 1) {
// 					var uomcount = 0,
// 						qtycount = 0,
// 						unitcount = 0;

// 					angular.forEach($scope.submat.level1mat, function(indimat){

// 						if(indimat.selected){

// 							if(indimat.uom) {

// 								uomcount++;
// 							}
// 							if(indimat.qtythis && indimat.qtythis != 0) {

// 								qtycount++;
// 							}
// 							if(indimat.unitrate && indimat.unitrate != 0) {

// 								unitcount++;
// 							}

// 						}

// 					});

// 					if(uomcount == 0) {

// 						swal("Please select UOM for all selected materials.");
// 					} else if(qtycount == 0){

// 						swal("Please enter quantity for all selected materials.");
// 					} else if(unitcount == 0) {

// 						swal("Please enter unit rate for all selected materials.");
// 					} else {

// 						var pomatlen = $scope.pomateriallistnew.length;
// 						if(pomatlen == 0){

// 							pomatlen = 1;
// 						}

// 						$scope.pomateriallistnew[pomatlen] = [];

// 						$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
// 						$scope.pomateriallistnew[pomatlen]['matid'] = $scope.submat.id;
// 						$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;
// 						$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.valueofgoods;
// 						$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.uomval.id;
// 						$scope.pomateriallistnew[pomatlen]['units'] = $scope.uomval.stmatuom.uom;
// 						$scope.pomateriallistnew[pomatlen]['materials'] = [];
						

// 						angular.forEach($scope.submat.level1mat, function(indimat){

// 							if(indimat.selected){

// 								$scope.pomateriallist.push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "mainuomid":$scope.uomval.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks});
// 								var originalindex = $scope.pomateriallist.length-1;

// 								 $scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex});

// 								// $scope.pomateriallistnew[$scope.submat.id]['materials'].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.units, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex});


// 								$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);

// 							}

// 						});

// 						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
// 						$scope.calculatetotalvalueofgoods();

// 						$scope.materialtype = "";
// 						$scope.submat = "";
// 						$scope.quantity = "";
// 						$scope.unitrate = "";
// 						$scope.valueofgoods = "";
// 						$scope.uomval = "";
// 						$scope.remarks = "";

// 						var elementcount = 0;

// 						angular.forEach($scope.pomateriallist,function(pomat){
									
// 							pomat.elementcount = elementcount;
// 							elementcount++;
// 						});


// 						angular.forEach($scope.taxdetails,function(potax){
								
// 							potax.elementcount = elementcount;
// 							elementcount++;
// 						});
// 					}

					

// 				} else {

// 					if(!$scope.pomateriallistnew[0]) {

// 						$scope.pomateriallistnew[0] = [];
// 						$scope.pomateriallistnew[0]['materials'] = [];
// 					}

// 					$scope.pomateriallist.push({"materialdesc":$scope.submat.name, "uom":$scope.uomval.stmatuom.uom, "uomid":$scope.uomval.id, "mainuomid":0, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":$scope.submat.id, "remarks":$scope.remarks, "elementcount":thiselementcount});

// 					var originalindex = $scope.pomateriallist.length-1;

// 					$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.uomval.stmatuom.uom, "uomid":$scope.uomval.id, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":$scope.submat.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex, "elementcount":thiselementcount});

// 						$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.valueofgoods);

// 						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
// 						$scope.calculatetotalvalueofgoods();

// 						$scope.materialtype = "";
// 						$scope.submat = "";
// 						$scope.quantity = "";
// 						$scope.unitrate = "";
// 						$scope.valueofgoods = "";
// 						$scope.uomval = "";
// 						$scope.remarks = "";

// 						var elementcount = thiselementcount+1;

						
// 						angular.forEach($scope.taxdetails,function(potax){
								
// 							potax.elementcount = elementcount;
// 							elementcount++;
// 						});

// 				}	

// 				console.log($scope.pomateriallistnew);	

// 				$rootScope.showloader=false;

// 			}
// 		}

// 	}
// 	$scope.totalcostfortax = 0;
// 	$scope.taxmatarr = [];


// 	$scope.changetaxtype = function() {

// 		$scope.taxmatarr = [];

// 		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

// 			angular.forEach($scope.pomateriallist, function(inpomat) {

// 				if(inpomat.selected) {

// 					$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], inpomat['elementcount'], 'po_material', inpomat.selected);
// 				}
// 			});

// 			angular.forEach($scope.taxdetails, function(inpotax) {

// 				if(inpotax.selected) {

// 					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, inpotax.elementcount, 'po_tax', inpotax.selected);
// 				}
// 			});
// 		}
// 	}

// 	$scope.toggletaxselectlist = function(thiscost, id, elementcountthis, type, taxmatselect){

// 		$rootScope.showloader=true;

// 		var totaltaxcost = 0;
// 		var matcheckthis = -1;

// 		if(type=="po_material") {
			

// 			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
// 				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

// 					matcheckthis = i;
// 				}
// 			}

// 			if(matcheckthis == -1) {
// 				var po_material_id = id;
// 				var tax_id = 0;

// 				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});				

// 			} else {

// 				$scope.taxmatarr.splice(matcheckthis, 1);

// 			}

// 		} else {

			
// 			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
// 				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

// 					matcheckthis = i;
// 				}
// 			}
// 			if(matcheckthis == -1) {

// 				var po_material_id = 0;
// 				var tax_id = id;


// 				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
// 			} else {


// 				$scope.taxmatarr.splice(matcheckthis, 1);
// 			}
// 		}

// 		var thistaxvalue = 0;		
		
// 		angular.forEach($scope.taxmatarr,function(enqtax){
				
// 			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
// 		});

// 		$scope.totalcostfortax = totaltaxcost;
// 		if($scope.potaxdetails) {
// 			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
// 			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
// 		}

// 		$rootScope.showloader=false;
		
// 	}


// 	$scope.addtotax = function() {

// 		if(!$scope.potaxdetails) {

// 			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
// 		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

// 			swal("Please enter tax/discount amount.");
// 		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

// 			swal("Please enter digits in amount.");
// 		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

// 			swal("Please enter tax/discount percentage.");
// 		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

// 			swal("Please enter digits in tax/discount percentage.");
// 		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

// 			swal("Please select atleast one material to calculate tax/discount.");
// 		}else {

// 			var taxcheck = 0;

// 			angular.forEach($scope.taxdetails,function(potax){
						
// 				if(potax['id'] == $scope.potaxdetails.id) {

// 					taxcheck = 1;
// 				}
// 			});

// 			if(taxcheck == 1) {

// 				swal("Tax already added.");
// 			} else {


// 				var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);
// 				var lumpsum = 0;
// 				if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

// 					thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
// 					lumpsum=1;
// 					$scope.taxmatarr = [];
// 				} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

// 					thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
// 					lumpsum=1;
// 				}
// 				thistaxamount = thistaxamount.toFixed(2);
				
// 				$rootScope.showloader=true;

// 				if(!$scope.potaxdetails.inclusivepercentage) {

// 					$scope.potaxdetails.inclusivepercentage = 0;
// 				}

// 				$scope.taxdetails.push({"id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
// 				$scope.calculatetotalvalueofgoods();

// 				$scope.potaxdetails = [];
// 				$scope.taxmatarr = [];
// 				$scope.potaxdetails.description = "";
// 				$scope.totalcostfortax = 0;
// 				$scope.potaxdetails.selectedtaxvalue = 0;

// 				var maxelementcount = 0;

// 				angular.forEach($scope.pomateriallist,function(pomat){
						
// 					if(pomat.elementcount > maxelementcount) {

// 						maxelementcount = pomat.elementcount;
// 					}
// 					pomat.selected = false;
// 				});

// 				var thistaxelementcount = maxelementcount+1;

// 				angular.forEach($scope.taxdetails,function(potax){
						
// 					potax.elementcount = thistaxelementcount;
// 					potax.selected = false;
// 					thistaxelementcount++;
// 				});

// 				angular.forEach($scope.alltaxes,function(pomattax){
						
// 					pomattax.selectedtaxvalue = 0;
// 				});

// 				$rootScope.showloader=false;
// 			}
// 		}
// 	}

// 	$scope.calculatetotalvalueofgoods = function() {

// 		var totalpovalueofgoods = 0,
// 			totalvaluethis = 0;

// 		for(var i=0; i<$scope.taxdetails.length;i++){

// 			var taxamount = 0;
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
				
// 				taxamount = taxamount+parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
				
// 			}

// 			if($scope.taxdetails[i]['lumpsum'] == 1) {

// 				taxamount = $scope.taxdetails[i]['taxamount'];
// 			}

// 			if(taxamount > 0) {

// 				var taxamountfinal = ($scope.taxdetails[i]['taxpercentage']*taxamount)/100;
// 				taxamountfinal = taxamountfinal.toFixed(2);
// 				if($scope.taxdetails[i]['lumpsum'] == 0) {

// 					$scope.taxdetails[i]['taxamount'] = taxamountfinal;
// 				}
				
// 				if($scope.taxdetails[i]['taxtype'] == "discount") {

// 					totalpovalueofgoods = totalpovalueofgoods - parseFloat($scope.taxdetails[i]['taxamount']);
// 				} else {

// 					totalpovalueofgoods = totalpovalueofgoods + parseFloat($scope.taxdetails[i]['taxamount']);
// 				}
// 			}
// 		}

// 		angular.forEach($scope.pomateriallist,function(pomat){
				
// 			totalpovalueofgoods = totalpovalueofgoods+parseFloat(pomat.valueofgoods);
// 			totalvaluethis= totalvaluethis+parseFloat(pomat.valueofgoods);
// 		});

// 		totalpovalueofgoods = totalpovalueofgoods.toFixed(2);
// 		totalvaluethis = totalvaluethis.toFixed(2);

// 		$scope.totalvalueofgoods = totalpovalueofgoods;
// 		$scope.totalvalue = totalvaluethis;
// 	}

// 	$scope.addtospecial = function() {

// 		if(!$scope.specialtermtitle) {

// 			swal("Please enter term title.");
// 		} else if(!$scope.specialtermdesc) {

// 			swal("Please enter term description.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

// 			$scope.specialtermtitle = "";
// 			$scope.specialtermdesc = "";

// 			$rootScope.showloader=false;
// 		}
// 	}

// 	$scope.removerow = function(currentrow, matid, pomatnewmat, originalindex) {

// 		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

// 			for(var i=$scope.taxdetails.length-1; i>=0;i--){
							
// 				for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
// 					if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] != 0) {
// 						if(matid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {

// 							$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
// 						}
// 					} 
					
// 				}

// 				if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

// 					$scope.taxdetails.splice(i, 1);
// 				}
// 			}

// 			$scope.potaxdetails = [];
// 			$scope.taxmatarr = [];
// 			$scope.potaxdetails.description = "";
// 			$(".taxmatselect").prop("checked", false);
// 			$scope.totalcostfortax = 0;
// 			$scope.potaxdetails.selectedtaxvalue = 0;

// 			var remkey = 0;
			
// 			for(var i=$scope.pomateriallist.length-1; i>=0;i--){

// 				if($scope.pomateriallist[i]['materialid'] == matid) {

// 					remkey = i;
// 				}
// 			}
// 			$scope.pomateriallist.splice(remkey, 1);
// 			pomatnewmat.splice(currentrow, 1);

// 			if($scope.pomateriallist.length == 0) {

// 				$scope.taxdetails = [];
// 			}
// 			$scope.calculatetotalvalueofgoods();

// 			$scope.$apply();

// 			swal("Material deleted successfully.", "", "success");

// 		});
// 	}

// 	$scope.removetaxrow = function(currentrow) {

// 		var thistaxid = $scope.taxdetails[currentrow]['id'];

// 		for(var i=$scope.taxdetails.length-1; i>=0;i--){
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
// 				if($scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id'] != 0) {
// 					if(thistaxid == $scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id']) {

// 						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
// 					}
// 				} 
				
// 			}

// 			if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

// 				$scope.taxdetails.splice(i, 1);
// 			}
// 		}

// 		$scope.potaxdetails = [];
// 		$scope.taxmatarr = [];
// 		$scope.potaxdetails.description = "";
// 		$(".taxmatselect").prop("checked", false);
// 		$scope.totalcostfortax = 0;
// 		$scope.potaxdetails.selectedtaxvalue = 0;

// 		$scope.taxdetails.splice(currentrow, 1);

// 		$scope.calculatetotalvalueofgoods();
		
// 	}

// 	$scope.removespecialrow = function(currentrow) {

// 		$scope.specialterms.splice(currentrow-1, 1);
// 	}

// 	$scope.matchange = function() {

// 		if($scope.submat.type!=1) {

// 			$scope.quantity = 1;

// 			angular.forEach($scope.submat.level1mat, function(indimat){

// 				if($scope.submat.type==3) {

// 					indimat.qtythis = angular.copy(indimat.qty_per_pole);
// 				} else {

// 					indimat.qtythis = angular.copy(indimat.qty);
// 				}

// 				indimat.uom = angular.copy(indimat.storeuom);
// 				indimat.selected = true;
// 			});
// 		}
// 	}

// 	$scope.isselectallsub = function(){

// 		if($scope.submat) {

// 			var countselect = 0;

// 			angular.forEach($scope.submat.level1mat, function(indimat){

// 				if(indimat.selected) {

// 					countselect++;
// 				}
// 			});

// 			if($scope.submat.level1mat.length == countselect) {

// 				return true;
// 			} else {

// 				return false;
// 			}
// 		}
// 	}

// 	$scope.generatepo = function() {

// 		if(!$scope.termsncondition) {

// 			swal("Please enter terms and conditions.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$http({
// 				method:'POST',
// 				url:$rootScope.requesturl+'/generatepo',
// 				data:{materiallist:$scope.pomateriallist, vendorid:$scope.vendorid, projectid:$scope.projectid, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, pomanualdate:$scope.pomanualdate, ponothis:$scope.ponothis, potype:$scope.potype },
// 				headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				$rootScope.showloader=false;
// 				if(result == 0) {

// 					swal("The entered Purcahse Order Number already exists.")
// 				} else {
// 					var totaloriginalcost = 0;

// 					angular.forEach($scope.pomateriallist,function(pomat){
							
// 						totaloriginalcost = totaloriginalcost+parseInt(pomat.valueofgoods);
// 					});
// 					$scope.totalvalueofgoods = angular.copy(Math.round($scope.totalvalueofgoods));
// 					$scope.totalcostwords = getwords($scope.totalvalueofgoods.toString());
// 					$scope.totalvalueofgoods = Commas.getcomma($scope.totalvalueofgoods);
// 					$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
					

// 					$scope.companyvendorinfo = result;
// 					$scope.pono = result['pono'];

// 					$("#GeneratePoModal").modal('show');
// 				}

// 			}).error(function(data,status){
// 				console.log(data+status);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}		
// 	}

// 	$scope.printpo = function() {

// 		var prtContent = document.getElementById("dd");
// 		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
// 		WinPrint.document.write(prtContent.innerHTML);
// 		WinPrint.document.close();
// 		WinPrint.focus();
// 		WinPrint.print();
// 		WinPrint.close();
// 	}

// 	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }


// 	$scope.selectall = function(pomaterials, taxdetails){

// 		if(pomaterials.length){
// 			var x = !$scope.isallselected(pomaterials);

// 			if(x == true) {

// 				$scope.taxmatarr = [];
// 			}

// 			angular.forEach(pomaterials,function(pomat){
// 				pomat.selected = x;

// 				$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['materialid'], pomat['elementcount'], 'po_material', pomat.selected);

// 			});

// 			angular.forEach(taxdetails,function(potax){
// 				potax.selected = x;

// 				$scope.toggletaxselectlist(potax.taxamount, potax.id, potax.elementcount, 'po_tax', potax.selected);
// 			});

// 		}else{
// 			return false;
// 		}
// 	};

// 	$scope.isallselected = function(pomaterials, taxdetails){
// 		if(pomaterials.length){
// 			var count = 0;
// 			angular.forEach(pomaterials,function(pomat){
// 				if(pomat.selected){
// 					count++;
// 				}
// 			});

// 			var taxcount = 0;

// 			angular.forEach(taxdetails,function(potax){
// 				if(potax.selected){
// 					count++;
					
// 				}
// 				taxcount++;
// 			});


// 			var totallength = taxcount+pomaterials.length;

// 			if(count == totallength){
// 				return true;
// 			}else{
// 				return false;
// 			}
// 		}else{
// 			return false;
// 		}
// 	};

// });

app.controller("PurchasesReportsPoOrderController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;

	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$scope.poorderreportopt = 'vendorwise';

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

	$scope.searchpo = function() {
		$scope.ponodetails = [];

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.ponumber) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_po_info',
			params:{pono:$scope.ponumber},
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
							$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['inversestore']['type'];
							if(pomat['storematerial']['parent_id'] != 0) {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = pomat['storematerial']['inversestore']['name'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materialid'] = pomat['storematerial']['inversestore']['id'];
								
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['mainuomid'] = pomat['store_material_main_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['uomid'] = pomat['store_material_uom_id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['id'] = pomat['id'];
								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['units'] = pomat['storematerial']['matuom'][0]['stmatuom']['id'];
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

						if(pomat['storematerial']['inversestore']['type'] == 3) {

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

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
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
			url:$rootScope.requesturl+'/get_vendor_polist',
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
							if(pomat['remarks'] != '') {

								$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname'] = $scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['matname']+", "+pomat['remarks'];
							}
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
				console.log($scope.pomateriallistnewpre);
				angular.forEach($scope.pomateriallistnewpre,function(pomatnew){

					$scope.pomateriallistnew[l] = pomatnew;
					l++;
				});
				angular.forEach($scope.pomateriallistnew,function(pomat){
							
					if(pomat.type == 3 && pomat['materials'].length>0) {

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

		if(!$scope.projectid) {

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
			params:{fromdate:$scope.pofromdate, todate:$scope.potodate, projectid:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
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

app.controller("PurchasesEditMaterialController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.materialtypeid = 'select';
	$rootScope.showloader=true;
	
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.materials = result;
		
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectlist = result;
		$scope.projectids = ["2","4"];
	});

	$scope.projchange = function() {

		console.log($scope.projectids);
	}

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_uoms',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(uomresult){

		$rootScope.showloader=false;
		$scope.uomlist = uomresult;

	});

	$scope.matfilter = function(smat){

		if(smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)){

			return true;
		} else {

			return false;
		}
	}
	

	$scope.materialchange = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.materialtypeid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;

			$scope.submat = 'select';

			$scope.submaterials = result;

			$scope.uomval = '';

			console.log(result);
			
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			// Logging.validation(status);
		});
	}

	$scope.editmaterial = function(submat) {

		submat['edit'] = true;
		submat['unitss'] = submat['units'];
	}

	$scope.savematerial = function(submat) {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/edit_materials',
			data:{submat:submat},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			if(result == 1) {
				
				swal("Material updated.", "", "success");
			} else if(result == 2) {

				swal("Sorry, the material code you entered already exists for some other material.", "", "warning");
				submat['material_code'] = "";
			} else {

				swal("Sorry, you cannot edit this material because it is there in one of the purchase orders.", "", "warning");

			}
			submat['edit'] = false;
			

		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}

	$scope.deletematerial = function(matid, currentrow) {

		if (confirm('Are you sure you want to delete this material')) {

		    $rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/delete_materials',
				data:{matid:matid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {
					
					swal("Material deleted.", "", "success");
					$scope.submaterials['submaterials'].splice(currentrow, 1);
				} else if(result == 2) {

					swal("Sorry, you cannot delete this material because it is mapped to vendor(s). Please delete it from 'Vendor materials' first.", "", "warning");
				}else {

					swal("Sorry, you cannot delete this material because it is there in one of the purchase orders.", "", "warning");
				}			

			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

		} else {
		    return false;
		}

		
	}

});

app.controller("PurchasesEditVendorMaterialController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.materials = [];
	$scope.showaddbox = false;
	$scope.materialtype = 'select';
	$scope.submaterials = [];
	$scope.vendor = [];
	$scope.vendor.accountdetails = [];
	$scope.materialvalues = [];

	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;

	});

	$scope.vendorchange = function(){
		if($scope.vendor.name){
			$scope.materialvalues = [];
			$scope.vendor.name = "";
			$scope.materials= [];
			$scope.submaterials = [];
			$scope.showaddbox = false;
		}
	}

	$scope.searchvendormat = function() {

		if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_vendor_materials',
				params:{vendorid:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.materials = result;

				angular.forEach($scope.materials,function(venmat){
					angular.forEach(venmat.submaterials,function(vensub){
						$scope.materialvalues.push(vensub.id);
					});
				});
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_vendor_info',
				params:{vendorid:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.vendor = result;
				$scope.showaddbox = true;

			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}


	}

	$scope.addaccountdetails = function() {

		if(!$scope.accountno) {

			swal("Please enter bank account number.");
		} else if(!$scope.ifsccode) {

			swal("Please enter IFSC code.");
		} else if(!$scope.bankname) {

			swal("Please enter bank name.");
		} else if(!$scope.bankbranch) {

			swal("Please enter bank branch.");
		} else {

			$scope.vendor.accountdetails.push({"bank_name":$scope.bankname, "bank_branch":$scope.bankbranch, "ifsc_code":$scope.ifsccode, "account_number":$scope.accountno});

			$scope.accountno= "";
			$scope.bankname = "";
			$scope.bankbranch = "";
			$scope.ifsccode = "";
		}
	}

	$scope.removeacrow = function(key) {

		$scope.vendor.accountdetails.splice(key, 1);
	}


	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.venmaterials = result;
		
	});

	$scope.toggleSelection = function toggleSelection(sub) {

		if(sub.type == 1 || sub.type == 3) {

		    var idx = $scope.materialvalues.indexOf(sub.id);

		    // is currently selected
		    if (idx > -1) {
		      $scope.materialvalues.splice(idx, 1);
		    }

		    // is newly selected
		    else {
		      $scope.materialvalues.push(sub.id);
		    }
		} else {

			if(sub.level1mat.length > 0) {

				angular.forEach(sub.level1mat, function(inlevelmat){
					
					inlevelmat.selected = true;
					var idx = $scope.materialvalues.indexOf(inlevelmat.storematerial.id);
				    // is currently selected
				    if (idx > -1) {

				      $scope.materialvalues.splice(idx, 1);
				    }
				    // is newly selected
				    else {
				      $scope.materialvalues.push(inlevelmat.storematerial.id);
				    }
				});
			}
		}

		console.log($scope.materialvalues);
	};

	$scope.deletematerial = function(matid, currentrow, parentindex) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

		    $rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/delete_vendor_materials',
				data:{matid:matid, vendorid:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {
					
					swal("Material deleted.", "", "success");
					$scope.materials[parentindex]['submaterials'].splice(currentrow, 1);
					var idx = $scope.materialvalues.indexOf(matid);

				    $scope.materialvalues.splice(idx, 1);
				    
				} else {

					swal("Sorry, you cannot delete this material because it is there in one of the purchase orders for the selected vendor.", "", "warning");
				}			

			}).error(function(data,status){
				console.log(data);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

		});

		
	}


	$scope.addmaterialbox = function() {

		$rootScope.showloader=true;
		var x = 0;
		angular.forEach($scope.submaterials,function(subm){
					
				if(subm.id == $scope.materialtype.id) {

					x=1;
				}
		});
		if(x==0) {
			$scope.submaterials.unshift($scope.materialtype);	
		}
		$rootScope.showloader=false;
	}

	$scope.matfilter = function(smat){

		if(smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)){

			return true;
		} else {

			return false;
		}
	}

	$scope.savevendormat = function() {

		if(!$scope.vendor.name) {

			swal("Please enter vendor name.");
		}
		if(!$scope.vendor.contact_person) {

			swal("Please enter contact person name.");
		} else if(!$scope.vendor.emailid && !$scope.vendor.alternate_emailid) {

			swal("Please enter atleast one Email ID.");
		} else if(!$scope.vendor.phoneno && !$scope.vendor.alternate_phoneno) {

			swal("Please enter atleast one phone number.");
		} else if(!$scope.vendor.address) {

			swal("Please enter vendor address.");
		} else if(!$scope.vendor.vendor_code) {

			swal("Please enter vendor code.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_vendor_materials',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{name:$scope.vendor.name, contact_person:$scope.vendor.contact_person, emailid:$scope.vendor.emailid,alternate_emailid:$scope.vendor.alternate_emailid, phoneno: $scope.vendor.phoneno, alternate_phoneno:$scope.vendor.alternate_phoneno, address:$scope.vendor.address, vendor_code:$scope.vendor.vendor_code, materialvalues:$scope.materialvalues, vendorid:$scope.vendorid, cin:$scope.vendor.cin, tin:$scope.vendor.tin, pan:$scope.vendor.pan, servicetaxno:$scope.vendor.servicetaxno, accountdetails:$scope.vendor.accountdetails}
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {

					swal("Material added/edited selected vendor.", "", "success");
					$http({
						method:'GET',
						url:$rootScope.requesturl+'/get_vendor_materials',
						params:{vendorid:$scope.vendorid},
						headers:{'JWT-AuthToken':localStorage.pmstoken},
					}).
					success(function(result){

						$scope.materials = result;
					}).error(function(data,status){
						$rootScope.showloader=false;
						$rootScope.showerror=true;
						//Logging.validation(status);
					});

				} else {

					swal("Something went wrong.");
				}
				
			});

		}
	}

	$scope.selectall = function(submat){
		if(submat.submaterials && submat.submaterials.length){
			var x = !$scope.isallselected(submat);
			if(x == true) {

				$scope.materialvalues = [];
			}

			angular.forEach($scope.materials,function(sm){
				
				angular.forEach(sm.submaterials,function(subsm){
					$scope.toggleSelection(subsm);
				});
			});

			angular.forEach(submat.submaterials,function(sm){
				
				sm.selected = x;
				if(sm.parent_id == 0 || sm.parent_id == sm.id) {
					$scope.toggleSelection(sm);
				}
			});
		}else{
			return false;
		}
	};

	$scope.isallselected = function(submat){
		if(submat.submaterials && submat.submaterials.length){
			var count = 0;
			angular.forEach(submat.submaterials,function(sm){
				if(sm.selected){
					count++;
				}
			});
			if(count == submat.submaterials.length){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	};

});

app.controller("PurchasesUploadPoDocumentsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.filedat = [];
	$scope.doclist = [];

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



	$scope.uploadpo=function(files){

		$rootScope.showloader=true;
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.allplist={};
		$scope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/uploadpodoc',
			data:formdata,
			headers:{'Content-Type': undefined,
			'JWT-AuthToken':localStorage.pmstoken},
			transformRequest: function(data) {return data;}
		}).
		success(function(data){
			$rootScope.showloader=false;
			if(data[0]=='success')
			{
				$scope.filedat.fname=data[1];
			}
			else
			{
				swal(data[1]);
			}
		});
	}

	$scope.searchpo = function() {

		if(!$scope.ponumber) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_po_info',
			params:{pono:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Purchased Order No doesnot exist.");
					$scope.ponodetails = [];
				} else {
					$scope.doclist = [];
					if(result[0]['company_approved_po'] != "") {

						$scope.doclist.push({'type':'Company','pono':result[0]['po_no'], 'docpath':result[0]['company_approved_po']});
					}

					if(result[0]['vendor_approved_po'] != "") {

						$scope.doclist.push({'type':'Vendor','pono':result[0]['po_no'], 'docpath':result[0]['vendor_approved_po']});
					}

					if(result[0]['gtp_doc'] != "") {

						$scope.doclist.push({'type':'GTP','pono':result[0]['po_no'], 'docpath':result[0]['gtp_doc']});
					}

					$scope.ponodetails = result;
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
	}


	$scope.add_doc=function(type){

		if(!$scope.filedat.fname)
		{
			swal('Please select the file to upload');
		}
		else
		{

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/insert_po_docs',
			data:{'type':type, 'path':$scope.requesturl+'/uploads/podocs/'+$scope.filedat.fname,'pono':$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			$scope.doclist.push({'type':type,'pono':$scope.ponumber, 'docpath':$scope.requesturl+'/uploads/podocs/'+$scope.filedat.fname});

			$scope.filedat = [];

			document.getElementById('file_upload').value=null;
			document.getElementById('file_uploadven').value=null;
			document.getElementById('file_uploadgtp').value=null;
			$scope.searchpo();
		}
	}

	$scope.remove_doc=function(i, pono, type){

		swal({   title: "Are you sure you want to delete this document?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/delete_po_docs',
			data:{'pono':pono, 'type':type},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$scope.searchpo();
				swal("Deleted!", "Your file has been deleted.", "success"); 

			});

			

		});

		

	}

});

app.controller("PurchasesAddDefaultTermsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.specialterms = [];

	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_special_terms',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader = false;
		$scope.specialterms = result;

	});

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}
	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.saveterms = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/insert_special_terms',
			data:{terms:$scope.specialterms},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			swal("Special terms & conditions saved successfully", "", "success");
		});


	}

});



app.controller("PurchasesEditPoOldController",function($scope,$http,$rootScope,$state,Logging, Commas){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.ponoshow = false;
	$scope.taxtype = "tax";
	$scope.pomateriallist = [];
	$scope.taxdetails = [];
	$scope.amds = [];
	$scope.amds.amenddetails = []

	$scope.edittype = "amendment";
	$scope.pomateriallistnew = [];

	$scope.amendnewtot=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='3')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].pomaterials.value_of_goods)
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}

	$scope.amendoldtot=function(){
		if($scope.amds)
		{
			var amt=0.00;
			for(var i=0;i<$scope.amds.amenddetails.length;i++)
			{
				if($scope.amds.amenddetails[i].material_id!='0' && $scope.amds.amenddetails[i].type!='2')
				{
					amt=amt+parseFloat($scope.amds.amenddetails[i].oldpomaterials.value_of_goods)
				}
			}
			return amt;
		}
		else
		{
			return 0;
		}
	}

	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_po_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.polist = result;
		

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

	$scope.showamendmat = function() {

		var flag=0;

		for(i=0;i<$scope.amds.amenddetails.length;i++){

			if($scope.amds.amenddetails[i]['material_id'] != 0 || $scope.amds.amenddetails[i]['tax_id'] != 0) {

				flag = 1;
			}
		}

		if(flag==0) {

			return false;
		} else {

			return true;
		}
	}
	$scope.showamendterms = function() {

		var flag2=0;

		for(i=0;i<$scope.amds.amenddetails.length;i++){

			if($scope.amds.amenddetails[i]['po_term_name']) {

				flag2 = 1;
			}
		}

		if(flag2==0) {

			return false;
		} else {

			return true;
		}
	}

	$scope.changeedittype = function()
	{
		
		$scope.allshow =false;
	}

	$scope.taxcaltype = 'percentage';
	$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_tax_list',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;

			$scope.alltaxes = result;

		}).error(function(data,status){
			
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

		$scope.searchpo = function() {
			$scope.ponodetails = [];
			$scope.pono = false;

			$scope.editmat = null;


			if(!$scope.purchaseid) {

				swal("Please select a purchase order.");
			} else {

				$rootScope.showloader=true;

				$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_pomain_info',
				params:{pono:$scope.purchaseid,type:$scope.edittype},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					
					$rootScope.showloader=false;
					$scope.allshow =true;
						
						if(result == 0) {

							$scope.ponodetails = [];
							swal("Purchase Order Number doesnot exist.", "", "warning");
						}
						else if(result=='dateover')
						{
							$scope.ponodetails = [];
							swal("Cant edit PO because the edit date is over.", "", "warning");
							$scope.allshow = false;
						}
						else {
							$scope.ponoshow = true;
							$scope.ponodetails = result;

							$scope.ponodetails.cdate = $scope.ponodetails.po_date.substr(0,10);
							$scope.ponodetails.cdate = $scope.ponodetails.cdate.split("-").reverse().join("-");

							var thispoid = result['id'];
							$http({
							method:'GET',
							url:$rootScope.requesturl+'/get_vendor_list',
							headers:{'JWT-AuthToken':localStorage.pmstoken},
							}).
							success(function(resultven){

								$rootScope.showloader=false;

								$scope.vendorlist = resultven;
								

							});

							$http({
								method:'GET',
								url:$rootScope.requesturl+'/get_project_list',
								headers:{'JWT-AuthToken':localStorage.pmstoken},
							}).
							success(function(resultproj){

								$rootScope.showloader=false;
								$scope.projectlist = resultproj;

							});

							$http({
								method:'GET',
								url:$rootScope.requesturl+'/get_material_types',
								headers:{'JWT-AuthToken':localStorage.pmstoken},
							}).
							success(function(resultmat){

								$rootScope.showloader=false;
								$scope.materials = resultmat;
								
							});

							$http({
								method:'GET',
								url:$rootScope.requesturl+'/get_pomateriallist',
								headers:{'JWT-AuthToken':localStorage.pmstoken},
								params:{pono:thispoid},
							}).
							success(function(poresult){

								$scope.pomateriallist = poresult;
								var totaloriginalcost = 0;

								angular.forEach($scope.pomateriallist,function(pomat){

									if(!$scope.pomateriallistnew[pomat['storematerial']['parent_id']]) {
									
										$scope.pomateriallistnew[pomat['storematerial']['parent_id']] = [];
									}
									if(pomat['storematerial']['parent_id'] != 0) {

										$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['matname'] = pomat['storematerial']['inversestore']['name'];

										$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['matid'] = pomat['storematerial']['inversestore']['id'];
										$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['type'] = pomat['storematerial']['inversestore']['type'];
										//$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['valueofgoods'] = $scope.valueofgoods;
										$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['mainuomid'] = pomat['store_material_main_uom_id'];
										$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['units'] = $scope.uomval.stmatuom.uom;
									}
									
									
									$scope.pomateriallistnew[pomat['storematerial']['parent_id']]['materials'] = [];

									totaloriginalcost = totaloriginalcost+parseInt(pomat.value_of_goods);
									pomat['materialdesc'] = pomat['storematerial']['name'];
									pomat['uom'] = pomat['storematerial']['units'];
									pomat['qty'] = pomat['quantity'];
									pomat['unitrate'] = pomat['unit_rate'];
									pomat['valueofgoods'] = pomat['value_of_goods'];
								});
								$scope.totalcostwords = getwords(Math.round($scope.ponodetails['total_cost']).toString());
								
								$scope.totalvalue = totaloriginalcost;
								$http({
								method:'GET',
									url:$rootScope.requesturl+'/get_potaxes',
									headers:{'JWT-AuthToken':localStorage.pmstoken},
									params:{pono:thispoid},
								}).
								success(function(poresult){

									$scope.taxdetails = poresult;
									
									
									$scope.totalvalueofgoods = angular.copy($scope.ponodetails['total_cost']);
									angular.forEach($scope.taxdetails,function(potax){
											
										potax.taxtitle = potax.name;
										potax.taxtype = potax.type;
										potax.taxamount = potax.value;
										potax.taxdescription = potax.tax_desc;
										potax.inclusivetaxpercentage = potax.inclusive_taxpercentage;
										potax.selected = false;

									});

									var elementcount = 0;

									angular.forEach($scope.pomateriallist,function(pomat){
											
										pomat.elementcount = pomat.purchase_unique_id;
										if(pomat.purchase_unique_id > elementcount) {

											elementcount = pomat.purchase_unique_id
										}
									});

									elementcount++;


									angular.forEach($scope.taxdetails,function(potax){
											
										potax.elementcount = elementcount;
										elementcount++;
									});

									angular.forEach($scope.taxdetails, function(potax){

										angular.forEach(potax.taxmaterials, function(potaxmat) {

											if(potaxmat.material_id != 0) {

												angular.forEach($scope.pomateriallist,function(pomat){

													if(potaxmat.material_id == pomat.id) {

														potaxmat.elementcount = angular.copy(pomat.elementcount);
													}
												});
											} else {

												angular.forEach($scope.taxdetails,function(potaxin){

													if(potaxmat.tax_id == potaxin.id) {

														potaxmat.elementcount = angular.copy(potaxin.elementcount);
													}
												});
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
						}


						

				}).error(function(data,status){
					
					$rootScope.showloader=false;
					$rootScope.showerror=true;
					//Logging.validation(status);
				});
			}
	    }



	$scope.totalcostfortax = 0;
	$scope.taxmatarr = [];

	$scope.toggletaxselectlist = function(thiscost, id, elementcountthis, type, taxmatselect){

		$rootScope.showloader=true;

		var totaltaxcost = 0;
		var matcheckthis = -1;

		if(type=="po_material") {
			

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

					matcheckthis = i;
				}
			}

			if(matcheckthis == -1) {
				var po_material_id = id;
				var tax_id = 0;

				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "mat":{"value_of_goods":thiscost}, "tax":{"tax_id":tax_id, "value":thiscost}});				

			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);

			}

		} else {

			
			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

					matcheckthis = i;
				}
			}
			if(matcheckthis == -1) {

				var po_material_id = 0;
				var tax_id = id;


				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "mat":{"value_of_goods":thiscost}, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {


				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		}

		var thistaxvalue = 0;		
		
		angular.forEach($scope.taxmatarr,function(enqtax){
				
			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
		});


		$scope.totalcostfortax = totaltaxcost;

		if($scope.potaxdetails) {
			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
		}

		$rootScope.showloader=false;
		
	}

	$scope.matchange = function() {

		if($scope.submat.type!=1) {

			$scope.quantity = 1;

			angular.forEach($scope.submat.level1mat, function(indimat){

				if($scope.submat.type==3) {

					indimat.qtythis = angular.copy(indimat.qty_per_pole);
				} else {

					indimat.qtythis = angular.copy(indimat.qty);
				}

				indimat.uom = angular.copy(indimat.storeuom);
				indimat.selected = true;
			});
		}
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

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;


		angular.forEach($scope.pomateriallist,function(pomat){

			if(!pomat['freightinsurance_rate']) {

				pomat['freightinsurance_rate'] = 0;
			}
			totalfreightcost += parseFloat(pomat['qty'])*parseFloat(pomat['freightinsurance_rate']);
		});

		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);

	}


	$scope.changetaxtype = function() {

		$scope.taxmatarr = [];
		$scope.potaxdetails.selectedtaxvalue = 0;

		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

			angular.forEach($scope.pomateriallist, function(inpomat) {

				if(inpomat.selected) {

					$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], inpomat['elementcount'], 'po_material', inpomat.selected);
				}
			});

			angular.forEach($scope.taxdetails, function(inpotax) {

				if(inpotax.selected) {

					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, inpotax.elementcount, 'po_tax', inpotax.selected);
				}
			});
		}
	}

	$scope.addtotax = function() {

		if(!$scope.potaxdetails) {

			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount amount.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in amount.");
		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount percentage.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in tax/discount percentage.");
		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select atleast one material to calculate tax/discount.");
		}else {

			var taxcheck = 0;

			angular.forEach($scope.taxdetails,function(potax){
						
				if(potax['tax_id'] == $scope.potaxdetails.id) {

					taxcheck = 1;
				}
			});

			if(taxcheck == 1) {

				swal("Tax already added.");
			} else {


				var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);
				var lumpsum = 0;
				
				if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

					thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
					lumpsum=1;
					$scope.taxmatarr = [];
				} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

					thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
					lumpsum=1;
				}

				thistaxamount = thistaxamount.toFixed(2);

				if(!$scope.potaxdetails.inclusive_taxpercentage) {

					$scope.potaxdetails.inclusive_taxpercentage = 0;
				}
				
				$rootScope.showloader=true;

				$scope.taxdetails.push({"tax_id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusive_taxpercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
				
				$scope.calculatetotalvalueofgoods();

				$scope.potaxdetails = [];
				$scope.taxmatarr = [];
				$scope.potaxdetails.description = "";
				$(".taxmatselect").prop("checked", false);

				var maxelementcount = 0;

				angular.forEach($scope.pomateriallist,function(pomat){
						
					if(pomat.elementcount > maxelementcount) {

						maxelementcount = pomat.elementcount;
					}
				});

				var thistaxelementcount = maxelementcount+1;

				angular.forEach($scope.taxdetails,function(potax){
						
					potax.elementcount = thistaxelementcount;
					potax.selected = false;
					thistaxelementcount++;
				});


				$rootScope.showloader=false;
				
			}
		}
	}

	$scope.calculatetotalvalueofgoods = function() {

		var totalpovalueofgoods = 0,
			totalvaluethis = 0;

		for(var i=0; i<$scope.taxdetails.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] == 0) {
				
					taxamount = taxamount+parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
				} else {

					taxamount = taxamount+parseFloat($scope.taxdetails[i]['taxmaterials'][j]['mat']['value_of_goods']);
				}
				
			}

			if($scope.taxdetails[i]['lumpsum'] == 1) {

				taxamount = $scope.taxdetails[i]['taxamount'];
			}

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

		angular.forEach($scope.pomateriallist,function(pomat){
				
			totalpovalueofgoods = totalpovalueofgoods+parseFloat(pomat.valueofgoods);
			totalvaluethis= totalvaluethis+parseFloat(pomat.valueofgoods);
		});

		totalpovalueofgoods = totalpovalueofgoods.toFixed(2);
		totalvaluethis = totalvaluethis.toFixed(2);

		$scope.totalvalueofgoods = totalpovalueofgoods;
		$scope.totalvalue = totalvaluethis;

	}



	$scope.materialchange = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.materialtype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;

			$scope.submat = 'select';

			$scope.submaterials = result.submaterials;

		});
	}

	$scope.getuom = function(id) {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_uom',
			params:{materialid:id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			
			$rootScope.showloader=false;

			$scope.uomval = result['units'];

		});
	}

	$scope.getgoodscost = function(type, submat) {

		if(!$scope.quantity && type != 'quantity' && type) {

			swal("Please enter quantity.");
		} else if(!$rootScope.digitcheck.test($scope.quantity) && type != 'unitrate' && type) {

			swal("Please enter digits in quantity.");
			$scope.quantity = "";
		}
		else if(!$scope.unitrate &&  type != 'quantity' &&  type != '') {

			swal("Please enter Unit Rate.");
		} else if(!$rootScope.digitcheck.test($scope.unitrate) && type != 'quantity' &&  type) {

			swal("Please enter digits in unit rate.");
			$scope.unitrate = "";
		} else {


			if(submat.type == 1) {

				$scope.valueofgoods = parseFloat($scope.quantity)*parseFloat($scope.unitrate);
				$scope.valueofgoods = angular.copy($scope.valueofgoods.toFixed(2));

			} else {

				var totalvalthis = 0;

				angular.forEach(submat.level1mat, function(indimat){

					if(type == 'quantity') {
						indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty);
					}
					if(submat.type == 3){

						indimat.qtythis = angular.copy(parseFloat($scope.quantity)*indimat.qty_per_pole);
					}
					if(!indimat.unitrate){

						indimat.unitrate = 0;
					}
					indimat.valueofgoods = angular.copy(parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate));

					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));

				});
				$scope.valueofgoods = angular.copy(totalvalthis);
			}
		}
	}

	$scope.aggcalval = function(pomat) {

		if(pomat.selected) {

			if(!$scope.valueofgoods){

				$scope.valueofgoods = 0;
			}

			if(pomat.unitrate && pomat.qtythis) {

				pomat.valueofgoods = angular.copy(parseFloat(pomat.qtythis)*parseFloat(pomat.unitrate));
				$scope.valueofgoods = angular.copy(parseFloat($scope.valueofgoods)+parseFloat(pomat.valueofgoods));
			}
		}
	}

	$scope.addtotable = function() {

		if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.quantity && $scope.submat.type == 1) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.quantity) && $scope.submat.type == 1) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.unitrate && $scope.submat.type == 1) {

			swal("Please enter unit rate.");
		} else if(!$rootScope.digitcheck.test($scope.unitrate) && $scope.submat.type == 1) {

			swal("Please enter digits in unit rate.");
		} else if(!$scope.uomval) {

			swal("Please select a uom.");
		} else {

			var checkmat = 0;

			var checkaggmat = 0;

			angular.forEach($scope.pomateriallistnew,function(pomat){

				angular.forEach(pomat.materials,function(inpomat){

					if($scope.submat.type == 1) {

						if(inpomat['materialid'] == $scope.submat.id) {

							checkmat++;
						}
					} else {

						angular.forEach($scope.submat.level1mat, function(indimat){

							if(indimat.selected){

								if(inpomat['materialid'] == indimat.storematerial.id) {

									checkmat++;
									checkaggmat++;
								}
							}
						});
					}
					

				});
			});

			if(checkmat > 0) {

				if(checkaggmat > 0) {

					swal("Please uncheck the already added material for this aggregator/fabrication material.", "", "warning");
				} else {

					swal("Material already added.", "", "warning");
				}
			} else {
				$rootScope.showloader=true;

				if(!$scope.deliveryaddress) {

					$scope.deliveryaddress = "";				
				}

				var maxelementcount = 0;

				angular.forEach($scope.pomateriallist,function(pomat){
						
					if(pomat.elementcount > maxelementcount) {

						maxelementcount = pomat.elementcount;
					}
				});

				var thiselementcount = maxelementcount+1;

				if($scope.submat.type != 1) {
					var uomcount = 0,
						qtycount = 0,
						unitcount = 0;

					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected){

							if(indimat.uom) {

								uomcount++;
							}
							if(indimat.qtythis && indimat.qtythis != 0) {

								qtycount++;
							}
							if(indimat.unitrate && indimat.unitrate != 0) {

								unitcount++;
							}

						}

					});

					if(uomcount == 0) {

						swal("Please select UOM for all selected materials.");
					} else if(qtycount == 0){

						swal("Please enter quantity for all selected materials.");
					} else if(unitcount == 0) {

						swal("Please enter unit rate for all selected materials.");
					} else {

						var pomatlen = $scope.pomateriallistnew.length;
						if(pomatlen == 0){

							pomatlen = 1;
						}

						$scope.pomateriallistnew[pomatlen] = [];

						$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
						$scope.pomateriallistnew[pomatlen]['matid'] = $scope.submat.id;
						$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;
						$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.valueofgoods;
						$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.uomval.id;
						$scope.pomateriallistnew[pomatlen]['units'] = $scope.uomval.stmatuom.uom;
						$scope.pomateriallistnew[pomatlen]['materials'] = [];
						

						angular.forEach($scope.submat.level1mat, function(indimat){

							if(indimat.selected){

								$scope.pomateriallist.push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "mainuomid":$scope.uomval.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks});
								var originalindex = $scope.pomateriallist.length-1;

								 $scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex});

								// $scope.pomateriallistnew[$scope.submat.id]['materials'].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.units, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":indimat.storematerial.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex});


								$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);

							}

						});

						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
						$scope.calculatetotalvalueofgoods();

						$scope.materialtype = "";
						$scope.submat = "";
						$scope.quantity = "";
						$scope.unitrate = "";
						$scope.valueofgoods = "";
						$scope.uomval = "";
						$scope.remarks = "";

						var elementcount = 0;

						angular.forEach($scope.pomateriallist,function(pomat){
									
							pomat.elementcount = elementcount;
							elementcount++;
						});


						angular.forEach($scope.taxdetails,function(potax){
								
							potax.elementcount = elementcount;
							elementcount++;
						});
					}

					

				} else {

					if(!$scope.pomateriallistnew[0]) {

						$scope.pomateriallistnew[0] = [];
						$scope.pomateriallistnew[0]['materials'] = [];
					}

					$scope.pomateriallist.push({"materialdesc":$scope.submat.name, "uom":$scope.uomval.stmatuom.uom, "uomid":$scope.uomval.id, "mainuomid":0, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":$scope.submat.id, "remarks":$scope.remarks, "elementcount":thiselementcount});

					var originalindex = $scope.pomateriallist.length-1;

					$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.uomval.stmatuom.uom, "uomid":$scope.uomval.id, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "materialid":$scope.submat.id, "remarks":$scope.remarks, "pomatoriginalindex":originalindex, "elementcount":thiselementcount});

						$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.valueofgoods);

						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
						$scope.calculatetotalvalueofgoods();

						$scope.materialtype = "";
						$scope.submat = "";
						$scope.quantity = "";
						$scope.unitrate = "";
						$scope.valueofgoods = "";
						$scope.uomval = "";
						$scope.remarks = "";

						var elementcount = thiselementcount+1;

						
						angular.forEach($scope.taxdetails,function(potax){
								
							potax.elementcount = elementcount;
							elementcount++;
						});

				}	

				console.log($scope.pomateriallistnew);	

				$rootScope.showloader=false;

			}
		}

	}

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}
	$scope.editmat = null;
	// $scope.editpomatqty=0;
	// $scope.editpomatunitrate=0;
	$scope.editrow = function(pomat){
		$scope.editmat = angular.copy(pomat.elementcount);
		pomat.editqty = angular.copy(pomat.quantity);
		pomat.editunitrate = angular.copy(pomat.unitrate);
		// 
		// 
	}
	$scope.saverow = function(index,pomat){
		if(pomat.payment_qty) {
			if(pomat.editqty < pomat.payment_qty) {

				swal("Material quantity cannot be less than the payment quantity.");
				pomat.editqty = 0;
				return false;
			}

		}
		$scope.editmat = null;
		$rootScope.showloader=false;
		$scope.pomateriallist[index]['qty'] = angular.copy(pomat.editqty);
		$scope.pomateriallist[index]['unitrate'] = angular.copy(pomat.editunitrate);
		$scope.pomateriallist[index]['valueofgoods'] = angular.copy(pomat.editqty*pomat.editunitrate);

		for(var i=0; i<$scope.taxdetails.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

				if($scope.taxdetails[i]['taxmaterials'][j]['mat']) {

						if($scope.taxdetails[i]['taxmaterials'][j]['mat']['material_id'] != 0) {

							if($scope.taxdetails[i]['taxmaterials'][j]['mat']['material_id'] == $scope.pomateriallist[index]['material_id']) {
							
								$scope.taxdetails[i]['taxmaterials'][j]['mat']['value_of_goods'] = angular.copy($scope.pomateriallist[index]['valueofgoods']);
							}

						}
				}
				
			}

			var totalfreightlump = 0;

			if($scope.taxdetails[i]['lumpsum'] == 1 && $scope.taxdetails[i]['tax_id'] == 11) {

				for(var x=0;x<$scope.pomateriallist.length;x++) {

					totalfreightlump += $scope.pomateriallist[x]['qty']*$scope.pomateriallist[x]['freightinsurance_rate'];
				}

				$scope.taxdetails[i]['taxamount'] = angular.copy(totalfreightlump);
			}

		}
		
		$scope.calculatetotalvalueofgoods();

		for(var i=0; i<$scope.taxdetails.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

				if($scope.taxdetails[i]['taxmaterials'][j]['tax']) {

					if($scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id'] != 0) {

						for(var k=0; k<$scope.taxdetails.length;k++){

							if($scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id'] == $scope.taxdetails[k]['tax_id']) {

								$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy($scope.taxdetails[k]['taxamount']);
							}
						}
					}
				}
				
			}

		}

		$scope.calculatetotalvalueofgoods();

	}


	$scope.removerow = function(currentrow, matid) {

		for(var i=$scope.taxdetails.length-1; i>=0;i--){
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] != 0) {
					if(matid == $scope.taxdetails[i]['taxmaterials'][j]['mat']['material_id']) {

						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
					}
				} 
				
			}


			if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

				$scope.taxdetails.splice(i, 1);
			}
		}

		$scope.potaxdetails = [];
		$scope.taxmatarr = [];
		$scope.potaxdetails.description = "";
		$(".taxmatselect").prop("checked", false);
		$scope.totalcostfortax = 0;
		$scope.potaxdetails.selectedtaxvalue = 0;

		$scope.removedelementcount = angular.copy($scope.pomateriallist[currentrow]['elementcount']);
		
		$scope.pomateriallist.splice(currentrow, 1);

		if($scope.pomateriallist.length == 0) {

			$scope.taxdetails = [];
		}
		$scope.calculatetotalvalueofgoods();
	}

	$scope.removetaxrow = function(currentrow) {

		var thistaxid = $scope.taxdetails[currentrow]['id'];

		for(var i=$scope.taxdetails.length-1; i>=0;i--){
						
			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
				if($scope.taxdetails[i]['taxmaterials'][j]['tax']) {
					if($scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id'] != 0) {
						if(thistaxid == $scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id']) {

							$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
						}
					} 
				}
				
			}

			if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

				$scope.taxdetails.splice(i, 1);
			}
		}

		$scope.potaxdetails = [];
		$scope.taxmatarr = [];
		$scope.potaxdetails.description = "";
		$(".taxmatselect").prop("checked", false);
		$scope.totalcostfortax = 0;
		$scope.potaxdetails.selectedtaxvalue = 0;

		$scope.taxdetails.splice(currentrow, 1);

		$scope.calculatetotalvalueofgoods();
		
	}

	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.savepo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/savepo',
				data:{materiallist:$scope.pomateriallist, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.ponodetails.project.id, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$scope.purchaseid },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;

				$scope.amds=result[1];
				var totaloriginalcost = 0;

				angular.forEach($scope.pomateriallist,function(pomat){
						
					pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
					totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
				});
				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

				$scope.companyvendorinfo = result[0];
				$scope.pono = result[0]['pono'];

				$("#GeneratePoModal").modal('show');

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


	$scope.editpo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/editpo',
				data:{materiallist:$scope.pomateriallist, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.ponodetails.project.id, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$scope.purchaseid },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;


				var totaloriginalcost = 0;

				angular.forEach($scope.pomateriallist,function(pomat){
						
					pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
					totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
				});
				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

				$scope.companyvendorinfo = result;
				$scope.pono = result['pono'];

				$("#GeneratePoModal").modal('show');

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}

	$scope.printpo = function() {

		var prtContent = document.getElementById("dd");
		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
	}



	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

	$scope.selectall = function(pomaterials, taxdetails){

		// if(pomaterials.length){
		// 	var x = !$scope.isallselected(pomaterials);

		// 	if(x == true) {

		// 		$scope.taxmatarr = [];
		// 	}

		// 	angular.forEach(pomaterials,function(pomat){
		// 		pomat.selected = x;

		// 		$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['material_id'], pomat['elementcount'], 'po_material', pomat.selected);

		// 	});

		// 	angular.forEach(taxdetails,function(potax){
		// 		potax.selected = x;

		// 		$scope.toggletaxselectlist(potax.taxamount, potax.tax_id, potax.elementcount, 'po_tax', potax.selected);
		// 	});

		// }else{
		// 	return false;
		// }
	};

	$scope.isallselected = function(pomaterials, taxdetails){

		// var count = 0;
		// angular.forEach(pomaterials,function(pomat){
		// 	if(pomat.selected){
		// 		count++;
		// 	}
		// });

		// var taxcount = 0;

		// angular.forEach(taxdetails,function(potax){
		// 	if(potax.selected){
		// 		count++;
				
		// 	}
		// 	taxcount++;
		// });


		// var totallength = taxcount+pomaterials.length;

		// if(count == totallength){
		// 	return true;
		// }else{
		// 	return false;
		// }
	};

});

// app.controller("PurchasesEditPoController",function($scope,$http,$rootScope,$state,Logging, Commas){
// 	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

// 	$scope.ponoshow = false;
// 	$scope.taxtype = "tax";
// 	$scope.pomateriallist = [];
// 	$scope.taxdetails = [];

// 	$scope.edittype = "amendment";

// 	$rootScope.showloader = true;
// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_po_list',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.polist = result;
// 		$.getScript('chosen/chosen.jquery.js',function(){
// 			var config2 = {
// 				'.chosen-selectpolist'           : {},
// 				'.chosen-selectpolist-deselect'  : {allow_single_deselect:true},
// 				'.chosen-selectpolist-no-single' : {disable_search_threshold:10},
// 				'.chosen-selectpolist-no-results': {no_results_text:'Oops, nothing found!'},
// 				'.chosen-selectpolist-width'     : {width:'95%'}
// 			}
// 			for (var selector in config2) {
// 				$(selector).chosen(config2[selector]);
// 			}
// 		});

// 	});

// 	$scope.changeedittype = function()
// 	{
// 		console.log('123');
// 		$scope.allshow =false;
// 	}

// 	$scope.taxcaltype = 'percentage';
// 	$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_tax_list',
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			$rootScope.showloader=false;

// 			$scope.alltaxes = result;

// 		}).error(function(data,status){
// 			console.log(data+status);
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			//Logging.validation(status);
// 		});

// 		$scope.searchpo = function() {
// 			$scope.ponodetails = [];
// 			$scope.pono = false;


// 			if($(".chosen-selectpolist").val() == '? undefined:undefined ?') {

// 				swal("Please select a purchase order.");
// 			} else {

// 				$rootScope.showloader=true;

// 				$http({
// 				method:'GET',
// 				url:$rootScope.requesturl+'/get_pomain_info',
// 				params:{pono:$(".chosen-selectpolist").val(),type:$scope.edittype},
// 				headers:{'JWT-AuthToken':localStorage.pmstoken},
// 				}).
// 				success(function(result){
// 					console.log(result);
// 					$rootScope.showloader=false;
// 					$scope.allshow =true;
						
// 						if(result == 0) {

// 							$scope.ponodetails = [];
// 							swal("Purchase Order Number doesnot exist.", "", "warning");
// 						}
// 						else if(result=='dateover')
// 						{
// 							$scope.ponodetails = [];
// 							swal("Cant edit PO because the edit date is over.", "", "warning");
// 							$scope.allshow = false;
// 						}
// 						else {
// 							$scope.ponoshow = true;
// 							$scope.ponodetails = result;

// 							$scope.ponodetails.cdate = $scope.ponodetails.po_date.substr(0,10);
// 							$scope.ponodetails.cdate = $scope.ponodetails.cdate.split("-").reverse().join("-");

// 							var thispoid = result['id'];
// 							$http({
// 							method:'GET',
// 							url:$rootScope.requesturl+'/get_vendor_list',
// 							headers:{'JWT-AuthToken':localStorage.pmstoken},
// 							}).
// 							success(function(resultven){

// 								$rootScope.showloader=false;

// 								$scope.vendorlist = resultven;

// 									$.getScript('chosen/chosen.jquery.js',function(){
										
// 										var config = {
// 											'.chosen-select'           : {},
// 											'.chosen-select-deselect'  : {allow_single_deselect:true},
// 											'.chosen-select-no-single' : {disable_search_threshold:10},
// 											'.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
// 											'.chosen-select-width'     : {width:'95%'}
// 										}
// 										for (var selector in config) {
// 											$(selector).chosen(config[selector]);
// 										}

// 										//updating chosen value with vendor id
// 										$(".chosen-select").val($scope.ponodetails['vendor_id']);
// 										$('.chosen-select').trigger('chosen:updated');
// 									});

									

// 							});

// 							$http({
// 								method:'GET',
// 								url:$rootScope.requesturl+'/get_project_list',
// 								headers:{'JWT-AuthToken':localStorage.pmstoken},
// 							}).
// 							success(function(resultproj){

// 								$rootScope.showloader=false;
// 								$scope.projectlist = resultproj;
// 								$.getScript('chosen/chosen.jquery.js',function(){
// 									var config2 = {
// 										'.chosen-select2'           : {},
// 										'.chosen-select2-deselect'  : {allow_single_deselect:true},
// 										'.chosen-select2-no-single' : {disable_search_threshold:10},
// 										'.chosen-select2-no-results': {no_results_text:'Oops, nothing found!'},
// 										'.chosen-select2-width'     : {width:'95%'}
// 									}
// 									for (var selector in config2) {
// 										$(selector).chosen(config2[selector]);
// 									}


// 									$(".chosen-select2").val($scope.ponodetails['project_id']);
// 									$('.chosen-select2').trigger('chosen:updated');
// 								});

// 							});

// 							$http({
// 								method:'GET',
// 								url:$rootScope.requesturl+'/get_material_types',
// 								headers:{'JWT-AuthToken':localStorage.pmstoken},
// 							}).
// 							success(function(resultmat){

// 								$rootScope.showloader=false;
// 								$scope.materials = resultmat;
								
// 							});

// 							$http({
// 								method:'GET',
// 								url:$rootScope.requesturl+'/get_pomateriallist',
// 								headers:{'JWT-AuthToken':localStorage.pmstoken},
// 								params:{pono:thispoid},
// 							}).
// 							success(function(poresult){

// 								$scope.pomateriallist = poresult;
// 								var totaloriginalcost = 0;

// 								angular.forEach($scope.pomateriallist,function(pomat){
										
// 									totaloriginalcost = totaloriginalcost+parseInt(pomat.value_of_goods);
// 									pomat['materialdesc'] = pomat['storematerial']['name'];
// 									pomat['uom'] = pomat['storematerial']['units'];
// 									pomat['qty'] = pomat['quantity'];
// 									pomat['unitrate'] = pomat['unit_rate'];
// 									pomat['valueofgoods'] = pomat['value_of_goods'];
// 								});
// 								$scope.totalcostwords = getwords(Math.round($scope.ponodetails['total_cost']).toString());
								
// 								$scope.totalvalue = totaloriginalcost;
// 								$http({
// 								method:'GET',
// 									url:$rootScope.requesturl+'/get_potaxes',
// 									headers:{'JWT-AuthToken':localStorage.pmstoken},
// 									params:{pono:thispoid},
// 								}).
// 								success(function(poresult){

// 									$scope.taxdetails = poresult;
// 									console.log("kkk");
// 									console.log($scope.taxdetails);
// 									$scope.totalvalueofgoods = angular.copy($scope.ponodetails['total_cost']);
// 									angular.forEach($scope.taxdetails,function(potax){
											
// 										potax.taxtitle = potax.name;
// 										potax.taxtype = potax.type;
// 										potax.taxamount = potax.value;
// 										potax.taxdescription = potax.tax_desc;
// 										potax.selected = false;

// 									});

// 									var elementcount = 0;

// 									angular.forEach($scope.pomateriallist,function(pomat){
											
// 										pomat.elementcount = elementcount;
// 										elementcount++;
// 									});


// 									angular.forEach($scope.taxdetails,function(potax){
											
// 										potax.elementcount = elementcount;
// 										elementcount++;
// 									});

// 									angular.forEach($scope.taxdetails, function(potax){

// 										angular.forEach(potax.taxmaterials, function(potaxmat) {

// 											if(potaxmat.material_id != 0) {

// 												angular.forEach($scope.pomateriallist,function(pomat){

// 													if(potaxmat.material_id == pomat.id) {

// 														potaxmat.elementcount = angular.copy(pomat.elementcount);
// 													}
// 												});
// 											} else {

// 												angular.forEach($scope.taxdetails,function(potaxin){

// 													if(potaxmat.tax_id == potaxin.id) {

// 														potaxmat.elementcount = angular.copy(potaxin.elementcount);
// 													}
// 												});
// 											}
// 										});
// 									});

									
// 								});


// 							});


// 							$http({
// 							method:'GET',
// 								url:$rootScope.requesturl+'/get_pospecialterms',
// 								headers:{'JWT-AuthToken':localStorage.pmstoken},
// 								params:{pono:thispoid},
// 							}).
// 							success(function(specialresult){

// 								$scope.specialterms = specialresult;

// 								angular.forEach($scope.specialterms,function(pospecial){
										
// 									pospecial.termtitle = pospecial.name;
// 									pospecial.termdesc = pospecial.condition;
									
// 								});

								
// 							});
							
							
// 							$scope.transporttype = angular.copy($scope.ponodetails['transporttype']);
// 							$scope.deliverylocation = angular.copy($scope.ponodetails['deliverylocation']);
// 							$scope.billingaddress = angular.copy($scope.ponodetails['billingaddress']);
// 							$scope.transportmode = angular.copy($scope.ponodetails['transport_mode']);
// 							$scope.reference = angular.copy($scope.ponodetails['reference']);
// 							$scope.termsncondition = angular.copy($scope.ponodetails['termsnconditions']);
// 						}

						

// 				}).error(function(data,status){
// 					console.log(data+status);
// 					$rootScope.showloader=false;
// 					$rootScope.showerror=true;
// 					//Logging.validation(status);
// 				});
// 			}
// 	    }



// 	$scope.totalcostfortax = 0;
// 	$scope.taxmatarr = [];

// 	$scope.toggletaxselectlist = function(thiscost, id, elementcountthis, type, taxmatselect){

// 		$rootScope.showloader=true;

// 		var totaltaxcost = 0;
// 		var matcheckthis = -1;

// 		if(type=="po_material") {
			

// 			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
// 				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

// 					matcheckthis = i;
// 				}
// 			}

// 			if(matcheckthis == -1) {
// 				var po_material_id = id;
// 				var tax_id = 0;

// 				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "mat":{"value_of_goods":thiscost}, "tax":{"tax_id":tax_id, "value":thiscost}});				

// 			} else {

// 				$scope.taxmatarr.splice(matcheckthis, 1);

// 			}

// 		} else {

			
// 			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
// 				if(elementcountthis == $scope.taxmatarr[i]['elementcount']) {

// 					matcheckthis = i;
// 				}
// 			}
// 			if(matcheckthis == -1) {

// 				var po_material_id = 0;
// 				var tax_id = id;


// 				$scope.taxmatarr.push({"elementcount":elementcountthis, "material_id":po_material_id, "mat":{"value_of_goods":thiscost}, "tax":{"tax_id":tax_id, "value":thiscost}});
// 			} else {


// 				$scope.taxmatarr.splice(matcheckthis, 1);
// 			}
// 		}

// 		var thistaxvalue = 0;		
		
// 		angular.forEach($scope.taxmatarr,function(enqtax){
				
// 			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
// 		});


// 		$scope.totalcostfortax = totaltaxcost;

// 		if($scope.potaxdetails) {
// 			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
// 			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
// 		}

// 		$rootScope.showloader=false;
		
// 	}

// 	$scope.addtotax = function() {

// 		if(!$scope.potaxdetails) {

// 			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
// 		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum') {

// 			swal("Please enter tax/discount amount.");
// 		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum') {

// 			swal("Please enter digits in amount.");
// 		} else if(!$scope.potaxdetails.percentage) {

// 			swal("Please enter tax/discount percentage.");
// 		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage)) {

// 			swal("Please enter digits in tax/discount percentage.");
// 		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

// 			swal("Please select atleast one material to calculate tax/discount.");
// 		}else {

// 			var taxcheck = 0;

// 			angular.forEach($scope.taxdetails,function(potax){
						
// 				if(potax['tax_id'] == $scope.potaxdetails.id) {

// 					taxcheck = 1;
// 				}
// 			});

// 			if(taxcheck == 1) {

// 				swal("Tax already added.");
// 			} else {


// 				var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);
// 				var lumpsum = 0;
// 				if($scope.taxcaltype == 'lumpsum') {

// 					thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
// 					lumpsum=1;
// 					$scope.taxmatarr = [];
// 				}
// 				thistaxamount = thistaxamount.toFixed(2);

// 				if(!$scope.potaxdetails.inclusivepercentage) {

// 					$scope.potaxdetails.inclusivepercentage = 0;
// 				}
				
// 				$rootScope.showloader=true;

// 				$scope.taxdetails.push({"tax_id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
// 				console.log($scope.taxdetails);
// 				$scope.calculatetotalvalueofgoods();

// 				$scope.potaxdetails = [];
// 				$scope.taxmatarr = [];
// 				$scope.potaxdetails.description = "";
// 				$(".taxmatselect").prop("checked", false);

// 				var elementcount = 0;

// 				angular.forEach($scope.pomateriallist,function(pomat){
						
// 					pomat.elementcount = elementcount;
// 					pomat.selected = false;
// 					elementcount++;
// 				});


// 				angular.forEach($scope.taxdetails,function(potax){
						
// 					potax.elementcount = elementcount;
// 					potax.selected = false;
// 					elementcount++;
// 				});


// 				$rootScope.showloader=false;
				
// 			}
// 		}
// 	}

// 	$scope.calculatetotalvalueofgoods = function() {

// 		var totalpovalueofgoods = 0,
// 			totalvaluethis = 0;

// 		for(var i=0; i<$scope.taxdetails.length;i++){

// 			var taxamount = 0;
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

// 				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] == 0) {
				
// 					taxamount = taxamount+parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
// 				} else {

// 					taxamount = taxamount+parseFloat($scope.taxdetails[i]['taxmaterials'][j]['mat']['value_of_goods']);
// 				}
				
// 			}

// 			if($scope.taxdetails[i]['lumpsum'] == 1) {

// 				taxamount = $scope.taxdetails[i]['taxamount'];
// 			}

// 			if(taxamount > 0) {

// 				var taxamountfinal = ($scope.taxdetails[i]['taxpercentage']*taxamount)/100;
// 				taxamountfinal = taxamountfinal.toFixed(2);
// 				if($scope.taxdetails[i]['lumpsum'] == 0) {

// 					$scope.taxdetails[i]['taxamount'] = taxamountfinal;
// 				}
				
// 				if($scope.taxdetails[i]['taxtype'] == "discount") {

// 					totalpovalueofgoods = totalpovalueofgoods - parseFloat($scope.taxdetails[i]['taxamount']);
// 				} else {

// 					totalpovalueofgoods = totalpovalueofgoods + parseFloat($scope.taxdetails[i]['taxamount']);
// 				}
// 			}
// 		}

// 		angular.forEach($scope.pomateriallist,function(pomat){
				
// 			totalpovalueofgoods = totalpovalueofgoods+parseFloat(pomat.valueofgoods);
// 			totalvaluethis= totalvaluethis+parseFloat(pomat.valueofgoods);
// 		});

// 		totalpovalueofgoods = totalpovalueofgoods.toFixed(2);
// 		totalvaluethis = totalvaluethis.toFixed(2);

// 		$scope.totalvalueofgoods = totalpovalueofgoods;
// 		$scope.totalvalue = totalvaluethis;

// 	}



// 	$scope.materialchange = function() {

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_material_subtypes',
// 			params:{materialid:$scope.materialtype},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){

// 			$rootScope.showloader=false;

// 			$scope.submat = 'select';

// 			$scope.submaterials = result.submaterials;

// 		});
// 	}

// 	$scope.getuom = function(id) {

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_material_uom',
// 			params:{materialid:id},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			console.log(result);
// 			$rootScope.showloader=false;

// 			$scope.uomval = result['units'];

// 		});
// 	}

// 	$scope.getgoodscost = function(type) {

// 		if(!$scope.quantity && type != 'quantity') {

// 			swal("Please enter quantity.");
// 		} else if(!$scope.unitrate &&  type != 'quantity') {

// 			swal("Please enter Unit Rate.");
// 		} else {

// 			$scope.valueofgoods = $scope.quantity*$scope.unitrate;
// 		}
// 	}

// 	$scope.addtotable = function() {

// 		if($(".chosen-select").val() == '? undefined:undefined ?') {

// 			swal("please select a vendor.");
// 		} else if($(".chosen-select2").val() == '? undefined:undefined ?') {

// 			swal("please select a project.");
// 		} else if(!$scope.billingaddress) {

// 			swal("please enter billing address.");
// 		} else if($scope.materialtype == "select") {

// 			swal("please select material type.");
// 		} else if($scope.submat == "select") {

// 			swal("please select material.");
// 		} else if(!$scope.quantity) {

// 			swal("please enter material quantity.");
// 		} else if(!$scope.unitrate) {

// 			swal("please enter unit rate.");
// 		} else {

// 			if(!$scope.deliveryaddress) {

// 				$scope.deliveryaddress = "";
// 			}

// 			$rootScope.showloader=true;

// 			$scope.pomateriallist.push({"materialdesc":$("#"+$scope.submat).attr("materialdesc"), "uom":$scope.uomval, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "deliveryaddress":$scope.deliveryaddress, "material_id":$scope.submat, "remarks":$scope.remarks});

// 			$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.valueofgoods);
// 			$scope.totalvalueofgoods = angular.copy($scope.totalvalue);

// 			$scope.materialtype = "select";
// 			$scope.submat = "select";
// 			$scope.quantity = "";
// 			$scope.unitrate = "";
// 			$scope.valueofgoods = "";
// 			$scope.uomval = "";
// 			$scope.remarks = "";

// 			var elementcount = 0;

// 			angular.forEach($scope.pomateriallist,function(pomat){
					
// 				pomat.elementcount = elementcount;
// 				elementcount++;
// 			});

// 			angular.forEach($scope.taxdetails,function(potax){
					
// 				potax.elementcount = elementcount;
// 				elementcount++;
// 			});

// 			$rootScope.showloader=false;
// 		}
// 	}

// 	$scope.addtospecial = function() {

// 		if(!$scope.specialtermtitle) {

// 			swal("Please enter term title.");
// 		} else if(!$scope.specialtermdesc) {

// 			swal("Please enter term description.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

// 			$scope.specialtermtitle = "";
// 			$scope.specialtermdesc = "";

// 			$rootScope.showloader=false;
// 		}
// 	}
// 	$scope.editmat = null;
// 	// $scope.editpomatqty=0;
// 	// $scope.editpomatunitrate=0;
// 	$scope.editrow = function(pomat){
// 		$scope.editmat = angular.copy(pomat.elementcount);
// 		pomat.editqty = angular.copy(pomat.quantity);
// 		pomat.editunitrate = angular.copy(pomat.unitrate);
// 		// console.log($scope.editpomatqty)
// 		// console.log($scope.editpomatunitrate)
// 	}
// 	$scope.saverow = function(index,pomat){
// 		$scope.editmat = null;
// 		$rootScope.showloader=false;
// 		$scope.pomateriallist[index]['quantity'] = angular.copy(pomat.editqty);
// 		$scope.pomateriallist[index]['unitrate'] = angular.copy(pomat.editunitrate);
// 		$scope.pomateriallist[index]['valueofgoods'] = angular.copy(pomat.editqty*pomat.editunitrate);

// 		for(var i=0; i<$scope.taxdetails.length;i++){

// 			var taxamount = 0;
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){

// 				if($scope.taxdetails[i]['taxmaterials'][j]['mat']) {

// 					if($scope.taxdetails[i]['taxmaterials'][j]['mat']['material_id'] == $scope.pomateriallist[index]['material_id']) {
					
// 						$scope.taxdetails[i]['taxmaterials'][j]['mat']['value_of_goods'] = angular.copy($scope.pomateriallist[index]['valueofgoods']);
// 					}
// 				}
				
// 			}

// 		}
// 		console.log($scope.taxdetails);
// 		$scope.calculatetotalvalueofgoods();
// 	}


// 	$scope.removerow = function(currentrow, matid) {

// 		for(var i=$scope.taxdetails.length-1; i>=0;i--){
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
// 				if($scope.taxdetails[i]['taxmaterials'][j]['material_id'] != 0) {
// 					if(matid == $scope.taxdetails[i]['taxmaterials'][j]['mat']['material_id']) {

// 						$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
// 					}
// 				} 
				
// 			}


// 			if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

// 				$scope.taxdetails.splice(i, 1);
// 			}
// 		}

// 		$scope.potaxdetails = [];
// 		$scope.taxmatarr = [];
// 		$scope.potaxdetails.description = "";
// 		$(".taxmatselect").prop("checked", false);
// 		$scope.totalcostfortax = 0;
// 		$scope.potaxdetails.selectedtaxvalue = 0;
		
// 		$scope.pomateriallist.splice(currentrow, 1);

// 		if($scope.pomateriallist.length == 0) {

// 			$scope.taxdetails = [];
// 		}
// 		$scope.calculatetotalvalueofgoods();
// 	}

// 	$scope.removetaxrow = function(currentrow) {

// 		var thistaxid = $scope.taxdetails[currentrow]['id'];

// 		for(var i=$scope.taxdetails.length-1; i>=0;i--){
						
// 			for(var j=$scope.taxdetails[i]['taxmaterials'].length-1;j>=0;j--){
// 				if($scope.taxdetails[i]['taxmaterials'][j]['tax']) {
// 					if($scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id'] != 0) {
// 						if(thistaxid == $scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id']) {

// 							$scope.taxdetails[i]['taxmaterials'].splice(j, 1);
// 						}
// 					} 
// 				}
				
// 			}

// 			if($scope.taxdetails[i]['taxmaterials'].length == 0 && $scope.taxdetails[i]['lumpsum'] == 0) {

// 				$scope.taxdetails.splice(i, 1);
// 			}
// 		}

// 		$scope.potaxdetails = [];
// 		$scope.taxmatarr = [];
// 		$scope.potaxdetails.description = "";
// 		$(".taxmatselect").prop("checked", false);
// 		$scope.totalcostfortax = 0;
// 		$scope.potaxdetails.selectedtaxvalue = 0;

// 		$scope.taxdetails.splice(currentrow, 1);

// 		$scope.calculatetotalvalueofgoods();
		
// 	}

// 	$scope.removespecialrow = function(currentrow) {

// 		$scope.specialterms.splice(currentrow-1, 1);
// 	}

// 	$scope.savepo = function() {

// 		if(!$scope.termsncondition) {

// 			swal("Please enter terms and conditions.");
// 		} else {

// 			$rootScope.showloader=true;

// 			console.log($(".chosen-selectpolist").val());

// 			$http({
// 				method:'POST',
// 				url:$rootScope.requesturl+'/savepo',
// 				data:{materiallist:$scope.pomateriallist, vendorid:$(".chosen-select").val(), projectid:$(".chosen-select2").val(), billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$(".chosen-selectpolist").val() },
// 				headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				$rootScope.showloader=false;

// 				console.log(result);
// 				var totaloriginalcost = 0;

// 				angular.forEach($scope.pomateriallist,function(pomat){
						
// 					pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
// 					totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
// 				});
// 				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
// 				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
// 				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

// 				$scope.companyvendorinfo = result;
// 				$scope.pono = result['pono'];

// 				$("#GeneratePoModal").modal('show');

// 			}).error(function(data,status){
// 				console.log(data+status);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}		
// 	}


// 	$scope.editpo = function() {

// 		if(!$scope.termsncondition) {

// 			swal("Please enter terms and conditions.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$http({
// 				method:'POST',
// 				url:$rootScope.requesturl+'/editpo',
// 				data:{materiallist:$scope.pomateriallist, vendorid:$(".chosen-select").val(), projectid:$(".chosen-select2").val(), billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$(".chosen-selectpolist").val() },
// 				headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				$rootScope.showloader=false;

// 				console.log(result);
// 				var totaloriginalcost = 0;

// 				angular.forEach($scope.pomateriallist,function(pomat){
						
// 					pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
// 					totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
// 				});
// 				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
// 				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
// 				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

// 				$scope.companyvendorinfo = result;
// 				$scope.pono = result['pono'];

// 				$("#GeneratePoModal").modal('show');

// 			}).error(function(data,status){
// 				console.log(data+status);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}		
// 	}

// 	$scope.printpo = function() {

// 		var prtContent = document.getElementById("dd");
// 		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
// 		WinPrint.document.write(prtContent.innerHTML);
// 		WinPrint.document.close();
// 		WinPrint.focus();
// 		WinPrint.print();
// 		WinPrint.close();
// 	}



// 	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

// 	$scope.selectall = function(pomaterials, taxdetails){

// 		// if(pomaterials.length){
// 		// 	var x = !$scope.isallselected(pomaterials);
// 		// 	console.log(x);
// 		// 	if(x == true) {

// 		// 		$scope.taxmatarr = [];
// 		// 	}

// 		// 	angular.forEach(pomaterials,function(pomat){
// 		// 		pomat.selected = x;

// 		// 		$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['material_id'], pomat['elementcount'], 'po_material', pomat.selected);

// 		// 	});

// 		// 	angular.forEach(taxdetails,function(potax){
// 		// 		potax.selected = x;

// 		// 		$scope.toggletaxselectlist(potax.taxamount, potax.tax_id, potax.elementcount, 'po_tax', potax.selected);
// 		// 	});

// 		// }else{
// 		// 	return false;
// 		// }
// 	};

// 	$scope.isallselected = function(pomaterials, taxdetails){

// 		// var count = 0;
// 		// angular.forEach(pomaterials,function(pomat){
// 		// 	if(pomat.selected){
// 		// 		count++;
// 		// 	}
// 		// });

// 		// var taxcount = 0;

// 		// angular.forEach(taxdetails,function(potax){
// 		// 	if(potax.selected){
// 		// 		count++;
				
// 		// 	}
// 		// 	taxcount++;
// 		// });


// 		// var totallength = taxcount+pomaterials.length;

// 		// if(count == totallength){
// 		// 	return true;
// 		// }else{
// 		// 	return false;
// 		// }
// 	};

// });

app.controller("PurchasesQuotationsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.totalcostfortax = 0;
	$scope.taxcaltype = "percentage";
	$scope.taxmatarr = [];
	$scope.gtpdrawings = [];
	$scope.paymentterms = [];
	//$scope.enquirydetails.quotpayterms.payment_term = "PDC";
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
			// console.log(result);return false;		
			$scope.enquirylist = result;
			
		});

	};

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;
		angular.forEach($scope.enquirydetails['materials'],function(enqmat){

			if(!enqmat['freightinsurance_rate']) {

				enqmat['freightinsurance_rate'] = 0;
			}
			totalfreightcost += parseFloat(enqmat['quantity'])*parseFloat(enqmat['freightinsurance_rate']);
		});
		$scope.taxdetails.selectedtaxvalue = angular.copy(totalfreightcost);
	}

	$scope.checklump = function() {

		if($scope.taxcaltype == 'lumpsum') {

			$scope.taxdetails.percentage = 0;
		}
	}

	$scope.uploadgtp=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.add_doc=function(){

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
				'filepath':'uploads/quotationdocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){

				$http({
					method:'POST',
					url:$scope.requesturl+'/insert_quotation_docs',
					data:{docpath:$scope.requesturl+"/uploads/quotationdocs/"+data['1'], filename:data[2], enqvendorid:$scope.enquirydetails.id},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(resultin){

					$rootScope.showloader=false;

					$scope.enquirydetails['quotationdocs'].push({"id":resultin['id'],"doc_url":$scope.requesturl+"/uploads/quotationdocs/"+data['1'], "doc_name":data['2']});

					document.getElementById('file_uploadgtp').value=null;
				});
					
			});
		}
	}

	$scope.remove_doc = function(key, docdata) {

		swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/remove_quotation_docs',
				data:{id:docdata['id']},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(data){

				$rootScope.showloader = false;
				$scope.enquirydetails['quotationdocs'].splice(key, 1);

				swal("File deleted successufully", "", "success");

			});

		})
	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.alltaxes = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.calculatebalance = function() {

		if(!$scope.enquirydetails.quotpayterms['payment_advance']) {

			swal("Please enter advance percentage.");
		} else {
			percenta = parseFloat($scope.enquirydetails.quotpayterms['payment_advance']);
			var totalperval = $scope.totalbasicval*percenta/100;

			var totalmainval = $scope.totalvalofgoods-totalperval;
			$scope.enquirydetails.quotpayterms['payment_balance'] = totalmainval;
			$scope.totalpercentval = totalperval;
		}
	}

	$scope.calculatelcinterest = function() {

		if(!$scope.enquirydetails.quotpayterms['lc_time_period']) {

			swal("Please enter LC time period.");
		} else {

			var intrstval = (parseFloat($scope.enquirydetails.quotpayterms['lc_interest_percentage'])*parseFloat($scope.enquirydetails.quotpayterms['payment_balance'])/36500)*parseInt($scope.enquirydetails.quotpayterms['lc_time_period']);

			$scope.enquirydetails.quotpayterms['lc_interest_value'] = parseFloat(intrstval).toFixed(2);
		}
	}

	$scope.calculate_vendor_sse_interest = function() {

		if(!$scope.enquirydetails.quotpayterms['lc_time_period']) {

			swal("Please enter LC time period.");
		} else if(parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']) > parseInt($scope.enquirydetails.quotpayterms['lc_time_period'])) {

			swal("Interest days of vendor cannot be greater than LC time period.");
			$scope.enquirydetails.quotpayterms['lc_interest_days_vendor'] = 0;
		} else if(!$scope.enquirydetails.quotpayterms['lc_interest_percentage']) {

			swal("Please enter LC interest %.");
		} else if(!$scope.enquirydetails.quotpayterms['lc_interest_days_vendor']) {

			swal("Please enter interest days on vendor.");
		} else {

			var lcintsse = parseInt($scope.enquirydetails.quotpayterms['lc_time_period'])-parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']);

			$scope.enquirydetails.quotpayterms['lc_interest_days_sse'] = lcintsse;

			var intrstvalvendor = (parseFloat($scope.enquirydetails.quotpayterms['lc_interest_percentage'])*parseFloat($scope.enquirydetails.quotpayterms['payment_balance'])/36500)*parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']);

			var intrstvalsse = (parseFloat($scope.enquirydetails.quotpayterms['lc_interest_percentage'])*parseFloat($scope.enquirydetails.quotpayterms['payment_balance'])/36500)*parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_sse']);

			$scope.enquirydetails.quotpayterms['interest_amount_vendorac'] = parseFloat(intrstvalvendor).toFixed(2);
			$scope.enquirydetails.quotpayterms['interest_amount_sselac']= parseFloat(intrstvalsse).toFixed(2);
		}
	}

	$scope.changeoflctimeperiod = function() {

		if($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']) {

			var lcintsse = parseInt($scope.enquirydetails.quotpayterms['lc_time_period'])-parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']);

			$scope.enquirydetails.quotpayterms['lc_interest_days_sse'] = lcintsse;

			var intrstvalvendor = (parseFloat($scope.enquirydetails.quotpayterms['lc_interest_percentage'])*parseFloat($scope.enquirydetails.quotpayterms['payment_balance'])/36500)*parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_vendor']);

			var intrstvalsse = (parseFloat($scope.enquirydetails.quotpayterms['lc_interest_percentage'])*parseFloat($scope.enquirydetails.quotpayterms['payment_balance'])/36500)*parseInt($scope.enquirydetails.quotpayterms['lc_interest_days_sse']);

			$scope.enquirydetails.quotpayterms['interest_amount_vendorac'] = parseFloat(intrstvalvendor).toFixed(2);
			$scope.enquirydetails.quotpayterms['interest_amount_sselac']= parseFloat(intrstvalsse).toFixed(2);
		}
	}
	$scope.changevendor = function() {
		$scope.taxdetails = "";
		$scope.taxcaltype = "percentage";
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_quotation_terms',
			params:{vendorid:$scope.enquirydetails.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(resultq){
			$rootScope.showloader=false;
			$scope.quotationterms = resultq;

			angular.forEach($scope.quotationterms,function(qterms){
			
				if(qterms.terms.length == 0) {
					qterms.terms[0] = {};

					qterms.terms[0]['term_desc'] = "";
				}
			});

			if(!$scope.enquirydetails.quotpayterms) {
				$scope.enquirydetails.quotpayterms = {};
				$scope.enquirydetails.quotpayterms.payment_type = "PDC";
			}
			$scope.calculatetotalvalueofgoods();

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});

		angular.forEach($scope.enquirydetails['taxes'], function(inditax){

			angular.forEach($scope.alltaxes, function(intax){

				if(inditax['tax_id'] == intax.id){

					intax.showtax = true;
				}
			});		
		});
	}

	$scope.searchenquiry = function() {

		if(!$scope.enquiry) {

			swal("Please enter enquiry number.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_details',
				params:{enqno:'E'+$scope.enquiry.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Entered enquiry number doesnot exist.");
					$scope.enquirydet = [];
					$scope.enquirydetails = [];
				} else {

					$scope.enquirydet = result;
				}

			}).error(function(data,status){
				console.log(data+status);
				
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.calculatetotalvalueofgoods = function() {

		var totalval = 0;

		angular.forEach($scope.enquirydetails['materials'],function(mat){
			
			totalval = totalval+parseFloat(mat.quotation_total_cost);
		});

		$scope.totalbasicval = totalval;

		var totalvaltax = 0;

		angular.forEach($scope.enquirydetails['taxes'],function(tax){
			
			totalvaltax = totalvaltax+parseFloat(tax.tax_amount);
		});

		$scope.totaltaxval = totalvaltax;

		$scope.totalvalofgoods = totalval+totalvaltax;
		
	}

	$scope.getgoodscost = function(enqmat) {

		if(!$rootScope.digitcheck.test(enqmat['quotation_unit_rate'])) {

			swal("Please enter digits for unit rate.");
			enqmat['quotation_unit_rate'] = "0.00";
			enqmat['quotation_total_cost'] = "0";
		} else {

			enqmat['quotation_total_cost'] = enqmat['quotation_unit_rate']*enqmat['quantity']; 
			for(var i=0; i<$scope.enquirydetails.taxes.length;i++){
				var taxamount = 0;
				for(var j=$scope.enquirydetails.taxes[i]['taxmaterials'].length-1;j>=0;j--){
					for(var k=0; k<$scope.enquirydetails.materials.length;k++) {
						if($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enquiry_material_id'] == $scope.enquirydetails.materials[k]['id']) {
							if(!$scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']) {
								$scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails'] = [];
							}
							$scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']['tax_amount'] = angular.copy($scope.enquirydetails.materials[k]['quotation_total_cost']);	
						}
					}
					if($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']) {
						taxamount = taxamount+parseFloat($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']['tax_amount']);
					} else {
						taxamount = taxamount+parseFloat($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxmat']['quotation_total_cost']);
					}
				}
				if(taxamount > 0) {

					var taxamountfinal = ($scope.enquirydetails.taxes[i]['tax_percentage']*taxamount)/100;
					taxamountfinal = taxamountfinal.toFixed(2);
					if($scope.enquirydetails.taxes[i]['lumpsum'] == 0) {
						$scope.enquirydetails.taxes[i]['tax_amount'] = taxamountfinal;
					}
				}
			}
		}
		$scope.calculatetotalvalueofgoods();
	}

	$scope.toggletaxselectlist = function(thiscost, id, type, name, tax_id, quotation_total_cost){

			var totaltaxcost = 0;
			var matcheckthis = -1;
			if(type=="enquiry_material_id") {
				for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
					if(id == $scope.taxmatarr[i]['enquiry_material_id']) {

						matcheckthis = i;
					}
				}

				if(matcheckthis == -1) {
					var enquiry_material_id = id;
					var enquiry_tax_id = 0;
					var enqname = "";
					var matname = name;

					$scope.taxmatarr.push({"enquiry_material_id":enquiry_material_id, "enquiry_tax_id":enquiry_tax_id, "enqtaxdetails":{"tax_amount":thiscost, "tax_id":tax_id,"taxdetails":{"tax":enqname}}, "enqtaxmat":{"quotation_total_cost":quotation_total_cost}});
					

				} else {

					$scope.taxmatarr.splice(matcheckthis, 1);

				}

				
			} else {

				for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
					if(id == $scope.taxmatarr[i]['enqtaxdetails']['tax_id']) {

						matcheckthis = i;
					}
				}
				if(matcheckthis == -1) {
					var enquiry_material_id = 0;
					var enquiry_tax_id = id;
					var enqname = name;
					var matname = "";

					$scope.taxmatarr.push({"enquiry_material_id":enquiry_material_id, "enquiry_tax_id":enquiry_tax_id, "enqtaxdetails":{"tax_amount":thiscost, "tax_id":id,"taxdetails":{"tax":enqname}}, "enqtaxmat":{"quotation_total_cost":quotation_total_cost}});
				} else {

					$scope.taxmatarr.splice(matcheckthis, 1);
				}



			}
			angular.forEach($scope.taxmatarr,function(enqtax){
				
				totaltaxcost = totaltaxcost+parseFloat(enqtax['enqtaxdetails']['tax_amount']);
			});
			$scope.totalcostfortax = totaltaxcost;	

			if($scope.taxdetails) {
				thistaxvalue = (parseFloat($scope.taxdetails.percentage)*$scope.totalcostfortax)/100;
				$scope.taxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
			}
	}

	$scope.addtotax = function() {

		if(!$scope.taxdetails) {

			swal("Please select a tax type");
		} else if(!$scope.taxdetails.percentage && $scope.taxcaltype != 'lumpsum') {

			swal("Please enter percentage.");
		} else if($scope.totalcostfortax == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select a material to calculate amount from.");
		} else if($scope.taxcaltype == 'lumpsum' && $scope.taxdetails.tax != 'Freight & Insurance' && !$scope.taxdetails.taxamount){

			swal("Please enter amount.");
		}else {

			var taxcheck = 0;
			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == $scope.taxdetails.id) {

					inditax.showtax = true;
				}
			});
			angular.forEach($scope.enquirydetails.taxes,function(enqtax){
						
				if(enqtax['tax_id'] == $scope.taxdetails.id) {

					taxcheck = 1;
				}
			});
			if(taxcheck == 1) {

				swal("Tax already added.");
			} else {

				var thistaxamount = (parseFloat($scope.taxdetails.percentage)*$scope.totalcostfortax)/100;
				var lumpsum =0;
				if($scope.taxcaltype == 'lumpsum' && $scope.taxdetails.tax != 'Freight & Insurance') {

					thistaxamount = parseFloat($scope.taxdetails.taxamount);
					lumpsum = 1;
					$scope.taxmatarr = [];
				} else if($scope.taxcaltype == 'lumpsum' && $scope.taxdetails.tax == 'Freight & Insurance') {
					thistaxamount = parseFloat($scope.taxdetails.selectedtaxvalue);
					lumpsum = 1;
					$scope.taxmatarr = [];
				}
				thistaxamount = thistaxamount.toFixed(2);

				if(!$scope.taxdetails.percentage) {

					$scope.taxdetails.percentage = 0;
				}
				if(!$.isNumeric(thistaxamount)) {

					thistaxamount = 0;
				}
				//if($scope.enquirydetails.taxes.length>0) {

					$scope.enquirydetails.taxes.push({"tax_id":$scope.taxdetails.id,"id":$scope.taxdetails.id, "lumpsum":lumpsum, "tax_percentage":$scope.taxdetails.percentage, "tax_amount":thistaxamount, "taxdetails":{"tax":$scope.taxdetails.tax, "type":$scope.taxdetails.type, "description":$scope.taxdetails.description}, "taxmaterials":$scope.taxmatarr});
				//} else {

					//$scope.enquirydetails.taxes.taxdetails = [];
				//	$scope.enquirydetails.taxes.push({"tax_id":$scope.taxdetails.id, "lumpsum":lumpsum, "tax_percentage":$scope.taxdetails.percentage, "tax_amount":thistaxamount, "taxdetails":{"tax":$scope.taxdetails.tax, "type":$scope.taxdetails.type, "description":$scope.taxdetails.description}, "taxmaterials":$scope.taxmatarr});
				//}

			}
			$scope.taxmatarr = [];
			$scope.totalcostfortax = 0;
			$scope.taxdetails.description = "";
			$scope.taxdetails = "";
			
			$scope.calculatetotalvalueofgoods();

			angular.forEach($scope.enquirydetails['materials'],function(pomat){
						
				pomat.selected = false;
			});
			angular.forEach($scope.enquirydetails['taxes'],function(potax){
					
				potax.selected = false;
			});

		}
	}

	$scope.removetaxrow = function(currentrow, tax_id) {
		console.log($scope.enquirydetails.taxes);

		angular.forEach($scope.alltaxes,function(inditax){
						
			if(inditax['id'] == tax_id) {

				inditax.showtax = false;
			}
		});
		var thistaxname = $scope.enquirydetails['taxes'][currentrow]['taxdetails']['tax'];

		for(var i=0; i<$scope.enquirydetails.taxes.length;i++){
						
			for(var j=$scope.enquirydetails.taxes[i]['taxmaterials'].length-1;j>=0;j--){
				if($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']) {
					if($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails'].length > 0) {
						if(thistaxname == $scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']['taxdetails']['tax']) {

							$scope.enquirydetails.taxes[i]['taxmaterials'].splice(j, 1);
						}
					}
				} 
				
			}
			if($scope.enquirydetails.taxes[i]['taxmaterials'].length == 0 && $scope.enquirydetails.taxes[i]['lumpsum'] == 0) {

				$scope.enquirydetails.taxes.splice(i, 1);
			}
		}

		for(var i=0; i<$scope.enquirydetails.taxes.length;i++){

			var taxamount = 0;
						
			for(var j=$scope.enquirydetails.taxes[i]['taxmaterials'].length-1;j>=0;j--){
				if($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']) {
					taxamount = taxamount+parseFloat($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxdetails']['tax_amount']);
				} else {

					taxamount = taxamount+parseFloat($scope.enquirydetails.taxes[i]['taxmaterials'][j]['enqtaxmat']['quotation_total_cost']);
				}

			}

			if(taxamount > 0) {

				var taxamountfinal = parseFloat(($scope.enquirydetails.taxes[i]['tax_percentage']*taxamount)/100);
				taxamountfinal = taxamountfinal.toFixed(2);
				if($scope.enquirydetails.taxes[i]['lumpsum'] == 0) {
					$scope.enquirydetails.taxes[i]['tax_amount'] = taxamountfinal;
				}
			}
		}

		$scope.enquirydetails['taxes'].splice(currentrow, 1);
		

		$scope.calculatetotalvalueofgoods();

	}

	$scope.savequotation = function() {

		if(!$scope.enquirydetails) {

			swal("Please select a vendor for the entered enquiry number.");
		} else if(!$scope.enquirydetails.quotpayterms['payment_advance']) {

			swal("Please enter payment advance.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/save_quotations',
				data:{enquirydetails:$scope.enquirydetails, quotationterms:$scope.quotationterms},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 1) {

					swal({ 
					  title: "Success",
					   text: "Quotation for the entered vendor added/updated.",
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

	$scope.selectall = function(){
		if($scope.enquirydetails){
			var x = !$scope.isallselected();

			if(x == true) {

				$scope.taxmatarr = [];
			}
			angular.forEach($scope.enquirydetails['materials'],function(enqmat){
				enqmat.selected = x;

				$scope.toggletaxselectlist(enqmat['quotation_total_cost'], enqmat['id'], 'enquiry_material_id', enqmat['materialdetails']['name'], 0, enqmat['quotation_total_cost']);
			});
			angular.forEach($scope.enquirydetails['taxes'],function(taxdet){
				taxdet.selected = x;

				$scope.toggletaxselectlist(taxdet.tax_amount, taxdet.tax_id, 'enquiry_tax_id', taxdet.taxdetails.tax, taxdet.tax_id, 0);
			});
		}else{
			return false;
		}
	};

	$scope.isallselected = function(){
		if($scope.enquirydetails){
			var count = 0;
			if($scope.enquirydetails['taxes'] && $scope.enquirydetails['taxes'].length){
				angular.forEach($scope.enquirydetails['taxes'],function(taxdet){
					if(taxdet.selected){
						count++;
					}
				});				
			}
			angular.forEach($scope.enquirydetails['materials'],function(enqmat){
				if(enqmat.selected){
					count++;
				}
			});
			if(count == $scope.enquirydetails['materials'].length+$scope.enquirydetails['taxes'].length){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	};

});

app.controller("PurchasesReportsEnquiryController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.Dates=Dates;

	$scope.enquiryreportopt = 'vendorwise';

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;

		$(document).ready(function(){

			$.getScript('/chosen/chosen.jquery.js',function(){
				
				var config = {
					'.chosen-select'           : {},
					'.chosen-select-deselect'  : {allow_single_deselect:true},
					'.chosen-select-no-single' : {disable_search_threshold:10},
					'.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
					'.chosen-select-width'     : {width:'95%'}
				}
				for (var selector in config) {
					$(selector).chosen(config[selector]);
				}


			});

			

		});

		

	});

	$scope.changeenqreporttype = function() {

		if($scope.enquiryreportopt == "enqdatewise") {

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
		$.getScript('/chosen/chosen.jquery.js',function(){
			var config2 = {
				'.chosen-selectproject'           : {},
				'.chosen-selectproject-deselect'  : {allow_single_deselect:true},
				'.chosen-selectproject-no-single' : {disable_search_threshold:10},
				'.chosen-selectproject-no-results': {no_results_text:'Oops, nothing found!'},
				'.chosen-selectproject-width'     : {width:'95%'}
			}
			for (var selector in config2) {
				$(selector).chosen(config2[selector]);
			}
		});

	});

	$scope.searchenquiry = function() {

		if(!$scope.enquirynumber) {

			swal("Please enter enquiry number.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_details',
				params:{enqno:$scope.enquirynumber},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Entered enquiry number doesnot exist.");
					$scope.enquirydetails = [];
				} else {

					$scope.enquirydetails = result;

				}
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});


		}
	}

	$scope.enquirywiseviewclick = function(enqmat) {

		$scope.enquirydetailsmodal = enqmat;
		$scope.enquirydetailsmodal['enqno'] = "E"+$scope.enquirydetails['id'];
		$("#EnquiryModal").modal('show');

	}

	$scope.get_enquiry_list = function() {

		if($(".chosen-selectproject").val() == '? undefined:undefined ?') {

			swal("please select a project.");
		} else if($(".chosen-select").val() == '? undefined:undefined ?') {

			swal("please select a vendor.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_list',
				params:{projectid:$(".chosen-selectproject").val(), vendorid:$(".chosen-select").val()},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Entered enquiry number doesnot exist.");
					$scope.enquirylist = [];
				} else {

					$scope.enquirylist = result;

				}
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});


		}


	}

	$scope.searchdatewiseenqlist = function() {


		if($(".chosen-selectproject2").val() == '? undefined:undefined ?') {

			swal("Please select a project.");
		} else if(!$scope.enqfromdate) {

			swal("Please select from date.");
		} else if(!$scope.enqtodate) {

			swal("Please select to date.");
		} else if($scope.enqtodate < $scope.enqfromdate) {

			swal("From date cannot be greater than to date.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_list_datewise',
				params:{projectid:$(".chosen-selectproject2").val(), fromdate:$scope.enqfromdate, todate:$scope.enqtodate},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Entered enquiry number doesnot exist.");
					$scope.enquirylist = [];
				} else {

					$scope.enquirylist = result;

				}
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});


		}
	}

	$scope.vendorwiseviewclick = function(enqid) {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_enquiry_venmat',
			params:{vendorid:$(".chosen-select").val(), enqid:enqid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.enquirydetailsmodal = result;
			$scope.enquirydetailsmodal['enqno'] = enqid;
			$("#EnquiryModal").modal('show');
			

		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});


	}

});
app.controller("PurchasesReportsCSController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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

		});

	};


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
				var subproj_no = $scope.project.subprojects.length?$scope.project.subprojects.length:1;

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
								{'field':'Indent Quantity','rows':1,'cols':subproj_no,'class':'text-center bold-font','style':'vertical-align:middle;'},
								{'field':'Total Quantity','rows':2,'cols':1,'class':'text-center bold-font','style':'vertical-align:middle;'},
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
				var total_bdgtamt=0;
				var total_ford=0;

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
							for(var i =0;i<$scope.project.subprojects.length;i++){
								if(count < 2*$scope.project.subprojects.length){
									var x = angular.copy(dummy);
									x['field'] = $scope.project.subprojects[i].name.substr(0,3);
									x['class'] = "text-center text-uppercase bold-font";
									cs[4].push(x);
									count++
								}
	//change here for subprojects also
								if(j==0){
									var y = angular.copy(dummy);
									if($scope.boqdet[matid]) {
										y['field'] = parseFloat($scope.boqdet[matid][$scope.project.subprojects[i]['id']]).toFixed(2);
									} else {
										y['field'] = 0;
									}
									bdgtrate = parseFloat(boqmaterials[matid]['budget_rate']).toFixed(2);
									dummyrow.push(y);
								}
								if(j==1){
									var y = angular.copy(dummy);
									if($scope.indentdet[matid]) {
										y['field'] = parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]).toFixed(2);
									} else {

										y['field'] = 0;
									}
									if($scope.indentdet[matid]) {
									totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]);
									// total_totqty += parseFloat($scope.indentdet[matid][$scope.project.subprojects[i]['id']]);
									}
									dummyrow.push(y);										
								}
							};
						}
						else{//this else loop is not rqd and will not run
							if(j==0){
								var y = angular.copy(dummy);
								y['field'] = boqmaterials[matid]['qty'];
								dummyrow.push(y);
							}
							if(j==1){
								var y = angular.copy(dummy);
								y['field'] = csmaterials[matid]['quantity'];
								totqty += parseFloat(csmaterials[matid]['quantity']);
								total_totqty += parseFloat(csmaterials[matid]['quantity']);
								dummyrow.push(y);										
							}

						}

					}

					var tq = angular.copy(dummy);
					tq.field = totqty.toFixed(2);
					dummyrow.push(tq);

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

					sortedarr.forEach(function(vi) {
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
app.controller("PurchasesDIController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	$scope.Dates=Dates;

	$scope.inspeccalldoclist = [];
	$scope.inspecrepdoclist = [];
	$scope.dispatchdoclist = [];
	$scope.filedat = [];

	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	/*	$rootScope.showloader = true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_po_list',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result)
			$rootScope.showloader=false;
			$scope.polist = result;
			$.getScript('/chosen/chosen.jquery.js',function(){
				var config2 = {
					'.chosen-selectpolist'           : {},
					'.chosen-selectpolist-deselect'  : {allow_single_deselect:true},
					'.chosen-selectpolist-no-single' : {disable_search_threshold:10},
					'.chosen-selectpolist-no-results': {no_results_text:'Oops, nothing found!'},
					'.chosen-selectpolist-width'     : {width:'95%'}
				}
				for (var selector in config2) {
					$(selector).chosen(config2[selector]);
				}
			});

		});*/

	$rootScope.showloader = true;
	$http({
		method:'GET',
		// url:$rootScope.requesturl+'/get_po_list',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result)
		$rootScope.showloader=false;
		// $scope.polist = result;
		$scope.projectlist = result;

	});



	$http({
		method:'GET',
		// url:$rootScope.requesturl+'/get_po_list',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result)
		$rootScope.showloader=false;
		// $scope.polist = result;
		$scope.vendorlist = result;
		

	});

	$scope.resetpos = function(){
		// console.log($(".chosen-select").val())
		if($scope.vendorid)	$scope.getpolist();
		$scope.ponumber='';

	};

	$scope.getpolist = function() {
		// console.log($scope.projectid)
		// console.log($scope.vendorid)

		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else {

			// $rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_polist',
			params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// $rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.polist = [];
				} else {

					$scope.polist = result[0];
						
				}
				$.getScript('/chosen/chosen.jquery.js',function(){
					$('.chosen-selectpolist').trigger("chosen:updated");
				});

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			$.getScript('/chosen/chosen.jquery.js',function(){
				$('.chosen-selectpolist').on('change',function(){
					$scope.ponumber=$(this).val();
					$scope.$apply();
				});
			});
		}
	}

	$scope.searchpo = function() {

		//console.log($scope.ponumber);

		if(!$scope.ponumber) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;
			$scope.inspdetails = [];
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_po_info_inspec',
			params:{pono:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Purchased Order No doesnot exist.");
					$scope.ponodetails = [];
				} else {

					$scope.ponodetails = result;
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.addtoinspectionmat = function(pomatid) {

		if(!$scope.inspomat) {

			swal("Please select a material.");
		} else if(!$scope.inspomat.current_inspected) {

			swal("Please enter current inspected quantity.");
		} else if(!$rootScope.digitcheck.test($scope.inspomat.current_inspected)) {

			swal("Please enter digits in current inspected quantity.");
		} else if(!$scope.inspomat.approved_insp_quantity) {

			swal("Please enter approved quantity.");
		} else if(!$rootScope.digitcheck.test($scope.inspomat.approved_insp_quantity)) {

			swal("Please enter digits in approved quantity.");
		} else {

			var count = 0;
			angular.forEach($scope.inspdetails.inspectionmaterials,function(pomat){
							
				if(pomat.purchase_order_material_id == pomatid) {

					count=1;
				}
			});
			if(count == 1) {

				swal("Material already added.");
				$scope.inspomat = [];
			} else {
				// console.log($scope.ponodetails);
				// return false;
				$http({
				method:'GET',
				url:$rootScope.requesturl+'/check_inspection_ref',
				params:{projectid:$$scope.projectid,vendorid:$scope.ponodetails.vendor.id,materialid:$scope.inspomat.material_id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					// console.log(result);return false;
					if(result.length>0){
						$scope.inspdetails.inspectionmaterials.push({"inspected_quantity":$scope.inspomat.current_inspected,"approved_quantity":$scope.inspomat.approved_insp_quantity, "purchase_order_material_id":pomatid, "pomaterial":{"quantity":$scope.inspomat.quantity, "storematerial":{"name":$scope.inspomat.storematerial.name, "units":$scope.inspomat.storematerial.units}}});						
					}else{
						swal("Please add GTP Drawing for this material.");
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

	$scope.remove_inspmat = function(key) {

		$scope.inspdetails.inspectionmaterials.splice(key, 1);
	}

	$scope.uploaddidoc=function(files){

		// console.log(files[0]['type']);
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		$scope.fdType = files[0]['type']
	}

	$scope.add_di_doc=function(type){

		if(!$scope.fd)
		{
			swal('Please select the file to upload');
		}
		else
		{
			$rootScope.showloader=false;
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
				$scope.filedat = [];
				$rootScope.showloader=false;
				console.log(data);
				if(data[0]=='success')
				{
					$rootScope.showloader=false;

					if(type == 'inspection_call') {

						$scope.inspdetails.inspectiondocs.push({'mime_type':$scope.fdType,'doc_type':1,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					} else if(type=='inspection_report') {

						$scope.inspdetails.inspectiondocs.push({'mime_type':$scope.fdType,'doc_type':2,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					} else if(type=='inspection_call_raise'){

						$scope.inspdetails.inspectiondocs.push({'mime_type':$scope.fdType,'doc_type':5,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					} else {

						$scope.inspdetails.inspectiondocs.push({'mime_type':$scope.fdType,'doc_type':4,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}
					console.log($scope.inspdetails.inspectiondocs);

					$scope.filedat = [];

					document.getElementById('file_inspcall').value=null;
					document.getElementById('file_inspreport').value=null;
					document.getElementById('file_approvedinsp').value=null;
					document.getElementById('file_inspinternal').value=null;
					
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
				for(var i=0; i<$scope.inspdetails.inspectiondocs.length;i++) {

					if($scope.inspdetails.inspectiondocs[i]['doc_url'] == path) {

						checkpath = i;
					}
				}

				if(checkpath != -1) {

					$scope.inspdetails.inspectiondocs.splice(checkpath, 1);
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

	$scope.inspectedelementblur = function(pomat) {

		if(!pomat.current_inspected) {

			pomat.current_inspected = 0;
		} 
		var totalinspected = parseFloat(pomat.current_inspected)+parseFloat(pomat.inspected_quantity);
		if(totalinspected > pomat.quantity) {

			swal("Total inspected cannot be greater than the total quantity.");
			pomat.current_inspected = 0;
		}
	}

	$scope.createnewinspecref = function() {

		if(!$scope.new_reference_no) {

			swal("Please enter inspection reference name.");
		} else {

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_inspection_ref',
			data:{refname:$scope.new_reference_no, poid:$scope.ponodetails.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;

				$("#CreateInspectionModal").modal("hide");

				$scope.searchpo();
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.changerefno = function() {

		$scope.inspomat = [];

		if($scope.inspdetails.inspectionmaterials.length == 0) {

			$scope.editflag = 0;
		} else {

			$scope.editflag = 1;
		}

		if($scope.inspdetails.inspectioncallraises){
			$scope.inspdetails.inspectioncallraises.ref = 'IRC'+$scope.inspdetails.inspectioncallraises.id;
		}

	}

	$scope.checkapprovedlen = function(inspected, approved, inspmat) {

		var tot_appr = parseFloat(inspmat.approved_quantity)+parseFloat(approved);

		// console.log(approved);

		if(parseFloat(approved) > parseFloat(inspected)) {

			swal("Approved cannot be greater than inspected quantity.", "", "warning");
			inspmat.approved_insp_quantity = "";

		} else if(parseFloat(inspected) > parseFloat(inspmat.quantity)) {

			swal("Current inspection quantity cannot be greater than purchased quantity.");
			inspmat.approved_insp_quantity = "";
			inspmat.current_inspected = "";

		} else if(parseFloat(tot_appr) > parseFloat(inspmat.quantity)) {

			swal("Total approved quantity exceeding tatal purchased quantity.");
			inspmat.approved_insp_quantity = "";

		}
	}

	$scope.raiseinspcall = function(){
		// console.log($scope.ponodetails);
		// console.log($scope.inspdetails);
		if($scope.inspdetails.inspectionmaterials.length == 0) {
			swal("Please add atleast one purchase order material for this inspection.");
		}else if(!$scope.to){
			swal("Please enter 'to' email id");
		}else if(!$scope.subject){
			swal("Please enter email subject");
		}else if(!$scope.emailcontent){
			swal("Please enter email content");
		}else{
			var file_attachments = [];
			// console.log($scope.inspdetails.inspectiondocs);
			if(typeof($scope.inspdetails.inspectiondocs) != 'undefined'){
				for(i=0;i<$scope.inspdetails.inspectiondocs.length;i++){
					if($scope.inspdetails.inspectiondocs[i]['doc_type']=='5'){
						file_attachments.push($scope.inspdetails.inspectiondocs[i]);
					}
				}
			}

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raiseinspcall',
				data:{poid:$scope.inspdetails.purchase_order_id,inspid:$scope.inspdetails.id,to:$scope.to,cc:$scope.cc,subject:$scope.subject, emailcontent:$scope.emailcontent,attachments:file_attachments},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				// console.log(result);
				if(result != 0) {

					$scope.icrno = result['ICRno'];
					$scope.inspdetails['inspectioncallraises'] = result;
					$scope.inspdetails.inspectioncallraises['ref'] = result['ICRno'];

					// console.log(result['failedmail'][0]);

					if(result['failedmail'].length > 0) {
						var htm = "";

						for(var j=0; j<result['failedmail'].length;j++) {

							htm = htm+(j+1)+")"+result['failedmail'][j];
						}

						swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Inspection Call Raise No: "+result['ICRno'], "warning");
					} else {

						swal("You have raised an inspection call", "Inspection Call Raise No: "+result['ICRno'], "success");
					}
					// $scope.saveinspection();
				}
			});
		}
	}

	$scope.saveinspection = function() {

		if($scope.inspdetails.inspectionmaterials.length == 0) {

			swal("Please add atleast one purchase order material for this inspection.");
		}/* else if(!$scope.inspdetails['inspector_name']) {

			swal("Please enter inspector name.");
		} else if(!$scope.inspdetails['inspection_location']) {

			swal("Please enter inspection location.");
		}*/ else {

			if(!$scope.inspdetails['inspectionremarks']) {

				$scope.inspdetails['inspectionremarks'] = "";
			}

			$rootScope.showloader=true;
			console.log($scope.inspdetails)
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/save_inspection',
			data:{inspdetails:$scope.inspdetails, editflag:$scope.editflag},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;

				if(result == 1) {

					swal("Inspection saved.", "", "success");
					$scope.ponodetails = [];
					$scope.inspdetails = [];
					$scope.searchpo();
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



app.controller("PurchasesInspectionController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	
	$scope.file_attachments = [];

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
				console.log(data);
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
		// console.log($scope.jointinsp);
		if(!$scope.refdate && !$scope.jointinsp)
		{
			swal("Please enter Call Raise Date");
		}	
		else 
		{
			if($scope.jointinsp)
			{
				$scope.refdate = '0000-00-00';
			}

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/raiseinspcallmanual',
				data:{attachments:$scope.file_attachments,pos:$scope.ponumber,date:$scope.refdate,joint:$scope.jointinsp, vendor:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result['res']==1)
				{
					$scope.refdate = "";
					$scope.file_attachments = [];
					$scope.searchins();
					swal({ 
					  title: "Success",
					   text: "successfully saved Details. Inspection Ref No: "+result['newrefno'],
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


	$scope.getpolist = function() {
		

		if(!$scope.projectid) {

			swal("Please select a project.");
			$scope.polist = [];
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
			$scope.polist = [];
		} else {

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_vendor_polist',
			params:{'vendorid':$scope.vendorid, 'projectid':$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// $rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.polist = [];
				} else {

					$scope.polist = result[0];
						
				}
				$.getScript('/chosen/chosen.jquery.js',function(){
					$('.chosen-selectpolist').trigger("chosen:updated");
				});

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			$.getScript('/chosen/chosen.jquery.js',function(){
				$('.chosen-selectpolist').on('change',function(){
					$scope.ponumber=$(this).val();
					$scope.$apply();
				});
			});
		}
	}

	$scope.resetpos = function(){
		if($scope.vendorid)	$scope.getpolist();
		$scope.ponumber='';

	};

	$scope.searchins = function()
	{
		if(!$scope.projectid)
		{
			swal("Please select a project.");
		}
		else if(!$scope.vendorid)
		{
			swal("Please select a Vendor.");
		}
		else if(!$scope.ponumber)
		{
			swal("Please select a PO.");
		}
		else
		{

			console.log($scope.ponumber);
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/get_pos_inspections',
				data:{dat:$scope.ponumber},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				if(result == 2) {

					swal("Please upload approved PO documents from company and vendor.");
				} else {
					$scope.insnames = result;
					$scope.showref = true;
				}
				
			});
		}

	}

	$scope.pochangefunc = function()
	{
		$scope.showref = false;
		$scope.callraisetype = false;
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
				url:$rootScope.requesturl+'/raiseinspcall',
				data:{to:$scope.to,cc:$scope.cc,subject:$scope.subject, emailcontent:$scope.emailcontent,attachments:$scope.file_attachments,pos:$scope.ponumber,vendor:$scope.vendorid,project:$scope.projectid},
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
					$scope.searchins();
					if(result['failedmail'].length > 0) {
						var htm = "";

						for(var j=0; j<result['failedmail'].length;j++) {

							htm = htm+(j+1)+")"+result['failedmail'][j];
						}

						swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Inspection Call Raise No: "+result['ICRno'], "warning");
					} else {

						swal({ 
						  title: "Success",
						   text: "You have raised an inspection call. Inspection Ref No: "+result['newrefno'],
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


	
});


app.controller("PurchasesDispatchInformationController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	$scope.Dates=Dates;
	$scope.dimaterials = []
	$scope.filedat = [];
	$scope.dispatchdocs = [];
	$scope.deliverylocation = "single";
	$scope.rec_type = "dept";
	$scope.dim_doc_type = {'name':"dispatchinfodeptmail",'id':6};

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



	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.vendorlist = result;

	});

	$scope.resetpos = function(){
		if($scope.vendorid)	$scope.getpolist();
		$scope.ponumber='';

	};

	$scope.getpolist = function() {
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
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			
		}
	}

	$scope.searchpo = function() {

		if(!$scope.ponumber) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;
			$scope.ponodetails = false;
			$scope.inspomat = [];
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_po_info_inspec',
			params:{pono:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Purchased Order No doesnot exist.");
					$scope.ponodetails = [];
				} else {

					$scope.ponodetails = result;
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.addtodimat = function(inspectionmatid) {

		if(!$scope.inspomat.approved_di_quantity) {

			swal("Please enter DI quantity.");
		} else if(!$scope.deliveryaddress) {

			swal("Please enter delivery address.");
		} else {

			var existcount = 0;

			angular.forEach($scope.dimaterials,function(dimat){
						
				if(dimat.inspection_material_id == inspectionmatid) {

					existcount=1;
				}
			});

			if(existcount == 1) {

				swal("Material already added.");
				$scope.inspomat = [];

			} else {

				$scope.dimaterials.push({"inspection_material_id":inspectionmatid, "material_name":$scope.inspomat.pomaterial.storematerial.name,"approved_qty":$scope.inspomat.approved_quantity, "already_dispatch_qty":$scope.inspomat.dispatch_quantity, "dispatch_quantity":$scope.inspomat.approved_di_quantity, "purchased_quantity":$scope.inspomat.pomaterial.quantity, "deliveryaddress":$scope.deliveryaddress});

				$scope.inspomat = [];
			}
		}
	}

	$scope.remove_dipmat = function(key) {


		swal({   title: "Are you sure you want to remove this material from the list?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   
			$scope.dimaterials.splice(key, 1);
			$scope.$apply();
			swal("Material removed", "", "success")

		});
	}

	$scope.approved_di_change = function() {

		var totaldispatch = parseFloat($scope.inspomat.approved_di_quantity) + parseFloat($scope.inspomat.dispatch_quantity);
		if(totaldispatch > parseFloat($scope.inspomat.approved_quantity)) {

			swal("Total DI quantity cannot be greater than the approved quantity.");
			$scope.inspomat.approved_di_quantity = "";
		}
	}

	$scope.approved_ditable_change = function(inspdimat) {
		var totaldispatch = parseFloat(inspdimat.already_dispatch_qty)+parseFloat(inspdimat.dispatch_quantity);
		if(totaldispatch > parseFloat(inspdimat.approved_qty)) {

			swal("Total dispatch quantity cannot be greater than approved quantity.");
			inspdimat.dispatch_quantity = "";
		}
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
			$rootScope.showloader=false;
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
				if(data[0]=='success')
				{
					$rootScope.showloader=false;
					if(dtype=="dispatchinfo"){
						$scope.dispatchdocs.push({'doc_type':3,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}else if(dtype=="dispatchinfodeptmail"){
						$scope.dispatchdocs.push({'mime_type':$scope.fdType,'doc_type':6,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}else if(dtype=="dispatchinfovendormail"){
						$scope.dispatchdocs.push({'mime_type':$scope.fdType,'doc_type':7,'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2]});
					}

					
					document.getElementById('file_dispatch').value=null;					
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
				

				$scope.dispatchdocs.splice(key, 1);
				swal("Deleted!", "Your file has been deleted.", "success"); 
				
				

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});

			

		});


		
	}

	$scope.dim_type_change = function(){
		if($scope.rec_type=='dept'){
			$scope.dim_doc_type.name = "dispatchinfodeptmail";
			$scope.dim_doc_type.id = "6";
		}else if($scope.rec_type=='dept'){
			$scope.dim_doc_type.name = "dispatchinfovendormail";
			$scope.dim_doc_type.id = "7";
		}
	}

	$scope.dispatchinfomailer = function(receiver_type){
		// console.log($scope.ponodetails);
		// console.log($scope.inspdetails);
		if(receiver_type=='vendor'){
			$scope.to = $scope.ponodetails.vendor.id;
		}
		if($scope.dimaterials.length == 0) {
			swal("Please add atleast one dispatch material for this dispatch.");
		}else if(!$scope.inspec_dispatch_date) {
			swal("Please select a DI date.");
		}else if(!$scope.to){
			swal("Please enter 'to' email id");
		}else if(!$scope.subject){
			swal("Please enter email subject");
		}else if(!$scope.emailcontent){
			swal("Please enter email content");
		}else{
			var file_attachments = [];
			// console.log($scope.inspdetails.inspectiondocs);
			if(typeof($scope.dispatchdocs) != 'undefined'){
				for(i=0;i<$scope.dispatchdocs.length;i++){
					if($scope.dispatchdocs[i]['doc_type']=='6'){
						file_attachments.push($scope.dispatchdocs[i]);
					}
				}
			}

			$rootScope.showloader=true;


			$http({
				method:'POST',
				url:$rootScope.requesturl+'/dispatchinfomailer',
				data:{poid:$scope.inspdetails.purchase_order_id,inspid:$scope.inspdetails.id,to:$scope.to,cc:$scope.cc,subject:$scope.subject, emailcontent:$scope.emailcontent,attachments:file_attachments,rec_type:receiver_type},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				if(result != 0) {

					// $scope.icrno = result['ICRno'];
					// $scope.inspdetails = result;
					// $scope.inspdetails.ref = result['ICRno'];

					// console.log(result['failedmail'][0]);

					if(result['failedmail'].length > 0) {
						var htm = "";

						for(var j=0; j<result['failedmail'].length;j++) {

							htm = htm+(j+1)+")"+result['failedmail'][j];
						}

						swal("Following email ID failed. Please send mail to these email ids manually "+htm, "Dispatch Info Mail Reference: "+result['DIMno'], "warning");
					} else {

						swal("You have raised an inspection call", "Dispatch Info Mail Reference: "+result['DIMno'], "success");
					}
					// $scope.savedispatch();
				}
			});
		}
	}	

	$scope.savedispatch = function() {

		if($scope.dimaterials.length == 0) {

			swal("Please add atleast one material for this DI.");
		} else if(!$scope.inspec_dispatch_date) {

			swal("Please select a DI date.");
		} else {

			if(!$scope.diremarks) {

				$scope.diremarks = "";
			}

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/save_didispatch',
			data:{dimaterials:$scope.dimaterials, dispatch_date:$scope.inspec_dispatch_date, dispatchdocs:$scope.dispatchdocs, inspectionid:$scope.inspdetails.id, remarks:$scope.diremarks},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				console.log(result);

				if(result == 1) {

					$scope.dimaterials = [];
					$scope.inspec_dispatch_date = "";
					$scope.dispatchdocs = [];
					$scope.inspdetails = [];
					$scope.searchpo();
				}
				
				swal("DI saved", "", "success");			

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

});

app.controller("PurchasesAddDefaultQuotationTermsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$http({
	method:'GET',
	url:$rootScope.requesturl+'/get_quotation_default_terms',
	headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		console.log(result);

		$scope.quotationterms = result;
		
	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else {

			$rootScope.showloader=true;

			$scope.quotationterms.push({"id":0, "termtitle":$scope.specialtermtitle});

			$scope.specialtermtitle = "";

			$rootScope.showloader=false;
		}
	}
	$scope.removespecialrow = function(currentrow) {

		//$scope.quotationterms.splice(currentrow-1, 1);
	}

	$scope.saveterms = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/insert_quotation_default_terms',
			data:{terms:$scope.quotationterms},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			swal("Quotation terms & conditions saved successfully", "", "success");
			console.log(result);
			$scope.quotationterms = result;
		});


	}

});

app.controller("PurchasesGtpDrawingController",function($scope,$http,$rootScope,$state,Logging){
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
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;
	});
	$scope.submatchange = function() {
		// if($scope.materialids == 'select') {
		if(!$scope.materialids) {

			swal("Please select a material.");
		} else {
			
			if(!$scope.projectid) {

				swal("Please select a project.");
			} else if(!$scope.vendorid) {

				swal("Please select a vendor.");
			} else {
				$http({
					method:'POST',
					url:$rootScope.requesturl+'/get_gtp_drawing',
					data:{projectid:$scope.projectid, vendorid:$scope.vendorid, materialid:$scope.materialids},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					console.log(result);
					$rootScope.showloader=false;
					if(result != "") {
						$scope.gtpdrawings = [];
						angular.forEach(result,function(drawing){
							$scope.gtpdrawings.push({"id":drawing['id'],"filename":drawing['filename'], "docpath":drawing['path']});
							
						});
					}  else {

						$scope.gtpdrawings = [];
					}
					
				});

			}
		}

	}
	$scope.vendorchan = function() {
		
		if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else {

			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_vendor_materials',
				params:{vendorid:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				$scope.mainmaterialslist = result;
				// $scope.materialid = "select";
				
			});
		}
	}

	$scope.uploadgtp=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.add_doc=function(){

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
				'filepath':'uploads/gtpdrawings'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){

				$http({
					method:'POST',
					url:$rootScope.requesturl+'/insert_gtp_drawing',
					data:{docpath:$scope.requesturl+"/uploads/gtpdrawings/"+data['1'], filename:data[2], vendorid:$scope.vendorid, projectid:$scope.projectid, "materialid":$scope.materialids},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(resultin){

					$rootScope.showloader=false;

					console.log(resultin);

					if(resultin != "") {

						$scope.gtpdrawings.push({"id":resultin['id'],"docpath":$scope.requesturl+"/uploads/gtpdrawings/"+data['1'], "filename":data['2']});

						document.getElementById('file_uploadgtp').value=null;
					}
					
				}).error(function(data,status){
					console.log(data+status);
					$rootScope.showloader=false;
					$rootScope.showerror=true;
					//Logging.validation(status);
				});
				
				// console.log(data);

			});


		}


	}

	$scope.remove_doc = function(key, docdata) {

		swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/remove_gtp_drawing',
				data:{id:docdata['id']},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(data){

				$rootScope.showloader = false;
				$scope.gtpdrawings.splice(key, 1);

				swal("File deleted successufully", "", "success");

			});

		})
	}
	
});

app.controller("TotalPoReportController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_po_total_report',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(data){
		console.log(data);

		$scope.totalpos = data;// data['podet'];
		// $scope.totalinspected = data['totalinspected'];
		// $scope.totalinspdispatch = data['totalinspdispatch'];
		// $scope.totalcompanyapproved = data['totalcompanyapproved'];
		// $scope.totalvendorapproved = data['totalvendorapproved'];
		
		
		$rootScope.showloader = false;
	});

});

app.controller("TotalVendorReportController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_total_report',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(data){

		$scope.totalvendor = data;
		$rootScope.showloader = false;
	});

});

app.controller("PurchasesPaymentsController",function($scope,$http,$rootScope,$state,Logging, Dates, $stateParams){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.internaldiid = $stateParams.indiid;
	$scope.ponumber='';
	$scope.inspecref='';
	$scope.diref='';
	$scope.invoicefiles=[];
	$scope.payterms = {};
	$scope.payterms['payment_type'] = "PDC";
	$scope.actype = "existing";
	$scope.file_attachments = [];
	$scope.currentpaycostcheck = 0;

	$scope.getindiinfo = function() {
		if($scope.internaldiid) {

			$rootScope.showloader = true;
			$http({
				method:'GET',
				// url:$rootScope.requesturl+'/get_po_list',
				url:$rootScope.requesturl+'/getindiinfo',
				params:{indiid:$scope.internaldiid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				$scope.pomateriallist = result[0];
				$scope.ponumberpre = result[1];
				$scope.vendorid = angular.copy($scope.pomateriallist[0]['vendor']);
				$scope.projectid = angular.copy($scope.pomateriallist[0]['project']);
				$scope.getpolist();
				console.log($scope.pomateriallist);
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
			});
		}
	}

	$scope.getindiinfo();

	$scope.dateconv = function(datethis){

		return Dates.getDate(datethis);
	}

	$scope.paymentraisetype='manual';
	$rootScope.showloader = true;
	$http({
		method:'GET',
		// url:$rootScope.requesturl+'/get_po_list',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result)
		$rootScope.showloader=false;
		// $scope.polist = result;
		$scope.projectlist = result;
		

	});
	$http({
		method:'GET',
		// url:$rootScope.requesturl+'/get_po_list',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		// console.log(result)
		$rootScope.showloader=false;
		// $scope.polist = result;
		$scope.vendorlist = result;		

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
			params:{vendorid:$scope.vendorid.id, projectid:$scope.projectid.id},
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
					$http({
						method:'GET',
						url:$rootScope.requesturl+'/get_vendor_info',
						params:{vendorid:$scope.vendorid.id},
						headers:{'JWT-AuthToken':localStorage.pmstoken},
					}).
					success(function(result){

						$rootScope.showloader=false;
						$scope.vendordetails = result;
						$scope.ponumber = angular.copy($scope.ponumberpre);

					}).error(function(data,status){
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

	$scope.pochange = function(){

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.ponumber){

			swal("Please select a purchase order.");
		}else {

			$rootScope.showloader=true;
			console.log($scope.ponumber);
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/get_pomat_details',
			data:{ponos:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				$scope.pomateriallist = result;

				angular.forEach($scope.pomateriallist, function(inpomat) {

					angular.forEach(inpomat.pomaterials, function(innpom) {

						innpom.currentpaycost = 0;
					})

					angular.forEach(inpomat.taxes, function(innpot) {

						innpot.newtaxvalue = 0;
					});
				});

				$scope.totalmatcost = 0;

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


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
		console.log("ss");
		console.log($scope.pomateriallist);
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
				console.log(innpot.value);
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
					} else if(innpot.tax_id == 11){

						angular.forEach(inpomat.pomaterials, function(innpomm) {

							totalcurpay += parseFloat(innpomm.currentpayqty)*innpomm.freightinsurance_rate;
						});

						innpot.newtaxvalue = parseFloat(totalcurpay).toFixed(2);
					}
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
		} else if($scope.currentpaycostcheck == 0) {

			swal("Please enter payment quantity for atleast one material.");
		} else if($scope.actype == "existing" && !$scope.vendoraccid){

			swal("Please select a bank account.")
		}else if($scope.actype == "new" && !$scope.accountno){

			swal("Please enter bank account number.")
		} else if($scope.actype == "new" && !$scope.ifsccode){

			swal("Please enter IFSC code.")
		} else if($scope.actype == "new" && !$scope.bankname){

			swal("Please enter bank name.")
		} else if($scope.actype == "new" && !$scope.bankbranch){

			swal("Please enter bank branch.")
		}else {

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


	$scope.remove_paymentdoc=function(path) {

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


app.controller("PurchasesCSController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.Dates=Dates;
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
    $scope.selectall = function(enquirydetails){
		if(enquirydetails && enquirydetails.length){
			var x = !$scope.isallselected(enquirydetails);
			angular.forEach(enquirydetails,function(enqdet){
				enqdet.selected = x;
			});
		}else{
			return false;
		}
	};

	$scope.isallselected = function(enquirydetails){
		if(enquirydetails && enquirydetails.length){
			var count = 0;
			var selectedVendors = {};
			angular.forEach(enquirydetails,function(enqdet){
				if(enqdet.selected){
					count++;
					var tempNetValue = parseFloat(angular.copy(enqdet.net_value_taxed));
					if(tempNetValue in selectedVendors) {

						tempNetValue = parseFloat(tempNetValue)+0.01;
					}
					selectedVendors[tempNetValue]=enqdet;
				}
			});

			$scope.selectedVendors = selectedVendors;
			$scope.selectedVendorsCount = count;
			if(count == enquirydetails.length){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	};

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
		$scope.enquiry = '';
		$scope.enquirydetails = 0;
		$scope.generatecs = 0;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_enquiry_list',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{projectid:$scope.project.id}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.enquirylist = result;
		});

	};

	$scope.searchenquiry = function(){
		if(!$scope.enquiry){
			swal("Please select an enquiry");
		}else{
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_enquiry_details_id',
				params:{enqid:$scope.enquiry.id, projectid:$scope.project.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){

				if(result != 0 && result != 2) {
					$scope.enquirydetails = result[0];
					$scope.enqmattypes = result[1].join(",");
					$scope.boqdet = result[3];
					$scope.indentdet = result[4];
					$scope.indenttot = result[5];
					$scope.latestindent = result[6];
					$scope.generatecs = 0;
					console.log(result);
				} else if(result == 0) {

					swal("No quotation added for the selected enquiry.");
				}
				$rootScope.showloader=false;
			}).error(function(result){
				$rootScope.showloader=false;
				console.log(result);

			});

		}
	};

	$scope.generatecsreport = function(){
		if(!$scope.selectedVendors){
			swal("please select atleast one of the vendors");
		}else{
			console.log($scope.selectedVendors);

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/generate_cs_ref',
				data:{enqid:$scope.enquiry.id, vendorlist:$scope.enquirydetails},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){				
				$rootScope.showloader=false;
				$scope.csrefdet = result;
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
								{'field':'Item Description','rows':1,'cols':1,'class':'text-center bold-font','style':'padding-left:70px;padding-right:70px;'},
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
					sortedarr.forEach(function(vi) {
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
								console.log($scope.selectedVendors[vi]['quotpayterms']['payment_type']);
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

			


			}).error(function(result){
				$rootScope.showloader=false;
				console.log(result);

			});

		}
				
	};

	$scope.savecsremarks = function(csrefdet) {

		if(!$scope.csrefdet.remarks) {

			swal("Please enter remarks to save remark.");
		} else {

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/savecsremarks',
				data:{csremarks:$scope.$scope.csrefdet.remarks, csrefid:$scope.csrefdet.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {

					swal("Remarks saved.");
				}
			});
		}
	}


});

app.controller("PurchasesReportsAmendPoController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;

	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$scope.poorderreportopt = 'vendorwise';

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

	$scope.searchpoamdlist = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.ponumber) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_poamdlist',
			params:{poid:$scope.ponumber},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Selected vendor doesnot have any purchase order for the selected project.");
					$scope.vendorpolist = [];
				} else {

					$scope.vendorpolist = result;
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
					var showterms = 0;
					var tobereadtotal = 0, tobereadtotalmain = 0;
					var oldtotal = 0, oldtotalmain = 0;

					angular.forEach($scope.ponodetails[0]['pomaterials'],function(podet){
						
						totalval = totalval+parseInt(podet['value_of_goods']);
						podet['value_of_goods'] = Commas.getcomma(Math.round(podet['value_of_goods']).toString());
					});

					angular.forEach($scope.ponodetails,function(podet){
						
						if(podet['amds']) {
							angular.forEach(podet['amds']['amenddetails'], function(inpodet) {

								if(inpodet.po_term_name != '' && inpodet.po_term_name) {
									showterms++;
								}
								if(inpodet.material_id != 0 && inpodet.type!=3) {
									if(inpodet.pomaterials) {
										tobereadtotal = tobereadtotal+parseFloat(inpodet.pomaterials.value_of_goods);
										tobereadtotalmain = tobereadtotalmain+parseFloat(inpodet.pomaterials.value_of_goods);
									}
								}
								if(inpodet.material_id != 0 && inpodet.type!=2) {
									oldtotal = oldtotal+parseFloat(inpodet.oldpomaterials.value_of_goods);
									oldtotalmain = oldtotalmain+parseFloat(inpodet.oldpomaterials.value_of_goods);
								}
								if(inpodet.tax_id != 0) {
									if(inpodet.potaxes) {
										tobereadtotalmain = tobereadtotal+parseFloat(inpodet.potaxes.value);
										oldtotalmain = oldtotalmain+parseFloat(inpodet.oldpotaxes.value);
									}
								}
							});
						}
					});
					$scope.oldtotal = angular.copy(oldtotal);
					$scope.tobereadtotal = angular.copy(tobereadtotal);
					$scope.oldtotalmain = angular.copy(Math.round(oldtotalmain));
					$scope.tobereadtotalmain = angular.copy(Math.round(tobereadtotalmain));
					if(showterms > 0) {

						$scope.showamdterms = true;
					}
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

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }




});

app.controller("MaterialHistoryReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.materials = result;
	});

	$scope.getmathistoryreport = function() {

		if(!$scope.submat) {

			swal("Please select a material.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/getmatreportdata',
				data:{submat:$scope.submat},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				$scope.repdata = result;
				$scope.myJson = {
				      type : 'scatter',
				      title: 'test title',
				      "utc":true,
				      'scale-y':{
						'values':'0:1000:100'    
						},
						"scale-x":{
					    "min-value":$scope.repdata['min'],
					    "step":"month",
					    "transform":{
					      "type":"date",
					      "all":"%M	%Y"
					    }
					},
				    series : [
				        { 
				        	values : $scope.repdata['values'],
				        	"data-product":$scope.repdata['podata'],
				            "tooltip":{
				                "text":"%data-product"
				            }

				        }
				    ]
				};
				console.log($scope.repdata['values']);
				console.log($scope.repdata['podata']);
			});
		}
	}
	
});

app.controller("PurchasesMatWisePoReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.Dates=Dates;

	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.getcommafun = function(num){

		return Commas.getcomma(num);
	}
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.materials = result;
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

	$scope.searchmatwisepo = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.submat) {

			swal("Please select a material.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_mat_wise_po',
				params:{matid:$scope.submat.id, projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				$scope.matwisepolist = result;
			});
		}
	}

});

app.controller("PurchasesEnterUnitFreightController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
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

	$scope.getpowithoutfreight = function() {

		$scope.podet = false;

		if($scope.projectid) {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getpowithoutfreight',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.polist = result;

			});
		}
	}

	$scope.saveunitfreight = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/saveunitfreight',
			data:{podet:$scope.podet},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			if(result == 1) {

				swal({ 
				  title: "Success",
				   text: "Unit Freight & Insurance rate saved successfully.",
				    type: "success" 
				  },
				  function(){
				    location.reload();
				});
				
			}
		});
	}
});

app.controller("PurchasesCopyPoController",function($scope,$http,$rootScope,$state,Logging, Commas){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.addmat = [];
	$scope.ponoshow = false;
	$scope.taxtype = "tax";
	$scope.pomateriallist = [];
	$scope.taxdetails = [];
	$scope.amds = [];
	$scope.amds.amenddetails = [];
	$scope.inclusivecheck = false;
	$scope.taxcaltype = 'percentage';
	$scope.edittype = "amendment";
	$scope.pomateriallistnew = [];
	$scope.pomateriallistnewpre = {};
	
	$scope.enqmattypecheck = function(mat) {
		if(mat && $scope.ponodetails.csref) {
			var x = 0;
			angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
				angular.forEach(inven.csvendor.materials, function(ininven){
					if(mat.id == ininven.materialdetails.category_id) {

						x++;
					}
				});
			});
			if(x>0){

				return true;
			} else {

				return false;
			}
		}
	}
	
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

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.alltaxes = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.searchpo = function() {
		$scope.ponodetails = [];
		$scope.pomateriallistnew = [];
		$scope.pomateriallistnewpre = {};
		$scope.pono = false;
		$scope.editmat = false;
		if(!$scope.purchaseid) {

			swal("Please select a purchase order.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_pomain_info',
			params:{pono:$scope.purchaseid,type:$scope.edittype},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				
				$rootScope.showloader=false;
				$scope.allshow =true;
				if(result == 0) {

					$scope.ponodetails = [];
					swal("Purchase Order Number doesnot exist.", "", "warning");
				}
				else if(result=='dateover')
				{
					$scope.ponodetails = [];
					swal("Cant edit PO because the edit date is over.", "", "warning");
					$scope.allshow = false;
				}
				else {
					$scope.ponoshow = true;
					$scope.ponodetails = result;
					$scope.ponodetails.cdate = $scope.ponodetails.po_date.substr(0,10);
					$scope.ponodetails.cdate = $scope.ponodetails.cdate.split("-").reverse().join("-");
					$scope.ponodetails.reference = angular.copy($scope.ponodetails.po_no+" dt. "+$scope.ponodetails.po_date);
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
							console.log(poresult);

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
									$scope.pomateriallistnewpre[pomat['storematerial']['parent_id']]['materials'].push({'materialdesc':pomat['storematerial']['name'], 'uom':pomat['storematerial']['matuom'][0]['stmatuom']['uom'], 'qty':pomat['quantity'], 'unitrate':pomat['unit_rate'], 'valueofgoods':pomat['value_of_goods'], 'materialid':pomat['material_id'], 'freightinsurance_rate':pomat.freightinsurance_rate, 'inspected_quantity':pomat.inspected_quantity, 'approved_quantity':pomat.approved_quantity, 'dispatch_quantity':pomat.dispatch_quantity, 'internal_di_quantity':pomat.internal_di_quantity, 'payment_qty':pomat.payment_qty, 'remarks':pomat.remarks, 'uomid':pomat.store_material_uom_id, 'total_po_qty':pomat['indenttotal']['total_po_qty'], 'total_indent_qty':pomat['indenttotal']['total_indent_qty']});
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
				}					

			}).error(function(data,status){
				
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
    }

	$scope.matfilter = function(smat){

		if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			if(smat.type == 2) {

				var y = 0;

				angular.forEach(smat.level1mat, function(inlevelmat){

					if(inlevelmat.storematerial.parent_id ==  smat.id) {

						y++;
					}
				});
				if(y>0) {

					return true;
				} else {

					return false;
				}
			} else {

				var x = 0;
				angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
					angular.forEach(inven.csvendor.materials, function(ininven){
						if(smat.id == ininven.materialdetails.id) {

							x++;
						}
					});
				});
				if(x>0){

					return true;
				} else {

					return false;
				}
			}

		} else {

			return false;
		}
	}
	$scope.matfiltersub = function(smat) {		
		var x = 0;
		angular.forEach($scope.ponodetails.csref.csrefdet, function(inven){
			angular.forEach(inven.csvendor.materials, function(ininven){
				if(smat.storematerial.id == ininven.materialdetails.id) {

					x++;
				}
			});
		});
		if(x>0){

			return true;
		} else {

			return false;
		}
		
	}


	$scope.editrow = function(pomat) {

		pomat.editmat = true;
	}

	$scope.saverow = function(pomat, pomatnew) {

		if(pomatnew.type==3 && !pomat.unitrate) {

			if(!pomat.qty || pomat.qty == 0) {

				swal("Please enter some quantity.");
			} else if(!$rootScope.digitcheck.test(pomat.qty)) {

				swal("Please enter digits in quantity.");
				pomat.qty = 0;
				pomat.valueofgoods = 0;
			} else {

				var calqty = 0;
				angular.forEach(pomatnew['materials'], function(indimat){

					calqty += parseFloat(indimat.qty)*parseFloat(indimat.wt_per_pole);
				});
				var pendinginqty = pomatnew.total_indent_qty-pomatnew.total_po_qty;
				
				pomatnew.qty = angular.copy(calqty);
				pomatnew.valueofgoods = angular.copy(parseFloat(pomatnew.qty)*parseFloat(pomatnew.unitrate));
				
			}

		} else {
			var pendinginqty = pomat.total_indent_qty-pomat.total_po_qty;
			var inspectqty = 0;
			if(pomat.inspected_quantity){
				inspectqty = angular.copy(pomat.inspected_quantity);
			}
			console.log(pomat.qty+'='+inspectqty);
			if(!pomat.qty || pomat.qty == 0) {
				swal("Please enter some quantity.");
			} else if(!$rootScope.digitcheck.test(pomat.qty)) {

				swal("Please enter digits in quantity.");
				pomat.qty = 0;
				pomat.valueofgoods = 0;
			} else if(!pomat.unitrate || pomat.unitrate == 0) {

				swal("Please enter some unit rate.");
			} else if(!$rootScope.digitcheck.test(pomat.unitrate)) {

				swal("Please enter digits in unit rate.");
				pomat.unitrate = 0;
				pomat.valueofgoods = 0;
			} else {
				
				pomat.valueofgoods = angular.copy(parseFloat(pomat.unitrate)*parseFloat(pomat.qty));
			}
		}
		$scope.altermatntax();
		pomat.editmat = false;
		
	}

	$scope.matchange = function() {
		
		if($scope.submat.type!=1) {

			$scope.addmat.quantity = 1;
			var calqty = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if($scope.submat.type==3) {

					indimat.qtythis = angular.copy(indimat.qty_per_pole);
					calqty += parseFloat(indimat.qty_per_pole)*parseFloat(indimat.wt_per_pole);
				} else {

					if(indimat.indenttotal.length>0) {
						indimat.pendingindentqty = indimat.indenttotal[0]['total_indent_qty']-indimat.indenttotal[0]['total_po_qty'];
						if(indimat.pendingindentqty >= indimat.qty) {

							indimat.qtythis = angular.copy(indimat.qty);	
						} else {

							indimat.qtythis = 0;
						}
						
					} else {

						indimat.pendingindentqty = 0;
						indimat.qtythis = 0;
					}
				}

				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});

			if($scope.submat.type==3) {

				$scope.addmat.quantity = angular.copy(calqty);
			}
			$scope.selectall = true;
		} else {
			
			if($scope.submat.indenttotal.length>0) {
				$scope.pendingindentqty = angular.copy($scope.submat.indenttotal[0]['total_indent_qty']-$scope.submat.indenttotal[0]['total_po_qty']);
				console.log($scope.submat.indenttotal.total_indent_qty);
			} else {

				$scope.pendingindentqty = 0;
			}
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

		if(!$scope.repeatprojectid) {

			swal("Please select project for repeat PO.");
		} else if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.addmat.quantity && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.quantity) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.addmat.unitrate && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter unit rate.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.unitrate) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in unit rate.");
		} else if(!$scope.addmat.uomval) {

			swal("Please select a uom.");
		} else {

			swal({   title: "Are you sure you want to add new material?",   text: "All taxes will be removed. Do you want to continue?",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, add it!",   closeOnConfirm: false }, function(){ 

				$scope.taxdetails = [];
			
				angular.forEach($scope.materials, function(inmattype){

					angular.forEach(inmattype.submaterials, function(inmat){

						if($scope.submat.id == inmat.id) {

							inmat.showmat = true;
						}
					});
				});

				$rootScope.showloader=true;

				if($scope.submat.type != 1) {
					var uomcount = 0, qtycount = 0,	unitcount = 0, selectedcount = 0, vgoodscount = 0;;

					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected){

							if(indimat.uom) {

								uomcount++;
							}
							if(indimat.qtythis && indimat.qtythis != 0) {

								qtycount++;
							}
							if(indimat.unitrate && indimat.unitrate != 0) {

								unitcount++;
							}

							selectedcount++;
							if(indimat.valueofgoods== 0 || indimat.qtythis == 0){

								vgoodscount++;
							}

						}

					});

					if(vgoodscount > 0) {

						swal("Value of goods/quantity for selected material cannot be zero.Please enter some quantity and unitrate for all selected materials.");
					} else if(selectedcount == 0){

						swal("Please select atleast one material to add.");
					} else if(uomcount == 0) {

						swal("Please select UOM for all selected materials.");
					} else if(qtycount == 0){

						swal("Please enter quantity for all selected materials.");
					} else if(unitcount == 0 && $scope.submat.type == 2) {

						swal("Please enter unit rate for all selected materials.");
					} else {

						var pomatlen = $scope.pomateriallistnew.length;
						if(!pomatlen in $scope.pomateriallistnew) {
							pomatlen++;
						}
						$scope.pomateriallistnew[pomatlen] = {};
						$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
						$scope.pomateriallistnew[pomatlen]['materialid'] = $scope.submat.id;
						$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;

						$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.addmat.uomval.id;
						if($scope.submat.type == 3){
							if($scope.submat.indenttotal){
								$scope.pomateriallistnew[pomatlen]['total_indent_qty'] = $scope.submat.indenttotal[0]['total_indent_qty'];
							}
							$scope.pomateriallistnew[pomatlen]['unitrate'] = $scope.addmat.unitrate;
							$scope.pomateriallistnew[pomatlen]['quantity'] = $scope.addmat.quantity;
						} else {

							$scope.pomateriallistnew[pomatlen]['unitrate'] = "";
							$scope.pomateriallistnew[pomatlen]['quantity'] = "";
						}
						$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.addmat.valueofgoods;
						$scope.pomateriallistnew[pomatlen]['units'] = $scope.addmat.uomval.stmatuom.uom;
						$scope.pomateriallistnew[pomatlen]['remarks'] = $scope.addmat.remarks;
						$scope.pomateriallistnew[pomatlen]['materials'] = [];
						
						angular.forEach($scope.submat.level1mat, function(indimat){
							if(indimat.selected){
								$scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uom.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "materialid":indimat.storematerial.id, "remarks":$scope.addmat.remarks, "total_indent_qty":indimat.indenttotal[0]['total_indent_qty'], "total_po_qty":indimat.indenttotal[0]['total_po_qty']});
								$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);
							}
						});
						$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
						$scope.altermatntax();
						$scope.addmat = [];
						$scope.materialtype = "";
						$scope.submat = "";
					}
				} else {
					if(!$scope.pomateriallistnew[0]) {
						$scope.pomateriallistnew[0] = {};
						$scope.pomateriallistnew[0]['type'] = $scope.submat.type;
						$scope.pomateriallistnew[0]['materials'] = [];
					}
					$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.addmat.uomval.stmatuom.uom, "uomid":$scope.addmat.uomval.id, "qty":$scope.addmat.quantity, "unitrate":$scope.addmat.unitrate,"valueofgoods":$scope.addmat.valueofgoods, "materialid":$scope.submat.id, "remarks":$scope.addmat.remarks, "total_indent_qty":$scope.submat.indenttotal[0]['total_indent_qty'], "total_po_qty":$scope.submat.indenttotal[0]['total_po_qty']});
					$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.addmat.valueofgoods);
					$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
					$scope.altermatntax();
					$scope.addmat = [];
					$scope.materialtype = "";
					$scope.submat = "";
				}	
				$rootScope.showloader=false;
				$scope.$apply();
				swal("Material added successfully", "", "success");
			});			
		}

	}

	$scope.getgoodscost = function(type) {

		if($scope.submat.type == 1 || $scope.submat.type == 3) {

			if($scope.submat.type == 3) {
				var calqty = 0;
				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						calqty += parseFloat(indimat.qtythis)*parseFloat(indimat.wt_per_pole);
					}
				});
				$scope.addmat.quantity = angular.copy(calqty);
				if($scope.addmat.quantity > $scope.pendingindentqty) {

					$scope.addmat.quantity = 0;
					$scope.addmat.valueofgoods = 0;
					swal("Quantity cannot be greater than pending indent quantity.");
				} else {
					if(!$scope.addmat.unitrate) {

						$scope.addmat.unitrate = 0;
					}
					$scope.addmat.valueofgoods = angular.copy(calqty*$scope.addmat.unitrate);
				}
			}

			if($scope.addmat.quantity > $scope.pendingindentqty) {

				$scope.addmat.quantity = 0;
				$scope.addmat.valueofgoods = 0;
				swal("Quantity cannot be greater than pending indent quantity.");
			} else {
				if($rootScope.digitcheck.test($scope.addmat.quantity) && $scope.addmat.quantity && $rootScope.digitcheck.test($scope.addmat.unitrate) && $scope.addmat.unitrate) {

					$scope.addmat.valueofgoods = parseFloat($scope.addmat.quantity)*parseFloat($scope.addmat.unitrate);
					$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods.toFixed(2));
				} else {

					$scope.addmat.valueofgoods = 0;
				}
			}
			

		} else {


			var totalvalthis = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if(indimat.selected) {
					if(indimat.qtythis > indimat.pendingindentqty) {

						indimat.qtythis = 0;
						swal("Quantity cannot be greater than pending indent quantity.");
					}
					
					if(!indimat.unitrate){

						indimat.unitrate = 0;
					}
					indimat.valueofgoods = angular.copy(parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate));
					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));
				}

			});
			$scope.addmat.valueofgoods = angular.copy(totalvalthis);


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
	}

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;

		angular.forEach($scope.pomateriallistnew,function(pomat){

			angular.forEach(pomat.materials,function(inpomat){

				if(!inpomat['freightinsurance_rate']) {

					inpomat['freightinsurance_rate'] = 0;
				}
				totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
			});
		});
		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);
	}

	$scope.removerow = function(pomat, pomatnew) {
		console.log(pomatnew);
		console.log($scope.pomateriallistnew);

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if(pomat.materialid == inmat.id) {

						inmat.showmat = false;
					}
				});
			});
			for(var i=pomatnew.materials.length-1; i>=0;i--){

				if(pomat.materialid == pomatnew.materials[i]['materialid']) {

					pomatnew.materials.splice(i, 1);
				}
			}
			for(var j=$scope.pomateriallistnew.length-1; j>=0;j--){

				if($scope.pomateriallistnew[j]['materials'].length == 0) {

					$scope.pomateriallistnew.splice(j, 1);
				}
			}
			if($scope.pomateriallistnew.length == 0) {

				$scope.taxdetails = [];
			}
			$scope.altermatntax();
			$scope.$apply();

			swal("Material deleted successfully.", "", "success");

		});
	}

	$scope.changetaxtype = function() {

		$scope.taxmatarr = [];

		$scope.potaxdetails.selectedtaxvalue = 0;

		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

			angular.forEach($scope.pomateriallistnew, function(inpomat) {

				if(inpomat.type == 3) {

					if(inpomat.selected) {

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);
					}
				} else {

					angular.forEach(inpomat['materials'], function(ininpomat) {

						if(ininpomat.selected) {

							$scope.toggletaxselectlist(ininpomat['valueofgoods'], ininpomat['materialid'], 'po_material', ininpomat.selected);
						}

					});
				}

				
			});

			angular.forEach($scope.taxdetails, function(inpotax) {

				if(inpotax.selected) {

					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, 'po_tax', inpotax.selected);
				}
			});
		}
	}

	$scope.toggletaxselectlist = function(thiscost, id, type, taxmatselect){

		$rootScope.showloader=true;
		var totaltaxcost = 0;
		var matcheckthis = -1;
		if(type=="po_material") {
			
			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
				if(id == $scope.taxmatarr[i]['material_id']) {

					matcheckthis = i;
				}
			}

			if(matcheckthis == -1) {

				var po_material_id = id;
				var tax_id = 0;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		} else {

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
				if(id == $scope.taxmatarr[i]['tax']['tax_id']) {

					matcheckthis = i;
				}
			}
			if(matcheckthis == -1) {

				var po_material_id = 0;
				var tax_id = id;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		}

		var thistaxvalue = 0;		
		
		angular.forEach($scope.taxmatarr,function(enqtax){
				
			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
		});

		$scope.totalcostfortax = angular.copy(totaltaxcost);
		if($scope.potaxdetails) {
			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
		}

		$rootScope.showloader=false;

		console.log($scope.taxmatarr);
	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}

	$scope.addtotax = function() {

		if(!$scope.potaxdetails) {

			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount amount.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in amount.");
		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount percentage.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in tax/discount percentage.");
		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select atleast one material to calculate tax/discount.");
		}else {

			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == $scope.potaxdetails.id) {

					inditax.showtax = true;
				}
			});

			var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);
			var lumpsum = 0;
			if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
				lumpsum=1;
				$scope.taxmatarr = [];
			} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
				lumpsum=1;
			}
			thistaxamount = thistaxamount.toFixed(2);
			
			$rootScope.showloader=true;

			if(!$scope.potaxdetails.inclusivepercentage) {

				$scope.potaxdetails.inclusivepercentage = 0;
			}

			$scope.taxdetails.push({"id":$scope.potaxdetails.id,"tax_id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
			$scope.altermatntax();

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			var maxelementcount = 0;

			angular.forEach($scope.pomateriallist,function(pomat){
					
				pomat.selected = false;
			});

			angular.forEach($scope.taxdetails,function(potax){
					
				potax.selected = false;
			});

			angular.forEach($scope.alltaxes,function(pomattax){
					
				pomattax.selectedtaxvalue = 0;
			});

			$rootScope.showloader=false;
		}
	}

	$scope.selectallmattax = function(pomaterials, taxdetails){

		if(pomaterials){
			var x = !$scope.isallselected(pomaterials, taxdetails);

			if(x == true) {

				$scope.taxmatarr = [];
			}

			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						inpomat.selected = x;

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);

					});

				} else {


					pomat.selected = x;

					$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['materialid'], 'po_material', pomat.selected);
				}

			});

			angular.forEach(taxdetails,function(potax){
				potax.selected = x;

				$scope.toggletaxselectlist(potax.taxamount, potax.id, 'po_tax', potax.selected);
			});

		}else{
			return false;
		}
	};

	$scope.isallselected = function(pomaterials, taxdetails){
		if(pomaterials){
			var count = 0, totcount = 0;
			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						if(inpomat.selected) {

							count++;
						}

						totcount++;

					});

				} else {

					if(pomat.selected){

						count++;
					}
					totcount++;
				}

			});

			var taxcount = 0;

			angular.forEach(taxdetails,function(potax){
				if(potax.selected){
					count++;
					
				}
				taxcount++;
			});


			var totallength = taxcount+totcount;

			if(count == totallength){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	$scope.removetaxrow = function(currentrow, taxid) {

		console.log($scope.taxdetails);

		swal({   title: "Are you sure you want to delete this tax?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == taxid) {

					inditax.showtax = false;
				}
			});

			$scope.taxdetails.splice(currentrow, 1);

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			$scope.altermatntax();
			$scope.$apply();
			swal("Tax deleted successfully", "", "warning");

		});
		
	}

	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}

	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.copypo = function() {

		if(!$scope.repeatprojectid) {

			swal("Please select project for repeat PO.");
		} else if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/generatepo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.repeatprojectid.id, billingaddress:$scope.ponodetails.billingaddress, transporttype:$scope.ponodetails.transporttype, reference:$scope.ponodetails.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode,transportmode:$scope.transport_mode, csrefid:$scope.ponodetails.csref_id, potype:0, repeatpo:1 },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				if(result == 0) {

					swal("The entered Purcahse Order Number already exists.");
				} else if(result == 3) {

					swal("Sorry! cannot repeat PO for the selected PO as it doesnot have CS attached to it.");
				} else {
					var totaloriginalcost = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){
							
						if(pomat.type == 3) {

							$scope.showanexure = true;
							totaloriginalcost = totaloriginalcost+parseInt(pomat.valueofgoods);
						} else {

							angular.forEach(pomat.materials, function(inpomat){

								totaloriginalcost = totaloriginalcost+parseInt(inpomat.valueofgoods);
							});
						}
					});
					$scope.totalvalueofgoods = angular.copy(Math.round($scope.totalvalueofgoods));
					$scope.totalcostwords = getwords($scope.totalvalueofgoods.toString());
					$scope.totalvalueofgoods = Commas.getcomma($scope.totalvalueofgoods);
					$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);

					$scope.companyvendorinfo = result;
					$scope.pono = result['pono'];

					$("#GeneratePoModal").modal('show');
				}

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


	$scope.editpo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/editpo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.ponodetails.vendor.id, projectid:$scope.ponodetails.project.id, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, deliverylocation:$scope.deliverylocation, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, poid:$scope.purchaseid },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;


				var totaloriginalcost = 0;

				angular.forEach($scope.pomateriallistnew,function(pomat){

					if(pomat.type == 3) {

						$scope.showanexure = true;
						
						pomat.unitrate = Commas.getcomma(Math.round(pomat.unitrate));
						totaloriginalcost = totaloriginalcost+parseInt(Math.round(pomat.valueofgoods));
					} else {

						angular.forEach(pomat.materials,function(inpomat){

							inpomat.unitrate = Commas.getcomma(Math.round(inpomat.unitrate));
							totaloriginalcost = totaloriginalcost+parseInt(Math.round(inpomat.valueofgoods));
						});
					}
				});
				$scope.totalcostwords = getwords(Math.round($scope.totalvalueofgoods.toString()));
				$scope.totalvalueofgoods = Commas.getcomma(Math.round($scope.totalvalueofgoods));
				$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
				

				$scope.companyvendorinfo = result;
				$scope.pono = result['pono'];

				$("#GeneratePoModal").modal('show');

			}).error(function(data,status){

				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}


	$scope.printpo = function() {

		var prtContent = document.getElementById("dd");
		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
	}



	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});

app.controller("PurchasesMatTrackerReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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

		});

	};

	$scope.generatemattrackerreport = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getmattrackreport',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.mattracklist = result;
			});
		}
	}


});

app.controller("PurchasesNormalRaiseOrderController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.ponew = [];
	$scope.addmat = [];
	$scope.transporttype = 'self';
	$scope.taxtype = 'tax';
	$scope.potype = 1;
	$scope.inclusivecheck = false;

	$scope.taxcaltype = 'percentage';

	$scope.pomateriallist = [];
	$scope.pomateriallistnew = {};

	$scope.taxdetails = [];

	$scope.specialterms = [];

	$rootScope.showloader=true

	$scope.totalvalueofgoods = 0;
	$scope.totalvalue = 0;

	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;

		$scope.alltaxes = result;

	}).error(function(data,status){
		console.log(data+status);
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
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

	$rootScope.showloader = true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_special_terms',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader = false;

		$scope.specialterms = result;

	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;

		$scope.vendorlist = result;
	});

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
		url:$rootScope.requesturl+'/get_material_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.materials = result;
		
	});

	$scope.projectchange = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_info',
			params:{project:$scope.projectid},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			var thistermcount = $scope.specialterms.length;
			var nextterm = thistermcount+1;
			var nextterm2 = nextterm+1;
			$scope.specialterms[thistermcount] = {};
			$scope.specialterms[nextterm] = {};
			
			$scope.specialterms[thistermcount]['termtitle'] = "LOA No";
			$scope.specialterms[thistermcount]['termdesc'] = result['loano'];
			$scope.specialterms[nextterm]['termtitle'] = "CLIENT";
			$scope.specialterms[nextterm]['termdesc'] = result['client'];
			if(result['project_term_name'] != "") {

				$scope.specialterms[nextterm2] = {};
				$scope.specialterms[nextterm2]['termtitle'] = "PROJECT NAME";
				$scope.specialterms[nextterm2]['termdesc'] = result['project_term_name'];
			}

			$scope.termsncondition = result['standard_terms'];

		});
	}

	$scope.matfilter = function(smat){
		if(smat.parent_id != 0 && smat.parent_id != smat.id && smat.parent) {

			if(smat.parent.type == 2) {

				return true;

			} else {

				return false;
			}
		}
		else if((smat.parent_id == 0 || (smat.parent_id != 0 && smat.parent_id == smat.id)) && !smat.showmat){

			return true;
		} else {

			return false;
		}
	}

	$scope.matchange = function() {
		$scope.submat.actcheck = false;

		if($scope.submat.type!=1) {

			$scope.addmat.quantity = 1;
			var calqty = 0;

			angular.forEach($scope.submat.level1mat, function(indimat){

				indimat.qtythis = angular.copy(indimat.qty);				

				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
			});

			if($scope.submat.type==3) {

				$scope.addmat.quantity = 0;

				$rootScope.showloader=true;
				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_fab_indent_mats',
					params:{projectid:$scope.projectid, matid:$scope.submat.id},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){

					$rootScope.showloader=false;
					
					if(result.length == 0) {

						swal("Fabrication inner materials are not mapped in boq.Please contact your planning department. ");
						$scope.submat = "";
					} else {

						$scope.activitygrouplist = result;
					}
					console.log(result);
				});
			}
			$scope.selectall = true;
		}
	}

	$scope.addtolevel1mat = function() {

		if(!$scope.subsubactivity) {

			swal("Please select a Activity.");
		} else {
			if(!$scope.submat.actcheck) {
				$scope.submat.level1mat = [];
			}
			angular.forEach($scope.subsubactivity.material, function(inmat){

				angular.forEach(inmat.submaterial, function(innmat) {
					$scope.submat.level1mat.push(innmat.storelevel1mat);
				});
			});
			angular.forEach($scope.submat.level1mat, function(indimat){
				indimat.selected = true;
				indimat.uom = angular.copy(indimat.storeuom);
				indimat.qtythis = angular.copy(indimat.qty);
			});
			$scope.submat.actcheck = true;
		}
	}
	$scope.levelmatclick = function(pomat) {

		if($scope.submat.type==3){

			if(!pomat.selected) {

				$scope.addmat.quantity = angular.copy($scope.addmat.quantity+(parseFloat(pomat.qty_per_pole)*parseFloat(pomat.wt_per_pole)));
			} else {

				$scope.addmat.quantity = angular.copy($scope.addmat.quantity-(parseFloat(pomat.qty_per_pole)*parseFloat(pomat.wt_per_pole)));
			}

			$scope.addmat.valueofgoods = angular.copy($scope.addmat.quantity*$scope.addmat.unitrate);
		} else {

			if(!pomat.selected) {

				if(!pomat.qtythis || !pomat.unitrate) {

					pomat.valueofgoods = 0;
				}
				$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods+pomat.valueofgoods);
			} else {

				if(!pomat.qtythis || !pomat.unitrate) {

					pomat.valueofgoods = 0;
				}
				$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods-pomat.valueofgoods);
			}

		}
	}

	$scope.selectallclick = function() {

		var checkselect = !$scope.isselectallsub();
		angular.forEach($scope.submat.level1mat, function(indimat){

			indimat.selected = checkselect;
		});
		var calqty = 0;
		var totalcostthis = 0;
		angular.forEach($scope.submat.level1mat, function(indimat){

			if(indimat.selected) {
				if($scope.submat.type==3) {

					calqty += parseFloat(indimat.qtythis)*parseFloat(indimat.wt_per_pc);
				} else if($scope.submat.type == 2) {

					if(!indimat.qtythis || !indimat.unitrate) {

						indimat.valueofgoods = 0;
					}
					totalcostthis = angular.copy(totalcostthis+indimat.valueofgoods);
				}
			}
		});
		if($scope.submat.type==3){
			$scope.addmat.quantity = angular.copy(Math.round(calqty*100)/100);
			if(!$scope.addmat.unitrate) {

				$scope.addmat.unitrate = 0;
			}
			$scope.addmat.valueofgoods = angular.copy($scope.addmat.quantity*$scope.addmat.unitrate);
		} else if($scope.submat.type == 2){

			$scope.addmat.valueofgoods = angular.copy(totalcostthis);
		}
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

		if(!$scope.vendorid) {

			swal("Please select a vendor.");
		} else if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.billingaddress) {

			swal("Please enter billing address.");
		} else if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.addmat.quantity && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter material quantity.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.quantity) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in quantity.");
		} else if(!$scope.addmat.unitrate && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter unit rate.");
		} else if(!$rootScope.digitcheck.test($scope.addmat.unitrate) && ($scope.submat.type == 1 || $scope.submat.type == 3)) {

			swal("Please enter digits in unit rate.");
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
				var uomcount = 0, qtycount = 0,	unitcount = 0, selectedcount = 0, vgoodscount = 0;;

				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						if(indimat.uom) {

							uomcount++;
						}
						if(indimat.qtythis && indimat.qtythis != 0) {

							qtycount++;
						}
						if(indimat.unitrate && indimat.unitrate != 0) {

							unitcount++;
						}
						selectedcount++;
						if(indimat.valueofgoods== 0 || indimat.qtythis == 0){

							vgoodscount++;
						}

					}

				});

				if(vgoodscount > 0) {

					swal("Value of goods/quantity for selected material cannot be zero.Please enter some quantity and unitrate for all selected materials.");
				} else if(selectedcount == 0){

					swal("Please select atleast one material to add.");
				} else if(uomcount == 0) {

					swal("Please select UOM for all selected materials.");
				} else if(qtycount == 0){

					swal("Please enter quantity for all selected materials.");
				} else if(unitcount == 0 && $scope.submat.type == 2) {

					swal("Please enter unit rate for all selected materials.");
				} else {

					var pomatlen = Object.keys($scope.pomateriallistnew).length;
					pomatlen += 1;

					$scope.pomateriallistnew[pomatlen] = {};

					$scope.pomateriallistnew[pomatlen]['matname'] = $scope.submat.name;
					$scope.pomateriallistnew[pomatlen]['materialid'] = $scope.submat.id;
					$scope.pomateriallistnew[pomatlen]['type'] = $scope.submat.type;
					
					$scope.pomateriallistnew[pomatlen]['mainuomid'] = $scope.submat.matuom[0]['stmatuom']['id'];
					if($scope.submat.type == 3){

						$scope.pomateriallistnew[pomatlen]['unitrate'] = $scope.addmat.unitrate;
						$scope.pomateriallistnew[pomatlen]['quantity'] = $scope.addmat.quantity;
					} else {

						$scope.pomateriallistnew[pomatlen]['unitrate'] = "";
						$scope.pomateriallistnew[pomatlen]['quantity'] = "";
					}
					$scope.pomateriallistnew[pomatlen]['valueofgoods'] = $scope.addmat.valueofgoods;
					$scope.pomateriallistnew[pomatlen]['units'] = $scope.submat.matuom[0]['stmatuom']['uom'];
					$scope.pomateriallistnew[pomatlen]['remarks'] = $scope.addmat.remarks;
					$scope.pomateriallistnew[pomatlen]['materials'] = [];
					console.log($scope.submat.level1mat);
					angular.forEach($scope.submat.level1mat, function(indimat){

						if(indimat.selected){

							$scope.pomateriallistnew[pomatlen]["materials"].push({"materialdesc":indimat.storematerial.name, "uom":indimat.uomin.stmatuom.uom, "uomid":indimat.uom.id, "qty":indimat.qtythis, "unitrate":indimat.unitrate,"valueofgoods":indimat.valueofgoods, "materialid":indimat.storematerial.id, "remarks":$scope.addmat.remarks});

							$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat(indimat.valueofgoods);

						}

					});

					$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
					$scope.altermatntax();

					$scope.addmat = [];
					$scope.materialtype = "";
					$scope.submat = "";

				}

			} else {

				if(!$scope.pomateriallistnew[0]) {

					$scope.pomateriallistnew[0] = {};
					$scope.pomateriallistnew[0]['type'] = $scope.submat.type;
					$scope.pomateriallistnew[0]['materials'] = [];
				}
				$scope.pomateriallistnew[0]['materials'].push({"materialdesc":$scope.submat.name, "uom":$scope.submat.matuom[0]['stmatuom']['uom'], "uomid":$scope.submat.matuom[0]['stmatuom']['id'], "qty":$scope.addmat.quantity, "unitrate":$scope.addmat.unitrate,"valueofgoods":$scope.addmat.valueofgoods, "materialid":$scope.submat.id, "remarks":$scope.addmat.remarks});

				$scope.totalvalue = parseFloat($scope.totalvalue) + parseFloat($scope.addmat.valueofgoods);
				$scope.totalvalue = angular.copy($scope.totalvalue.toFixed(2));
				$scope.altermatntax();
				$scope.addmat = [];
				$scope.materialtype = "";
				$scope.submat = "";

			}	
			$rootScope.showloader=false;			
		}

	}

	$scope.getgoodscost = function(type) {
		console.log($scope.submat);

		if($scope.submat.type == 1 || $scope.submat.type == 3) {
			if($scope.submat.type == 3) {
				var calqty = 0;
				angular.forEach($scope.submat.level1mat, function(indimat){

					if(indimat.selected){

						calqty += parseFloat(indimat.qtythis)*parseFloat(indimat.wt_per_pc);
					}
				});
				$scope.addmat.quantity = angular.copy(Math.round(calqty*100)/100);
				if(!$scope.addmat.unitrate) {

					$scope.addmat.unitrate = 0;
				}
				$scope.addmat.valueofgoods = angular.copy(calqty*$scope.addmat.unitrate);
				
			}
			if($rootScope.digitcheck.test($scope.addmat.quantity) && $scope.addmat.quantity && $rootScope.digitcheck.test($scope.addmat.unitrate) && $scope.addmat.unitrate) {

				$scope.addmat.valueofgoods = parseFloat($scope.addmat.quantity)*parseFloat($scope.addmat.unitrate);
				$scope.addmat.valueofgoods = angular.copy($scope.addmat.valueofgoods.toFixed(2));
			} else {

				$scope.addmat.valueofgoods = 0;
				
			}

		} else {


			var totalvalthis = 0;
			angular.forEach($scope.submat.level1mat, function(indimat){

				if(indimat.selected) {
					if(type == 'quantity') {
						indimat.qtythis = angular.copy(parseFloat($scope.addmat.quantity)*indimat.qty);
					}
					// if($scope.submat.type == 3){

					// 	indimat.qtythis = angular.copy(parseFloat($scope.addmat.quantity)*indimat.qty_per_pole);
					// }
					if(!indimat.unitrate){

						indimat.unitrate = 0;
					}
					indimat.valueofgoods = angular.copy(parseFloat(indimat.qtythis)*parseFloat(indimat.unitrate));

					totalvalthis = angular.copy(parseFloat(totalvalthis)+parseFloat(indimat.valueofgoods));
				}

			});
			$scope.addmat.valueofgoods = angular.copy(totalvalthis);


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

								$scope.taxdetails[i]['taxmaterials'][j]['tax']['value'] = angular.copy(parseFloat(pomat.valueofgoods));
								taxamount += parseFloat($scope.taxdetails[i]['taxmaterials'][j]['tax']['value']);
								checktaxmat++;
							}
						} else{

							angular.forEach(pomat['materials'],function(inpomat){
								if(inpomat.materialid == $scope.taxdetails[i]['taxmaterials'][j]['material_id']) {
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
								
						if($scope.taxdetails[k]['id'] == $scope.taxdetails[i]['taxmaterials'][j]['tax']['tax_id']) {

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

				taxamount = $scope.taxdetails[i]['taxamount'];
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
	}

	$scope.calculatetotalfreight = function() {

		var totalfreightcost = 0;

		angular.forEach($scope.pomateriallistnew,function(pomat){

			angular.forEach(pomat.materials,function(inpomat){

				if(!inpomat['freightinsurance_rate']) {

					inpomat['freightinsurance_rate'] = 0;
				}
				totalfreightcost += parseFloat(inpomat['qty'])*parseFloat(inpomat['freightinsurance_rate']);
			});
		});
		$scope.potaxdetails.selectedtaxvalue = angular.copy(totalfreightcost);
	}
	$scope.removerow = function(currentrow, matid, pomatnewmat, pomatnew, pomat) {

		swal({   title: "Are you sure you want to delete this material?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			angular.forEach($scope.materials, function(inmattype){

				angular.forEach(inmattype.submaterials, function(inmat){

					if(matid == inmat.id) {

						inmat.showmat = false;
					}
				});
			});

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;
			if(pomatnew.type == 3) {

				var thisqtyindi = angular.copy(parseFloat(pomat.qty)*parseFloat(pomat.wt_per_pole));
				pomatnew.quantity = angular.copy(pomatnew.quantity-thisqtyindi);
				pomatnew.valueofgoods = angular.copy(pomatnew.quantity*pomatnew.unitrate);
			}

			pomatnewmat.splice(currentrow, 1);
			
			var countempty = 0;
			angular.forEach($scope.pomateriallistnew, function(inmattype){

				if(inmattype.materials.length == 0){
					countempty++;

					angular.forEach($scope.materials, function(inmattype2){

						angular.forEach(inmattype2.submaterials, function(inmat2){

							if(inmattype.materialid == inmat2.id) {

								inmat2.showmat = false;
							}
						});
					});
				}
			});
			if(Object.keys($scope.pomateriallistnew).length == countempty) {

				$scope.taxdetails = [];
			}
			$scope.altermatntax();
			$scope.selectall = false;
			$scope.$apply();
			swal("Material deleted successfully.", "", "success");

		});
	}


	$scope.changetaxtype = function() {

		$scope.taxmatarr = [];

		$scope.potaxdetails.selectedtaxvalue = 0;

		if($scope.taxcaltype == 'percentage' && $scope.potaxdetails) {

			angular.forEach($scope.pomateriallistnew, function(inpomat) {

				if(inpomat.type == 3) {

					if(inpomat.selected) {

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);
					}
				} else {

					angular.forEach(inpomat['materials'], function(ininpomat) {

						if(ininpomat.selected) {

							$scope.toggletaxselectlist(ininpomat['valueofgoods'], ininpomat['materialid'], 'po_material', ininpomat.selected);
						}

					});
				}

				
			});

			angular.forEach($scope.taxdetails, function(inpotax) {

				if(inpotax.selected) {

					$scope.toggletaxselectlist(inpotax.taxamount, inpotax.id, 'po_tax', inpotax.selected);
				}
			});
		}
	}

	$scope.toggletaxselectlist = function(thiscost, id, type, taxmatselect){

		$rootScope.showloader=true;

		var totaltaxcost = 0;
		var matcheckthis = -1;

		if(type=="po_material") {
			

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
						
				if(id == $scope.taxmatarr[i]['material_id']) {

					matcheckthis = i;
				}
			}

			if(matcheckthis == -1) {

				var po_material_id = id;
				var tax_id = 0;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		} else {

			for(var i=$scope.taxmatarr.length-1;i>=0;i--){
					
				if(id == $scope.taxmatarr[i]['tax']['tax_id']) {

					matcheckthis = i;
				}
			}
			if(matcheckthis == -1) {

				var po_material_id = 0;
				var tax_id = id;
				$scope.taxmatarr.push({"material_id":po_material_id, "tax":{"tax_id":tax_id, "value":thiscost}});
			} else {

				$scope.taxmatarr.splice(matcheckthis, 1);
			}
		}

		var thistaxvalue = 0;		
		
		angular.forEach($scope.taxmatarr,function(enqtax){
				
			totaltaxcost = totaltaxcost+parseFloat(enqtax['tax']['value']);
		});

		$scope.totalcostfortax = angular.copy(totaltaxcost);
		if($scope.potaxdetails) {
			thistaxvalue = (parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100;
			$scope.potaxdetails.selectedtaxvalue = thistaxvalue.toFixed(2);
		}

		$rootScope.showloader=false;
	}

	$scope.taxfilter = function(tax) {

		if(!tax.showtax) {

			return true;
		} else {

			return false;
		}
	}

	$scope.addtotax = function() {

		if(!$scope.potaxdetails) {

			swal("Please select a Tax/ Discount/ Insurance/ Freight.");
		} else if(!$scope.potaxdetails.taxamount && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount amount.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.taxamount) && $scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in amount.");
		} else if(!$scope.potaxdetails.percentage && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter tax/discount percentage.");
		} else if(!$rootScope.digitcheck.test($scope.potaxdetails.percentage) && $scope.potaxdetails.tax != 'Freight & Insurance') {

			swal("Please enter digits in tax/discount percentage.");
		} else if($scope.taxmatarr.length == 0 && $scope.taxcaltype != 'lumpsum') {

			swal("Please select atleast one material to calculate tax/discount.");
		}else {

			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == $scope.potaxdetails.id) {

					inditax.showtax = true;
				}
			});

			var thistaxamount = angular.copy((parseFloat($scope.potaxdetails.percentage)*$scope.totalcostfortax)/100);

			var lumpsum = 0;
			if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax != 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.taxamount));
				lumpsum=1;
				$scope.taxmatarr = [];
			} else if($scope.taxcaltype == 'lumpsum' && $scope.potaxdetails.tax == 'Freight & Insurance') {

				thistaxamount = angular.copy(parseFloat($scope.potaxdetails.selectedtaxvalue));
				lumpsum=1;
			}
			thistaxamount = thistaxamount.toFixed(2);
			
			$rootScope.showloader=true;

			if(!$scope.potaxdetails.inclusivepercentage) {

				$scope.potaxdetails.inclusivepercentage = 0;
			}
			$scope.taxdetails.push({"id":$scope.potaxdetails.id,"lumpsum":lumpsum, "taxtitle":$scope.potaxdetails.tax, "taxtype":$scope.potaxdetails.type,"taxpercentage":$scope.potaxdetails.percentage,"inclusivetaxpercentage":$scope.potaxdetails.inclusivepercentage, "taxamount":thistaxamount,"taxdescription":$scope.potaxdetails.description, "taxmaterials":$scope.taxmatarr});
			$scope.altermatntax();

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;
			console.log($scope.taxdetails);
			var maxelementcount = 0;

			angular.forEach($scope.pomateriallistnew,function(pomat){
					
				pomat.selected = false;
				angular.forEach(pomat.materials,function(inpomat){
					inpomat.selected = false;
				});
			});

			angular.forEach($scope.taxdetails,function(potax){
					
				potax.selected = false;
			});

			angular.forEach($scope.alltaxes,function(pomattax){
					
				pomattax.selectedtaxvalue = 0;
			});

			console.log($scope.taxdetails);

			$rootScope.showloader=false;
		}
	}

	$scope.selectallmattax = function(pomaterials, taxdetails){

		if(pomaterials){
			var x = !$scope.isallselected(pomaterials, taxdetails);

			if(x == true) {

				$scope.taxmatarr = [];
			}

			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						inpomat.selected = x;

						$scope.toggletaxselectlist(inpomat['valueofgoods'], inpomat['materialid'], 'po_material', inpomat.selected);

					});

				} else {


					pomat.selected = x;

					$scope.toggletaxselectlist(pomat['valueofgoods'], pomat['materialid'], 'po_material', pomat.selected);
				}

			});

			angular.forEach(taxdetails,function(potax){
				potax.selected = x;

				$scope.toggletaxselectlist(potax.taxamount, potax.id, 'po_tax', potax.selected);
			});

		}else{
			return false;
		}
	};

	$scope.isallselected = function(pomaterials, taxdetails){
		if(pomaterials){
			var count = 0, totcount = 0;
			angular.forEach(pomaterials,function(pomat){

				if(pomat.type != '3') {

					angular.forEach(pomat.materials,function(inpomat){
						if(inpomat.selected) {

							count++;
						}

						totcount++;

					});

				} else {

					if(pomat.selected){

						count++;
					}
					totcount++;
				}

			});

			var taxcount = 0;

			angular.forEach(taxdetails,function(potax){
				if(potax.selected){
					count++;
					
				}
				taxcount++;
			});


			var totallength = taxcount+totcount;

			if(count == totallength){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	$scope.removetaxrow = function(currentrow, taxid) {

		swal({   title: "Are you sure you want to delete this tax?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 
			angular.forEach($scope.alltaxes,function(inditax){
						
				if(inditax['id'] == taxid) {

					inditax.showtax = false;
				}
			});

			$scope.taxdetails.splice(currentrow, 1);

			$scope.potaxdetails = [];
			$scope.taxmatarr = [];
			$scope.potaxdetails.description = "";
			$(".taxmatselect").prop("checked", false);
			$scope.totalcostfortax = 0;
			$scope.potaxdetails.selectedtaxvalue = 0;

			$scope.altermatntax();
			$scope.$apply();
			swal("Tax deleted successfully", "", "warning");

		});
		
	}
	$scope.addtospecial = function() {

		if(!$scope.specialtermtitle) {

			swal("Please enter term title.");
		} else if(!$scope.specialtermdesc) {

			swal("Please enter term description.");
		} else {

			$rootScope.showloader=true;

			$scope.specialterms.push({"termtitle":$scope.specialtermtitle, "termdesc":$scope.specialtermdesc});

			$scope.specialtermtitle = "";
			$scope.specialtermdesc = "";

			$rootScope.showloader=false;
		}
	}

	$scope.removespecialrow = function(currentrow) {

		$scope.specialterms.splice(currentrow-1, 1);
	}

	$scope.generatepo = function() {

		if(!$scope.termsncondition) {

			swal("Please enter terms and conditions.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/generatepo',
				data:{materiallist:$scope.pomateriallistnew, vendorid:$scope.vendorid, projectid:$scope.projectid, billingaddress:$scope.billingaddress, transporttype:$scope.transporttype, reference:$scope.reference, termsnconditions:$scope.termsncondition, specialterms:$scope.specialterms, taxdetails:$scope.taxdetails, totalvalueofgoods:$scope.totalvalueofgoods,transportmode:$scope.transportmode, pomanualdate:$scope.pomanualdate, ponothis:$scope.ponothis, potype:$scope.potype, csrefid:0 },
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("The entered Purcahse Order Number already exists.", "", "warning");
				} else if(result == 3) {

					swal("Cannot raise the on going PO through this module.", "", "warning");
				} else if(result == 4) {

					swal("Sorry!, You can only raise one month or older POs through this module.", "","warning")
				} else {
					var totaloriginalcost = 0;

					angular.forEach($scope.pomateriallistnew,function(pomat){
							
						if(pomat.type == 3) {

							$scope.showanexure = true;
							totaloriginalcost = totaloriginalcost+parseInt(pomat.valueofgoods);
						} else {

							angular.forEach(pomat.materials, function(inpomat){

								totaloriginalcost = totaloriginalcost+parseInt(inpomat.valueofgoods);
							});
						}
					});
					$scope.totalvalueofgoods = angular.copy(Math.round($scope.totalvalueofgoods));
					$scope.totalcostwords = getwords($scope.totalvalueofgoods.toString());
					$scope.totalvalueofgoods = Commas.getcomma($scope.totalvalueofgoods);
					$scope.totaloriginalcost = Commas.getcomma(totaloriginalcost);
					

					$scope.companyvendorinfo = result;
					$scope.pono = result['pono'];

					$("#GeneratePoModal").modal('show');
				}

			}).error(function(data,status){
				console.log(data+status);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}		
	}

	$scope.printpo = function() {

		var prtContent = document.getElementById("dd");
		var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		WinPrint.document.write(prtContent.innerHTML);
		WinPrint.document.close();
		WinPrint.focus();
		WinPrint.print();
		WinPrint.close();
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});


app.controller("PurchasesIndentReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getindentreport',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				$scope.indentlist = result;
			});
		}
	}


});

app.controller("PurchasesMatToBePurReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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

	$scope.gettobepurchasedindentreport = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/gettobepurchasedindentreport',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				$scope.indentlist = result;
			});
		}
	}


});

app.controller("PurchasesInsDiStatusReportController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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
		$scope.projectlist.unshift({"name":"All", "id":"All"});
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_vendor_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.vendorlist = result;
		$scope.vendorlist.unshift({"name":"All", "id":"All"});
	});

	$scope.generateinsdistatusreport = function() {

		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/generateinsdistatusreport',
			params:{projectid:$scope.projectid, vendorid:$scope.vendorid.id, fromdate:$scope.pofromdate, todate:$scope.potodate},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			if(result.length == 0) {

				swal("No Materials found.");
			} else {
				$scope.powiselist = result;
			}
		});
	}

});


app.controller("PurchasesFabMapController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
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

	$scope.getpowithoutfabmap = function() {

		$scope.podet = false;

		if($scope.projectid) {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getpowithoutfabmap',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$scope.polist = result;
				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_activity_group_list',
					params:{projectid:$scope.projectid},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){

					$rootScope.showloader=false;
					$scope.activitygrouplist = result;
					console.log(result);
				});

			});
		}
	}

	$scope.selectallsub = function(actgrp) {
		if(!actgrp.selectall) {

			actgrp.selectall = true;
		} else {

			actgrp.selectall = false;
		}

		angular.forEach(actgrp.material, function(mat) {
			
			angular.forEach(mat.submaterial, function(innmat){

				innmat.selected=actgrp.selectall;
			});
		});
			
	}

	$scope.inmatclick = function(actgrp, pomat) {
		if(!pomat.selected) {

			pomat.selected = true;
		} else {

			pomat.selected = false;
		}
		var checkallsub = isselectallsub(actgrp);
		actgrp.selectall = checkallsub;
	}

	function isselectallsub(actgrp) {
		var count = 0;
		for(var i=0; i<actgrp.material.length; i++) {
			
			var matcount = actgrp.material[i]['submaterial'].length;
			for(var j=0; j<actgrp.material[i]['submaterial'].length; j++) {

				if(actgrp.material[i]['submaterial'][j]['selected']) {

					count++;
				}
			}
			
		}
		
		if(count == matcount) {

			return true;
		} else {

			return false;
		}
		
	}

	$scope.savefabmat = function(){
		var countlevel = 0;
		angular.forEach($scope.activitygrouplist, function(indiact){

			angular.forEach(indiact.material, function(indimat){

				angular.forEach(indimat.submaterial, function(indisub){

					if(indisub.selected){
						countlevel++;
					}
				});
			});
		});

		if(countlevel == 0) {

			swal("Please select atleast one material. ");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/savefabmat',
				data:{podet:$scope.podet, actgrp:$scope.activitygrouplist},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 1) {

					swal({ 
					  title: "Success",
					   text: "Fabrication material saved successfully.",
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

app.controller("PurchasesIndentReportFabController",function($scope,$http,$rootScope,$state,Logging, Commas,Dates){

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

	$scope.getindentreportfab = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else {
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/getindentreportfab',
				params:{projectid:$scope.projectid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;
				$scope.indentlist = result;
			});
		}
	}


});