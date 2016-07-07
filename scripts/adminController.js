app.controller("AdminHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

});
app.controller("AdminUomController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.typeofwork='add';
	$scope.add={};
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_uom_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.uomlist=result;
	});

	$scope.add_uom=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_uom',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.add
		}).success(function(result){
			swal(result);
			$scope.add={};
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_uom_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){
				$rootScope.showloader=false;
				$scope.uomlist=result;
			});
		});
	}

	$scope.edit_uom=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/edit_uom',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.uommain
		}).success(function(result){
			$rootScope.showloader=false;
			swal(result);
			$scope.uommain="";
		});
	}
});

app.controller("AdminTaxesController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.typeofwork='add';
	$scope.add={};
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_tax_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.taxlist=result;
	});
	$scope.add_tax=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_tax',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.add
		}).success(function(result){
			swal(result);
			$scope.add={};
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_tax_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).success(function(result){
				$rootScope.showloader=false;
				$scope.taxlist=result;
			});
		});
	}

	$scope.edit_tax=function(){
		if($scope.taxmain.type=='select')
		{
			swal('Please select if you are adding a tax or discount');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/edit_tax',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:$scope.taxmain
			}).success(function(result){
				$rootScope.showloader=false;
				swal(result);
				$scope.taxmain="";
			});
		}
	}
});

app.controller("AdminCreateStoreController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$scope.store={};
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_offices',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.offices=result;
	});
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_managers',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.userlist=result;
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.projectlist=result;
	});

	$scope.create_store=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_store',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.store
		}).success(function(result){
			$rootScope.showloader=false;
			if(result[0]=='Success')
			{
				$scope.store={};
			}
			swal(result[1]);
		});
	}
});

app.controller("AdminEditStoreController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

});

app.controller("AdminCreateOfficeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.create_office=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_office',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.office
		}).success(function(result){
			$rootScope.showloader=false;
			if(result[0]=='error')
			{
				swal(result[1]);
			}
			else
			{
				swal(result[1]);
				$scope.office={};
			}
		})
	}

});

app.controller("AdminCreateUserController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$scope.user={};
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_user_roles',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.userroles=result;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_offices',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.offices=result;
		});
	});


	$scope.create_user=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_user',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.user
		}).success(function(result){
			$rootScope.showloader=false;
			if(result[0]=='error')
			{
				swal(result[1]);
			}
			else
			{
				swal(result[1]);
				$scope.user={};
			}
		});
	}
});	

app.controller("AdminEditUsersController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.mainuser={};
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_user_roles',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.userroles=result;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_offices',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).success(function(result){
			$scope.offices=result;
			$rootScope.showloader=false;
		});
	});

	$scope.editusershow=function(x){
		$scope.mainuser=angular.copy(x);
	}

	$scope.edituser=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/edit_user',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:$scope.mainuser
		}).success(function(result){
			$scope.userlist=result;
			$scope.mainuser={};
			$('#edituserdetails').modal('hide');
			$rootScope.showloader=false;
		});
	}

	$scope.showusers=function(){
		if($scope.usertype=='select')
		{
			swal('Please select the type of user.');
		}
		else if($scope.officetype=='select')
		{
			swal('Please select the office.');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_user_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{usertype:$scope.usertype,officetype:$scope.officetype}
			}).success(function(result){
				$scope.userlist=result;
				$rootScope.showloader=false;
			});
		}
	}
});

app.controller("AdminAssignHvdsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.project='select';
	$scope.projects=[];
	$scope.feeders=[];
	$scope.feeder='select';
	$scope.workids=[];
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$scope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.projects=result;
	});

	$http({
		method:'GET',
		url:$scope.requesturl+'/get_project_managers_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken}
	}).success(function(result){
		$scope.userlist=result;
	});

	$scope.project_change=function(){
		if($scope.project=='select')
		{
			$scope.feeders=[];
			$scope.feeder='select';
			$scope.workids=[];
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_feeder_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{'project':$scope.project}
			}).success(function(result){
				$rootScope.showloader=false;
				$scope.feeders=result[0].feeders;
			});
		}
	}

	$scope.feeder_change=function(){
		if($scope.feeder=='select')
		{
			$scope.workids=[];
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_workid_list',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				params:{'feeder':$scope.feeder}
			}).success(function(result){
				$rootScope.showloader=false;
				$scope.workids=result;
				angular.forEach($scope.workids,function(work){
					if(!work.sitedata)
					{
						work.sitedata={};
						work.sitedata.user_id='select';
					}
				});
			});
		}
	}

	$scope.save_workids=function(){
		var flag=0;
		for(var i=0;i<$scope.workids.length;i++)
		{
			if($scope.workids[i].sitedata.user_id=='select')
			{
				swal('Please select the Project Manager for '+$scope.workids[i].name);
				flag=1;
				break;
			}
		}
		if(flag==0)
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/save_workids',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{'data':$scope.workids}
			}).
			success(function(result){
				$rootScope.showloader=false;
				swal(result[1]);
			});
		}

	}

});

app.controller("AdminAssignElectrificationController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

});

app.controller("AdminAssignSubStationConstructionController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

});

app.controller("AdminEditProjectController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.projectlist=result;
		$rootScope.showloader=false;
	});

	$scope.change_project=function(){
		$rootScope.showloader=true;
		if($scope.mainproject.status=='0')
		{
			$state.go('user.admin.createproject.divisions',{'projectid':$scope.mainproject.id});
		}
		else if($scope.mainproject.status=='1')
		{
			$state.go('user.admin.createproject.schedules',{'projectid':$scope.mainproject.id});
		}
	}
});

app.controller("AdminCreateProjectController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$rootScope.showloader=true;
	$scope.typeofwork = 'hvds';
	$scope.filedat={};
	$scope.filedat.desc='';
	$scope.doclist=[];
	$scope.project={};

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_offices',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.offices=result;
	});

	$http({
		method:'GET',
		url:$scope.requesturl+'/get_project_heads',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.projectheads=result;
	});

	$http({
		method:'GET',
		url:$scope.requesturl+'/get_doc_types',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		params:{type:'1'}
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.doctypes=result;
	});

	$scope.add_doc=function(){
		if($scope.filedat.desc=='')
		{
			swal('Please select the type of document you are uploading');
		}
		else if(!$scope.filedat.fname)
		{
			swal('Please select the file to upload');
		}
		else
		{
			var fdats=$scope.filedat.desc.split("|");
			$scope.doclist.push({'docname':fdats[1],'docid':fdats[0],'docpath':$scope.requesturl+'/uploads/'+$scope.filedat.fname});
			$scope.filedat={};
			$scope.filedat.desc='';
			document.getElementById('file_upload').value=null;
		}
	}

	$scope.remove_doc=function(i){
		$scope.doclist.splice(i,1);
	}
	
	
	$scope.upload=function(files){
		$rootScope.showloader=true;
		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.allplist={};
		$scope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/uploading',
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

	$scope.create_project=function(){
		if($scope.doclist.length==0)
		{
			swal('Please upload the corresponding documents');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$scope.requesturl+'/create_project',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{'projectdets':$scope.project,'docdets':$scope.doclist,'projecttype':$scope.typeofwork}
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result[0]=='success')
				{
					swal(result[1]);
					$scope.filedat={};
					$scope.filedat.desc='';
					$scope.doclist=[];
					$scope.project={};
					$state.go('user.admin.createproject.divisions',{'projectid':result[2]});
				}
				else
				{
					swal(result[1]);
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

app.controller("AdminCreateProjectHvdsController",function($scope,$http,$rootScope,$state,Logging,$stateParams){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	var pjid=$stateParams.projectid;
	$scope.substationno='select';
	$scope.dat=[];
	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$scope.requesturl+'/get_project_info',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		params:{'project':pjid}
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.project=result;
	});

	$scope.sschange=function(){
		if($scope.substationno=='select')
		{
			$scope.dat=[];
		}
		else
		{
			if(parseInt($scope.substationno)<$scope.dat.length)
			{
				$scope.dat.splice(parseInt($scope.substationno));
			}
			else
			{
				var count=parseInt($scope.substationno)-$scope.dat.length;
				for(var i=0;i<count;i++)
				{
					$scope.dat.push({'ssname':'','feederno':'select','feederdat':[]});
				}
			}
		}
	}

	$scope.feederchange=function(ss){
		if(ss.feederno=='select')
		{
			ss.feederdat=[];
		}
		else
		{
			if(parseInt(ss.feederno)<ss.feederdat.length)
			{
				ss.feederdat.splice(parseInt(ss.feederno));
			}
			else
			{
				var counter=parseInt(ss.feederno)-ss.feederdat.length;
				for(var j=0;j<counter;j++)
				{
					ss.feederdat.push({'feedername':'','mdtrno':''});
				}
			}
		}
	}

	$scope.add_ss_feeder=function(){
		if($scope.dat.length==0)
		{
			swal('Please select the number of sub stations');
		}
		else
		{
			var flag=0;
			for(var i=0;i<$scope.dat.length;i++)
			{
				if($scope.dat[i].feederdat.length==0)
				{
					flag=1;
					swal('Please select the number of feeders under substation '+(i+1));
				}
			}
			if(flag==0)
			{
				$rootScope.showloader=true;
				$http({
					method:'POST',
					url:$scope.requesturl+'/add_ss_feeder',
					data:{'dat':$scope.dat,'project':$scope.project},
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(result){
					$rootScope.showloader=false;
					swal(result[1]);
					$state.go('user.admin.createproject.schedules',{'projectid':$scope.project.id});
				}).error(function(data,status){
					console.log(data+status);
					$rootScope.showloader=false;
					$rootScope.showerror=true;
					//Logging.validation(status);
				});
			}
		}
	}
});

app.controller("AdminCreateProjectSchedulesController",function($scope,$http,$rootScope,$state,Logging,$stateParams){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$rootScope.showloader=true;
	$scope.dat=[
	{
		'name':'',
		'subschedule':[
			{
				'no':'',
				'descr':'',
				'boqmat':'select',
				'qty':'',
				'unitrate':'',
				'erectrate':'',
				'budgetrate':'',
				'tot':''
			}
		]
	}
	]
	$http({
		method:'GET',
		url:$scope.requesturl+'/get_boq_mats',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		params:{'project':$stateParams.projectid}
	}).
	success(function(result){
		$rootScope.showloader=false;
		// $scope.boqmats=result;
		$scope.materials=result;
	});

	$scope.add_new_sch=function(){
		$scope.dat.push({
			'name':'',
			'subschedule':[
				{
					'no':'',
					'descr':'',
					'boqmat':'select',
					'qty':'',
					'unitrate':'',
					'erectrate':'',
					'tot':''
				}
			]
		});
	}

	$scope.add_sub_sch=function(sch){
		sch.subschedule.push({
			'no':'',
			'descr':'',
			'boqmat':'select',
			'qty':'',
			'unitrate':'',
			'erectrate':'',
			'tot':''
		});
	}

	$scope.remove_sub=function(sch,i){
		sch.subschedule.splice(i,1);
		if(sch.subschedule.length==0)
		{
			sch.subschedule.push({
				'no':'',
				'descr':'',
				'boqmat':'select',
				'qty':'',
				'unitrate':'',
				'erectrate':'',
				'tot':''
			});
		}
	}


	$scope.remove_sch=function(i){
		$scope.dat.splice(i,1);
		if($scope.dat.length==0)
		{
			$scope.dat.push({
				'name':'',
				'subschedule':[
					{
						'no':'',
						'descr':'',
						'boqmat':'select',
						'qty':'',
						'unitrate':'',
						'erectrate':'',
						'tot':''
					}
				]
			});
		}
	}

	$scope.get_tot=function(s){
		return (s.qty*s.unitrate)+(s.qty*s.erectrate);
	}

	$scope.save_sch=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$scope.requesturl+'/add_sch',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{'project':$stateParams.projectid,'data':$scope.dat}
		}).success(function(result){
			$rootScope.showloader=false;
			swal(result[1]);
			$state.go('user.admin.createproject.create');
		}).error(function(data,status){
			console.log(data+status);
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			//Logging.validation(status);
		});
	}
});

app.controller("AdminSurveyItemsController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$rootScope.showloader=true;
	$scope.items=[
		{},
	];
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_project_list',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$rootScope.showloader=false;
		$scope.projectlist=result;
	});

	$scope.get_project_schedules=function(){
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_schedules',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{project:$scope.mainproject.id}
		}).success(function(result){
			$rootScope.showloader=false;
			$scope.schedulelist=result;
			angular.forEach($scope.schedulelist,function(schedule){
				schedule.applicable=1;
				schedule.type=1;
				schedule.datatype=1;
			});
			$scope.items[0].slist=angular.copy($scope.schedulelist);
		});
	}

	$scope.add_item=function(){
		var arr={};
		arr.slist=angular.copy($scope.schedulelist);
		$scope.items.push(arr);
	}

	$scope.remove_item=function(i){
		$scope.items.splice(i,1);
		if($scope.items.length==0)
		{
			var arr={};
			arr.slist=angular.copy($scope.schedulelist);
			$scope.items.push(arr);
		}
	}

	$scope.create_survey_items=function(){
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/create_survey_items',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			data:{project:$scope.mainproject.id,items:$scope.items}
		}).success(function(result){
			swal(result);
			$rootScope.showloader=false;
			$scope.items=[];
			var arr={};
			arr.slist=angular.copy($scope.schedulelist);
			$scope.items.push(arr);
		});
	}
});

