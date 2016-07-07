var app=angular.module("PMSApp",["ui.router", "zingchart-angularjs"]);
app.directive('fileChange', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('change', function() {
				scope.$apply(function() {
				scope[attrs['fileChange']](element[0].files);
				});
			});
		},
	}
});
//to display html content in scope variable
app.directive('htmldiv', function($compile, $parse) {
return {
  restrict: 'E',
  link: function(scope, element, attr) {
    scope.$watch(attr.content, function() {
      element.html($parse(attr.content)(scope));
      $compile(element.contents())(scope);
    }, true);
  }
}
});

//chosen directive
app.directive('chosen', function() {

	 var linker = function (scope, element, attrs) {
        var list = attrs['options'];

        //watching the scope variable which is there in options attribute
        scope.$watch(list, function () {
            element.trigger('chosen:updated');
        });

        //watching ng-model
        scope.$watch(attrs['ngModel'], function() {

        	//updating chosen on change
            element.trigger('chosen:updated');
        });

        //initiating chosen
        element.chosen();
    };

    return {
        restrict: 'A',
        link: linker
    };
	
});


app.factory('Dates',function(){
	return{
		getDate:function(str1)
		{
			if(!str1)
			{
				return "";
			}
			else
			{
				var dt1=str1.substring(8,10);
				var mon1=str1.substring(5,7);
				var yr1=str1.substring(0,4);
				return dt1+'/'+mon1+'/'+yr1;
			}
		}
	}
});

app.service('Commas',function(){
	this.getcomma=function(nums){

		nums = Math.round(nums);
		if(nums)
		{
		var num1=nums.toString();
		if(num1.length>7)
		{
			numstart=num1.substr(0,num1.length-7);
			numstart=numstart+',';
			num=num1.substr(-7);
		}
		else
		{
			num=num1;
			numstart="";
		}
		if(num.length>4)
		{
			num1=num.substr(0,num.length-3);
			if(num1.length%2==0)
			{
				var num2 = num1.match(/(.{1,2})/g);
				num2.push(num.substr(-3));
				fin=num2.join();
			}
			else
			{
				var num2=num1.substr(1);
				var num3 = num2.match(/(.{1,2})/g);
				num3.push(num.substr(-3));
				fin=num3.join();
				fin=num.substr(0,1)+','+fin;
			}
		}
		else
		{
			fin=num;
		}
		return numstart+fin;
		}
		else
		{
			return " ";
		}
	}
});


app.service('Logging', ['$state','$rootScope','$http',function ($state,$rootScope,$http) {
	this.validation=function(status){
		if(status=='401')
		{
			$rootScope.loginerrormsg='Unauthorized Access.';
		}
		else if(status=='402')
		{
			$rootScope.loginerrormsg='Session Timed Out.';
		}
		else
		{
			$rootScope.loginerrormsg='Error Connecting.';
		}
		localStorage.removeItem('pmstoken');
		$state.go('login');
	}

	this.logout=function(){
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/logout',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).success(function(result){
			$rootScope.showloader=false;
			localStorage.removeItem('pmstoken');
			$state.go('login');
		}).error(function(data,status){
			$rootScope.showloader=false;
			if(status=='401')
			{
				$rootScope.loginerrormsg='Unauthorized Access.';
			}
			else if(status=='402')
			{
				$rootScope.loginerrormsg='Session Timed Out.';
			}
			else
			{
				$rootScope.loginerrormsg='Error Connecting.';
			}
			localStorage.removeItem('pmstoken');
			$state.go('login');
		});
	}
}]);

app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/login");

	$stateProvider.
		state('login',{
			url: '/login',
			views:{
				"nav":{
					templateUrl:"partials/navmain.html"
				},
				"main":{
					templateUrl:"partials/home.html",
					data:{title:'Home'},
					controller:'HomeController'
				}
				
			}
		}).
		state('user',{
			views:{
				"nav":{
					templateUrl:"partials/nav.html",
					controller:'LoginController'
				},
				"main":{
					templateUrl:"partials/users/main.html",
				}
				
			}
		}).
		state('user.module',{
			url: '/home',
			views:{
				"content":{
					templateUrl:"partials/users/module.html",
					data:{title:'Modules'},
					controller:'WelcomeController'
				}
				
			}
		}).
		state('user.profile',{
			views:{
				"content":{
					templateUrl:"partials/profile/sidebar.html",
				}
			}
		}).
		state('user.profile.details',{
			url:'/profile',
			views:{
				"pagetopnav":{
					templateUrl:"partials/profile/details.html",
					data:{title:'Details'},
					controller:'ProfileDetailsController'
				}
				
			}
		}).
		state('user.profile.password',{
			url:'/changepassword',
			views:{
				"pagetopnav":{
					templateUrl:"partials/profile/password.html",
					data:{title:'Change Password'},
					controller:'ProfilePasswordController'
				}
				
			}
		}).
		//Mine//
		state('user.warehouseadmin',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.warehouseadmin.main',{
			url: '/warehouseadmin',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/home.html",
					data:{title:'Warehouse'},
					controller:'WarehouseAdminHomeController'
				}
			}
		}).
		state('user.warehouseadmin.issuereport',{
			url: '/warehouseadmin/issuereport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/issuereport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminIssueReportController'
				}
			}
		}).
		state('user.warehouseadmin.receiptreport',{
			url: '/warehouseadmin/receiptreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/receiptreport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminReceiptReportController'
				}
			}
		}).
		state('user.warehouseadmin.reconreport',{
			url: '/warehouseadmin/reconreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/reconreport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminReconReportController'
				}
			}
		}).
		state('user.warehouseadmin.personwisereport',{
			url: '/warehouseadmin/personwisereport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/personwisereport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminPersonWiseReportController'
				}
			}
		}).
		state('user.warehouseadmin.stockreport',{
			url: '/warehouseadmin/stockreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/stockreport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminStockReportController'
				}
			}
		}).
		state('user.warehouseadmin.materialreport',{
			url: '/warehouseadmin/materialreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouseadmin/materialreport.html",
					data:{title:'Warehouse Issue Report'},
					controller:'WarehouseAdminMaterialReportController'
				}
			}
		}).
		//Mine//
		state('user.warehouse',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.warehouse.main',{
			url: '/warehouse',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/home.html",
					data:{title:'Warehouse'},
					controller:'WarehouseHomeController'
				}
				
			}
		}).
		state('user.warehouse.inventorymanagement',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/warehouse/stockinventorytopnav.html"
				}
				
			}
		}).
		state('user.warehouse.inventorymanagement.stockinventory',{
			url: '/warehouse/inventorymanagement/stockinventory',
			views:{
				"content":{
					templateUrl:"partials/warehouse/stockinventory.html",
					data:{title:'Warehouse Stock Inventory'},
					controller:'WarehouseStockInventoryController'
				}
				
			}
		}).
		state('user.warehouse.inventorymanagement.receipts',{
			url: '/warehouse/inventorymanagement/receipts',
			views:{
				"content":{
					templateUrl:"partials/warehouse/receipts.html",
					data:{title:'Warehouse Receipts'},
					controller:'WarehouseReceiptsController'
				}				
			}
		}).
		state('user.warehouse.inventorymanagement.receipt',{
			url: '/warehouse/inventorymanagement/receipt',
			views:{
				"content":{
					templateUrl:"partials/warehouse/receipt.html",
					data:{title:'Warehouse Receipts'},
					controller:'WarehouseReceiptController'
				}				
			}
		}).
		state('user.warehouse.inventorymanagement.issue',{
			url: '/warehouse/inventorymanagement/issue',
			views:{
				"content":{
					templateUrl:"partials/warehouse/issue.html",
					data:{title:'Warehouse Issue'},
					controller:'WarehouseIssueController'
				}
				
			}
		}).
		state('user.warehouse.inventorymanagement.groundstockrevision',{
			url: '/warehouse/inventorymanagement/groundstockrevision',
			views:{
				"content":{
					templateUrl:"partials/warehouse/groundstockrevision.html",
					data:{title:'Warehouse Ground Stock Revision'},
					controller:'WarehouseGroundStockRevisionController'
				}
				
			}
		}).
		state('user.warehouse.reports',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/warehouse/reports/reportstopnav.html"
				}
				
			}
		}).
		state('user.warehouse.reports.reconciliation',{
			url: '/warehouse/reports/reconciliation',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/reconciliation.html",
					data:{title:'Warehouse Reconciliation Reports'},
					controller:'WarehouseReportsReconciliationController'
				}
				
			}
		}).
		state('user.warehouse.reports.stockrevisionreports',{
			url: '/warehouse/reports/stockrevision',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/stockrevision.html",
					data:{title:'Warehouse Stock Revision Reports'},
					controller:'WarehouseReportsStockRevisionController'
				}
			}
		}).
		state('user.warehouse.reports.stockinventoryreports',{
			url: '/warehouse/reports/stockinventory',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/stockinventory.html",
					data:{title:'Warehouse Stock Inventory Reports'},
					controller:'WarehouseReportsStockInventoryController'
				}				
			}
		}).
		state('user.warehouse.reports.materialissuereports',{
			url: '/warehouse/reports/materialissue',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/materialissue.html",
					data:{title:'Warehouse Material Issue Reports'},
					controller:'WarehouseReportsMaterialIssueController'
				}
				
			}
		}).
		state('user.warehouse.reports.materialreceiptreports',{
			url: '/warehouse/reports/materialreceipt',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/materialreceipt.html",
					data:{title:'Warehouse Material Receipt Reports'},
					controller:'WarehouseReportsMaterialReceiptController'
				}
			}
		}).
		state('user.warehouse.reports.materialrptpersonwise',{
			url: '/warehouse/reports/materialrptpersonwise',
			views:{
				"content":{
					templateUrl:"partials/warehouse/reports/materialrptpersonwise.html",
					data:{title:'Warehouse Material Report Person Wise '},
					controller:'WarehouseReportsMaterialPersonWiseController'
				}
			}
		}).
		state('user.warehouse.addmaterialtype',{
			url: '/warehouse/addmaterialtype',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addmaterialtype.html",
					data:{title:'Warehouse Add Material Type'},
					controller:'WarehouseAddMaterialTypeController'
				}
			}
		}).
		state('user.warehouse.addmaterials',{
			url: '/warehouse/addmaterials',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addmaterials.html",
					data:{title:'Warehouse Add Material'},
					controller:'WarehouseAddMaterialsController'
				}
			}
		}).
		state('user.warehouse.boqbommapping',{
			url: '/warehouse/boqbommapping',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/boqbommapping.html",
					data:{title:'Warehouse Material Mapping'},
					controller:'WarehouseBoqBomMappingController'
				}
			}
		}).
		state('user.warehouse.addthirdparty',{
			url: '/warehouse/addthirdparty',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addthirdparty.html",
					data:{title:'Warehouse Add Third Party'},
					controller:'WarehouseThirdPartyController'
				}
			}
		}).
		state('user.warehouse.addsubcontractor',{
			url: '/warehouse/addsubcontractor',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addsubcontractor.html",
					data:{title:'Warehouse Add Sub Contractor'},
					controller:'WarehouseSubContractorController'
				}
			}
		}).
		state('user.warehouse.addstocks',{
			url: '/warehouse/addstocks',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addstocks.html",
					data:{title:'Warehouse Add Stocks'},
					controller:'WarehouseAddStocksController'
				}
			}
		}).
		state('user.warehouse.addfabricationstocks',{
			url: '/warehouse/addfabricationstocks',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addstocksfab.html",
					data:{title:'Warehouse Add Fabrication Stocks'},
					controller:'WarehouseAddFabStocksController'
				}
			}
		}).
		state('user.purchases',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.purchases.main',{
			url: '/purchases',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/home.html",
					data:{title:'Purchases'},
					controller:'PurchasesHomeController'
				}
				
			}
		}).
		state('user.purchases.vendorregistration',{
			url: '/purchases/vendorregistration',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/vendorregistration.html",
					data:{title:'Vendor Registration'},
					controller:'PurchasesVendorRegistrationController'
				}
				
			}
		}).
		state('user.purchases.edituom',{
			url: '/addedituom',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/edituom.html",
					data:{title:'Admin'},
					controller:'AdminUomController'
				}
			}
		}).
		state('user.purchases.payments',{
			url: '/purchases/payments/:indiid',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/payments.html",
					data:{title:'Payments'},
					controller:'PurchasesPaymentsController'
				}
			}
		}).
		state('user.purchases.boqreport',{
			url: '/purchases/boqreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/boqreport.html",
					data:{title:'BOQ REPORT'},
					controller:'BoqReportController'
				}
				
			}
		}).
		state('user.purchases.sendenquiry',{
			url: '/purchases/sendenquiry',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/sendenquiry.html",
					data:{title:'Send Enquiry'},
					controller:'PurchasesSendEnquiryController'
				}
				
			}
		}).
		state('user.purchases.resendenquiry',{
			url: '/purchases/resendenquiry',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/resendenquiry.html",
					data:{title:'Re-Send Enquiry'},
					controller:'PurchasesReSendEnquiryController'
				}
				
			}
		}).
		state('user.purchases.raisepurchaseorder',{
			url: '/purchases/raisepurchaseorder',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/raisepurchaseorder.html",
					data:{title:'Raise Purchase Order'},
					controller:'PurchasesRaiseOrderController'
				}
				
			}
		}).
		state('user.purchases.raisenormalpurchaseorder',{
			url: '/purchases/raisenormalpurchaseorder',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/raisenormalpurchaseorder.html",
					data:{title:'Raise Purchase Order'},
					controller:'PurchasesNormalRaiseOrderController'
				}
				
			}
		}).
		state('user.purchases.editpurchaseorder',{
			url: '/purchases/editpurchaseorder',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/editpurchaseorder.html",
					data:{title:'Edit Purchase Order'},
					controller:'PurchasesEditPoController'
				}
				
			}
		}).
		state('user.purchases.copypurchaseorder',{
			url: '/purchases/copypurchaseorder',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/copypo.html",
					data:{title:'Repeat Purchase Order'},
					controller:'PurchasesCopyPoController'
				}
				
			}
		}).
		state('user.purchases.enterquotations',{
			url: '/purchases/enterquotations',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/enterquotations.html",
					data:{title:'Add/Edit Quotations'},
					controller:'PurchasesQuotationsController'
				}
				
			}
		}).
		state('user.purchases.di',{
			url: '/purchases/departmentinspection',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/di.html",
					data:{title:'Inspection Details'},
					controller:'PurchasesDIController'
				}
				
			}
		}).
		state('user.purchases.roadpermit',{
			url: '/purchases/roadpermit',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/roadpermit.html",
					data:{title:'Road Permits'},
					controller:'RoadPermitController'
				}
				
			}
		}).
		state('user.purchases.maninternaldi',{
			url: '/purchases/maninternaldi',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/maininternaldi.html",
					data:{title:'Internal DI'},
					controller:'ManInternalDIController'
				}
				
			}
		}).
		state('user.purchases.internaldi',{
			url: '/purchases/internaldi',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/internaldi.html",
					data:{title:'Inspection Details'},
					controller:'PurchasesInternalDIController'
				}
				
			}
		}).
		state('user.purchases.createinsref',{
			url: '/purchases/createinsref',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/ins.html",
					data:{title:'Inspection Reference'},
					controller:'PurchasesInspectionController'
				}
			}
		}).
		state('user.purchases.inspection',{
			url: '/purchases/inspection',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/depins.html",
					data:{title:'Department Inspection'},
					controller:'PurchasesDepInspectionController'
				}
				
			}
		}).
		state('user.purchases.createdisref',{
			url: '/purchases/createdisref',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/createdisref.html",
					data:{title:'Create Dispatch Reference'},
					controller:'PurchasesDispatchRefController'
				}
				
			}
		}).
		state('user.purchases.dispatch',{
			url: '/purchases/dispatch',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/dispath.html",
					data:{title:'Dispath Instructions'},
					controller:'PurchasesDispathController'
				}
				
			}
		}).
		state('user.purchases.inspectiondispatchinformation',{
			url: '/purchases/inspectiondispatchinformation',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/dispatchinformation.html",
					data:{title:'Dispatch Instructions'},
					controller:'PurchasesDispatchInformationController'
				}
				
			}
		}).
		state('user.purchases.gtpdrawing',{
			url: '/purchases/gtpdrawing',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/gtpdrawing.html",
					data:{title:'GTP Drawing'},
					controller:'PurchasesGtpDrawingController'
				}
				
			}
		}).
		state('user.purchases.comparativestatement',{
			url: '/purchases/comparativestatement',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/comparativestatement.html",
					data:{title:'Comparative Statement'},
					controller:'PurchasesCSController'
				}
				
			}
		}).
		state('user.purchases.enterunitfreight',{
			url: '/purchases/enterunitfreight',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/enterunitfreight.html",
					data:{title:'Enter Unit Freight'},
					controller:'PurchasesEnterUnitFreightController'
				}
				
			}
		}).
		state('user.purchases.mapfabricationmat',{
			url: '/purchases/mapfabricationmat',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/mapfabricationmat.html",
					data:{title:'Map Fabrication Material'},
					controller:'PurchasesFabMapController'
				}
				
			}
		}).
		state('user.purchases.reports',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/purchases/reports/reportstopnav.html"
				}
				
			}
		}).
		state('user.purchases.reports.poreport',{
			url: '/purchases/report/purchaseorderreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/poreport.html",
					data:{title:'Purchase Order Report'},
					controller:'PurchasesReportsPoOrderController'
				}
				
			}
		}).
		state('user.purchases.reports.vendorreport',{
			url: '/purchases/report/vendorreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/vendorreport.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsVendorRepController'
				}
				
			}
		}).
		state('user.purchases.reports.potracker',{
			url: '/purchases/report/potracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/potracker.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsPoTrackerController'
				}
				
			}
		}).
		state('user.purchases.reports.amdporeport',{
			url: '/purchases/report/amdporeport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/amdporeport.html",
					data:{title:'Amendment PO Report'},
					controller:'PurchasesReportsAmendPoController'
				}
				
			}
		}).
		state('user.purchases.reports.matwiseporpt',{
			url: '/purchases/report/matwiseporpt',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/matwiseporpt.html",
					data:{title:'Material Wise PO Report'},
					controller:'PurchasesMatWisePoReportController'
				}
				
			}
		}).
		state('user.planning.reports.matwiseporpt',{
			url: '/planning/report/matwiseporpt',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/matwiseporpt.html",
					data:{title:'Material Wise PO Report'},
					controller:'PurchasesMatWisePoReportController'
				}
				
			}
		}).
		state('user.planning.reports.schedulematerials',{
			url: '/planning/report/schedulematerials',
			views:{
				"content":{
					templateUrl:"partials/planning/reports/schedulematerials.html",
					data:{title:'Schedule Materials Report'},
					controller:'ScheduleMaterialsController'
				}
				
			}
		}).
		state('user.purchases.reports.enquiryreport',{
			url: '/purchases/report/enquiryreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/enquiryreport.html",
					data:{title:'Enquiry Report'},
					controller:'PurchasesReportsEnquiryController'
				}
				
			}
		}).
		state('user.purchases.reports.csreport',{
			url: '/purchases/report/csreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/csreport.html",
					data:{title:'Comparitive Statement Report'},
					controller:'PurchasesReportsCSController'
				}
				
			}
		}).
		state('user.purchases.reports.mattracker',{
			url: '/purchases/report/mattracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/mattracker.html",
					data:{title:'Material Tracker'},
					controller:'PurchasesMatTrackerReportController'
				}
				
			}
		}).
		state('user.purchases.reports.indentreport',{
			url: '/purchases/report/indentreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/indentreport.html",
					data:{title:'Indent Report'},
					controller:'PurchasesIndentReportController'
				}
				
			}
		}).
		state('user.purchases.reports.indentreportfab',{
			url: '/purchases/report/indentreportfab',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/indentreportfab.html",
					data:{title:'Fabrication Materials Indent Report'},
					controller:'PurchasesIndentReportFabController'
				}
				
			}
		}).
		state('user.purchases.reports.materialtobepurchased',{
			url: '/purchases/report/materialtobepurchased',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/materialtobepurchased.html",
					data:{title:'Indent Report'},
					controller:'PurchasesMatToBePurReportController'
				}
				
			}
		}).
		state('user.purchases.reports.inspdistatusreport',{
			url: '/purchases/report/inspdistatusreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/inspdistatusreport.html",
					data:{title:'Inspection DI Status Report'},
					controller:'PurchasesInsDiStatusReportController'
				}
				
			}
		}).
		state('user.purchases.reports.approvedindent',{
			url: '/purchases/report/approvedindent',
			views:{
				"content":{
					templateUrl:"partials/planninghead/reports/approvedindent.html",
					data:{title:'Approved Indent Report'},
					controller:'ApprovedIndentController'
				}
				
			}
		}).
		state('user.billing',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.billing.main',{
			url: '/billing',
			views:{
				"pagetopnav":{
					templateUrl:"partials/billing/home.html",
					data:{title:'Billing'},
					controller:'BillingHomeController'
				}
				
			}
		}).
		state('user.billing.clientbilling',{
			url: '/billing/clientbilling',
			views:{
				"pagetopnav":{
					templateUrl:"partials/billing/clientbilling.html",
					data:{title:'Client Billing'},
					controller:'BillingClientController'
				}
				
			}
		}).
		state('user.billing.subcontractorbilling',{
			url: '/billing/subcontractorbilling',
			views:{
				"pagetopnav":{
					templateUrl:"partials/billing/subcontractorbilling.html",
					data:{title:'Sub Contractor Billing'},
					controller:'BillingSubContractorController'
				}
				
			}
		}).
		state('user.billing.recovery',{
			url: '/billing/recovery',
			views:{
				"pagetopnav":{
					templateUrl:"partials/billing/recovery.html",
					data:{title:'Recovery'},
					controller:'BillingRecoveryController'
				}
				
			}
		}).
		state('user.billing.supplybilling',{
			url: '/billing/supplybilling',
			views:{
				"pagetopnav":{
					templateUrl:"partials/billing/supplybilling.html",
					data:{title:'Supply Billing'},
					controller:'BillingSupplyController'
				}
				
			}
		}).
		state('user.admin',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.admin.main',{
			url: '/admin',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/home.html",
					data:{title:'Admin'},
					controller:'AdminHomeController'
				}
				
			}
		}).
		state('user.admin.addmaterialtype',{
			url: '/planning/addmaterialtype',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addmaterialtype.html",
					data:{title:'Purchases Add Material Type'},
					controller:'WarehouseAddMaterialTypeController'
				}
			}
		}).
		state('user.admin.addmaterials',{
			url: '/planning/addmaterials',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addmaterials.html",
					data:{title:'Purchases Add Material'},
					controller:'WarehouseAddMaterialsController'
				}
			}
		}).
		state('user.admin.addmsmaterial',{
			url: '/planning/addmsmaterial',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addmsmaterial.html",
					data:{title:'Add MS Material'},
					controller:'AddMsMaterialController'
				}
			}
		}).
		state('user.admin.addaggregator',{
			url: '/planning/addaggregator',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addaggregator.html",
					data:{title:'Purchases Aggregator Mapping'},
					controller:'WarehouseAddAggregatorController'
				}
			}
		}).
		state('user.admin.addfabrication',{
			url: '/planning/addfabrication',
			views:{
				"pagetopnav":{
					templateUrl:"partials/warehouse/addfabrication.html",
					data:{title:'Purchases Fabrication Mapping'},
					controller:'WarehouseAddFabricationController'
				}
			}
		}).
		state('user.admin.editmaterial',{
			url: '/planning/editmaterial',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/editmaterial.html",
					data:{title:'Purchases Edit Material'},
					controller:'PurchasesEditMaterialController'
				}
			}
		}).
		state('user.admin.materialhistoryreport',{
			url: '/purchases/materialhistoryreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/reports/materialhistoryreport.html",
					data:{title:'Material History Report'},
					controller:'MaterialHistoryReportController'
				}
			}
		}).
		state('user.purchases.editvendormaterials',{
			url: '/purchases/editvendormaterials',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/editvendormaterial.html",
					data:{title:'Purchases Edit Vendor Material'},
					controller:'PurchasesEditVendorMaterialController'
				}
			}
		}).
		state('user.purchases.uploadpodocuments',{
			url: '/purchases/uploadpodocuments',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/uploadpodocuments.html",
					data:{title:'Purchases Upload PO Documents'},
					controller:'PurchasesUploadPoDocumentsController'
				}
			}
		}).
		state('user.admin.adddefaultterms',{
			url: '/purchases/adddefaultterms',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/adddefaultterms.html",
					data:{title:'Purchases Add Default Terms'},
					controller:'PurchasesAddDefaultTermsController'
				}
			}
		}).
		state('user.admin.adddefaultquotationterms',{
			url: '/purchases/adddefaultquotationterms',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchases/adddefaultquotationterms.html",
					data:{title:'Purchases Add Default Quotation Terms'},
					controller:'PurchasesAddDefaultQuotationTermsController'
				}
			}
		}).
		state('user.admin.createuser',{
			url: '/createuser',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/createuser.html",
					data:{title:'Admin'},
					controller:'AdminCreateUserController'
				}
				
			}
		}).
		state('user.admin.edituom',{
			url: '/addedituom',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/edituom.html",
					data:{title:'Admin'},
					controller:'AdminUomController'
				}
			}
		}).
		state('user.admin.taxes',{
			url: '/taxes',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/taxes.html",
					data:{title:'Admin'},
					controller:'AdminTaxesController'
				}
			}
		}).
		state('user.admin.editstore',{
			url: '/editstore',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/editstore.html",
					data:{title:'Admin'},
					controller:'AdminEditStoreController'
				}
			}
		}).
		state('user.admin.createstore',{
			url: '/createstore',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/createstore.html",
					data:{title:'Admin'},
					controller:'AdminCreateStoreController'
				}
			}
		}).
		state('user.admin.editusers',{
			url: '/editusers',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/editusers.html",
					data:{title:'Admin'},
					controller:'AdminEditUsersController'
				}
				
			}
		}).
		state('user.admin.assignworkids',{
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/workidtopnav.html"
				}
				
			}
		}).
		state('user.admin.assignworkids.hvds',{
			url:'/admin/assignworkids/hvds',
			views:{
				"content":{
					templateUrl:"partials/admin/hvds.html",
					data:{title:'Admin Assign Work IDs'},
					controller:'AdminAssignHvdsController'
				}
				
			}
		}).
		state('user.admin.assignworkids.electrification',{
			url:'/admin/assignworkids/electrification',
			views:{
				"content":{
					templateUrl:"partials/admin/electrification.html",
					data:{title:'Admin Assign Work IDs'},
					controller:'AdminAssignElectrificationController'
				}
				
			}
		}).
		state('user.admin.assignworkids.substationconstruction',{
			url:'/admin/assignworkids/substationconstruction',
			views:{
				"content":{
					templateUrl:"partials/admin/substationconstruction.html",
					data:{title:'Admin Assign Work IDs'},
					controller:'AdminAssignSubStationConstructionController'
				}
				
			}
		}).
		state('user.admin.createproject',{
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/creatprojecttopnav.html"
				}
				
			}
		}).
		state('user.admin.createproject.create',{
			url:'/admin/createproject/create',
			views:{
				"content":{
					templateUrl:"partials/admin/createproject.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectController'
				}
				
			}
		}).
		state('user.admin.createproject.hvds',{
			url:'/admin/createproject/hvds/:projectid',
			views:{
				"content":{
					templateUrl:"partials/admin/createprojecthvds.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectHvdsController'
				}
				
			}
		}).
		state('user.admin.createproject.schedules',{
			url:'/admin/createproject/schedules/:projectid',
			views:{
				"content":{
					templateUrl:"partials/admin/schedules.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectSchedulesController'
				}
				
			}
		}).
		state('user.admin.createproject.electrification',{
			url:'/admin/createproject/electrification',
			views:{
				"content":{
					templateUrl:"partials/admin/createprojectelectrification.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectElectrificationController'
				}
				
			}
		}).
		state('user.admin.createproject.substationconstruction',{
			url:'/admin/createproject/substationconstruction',
			views:{
				"content":{
					templateUrl:"partials/admin/createprojectsubstationconstruction.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectSubStationConstructorController'
				}
				
			}
		}).
		state('user.survey',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.survey.main',{
			url: '/survey',
			views:{
				"pagetopnav":{
					templateUrl:"partials/survey/home.html",
					data:{title:'Survey'},
					controller:'SurveyHomeController'
				}
				
			}
		}).
		state('user.admin.createoffice',{
			url: '/createoffice',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/createoffice.html",
					data:{title:'Admin'},
					controller:'AdminCreateOfficeController'
				}
				
			}
		}).
		state('user.admin.createproject.divisions',{
			url:'/admin/createproject/divisions/:projectid',
			views:{
				"content":{
					templateUrl:"partials/admin/createprojecthvds.html",
					data:{title:'Admin Create Project'},
					controller:'AdminCreateProjectHvdsController'
				}
				
			}
		}).
		state('user.admin.surveyitems',{
			url: '/surveyitems',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/surveyitems.html",
					data:{title:'Admin Survey Items'},
					controller:'AdminSurveyItemsController'
				}
			}
		}).
		state('user.admin.editproject',{
			url: '/editproject',
			views:{
				"pagetopnav":{
					templateUrl:"partials/admin/editproject.html",
					data:{title:'Admin Edit Project'},
					controller:'AdminEditProjectController'
				}
			}
		}).
		state('user.pototalreport',{
			url: '/pototalreport',
			views:{
				"content":{
					templateUrl:"partials/reports/pototalreport.html",
					data:{title:'PO Total Report'},
					controller:'TotalPoReportController'
				}
				
			}
		}).
		state('user.vendortotalreport',{
			url: '/vendortotalreport',
			views:{
				"content":{
					templateUrl:"partials/reports/vendor_report.html",
					data:{title:'Vendor Total Report'},
					controller:'TotalVendorReportController'
				}
				
			}
		}).
		state('user.editboqbommapping',{
			url: '/editboqbommapping',
			views:{
				"content":{
					templateUrl:"partials/editboqbommapping.html",
					data:{title:'Edit BOQ BOM MAPPING'},
					controller:'EditBoqBomMappingController'
				}
				
			}
		}).
		state('user.boqreport',{
			url: '/boqreport',
			views:{
				"content":{
					templateUrl:"partials/boqreport.html",
					data:{title:'BOQ REPORT'},
					controller:'BoqReportController'
				}
				
			}
		}).
		state('user.planning',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.planning.main',{
			url: '/planning',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/home.html",
					data:{title:'Planning'},
					controller:'PlanningHomeController'
				}
				
			}
		}).
		state('user.planning.boqbommapping',{
			url: '/planning/boqbommapping',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/boqbommapping.html",
					data:{title:'Planning Material Mapping'},
					controller:'BoqBomMappingController'
				}
			}
		}).
		state('user.planning.editboqbommapping',{
			url: '/planning/editboqbommapping',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/editboqbommapping.html",
					data:{title:'Edit BOQ BOM MAPPING'},
					controller:'EditBoqBomMappingController'
				}
				
			}
		}).
		state('user.planning.boqreport',{
			url: '/planning/boqreport',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/boqreport.html",
					data:{title:'BOQ REPORT'},
					controller:'BoqReportController'
				}
				
			}
		}).
		state('user.planning.raiseindent',{
			url: '/planning/raiseindent',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/raiseindent.html",
					data:{title:'Raise indent'},
					controller:'RaiseIndentController'
				}
				
			}
		}).
		state('user.planning.copyactivities',{
			url: '/planning/copyactivities',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/copyactivities.html",
					data:{title:'Copy Activities'},
					controller:'CopyActivitiesController'
				}
				
			}
		}).
		state('user.planning.activitysheet',{
			url: '/planning/activitysheet',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/activitysheet.html",
					data:{title:'Raise Sample BOQ'},
					controller:'ActivitySheetController'
				}
				
			}
		}).
		state('user.planning.uploadsupplyrate',{
			url: '/planning/uploadsupplyrate',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/uploadsupplyrate.html",
					data:{title:'Upload Supply Rate'},
					controller:'UploadSupplyRateController'
				}
				
			}
		}).
		state('user.planning.uploadindent',{
			url: '/planning/uploadindent',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/uploadindent.html",
					data:{title:'Upload Indent'},
					controller:'UploadIndentController'
				}
				
			}
		}).
		state('user.planning.raiseindentnonbillable',{
			url: '/planning/raiseindentnonbillable',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/raiseindentnonbillable.html",
					data:{title:'Raise Non-Billable Material Indent'},
					controller:'RaiseIndentNonBillableController'
				}
				
			}
		}).
		state('user.planning.createworkorder',{
			url: '/planning/createworkorder',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/createworkorder.html",
					data:{title:'Create Work Order'},
					controller:'PlanningWorkOrderController'
				}
				
			}
		}).
		state('user.planning.createboq',{
			url: '/planning/createboq',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/createboq.html",
					data:{title:'Create BOQ'},
					controller:'PlanningCreateBoqController'
				}
				
			}
		}).
		state('user.planning.workindent',{
			url: '/planning/workindent',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/workindent.html",
					data:{title:'Work Indent'},
					controller:'PlanningWorkIndentController'
				}
				
			}
		}).
		state('user.planning.editindent',{
			url: '/planning/editindent',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/editindent.html",
					data:{title:'Edit Indent'},
					controller:'PlanningEditIndentController'
				}
				
			}
		}).
		state('user.planning.activitygrouping',{
			url: '/planning/activitygrouping',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/activitygrouping.html",
					data:{title:'Activity Grouping'},
					controller:'ActivityGroupingController'
				}
				
			}
		}).
		state('user.purchaseshead',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.purchaseshead.main',{
			url: '/purchaseshead',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchaseshead/home.html",
					data:{title:'Purchases Head'},
					controller:'PurchasesHeadHomeController'
				}
				
			}
		}).
		state('user.purchaseshead.reports',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/purchaseshead/reports/reportstopnav.html"
				}
				
			}
		}).
		state('user.purchaseshead.reports.poreport',{
			url: '/purchaseshead/report/purchaseorderreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/poreport.html",
					data:{title:'Purchase Order Report'},
					controller:'PurchasesReportsPoOrderController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.vendorreport',{
			url: '/purchaseshead/report/vendorreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/vendorreport.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsVendorRepController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.potracker',{
			url: '/purchaseshead/report/potracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/potracker.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsPoTrackerController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.amdporeport',{
			url: '/purchaseshead/report/amdporeport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/amdporeport.html",
					data:{title:'Amendment PO Report'},
					controller:'PurchasesReportsAmendPoController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.enquiryreport',{
			url: '/purchaseshead/report/enquiryreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/enquiryreport.html",
					data:{title:'Enquiry Report'},
					controller:'PurchasesReportsEnquiryController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.csreport',{
			url: '/purchaseshead/report/csreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/csreport.html",
					data:{title:'Comparitive Statement Report'},
					controller:'PurchasesReportsCSController'
				}
				
			}
		}).
		state('user.purchaseshead.approvepo',{
			url: '/purchaseshead/approvepo',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchaseshead/approvepo.html",
					data:{title:'Approve PO'},
					controller:'PurchasesApprovePoController'
				}
				
			}
		}).
		state('user.purchaseshead.approvecs',{
			url: '/purchaseshead/approvecs',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchaseshead/approvecs.html",
					data:{title:'Approve CS'},
					controller:'PurchasesHeadApproveCSController'
				}
				
			}
		}).
		state('user.purchaseshead.reports.approvedcs',{
			url: '/purchaseshead/reports/approvedcs',
			views:{
				"content":{
					templateUrl:"partials/purchaseshead/reports/approvedcs.html",
					data:{title:'Approved CS Report'},
					controller:'PurchasesHeadApproveCSController'
				}
				
			}
		}).
		state('user.purchaseshead.approverejcloseporequest',{
			url: '/purchaseshead/approverejcloseporequest',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchaseshead/approverejcloseporequest.html",
					data:{title:'Close PO'},
					controller:'PurchasesHeadApproveClosePoController'
				}
				
			}
		}).
		state('user.purchases.closepo',{
			url: '/purchases/closepo',
			views:{
				"pagetopnav":{
					templateUrl:"partials/purchaseshead/closepo.html",
					data:{title:'Close PO'},
					controller:'PurchasesHeadClosePoController'
				}
				
			}
		}).
		state('user.workprogress',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.workprogress.main',{
			url: '/workprogress',
			views:{
				"pagetopnav":{
					templateUrl:"partials/workprogress/home.html",
					data:{title:'Work Progress'},
					controller:'WorkProgressHomeController'
				}
			}
		}).
		state('user.planning.reports',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/planning/reports/reportstopnav.html"
				}
				
			}
		}).
		state('user.planning.reports.poreport',{
			url: '/planning/report/purchaseorderreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/poreport.html",
					data:{title:'Purchase Order Report'},
					controller:'PurchasesReportsPoOrderController'
				}
				
			}
		}).
		state('user.planning.reports.vendorreport',{
			url: '/planning/report/vendorreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/vendorreport.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsVendorRepController'
				}
				
			}
		}).
		state('user.planning.reports.potracker',{
			url: '/planning/report/potracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/potracker.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsPoTrackerController'
				}
				
			}
		}).
		state('user.planning.reports.amdporeport',{
			url: '/planning/report/amdporeport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/amdporeport.html",
					data:{title:'Amendment PO Report'},
					controller:'PurchasesReportsAmendPoController'
				}
				
			}
		}).
		state('user.planning.reports.enquiryreport',{
			url: '/planning/report/enquiryreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/enquiryreport.html",
					data:{title:'Enquiry Report'},
					controller:'PurchasesReportsEnquiryController'
				}
				
			}
		}).
		state('user.planning.reports.mattracker',{
			url: '/planning/report/mattracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/mattracker.html",
					data:{title:'Material Tracker'},
					controller:'PurchasesMatTrackerReportController'
				}
				
			}
		}).
		state('user.planning.reports.csreport',{
			url: '/planning/report/csreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/csreport.html",
					data:{title:'Comparitive Statement Report'},
					controller:'PurchasesReportsCSController'
				}
				
			}
		}).
		state('user.planning.reports.indentreport',{
			url: '/planning/report/indentreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/indentreport.html",
					data:{title:'Indent Report'},
					controller:'PurchasesIndentReportController'
				}
				
			}
		}).
		state('user.planninghead',{
			views:{
				"content":{
					templateUrl:"partials/sidebar.html",
					controller:'SidebarController'
				}
				
			}
		}).
		state('user.planninghead.main',{
			url: '/planninghead',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planninghead/home.html",
					data:{title:'Planning Head'},
					controller:'PlanningHeadHomeController'
				}
				
			}
		}).
		state('user.planninghead.reports',{
			views:{
				"pagetopnav":{

					templateUrl:"partials/planninghead/reports/reportstopnav.html"
				}
				
			}
		}).
		state('user.planninghead.reports.poreport',{
			url: '/planninghead/report/purchaseorderreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/poreport.html",
					data:{title:'Purchase Order Report'},
					controller:'PurchasesReportsPoOrderController'
				}
				
			}
		}).
		state('user.planninghead.reports.vendorreport',{
			url: '/planninghead/report/vendorreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/vendorreport.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsVendorRepController'
				}
				
			}
		}).
		state('user.planninghead.reports.potracker',{
			url: '/planninghead/report/potracker',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/potracker.html",
					data:{title:'Vendor Report'},
					controller:'PurchasesReportsPoTrackerController'
				}
				
			}
		}).
		state('user.planninghead.reports.amdporeport',{
			url: '/planninghead/report/amdporeport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/amdporeport.html",
					data:{title:'Amendment PO Report'},
					controller:'PurchasesReportsAmendPoController'
				}
				
			}
		}).
		state('user.planninghead.reports.enquiryreport',{
			url: '/planninghead/report/enquiryreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/enquiryreport.html",
					data:{title:'Enquiry Report'},
					controller:'PurchasesReportsEnquiryController'
				}
				
			}
		}).
		state('user.planninghead.reports.csreport',{
			url: '/planninghead/report/csreport',
			views:{
				"content":{
					templateUrl:"partials/purchases/reports/csreport.html",
					data:{title:'Comparitive Statement Report'},
					controller:'PurchasesReportsCSController'
				}
				
			}
		}).
		state('user.planninghead.reports.indentpending',{
			url: '/planninghead/report/indentpending',
			views:{
				"content":{
					templateUrl:"partials/planninghead/reports/indentpending.html",
					data:{title:'Pending Indent Report'},
					controller:'PendingIndentController'
				}
				
			}
		}).
		state('user.planninghead.reports.approvedindent',{
			url: '/planninghead/report/approvedindent',
			views:{
				"content":{
					templateUrl:"partials/planninghead/reports/approvedindent.html",
					data:{title:'Approved Indent Report'},
					controller:'ApprovedIndentController'
				}
				
			}
		}).
		state('user.planninghead.activitysheet',{
			url: '/planninghead/activitysheet',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planning/activitysheet.html",
					data:{title:'Raise Sample BOQ'},
					controller:'ActivitySheetController'
				}
				
			}
		}).
		state('user.planninghead.approveindent',{
			url: '/planninghead/approveindent',
			views:{
				"pagetopnav":{
					templateUrl:"partials/planninghead/approveindent.html",
					data:{title:'Approve Indent'},
					controller:'ApproveIndentController'
				}
				
			}
		});

});
