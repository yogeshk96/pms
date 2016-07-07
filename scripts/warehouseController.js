app.controller("WarehouseController",function($scope,$http,$rootScope,$state,Logging){
	$scope.state = $state;
});

app.controller("WarehouseSubContractorController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.subcontractor={};
	$scope.add_third_party = function() {
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_subcontractor',
			data:$scope.subcontractor,
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			if(result == 1) {

				swal("Sub Contractor added successfully.");
				$scope.subcontractor={};
			} else {
				swal("Something went wrong.");
			}
			
		});
	}
	
});

app.controller("WarehouseReceiptController",function($scope,$http,$rootScope,$state,Logging){
	// $scope.state = $state;

	$scope.receipt = {};
	$scope.receipt.invoices = [];
	$scope.receipt.dcdocs = [];
	$scope.receipt.lrdocs = [];
	$scope.receipt.packdocs = [];
	$scope.receipt.weighdocs = [];
	$scope.rectype = '1';
	$scope.purchasedby = 'company';
	$scope.subtype = 'select';
	$scope.materialtypeid = 'select';
	$scope.recptmateriallist = [];
	$scope.retmateriallist = [];
	$scope.invoice = {};
	$scope.invoice.docs = [];
	$scope.marretfrom = 'subc';
	$scope.subcontsel = 'select';
	$scope.thirdpsel = 'select';
	$scope.mainidi = [];

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
		url:$rootScope.requesturl+'/get_third_parties',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.thirdparties = result;
		
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_sub_contractors',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.subcont = result;
		
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});

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

	$scope.windowprint = function()
	{
		window.print();
	}

	$scope.addmatereturn = function()
	{
		if($scope.retmateriallist.length==0)
		{
			swal('Add materials first!');
		}
		else if($scope.marretfrom=='subc' && $scope.subcontsel=='select')
		{
			swal('Please select sub contracter!');
		}
		else if($scope.marretfrom=='thirdp' && $scope.thirdpsel=='select')
		{
			swal('Please select a third party!');
		}
		else 
		{
			// console.log('1');

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/accpt_matret',
				data:{mat:$scope.retmateriallist,type:$scope.marretfrom,sub:$scope.subcontsel,thirdp:$scope.thirdpsel},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				// console.log(result);
				$rootScope.showloader=false;
				if(result[0]=='yes')
				{
					swal('successfully added inventory!');
					$scope.mrn_no = result[1];
					$scope.mrn_date = result[2]['date'].substr(0,10);
					$scope.mrn_date = $scope.mrn_date.split("-").reverse().join("-");
					$scope.partyname = result[3]['name'];
					$scope.storename = result[4]['name'];
					$scope.storeloc = result[4]['location'];
					$scope.recmatret = true;

				}
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
	}

	$scope.addtomatrettable = function() {

		var matflag = 0;
		for (var i = 0; i < $scope.retmateriallist.length; i++) {
			if($scope.retmateriallist[i]['materialid']==$scope.submatret)
			{
				matflag = 1;
			}
		};

		if(!$scope.materialtypeidret) {

			swal("please select material type.");
		} 
		else if(!$scope.submatret) {

			swal("please select material.");
		}
		else if($scope.submaterials.length==0) {

			swal("No materials under this material type!.");
		} 
		else if(!$scope.quantityret) {

			swal("please enter material quantity.");
		}
		else if(matflag==1) {

			swal("Material already added remove that and add again.");
		} 
		else {

			$rootScope.showloader=true;

			$scope.retmateriallist.push({"materialdesc":$("#"+$scope.submatret).attr("materialdesc"), "uom":$scope.uomval, "qty":$scope.quantityret, "materialid":$scope.submatret,'damagedqty':$scope.damquantityret});
			
			$rootScope.showloader=false;
		}
	}

	$scope.addselftoinventory = function() {

		if($scope.recptmateriallist.length == 0){

			swal("Please add atleast one material.");
		} else if(!$scope.selfauthorizedby) {

			swal("Please enter authorized by.");
		} else if(!$scope.selfinvoiceno) {

			swal("Please enter invoice numebr.");
		} else if(!$scope.selfinvoicedate) {

			swal("Please select invoice date.");
		} else {

			$rootScope.showloader=true;

			$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_to_inventory',
			data:{authorized_by:$scope.selfauthorizedby, invoiceno:$scope.selfinvoiceno, invoicedate:$scope.selfinvoicedate, totalqty:$scope.selftotalqty, totalcost:$scope.selftotalcostofgoods, recptmateriallist:$scope.recptmateriallist},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;

				if(result == 1) {

					swal("Added to Inventory.");
					window.location.reload();
				} else if(result == 0){

					swal("No store mapped to add to inventory.");
				} else {

					swal("Something went wrong.");
				}

			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
	}

	$scope.searchanotherstoredcno = function() {

		if(!$scope.anotherstoredcno) {

			swal("Please enter DC No.");
		} else {

			$rootScope.showloader=true;
			$http({
			method:'GET',
			url:$rootScope.requesturl+'/search_dc_no',
			params:{dcno:$scope.anotherstoredcno},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;

				if(result == 0) {

					swal("DC No doenot exist.");
				} else if(result == 1) {

					swal("Already added to Inventory.");
				} else {

					$scope.dcnodetails = result;
				}


			}).error(function(data,status){
				console.log(data);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}
	}

	$scope.getgoodscost = function(type) {
		if(!$scope.quantity && type != 'quantity') {

			swal("Please enter quantity.");
		} else if(!$scope.unitrate &&  type != 'quantity') {

			swal("Please enter Unit Rate.");
		} else {

			$scope.valueofgoods = $scope.quantity*$scope.unitrate;
		}
	}

	$scope.changemainrecpt = function() {
		$scope.materialtypeid = 'select';
		$scope.submaterials = null;
		$scope.quantity = null; 
		$scope.unitrate = null;
		$scope.valueofgoods = null;
		$scope.uomval = null;
	}

	$scope.removerow = function(currentrow) {
		$scope.recptmateriallist.splice(currentrow-1, 1);

		var totalqty = 0,
			totalcostofgoods = 0;

			angular.forEach($scope.recptmateriallist,function(recptm){
						
				totalqty = totalqty + parseInt(recptm.qty);
				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
			});

			$scope.selftotalqty = totalqty;
			$scope.selftotalcostofgoods = totalcostofgoods;
	}

	$scope.removerowret = function(currentrow) {
		$scope.retmateriallist.splice(currentrow-1, 1);

		// var totalqty = 0,
		// 	totalcostofgoods = 0;

		// 	angular.forEach($scope.retmateriallist,function(recptm){
						
		// 		totalqty = totalqty + parseInt(recptm.qty);
		// 		totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
		// 	});

		// 	$scope.selftotalqty = totalqty;
		// 	$scope.selftotalcostofgoods = totalcostofgoods;
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
			console.log(result);
			$rootScope.showloader=false;
			$scope.submat = 'select';
			$scope.submaterials = result.submaterials;
			$scope.uomval = '';

		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
	}

	$scope.materialchangeret = function() {

		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.materialtypeidret},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			console.log(result);
			$rootScope.showloader=false;
			$scope.submatret = 'select';
			$scope.submaterials = result.submaterials;
			$scope.uomval = '';

		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
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
			console.log(result);
			$rootScope.showloader=false;

			$scope.uomval = result['units'];

		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
	}

	$scope.changemat = function() {

		angular.forEach($scope.mainidii, function(inma){

			angular.forEach(inma['intdidets'], function(inma2){
				if($scope.mainidi.length == 0) {

					$scope.mainidi.push(inma2);
				} else {
					var checkm = 0;
					angular.forEach($scope.mainidi, function(inmain){

						if(inmain.intdimat.intdi.ref_name == inma2.intdimat.intdi.ref_name && inmain.storematerial.id == inma2.storematerial.id) {

							checkm++;
						} 
					});
					if(checkm == 0) {

						$scope.mainidi.push(inma2);
					}
				}
				
			})
		});

		for(var i=$scope.mainidi.length-1; i>=0;i--){
			var checkdelm = 0;
			angular.forEach($scope.mainidii, function(inma){
				angular.forEach(inma['intdidets'], function(inmain) {

					if($scope.mainidi[i]['intdimat']['intdi']['ref_name'] == inmain.intdimat.intdi.ref_name && $scope.mainidi[i]['storematerial']['id'] == inmain.storematerial.id) {

						checkdelm++;
					} 
				})
				
			});

			if(checkdelm == 0) {

				$scope.mainidi.splice(i, 1);
			}

					
		}
	}

	$scope.acceptreceipt = function()
	{
		console.log($scope.mainidi);
		var dczero = 0;
		var dcnull = 0;
		for (var i = 0; i < $scope.mainidi.length; i++) {
			if(parseFloat($scope.mainidi[i]['dcreceived'])==0)
			{
				dczero = 1;
			}
			else if(!$scope.mainidi[i]['dcreceived'])
			{
				dcnull = 1;
			}
		};

		if(dcnull==1)
		{
			swal('DC quantity cant be empty!check dc quantities');
		}
		else if(!$scope.receipt.dcno)
		{
			swal('Enter DC NO');
		}
		else if(!$scope.receipt.dcdate)
		{
			swal('Enter DC Date');
		}
		else if(!$scope.receipt.vehicleno)
		{
			swal('Enter Vehicle No');
		}
		else if(!$scope.receipt.tranportname)
		{
			swal('Enter Transporter Name!');
		}
		else if(!$scope.receipt.lrno)
		{
			swal('Enter LR No!');
		}
		else if(!$scope.receipt.lrdate)
		{
			swal('Enter LR Date!');
		}
		else if(!$scope.receipt.waybillno)
		{
			swal('Enter Way Bill No!');
		}
		else if($scope.receipt.invoices.length==0)
		{
			swal('Please add invoices!');
		}
		// else if($scope.receipt.dcdocs.length==0)
		// {
		// 	swal('Please upload DC Docs!');
		// }
		// else if($scope.receipt.lrdocs.length==0)
		// {
		// 	swal('Please upload LR Docs!');
		// }
		// else if($scope.receipt.packdocs.length==0)
		// {
		// 	swal('Please upload Packing Docs!');
		// }
		else 
		{
			console.log($scope.receipt);
			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/accept_warehouse_qtys',
				data:{receipt:$scope.receipt,idimat:$scope.mainidi},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				if(result[0]=='yes')
				{
					swal('Quantities accepted!You can now generate your MRV');
					$scope.showmrv = true;
					$scope.podata = result[1];
					$scope.mrvid = result[3];
					$scope.mrvsno = result[2];
					$scope.mrvdets = result[4];
					$scope.invs = result[5];
					$scope.storedets = result[6];
					$scope.stockdate = result[7];

					angular.forEach($scope.mrvdets,function(subm){
						$scope.mrvdets.format_dc_date = $scope.mrvdets.dc_date.split("-").reverse().join("-");
						$scope.mrvdets.format_lr_date = $scope.mrvdets.lr_date.split("-").reverse().join("-");
						$scope.mrvdets.mrv_date = $scope.mrvdets.created_at.substr(0,10);
						$scope.mrvdets.mrv_date = $scope.mrvdets.mrv_date.split("-").reverse().join("-");
					});

					for (var i = 0; i < $scope.podata.length; i++) {
						$scope.podata[i]['format_po_date'] = $scope.podata[i]['po_date'].substr(0,10);
						$scope.podata[i]['format_po_date'] = $scope.podata[i]['format_po_date'].split("-").reverse().join("-");
					};

					angular.forEach($scope.podata, function(inpo){

						angular.forEach(inpo.pomaterials, function(inpomat){
							var totqtydc = 0;
							var totqtyshort = 0;
							var totqtydamage = 0;
							var totqtyaccept = 0;
							angular.forEach(inpomat.storetransdata, function(instdata){

								if($scope.mrvdets.dc_date > $scope.stockdate) {
									totqtydc += parseFloat(instdata.dc_received_qty);
									totqtyshort += parseFloat(instdata.shortage_qty);
									totqtydamage += parseFloat(instdata.damaged_qty);
									totqtyaccept += parseFloat(instdata.accepted_qty);
								} else {

									totqtydc += parseFloat(instdata.old_dc_received_qty);
									totqtyshort += parseFloat(instdata.old_shortage_qty);
									totqtydamage += parseFloat(instdata.old_damaged_qty);
									totqtyaccept += parseFloat(instdata.old_accepted_qty);
								}
							});
							inpomat.dc_received_qty = angular.copy(totqtydc);
							inpomat.shortage_qty = angular.copy(totqtyshort);
							inpomat.damaged_qty = angular.copy(totqtydamage);
							inpomat.accepted_qty = angular.copy(totqtyaccept);
						});
					});

					$scope.caltotalpaycost();


				}
				$rootScope.showloader=false;
			});
		}

	}


	$scope.caltotalpaycost = function() {

		
		var totaltaxcostn = 0;

		angular.forEach($scope.podata, function(inpomat) {

				var totaltaxcost = 0;

				angular.forEach(inpomat.taxes, function(innpot) {

					var totalcurpay = 0; 
					innpot.newtaxvalue = 0;

					if(parseFloat(innpot.value) > 0 && (innpot.tax_id != 11 || (innpot.tax_id == 11 && innpot.lumpsum == 0))) {
						
						angular.forEach(innpot.taxmaterials, function(innpotm) {

							if(innpotm.material_id != 0){

								angular.forEach(inpomat.pomaterials, function(innpom) {

									if(innpotm.material_id == innpom.id) {

										totalcurpay += parseFloat(innpom['accepted_qty'])*innpom.unit_rate;
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

						innpot.newtaxvalue = (innpot.taxpercentage*totalcurpay)/100;
					} else if(innpot.tax_id == 11){

						angular.forEach(inpomat.pomaterials, function(innpomm) {
							totalcurpay += parseFloat(innpomm['accepted_qty'])*innpomm.freightinsurance_rate;
							
						});

						innpot.newtaxvalue = totalcurpay.toFixed(2);
					}
					totaltaxcost += parseFloat(innpot.newtaxvalue);
				});

				totaltaxcostn += totaltaxcost;

				inpomat.totaltaxcost = angular.copy(totaltaxcost.toFixed(2));

		});
		var totalmatcostn = 0;
		angular.forEach($scope.podata, function(inpomat) {
			var totalmatcost = 0;
			angular.forEach(inpomat.pomaterials, function(innpom) {

				totalmatcost += parseFloat(innpom['accepted_qty'])*innpom.unit_rate;
				totalmatcostn += parseFloat(innpom['accepted_qty'])*innpom.unit_rate;
				

			});
			inpomat.netcost = parseFloat(inpomat.totaltaxcost)+parseFloat(totalmatcost);

		});

		$scope.totalmatcostn = angular.copy(totalmatcostn.toFixed(2));
		$scope.totaltaxcostn = angular.copy(totaltaxcostn.toFixed(2));

		$scope.netcost = parseFloat($scope.totalmatcostn)+parseFloat($scope.totaltaxcostn);
		$scope.netcostinwords = getwords(Math.round($scope.netcost).toString());
	}

	$scope.deleteidi = function()
	{
		$scope.mainidi = [];
		$scope.idilist = [];
	}

	$scope.addinvoicetorec = function()
	{
		if(!$scope.invoice.invoice_no)
		{
			swal('Add Invoice No');
		}
		else if(!$scope.invoice.invoice_date)
		{
			swal('Add invoice date!');
		}
		else if(!$scope.invoice.invoice_quantity)
		{
			swal('Add invoice quantity!');
		}
		else if(!$scope.invoice.invoice_value)
		{
			swal('Add invoice value!');
		}
		// else if($scope.invoice.docs.length==0)
		// {
		// 	swal('Upload invoice docs!');
		// }
		else
		{
			$scope.invoice.format_invoice_date = $scope.invoice.invoice_date.split("-").reverse().join("-");
			$scope.receipt.invoices.push($scope.invoice);
			// console.log($scope.receipt);
			$scope.invoice = [];
			$scope.invoice.docs = [];
		}
	}

	$scope.blurinput = function(x, mx)
	{

		console.log(mx);

		if(!x.dcreceived)
		{
			x.dcreceived = 0;
		}
		
		if(!x.shortageqty)
		{
			x.shortageqty = 0;
		}
		
		if(!x.damagedqty)
		{
			x.damagedqty = 0;
		}
		

		var m = parseFloat(x.shortageqty) + parseFloat(x.damagedqty);

		if(mx.storematerial.type == 3) {
			console.log(parseFloat(x.dcreceived)+"="+parseFloat(x.qty)+"="+parseFloat(x.received_qty));
			if(parseFloat(m) > parseFloat(x.dcreceived))
			{
				swal('shortage and damage cant be grater than dc received');
				x.damagedqty = 0;
				x.shortageqty = 0;
				x.dcreceived = 0;
				x.acceptedqty = 0;
			}
			else if(parseFloat(x.dcreceived)> (parseFloat(x.qty) - parseFloat(x.received_qty)))
			{
				swal('DC qty cant be greater than maximum limit of acceptance!');
				x.damagedqty = 0;
				x.shortageqty = 0;
				x.dcreceived = 0;
				x.acceptedqty = 0;
			}
			else
			{
				x.acceptedqty = parseFloat(x.dcreceived) - parseFloat(m);
				x.acceptedqty = x.acceptedqty.toFixed(3);
			}
			mx.damagedqty = 0;
			mx.shortageqty = 0;
			mx.dcreceived = 0;
			mx.acceptedqty = 0;

			angular.forEach(mx.pomatdetails.fabmat, function(infmat) {

				if(!infmat.dcreceived) {
					infmat.dcreceived = 0;
				}
				if(!infmat.shortageqty) {
					infmat.shortageqty = 0;
				}
				if(!infmat.damagedqty) {
					infmat.damagedqty = 0;
				}
				if(!infmat.acceptedqty) {
					infmat.acceptedqty = 0;
				}

				mx.dcreceived += Math.round((parseFloat(infmat.dcreceived) * parseFloat(infmat.storemat.level1matindi[0]['wt_per_pc'])) *100)/100;
				mx.damagedqty += Math.round((parseFloat(infmat.damagedqty) * parseFloat(infmat.storemat.level1matindi[0]['wt_per_pc'])) *100)/100;
				mx.shortageqty += Math.round((parseFloat(infmat.shortageqty) * parseFloat(infmat.storemat.level1matindi[0]['wt_per_pc'])) *100)/100;
				mx.acceptedqty += Math.round((parseFloat(infmat.acceptedqty) * parseFloat(infmat.storemat.level1matindi[0]['wt_per_pc'])) *100)/100;
				
			});

		} else {
			if(parseFloat(m) > parseFloat(x.dcreceived))
			{
				swal('shortage and damage cant be grater than dc received');
				x.damagedqty = 0;
				x.shortageqty = 0;
				x.dcreceived = 0;
				x.acceptedqty = 0;
			}
			else if(parseFloat(x.dcreceived)> parseFloat(x.quantity) - parseFloat(x.already_received))
			{
				swal('DC qty cant be greater than maximum limit of acceptance!');
				x.damagedqty = 0;
				x.shortageqty = 0;
				x.dcreceived = 0;
				x.acceptedqty = 0;
			}
			else
			{
				x.acceptedqty = parseFloat(x.dcreceived) - parseFloat(m);
				x.acceptedqty = x.acceptedqty.toFixed(3);
			}	
		}
	}

	$scope.searchidis = function()
	{
		if(!$scope.vendorid)
		{
			swal('Please select a Vendor!');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_idis_data',
				params:{data:$scope.vendorid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				if(result.length == 0)
				{
					swal('There are no new materials bought from this vendor!');
				}
				else
				{
					$scope.idilist = result;
				}
				$rootScope.showloader=false;
				

			});
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
					
					if(dtype=='rinvoice')
					{
						$scope.invoice.docs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
						$scope.fd = '';
					}
					else if(dtype=='dcupload')
					{
						$scope.receipt.dcdocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
						$scope.fd = '';
					}
					else if(dtype=='lrdocs')
					{
						$scope.receipt.lrdocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
						$scope.fd = '';
					}
					else if(dtype=='packdocs')
					{
						$scope.receipt.packdocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
						$scope.fd = '';
					}
					else if(dtype=='weighdocs')
					{
						$scope.receipt.weighdocs.push({'doc_url':$scope.requesturl+'/uploads/didocs/'+data[1], 'doc_name':data[2],'mime_type':$scope.fdType});
						$scope.fd = '';
					}
								
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
				
				if(type=='rinvoice')
				{
					$scope.invoice.docs.splice(key, 1);
				}
				else if(type=='dcupload')
				{
					$scope.receipt.dcdocs.splice(key, 1);
				}
				else if(type=='lrdocs')
				{
					$scope.receipt.lrdocs.splice(key, 1);
				}
				else if(type=='packdocs')
				{
					$scope.receipt.packdocs.splice(key, 1);
				}
				else if(type=='weighdocs')
				{
					$scope.receipt.weighdocs.splice(key, 1);
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

	$scope.addtotable = function() {

		var matflag = 0;
		for (var i = 0; i < $scope.recptmateriallist.length; i++) {
			if($scope.recptmateriallist[i]['materialid']==$scope.submat)
			{
				matflag = 1;
			}
		};
		if(!$scope.materialtypeid) {

			swal("please select material type.");
		} else if(!$scope.submat) {

			swal("please select material.");
		} else if(!$scope.quantity) {

			swal("please enter material quantity.");
		} else if(!$scope.unitrate) {

			swal("please enter unit rate.");
		} else if(!$scope.suppliername) {

			swal("please enter supplier name.");
		} else if(matflag==1) {

			swal("Material already added remove that and add again.");
		} else {

			$rootScope.showloader=true;

			$scope.recptmateriallist.push({"materialdesc":$("#"+$scope.submat).attr("materialdesc"), "uom":$scope.uomval, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "materialid":$scope.submat, "suppliername":$scope.suppliername});
			var totalqty = 0,
				totalcostofgoods = 0;

			angular.forEach($scope.recptmateriallist,function(recptm){
						
				totalqty = parseFloat(totalqty) + parseFloat(recptm.qty);
				totalcostofgoods = parseFloat(totalcostofgoods) + parseFloat(recptm.valueofgoods);
			});

			$scope.selftotalqty = totalqty;
			$scope.selftotalcostofgoods = totalcostofgoods;
			$rootScope.showloader=false;
		}
	}

	$scope.bluranotherstoreinput = function(tdata, x) {
		if(!tdata['shortageqty']) {

			tdata['shortageqty'] = 0
		}
		if(!tdata['damagedqty']) {

			tdata['damagedqty'] = 0;
		}


		var totalaccepetedqty = parseFloat(tdata['quantity']) - ( parseFloat(tdata['already_received']) +parseFloat(tdata['shortageqty'])+parseFloat(tdata['damagedqty']));

		if(totalaccepetedqty < 0) {

			tdata['damagedqty'] = 0;
			tdata['shortageqty'] = 0;
			tdata['acceptedqty'] = 0;
			
			swal("Damaged and shortage quantity cannot be greater than issued quantity.");
		} 
		else{

			tdata['acceptedqty'] = totalaccepetedqty;
		}
	}

	$scope.add_another_store_inventory = function() {
		var totflag = 0;
		var emptyflag = 0;

		for (var i = 0; i < $scope.dcnodetails[0]['transdata'].length; i++) {
			if(!$scope.dcnodetails[0]['transdata'][i]['acceptedqty']&&$scope.dcnodetails[0]['transdata'][i]['acceptedqty']!=0)
			{
				emptyflag = 1;
			}
		};

		if(!$scope.anotherstorevehicleno) {

			swal("Please enter vehicle number.");
		}
		else if(emptyflag==1)
		{
			swal("Accepted quantity cant be empty.Check quantities");
		}
		else {
			$rootScope.showloader=true;
			$http({
			method:'POST',
			url:$rootScope.requesturl+'/add_to_inventory_anotherstore',
			data:{dcnodetails:$scope.dcnodetails, vehicleno:$scope.anotherstorevehicleno, remarks:$scope.anotherremark},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				console.log(result);
				$rootScope.showloader=false;

				if(result != 0) {

					swal("Added to inventory.");
					$scope.transidanotherstore =true;
				} else {

					swal("No store mapped to add to inventory.");
				}

			}).error(function(data,status){
				console.log(data);
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
			// console.log(emptyflag);
		}
	}

	function getwords(e){ e= e.toString(); if(parseInt(e) == 0) { return "ZERO";} else {e = e.replace(/^0+/, ''); var t="";if(e.length==2){}else if(e.length==1){e=0+e}else if(e.length%2===0){e=0+e}var n=e.substr(-2,2);t=t+getnum(n);if(e.length>=3){var r="0"+e.substr(-3,1);if(r=="00"){}else{t=getnum(r)+" HUNDRED"+t}}if(e.length>=5){var i=e.substr(-5,2);if(i=="00"){}else{t=getnum(i)+" THOUSAND"+t}}if(e.length>=7){var s=e.substr(-7,2);if(s=="00"){}else{t=getnum(s)+" LAKH"+t}}if(e.length>7){var o=e.substr(0,e.length-7);t=getwords(o)+" CRORE"+t}return t}function getnum(e){var t="";ones=e.substr(1,1);tens=e.substr(0,1);if(tens=="0"){switch(ones){case"0":t="";break;case"1":t=" ONE";break;case"2":t=" TWO";break;case"3":t=" THREE";break;case"4":t=" FOUR";break;case"5":t=" FIVE";break;case"6":t=" SIX";break;case"7":t=" SEVEN";break;case"8":t=" EIGHT";break;case"9":t=" NINE";break}}else if(tens=="1"){switch(ones){case"0":t=" TEN";break;case"1":t=" ELEVEN";break;case"2":t=" TWELVE";break;case"3":t=" THIRTEEN";break;case"4":t=" FOURTEEN";break;case"5":t=" FIFTEEN";break;case"6":t=" SIXTEEN";break;case"7":t=" SEVENTEEN";break;case"8":t=" EIGHTEEN";break;case"9":t="NINETEEN";break}}else{switch(tens){case"2":t=" TWENTY";break;case"3":t=" THIRTY";break;case"4":t=" FORTY";break;case"5":t=" FIFTY";break;case"6":t=" SIXTY";break;case"7":t=" SEVENTY";break;case"8":t=" EIGHTY";break;case"9":t=" NINTY";break}switch(ones){case"0":t=t+"";break;case"1":t=t+" ONE";break;case"2":t=t+" TWO";break;case"3":t=t+" THREE";break;case"4":t=t+" FOUR";break;case"5":t=t+" FIVE";break;case"6":t=t+" SIX";break;case"7":t=t+" SEVEN";break;case"8":t=t+" EIGHT";break;case"9":t=t+" NINE";break}}return t} }

});

app.controller("WarehouseHomeController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
});

app.controller("WarehouseStockInventoryController",function($scope,$http,$rootScope,$state,Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$rootScope.showloader=true;
	$http({
		method:'GET',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		url:$rootScope.requesturl+'/getinventorydata'
	}).
	success(function(result){
		console.log(result);
		$rootScope.showloader=false;
		$scope.inventorydata = result;
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$http({
		method:'GET',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		url:$rootScope.requesturl+'/getstoredata'
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.storedata = result;
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});
	
});

// app.controller("WarehouseReceiptsController",function($scope,$http,$rootScope,$state,Logging){
// 	$scope.$emit("changeTitle",$state.current.views.content.data.title);
// 	$scope.purchasedby = "self";
// 	$scope.rectype = 1;

// 	$scope.recptmateriallist = [];

// 	$scope.recptmaterialreturnlist = [];

// 	$scope.recptinhousemateriallist = [];

// 	$scope.recptthirdpartymateriallist =[];

// 	$scope.companydetails = {};

// 	$scope.materialreturn = [];
// 	$scope.returnfeeder = [];

// 	$scope.subtype = 'select';

// 	$scope.thirdparty = 'select';
// 	$scope.materialtypeid = 'select';
// 	$scope.returnmanager = 'select';
// 	$scope.returnfeeder = 'select';
// 	$scope.inhousevendor = 'select';


// 	$rootScope.showloader=true;
// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_material_types',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.materials = result;
		
// 	}).error(function(data,status){
// 		$rootScope.showloader=false;
// 		$rootScope.showerror=true;
// 		Logging.validation(status);
// 	});

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_inhouse_vendor',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.inhousevendorlist = result;
		
// 	}).error(function(data,status){
// 		$rootScope.showloader=false;
// 		$rootScope.showerror=true;
// 		Logging.validation(status);
// 	});

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_third_parties',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.thirdparties = result;
		
// 	}).error(function(data,status){
// 		$rootScope.showloader=false;
// 		$rootScope.showerror=true;
// 		Logging.validation(status);
// 	});

// 	$http({
// 		method:'GET',
// 		url:$rootScope.requesturl+'/get_project_managers_list',
// 		headers:{'JWT-AuthToken':localStorage.pmstoken},
// 	}).
// 	success(function(result){

// 		$rootScope.showloader=false;
// 		$scope.managerlist = result;
		
// 	}).error(function(data,status){
// 		$rootScope.showloader=false;
// 		$rootScope.showerror=true;
// 		Logging.validation(status);
// 	});

// 	$scope.materialchange = function() {

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_material_subtypes',
// 			params:{materialid:$scope.materialtypeid},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){

// 			$rootScope.showloader=false;

// 			$scope.submat = 'select';

// 			$scope.submaterials = result.submaterials;

// 			$scope.uomval = '';

// 		}).error(function(data,status){
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			Logging.validation(status);
// 		});
// 	}

// 	$scope.removerow = function(currentrow) {

// 		$scope.recptmateriallist.splice(currentrow-1, 1);

// 		var totalqty = 0,
// 			totalcostofgoods = 0;

// 			angular.forEach($scope.recptmateriallist,function(recptm){
						
// 				totalqty = totalqty + parseInt(recptm.qty);
// 				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
// 			});

// 			$scope.selftotalqty = totalqty;
// 			$scope.selftotalcostofgoods = totalcostofgoods;
// 	}

// 	$scope.removerowreturn = function(currentrow) {

// 		$scope.recptmaterialreturnlist.splice(currentrow-1, 1);

// 		var totalscrapqty = 0,
// 				totalscrapcost = 0,
// 				totaldefectiveqty = 0,
// 				totaldefectivecost = 0,
// 				totalusableqty = 0,
// 				totalusablecost = 0;

// 			angular.forEach($scope.recptmaterialreturnlist,function(recptm){
						
// 				totalscrapqty = totalscrapqty + parseInt(recptm.qty);
// 				totaldefectiveqty = totaldefectiveqty + parseInt(recptm.defectiveqty);
// 				totalscrapcost = totalscrapcost + parseInt(recptm.valueofgoods);
// 				totaldefectivecost = totaldefectivecost + parseInt(recptm.defectivevalueofgoods);
// 				totalusableqty = totalusableqty + parseInt(recptm.usableqty);
// 				totalusablecost = totalusablecost + parseInt(recptm.usablevalueofgoods);
// 			});
// 			if(isNaN(totaldefectivecost)) {

// 				totaldefectivecost = 0;
// 			}
// 			if(isNaN(totaldefectiveqty)) {

// 				totaldefectiveqty = 0;
// 			}
// 			if(isNaN(totalusablecost)) {

// 				totalusablecost = 0;
// 			}
// 			if(isNaN(totalusableqty)) {

// 				totalusableqty = 0;
// 			}
// 			if(isNaN(totalscrapcost)) {

// 				totalscrapcost = 0;
// 			}
// 			if(isNaN(totalscrapqty)) {

// 				totalscrapqty = 0;
// 			}
// 			$scope.totalscrapqty = totalscrapqty;
// 			$scope.totalscrapcost = totalscrapcost;
// 			$scope.totaldefectiveqty = totaldefectiveqty;
// 			$scope.totaldefectivecost = totaldefectivecost;
// 			$scope.totalusableqty = totalusableqty;
// 			$scope.totalusablecost = totalusablecost;
// 	}

// 	$scope.removerowinhouse = function(currentrow) {

// 		$scope.recptinhousemateriallist.splice(currentrow-1, 1);

// 		var totalqty = 0,
// 			totalcostofgoods = 0;

// 			angular.forEach($scope.recptinhousemateriallist,function(recptm){
						
// 				totalqty = totalqty + parseInt(recptm.qty);
// 				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
// 			});

// 			$scope.inhousetotalqty = totalqty;
// 			$scope.inhousetotalcostofgoods = totalcostofgoods;
// 	}

// 	$scope.removerowthirdparty = function(currentrow) {

// 		$scope.recptthirdpartymateriallist.splice(currentrow-1, 1);

// 		var totalqty = 0,
// 			totalcostofgoods = 0;

// 			angular.forEach($scope.recptthirdpartymateriallist,function(recptm){
						
// 				totalqty = totalqty + parseInt(recptm.qty);
// 				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
// 			});

// 			$scope.thirdpartytotalqty = totalqty;
// 			$scope.thirdpartytotalcostofgoods = totalcostofgoods;
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

// 		}).error(function(data,status){
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			Logging.validation(status);
// 		});
// 	}

// 	$scope.getuomreturn = function(uom) {

// 		var uom = jQuery.parseJSON(uom);

// 		$rootScope.showloader=true;

// 		$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_material_uom',
// 			params:{materialid:uom.id},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 		}).
// 		success(function(result){
// 			console.log(result);
// 			$rootScope.showloader=false;

// 			$scope.uomval = result['units'];

// 		}).error(function(data,status){
// 			$rootScope.showloader=false;
// 			$rootScope.showerror=true;
// 			Logging.validation(status);
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

// 	$scope.changemainrecpt = function() {

// 		$scope.materialtypeid = 'select';
// 		$scope.submaterials = null;
// 		$scope.quantity = null; 
// 		$scope.unitrate = null;
// 		$scope.valueofgoods = null;
// 		$scope.uomval = null;

// 	}

// 	$scope.changereturnmanager = function(manager) {

// 		var manager = jQuery.parseJSON(manager);

// 		if(manager != 'select') {

// 			$rootScope.showloader = true;
// 			$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_manager_feeders',
// 			params:{managerid:manager.id},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;

// 				$scope.feederlist = result;

// 			}).error(function(data,status){
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				Logging.validation(status);
// 			});
// 		}


// 	}

// 	$scope.addtotable = function() {

// 		if(!$scope.materialtypeid) {

// 			swal("please select material type.");
// 		} else if(!$scope.submat) {

// 			swal("please select material.");
// 		} else if(!$scope.quantity) {

// 			swal("please enter material quantity.");
// 		} else if(!$scope.unitrate) {

// 			swal("please enter unit rate.");
// 		} else if(!$scope.suppliername) {

// 			swal("please enter supplier name.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$scope.recptmateriallist.push({"materialdesc":$("#"+$scope.submat).attr("materialdesc"), "uom":$scope.uomval, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "materialid":$scope.submat, "suppliername":$scope.suppliername});
// 			var totalqty = 0,
// 				totalcostofgoods = 0;

// 			angular.forEach($scope.recptmateriallist,function(recptm){
						
// 				totalqty = parseFloat(totalqty) + parseFloat(recptm.qty);
// 				totalcostofgoods = parseFloat(totalcostofgoods) + parseFloat(recptm.valueofgoods);
// 			});

// 			$scope.selftotalqty = totalqty;
// 			$scope.selftotalcostofgoods = totalcostofgoods;
// 			$rootScope.showloader=false;
// 		}
// 	}

// 	$scope.addmaterialreturntotable = function() {
		

// 		if($scope.subtype == 'select') {

// 			swal("Please select Sub Type.");

// 		} else if($scope.materialtypeid == 'select') {

// 			swal("Please select material type.");
// 		} else if($scope.submat == 'select') {

// 			swal("Please select material.");
// 		} else if($scope.subtype == '5' && !$scope.scrapqty) {

// 			swal("Please enter material quantity.");
// 		} else if($scope.subtype == '6' && !$scope.usableqty) {

// 			swal("Please enter usable quantity.");
// 		} else if($scope.subtype == '6' && !$scope.defectiveqty) {

// 			swal("Please enter defective quantity.");
// 		} else if($scope.subtype == '5' && !$scope.scrapvalueofgoods) {

// 			swal("Please enter value of goods.");
// 		} else if($scope.subtype == '6' && !$scope.usablevalueofgoods) {

// 			swal("Please enter usable value of goods.");
// 		} else if($scope.subtype == '6' && !$scope.defectivevalueofgoods) {

// 			swal("Please enter defective value of goods.");
// 		} else if($scope.returnmanager == 'select') {

// 			swal("Please select Manager.");
// 		} else if($scope.returnfeeder == 'select') {

// 			swal("Please select Feeder.");
// 		} else {

// 			var returnfeeder = jQuery.parseJSON($scope.returnfeeder);

// 			var submat = jQuery.parseJSON($scope.submat);

// 			var returnmanager = jQuery.parseJSON($scope.returnmanager);

// 			$rootScope.showloader=true;

// 			$scope.recptmaterialreturnlist.push({"materialdesc":submat.name, "uom":$scope.uomval, "qty":$scope.scrapqty, "usableqty":$scope.usableqty, "defectiveqty":$scope.defectiveqty, "usablevalueofgoods":$scope.usablevalueofgoods, "valueofgoods":$scope.scrapvalueofgoods, "defectivevalueofgoods":$scope.defectivevalueofgoods, "materialid":submat.id, "feeder":returnfeeder.name, "feederid":returnfeeder.id,"manager":returnmanager.name,"managerid":returnmanager.id});

// 			var totalscrapqty = 0,
// 				totalscrapcost = 0,
// 				totaldefectiveqty = 0,
// 				totaldefectivecost = 0,
// 				totalusableqty = 0,
// 				totalusablecost = 0;

// 			angular.forEach($scope.recptmaterialreturnlist,function(recptm){
						
// 				totalscrapqty = totalscrapqty + parseInt(recptm.qty);
// 				totaldefectiveqty = totaldefectiveqty + parseInt(recptm.defectiveqty);
// 				totalscrapcost = totalscrapcost + parseInt(recptm.valueofgoods);
// 				totaldefectivecost = totaldefectivecost + parseInt(recptm.defectivevalueofgoods);
// 				totalusableqty = totalusableqty + parseInt(recptm.usableqty);
// 				totalusablecost = totalusablecost + parseInt(recptm.usablevalueofgoods);
// 			});
// 			if(isNaN(totaldefectivecost)) {

// 				totaldefectivecost = 0;
// 			}
// 			if(isNaN(totaldefectiveqty)) {

// 				totaldefectiveqty = 0;
// 			}
// 			if(isNaN(totalusablecost)) {

// 				totalusablecost = 0;
// 			}
// 			if(isNaN(totalusableqty)) {

// 				totalusableqty = 0;
// 			}
// 			if(isNaN(totalscrapcost)) {

// 				totalscrapcost = 0;
// 			}
// 			if(isNaN(totalscrapqty)) {

// 				totalscrapqty = 0;
// 			}
// 			$scope.totalscrapqty = totalscrapqty;
// 			$scope.totalscrapcost = totalscrapcost;
// 			$scope.totaldefectiveqty = totaldefectiveqty;
// 			$scope.totaldefectivecost = totaldefectivecost;
// 			$scope.totalusableqty = totalusableqty;
// 			$scope.totalusablecost = totalusablecost;
// 			$rootScope.showloader=false;
// 		}
// 	}

// 	$scope.addinhousetotable = function() {

// 		if($scope.materialtypeid == 'select') {

// 			swal("please select material type.");
// 		} else if($scope.submat=='select') {

// 			swal("please select material.");
// 		} else if(!$scope.quantity) {

// 			swal("please enter material quantity.");
// 		} else if(!$scope.unitrate) {

// 			swal("please enter unit rate.");
// 		} else if($scope.inhousevendor == 'select') {

// 			swal("please select inhouse vendor.");
// 		} else {

// 			var submat = jQuery.parseJSON($scope.submat);
// 			var inhousevendor = jQuery.parseJSON($scope.inhousevendor);

// 			$rootScope.showloader=true;

// 			$scope.recptinhousemateriallist.push({"materialdesc":submat.name, "uom":$scope.uomval, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "materialid":submat.id, "inhousevendorname":inhousevendor.name, "inhousevendorid":inhousevendor.id});
// 			var totalqty = 0,
// 				totalcostofgoods = 0;

// 			angular.forEach($scope.recptinhousemateriallist,function(recptm){
						
// 				totalqty = totalqty + parseInt(recptm.qty);
// 				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
// 			});

// 			$scope.inhousetotalqty = totalqty;
// 			$scope.inhousetotalcostofgoods = totalcostofgoods;
// 			$rootScope.showloader=false;
// 		}
// 	}


// 	$scope.addthirdpartytotable = function() {

// 		if($scope.thirdparty == 'select') {

// 			swal("Please select a third party.");
// 		} else if($scope.materialtypeid == 'select') {

// 			swal("please select material type.");
// 		} else if($scope.submat=='select') {

// 			swal("please select material.");
// 		} else if(!$scope.quantity) {

// 			swal("please enter material quantity.");
// 		} else if(!$scope.unitrate) {

// 			swal("please enter unit rate.");
// 		} else {

// 			var submat = jQuery.parseJSON($scope.submat);

// 			$rootScope.showloader=true;

// 			$scope.recptthirdpartymateriallist.push({"materialdesc":submat.name, "uom":$scope.uomval, "qty":$scope.quantity, "unitrate":$scope.unitrate,"valueofgoods":$scope.valueofgoods, "materialid":submat.id});
// 			var totalqty = 0,
// 				totalcostofgoods = 0;

// 			angular.forEach($scope.recptthirdpartymateriallist,function(recptm){
						
// 				totalqty = totalqty + parseInt(recptm.qty);
// 				totalcostofgoods = totalcostofgoods + parseInt(recptm.valueofgoods);
// 			});

// 			$scope.thirdpartytotalqty = totalqty;
// 			$scope.thirdpartytotalcostofgoods = totalcostofgoods;
// 			$rootScope.showloader=false;
// 		}
// 	}



// 	$scope.changesubtype = function() {

// 		$scope.recptmaterialreturnlist = [];
// 	}

// 	$scope.addmaterialreturn = function() {

// 		if(!$scope.returnvehicleno) {

// 			swal("Please enter vehicle number.");
// 		} else {

// 			if(!$scope.remarks) {

// 				$scope.remarks = "";
// 			}


// 			$rootScope.showloader=true;
// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_materialreturn_to_inventory',
// 			data:{recptmaterialreturnlist:$scope.recptmaterialreturnlist, subtype:$scope.subtype, vehicleno:$scope.returnvehicleno, remarks:$scope.remarks, totalscrapqty:$scope.totalscrapqty, totalscrapcost:$scope.totalscrapcost, totalusableqty:$scope.totalusableqty, totalusablecost:$scope.totalusablecost, totaldefectiveqty:$scope.totaldefectiveqty, totaldefectivecost:$scope.totaldefectivecost},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$scope.mrn_no = "MRN/"+result;
// 				$rootScope.showloader=false;
				
// 			}).error(function(data,status){
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});

// 		}


// 	}


// 	$scope.addinventoryinhouse = function() {

// 		if(!$scope.inhousevehicleno) {

// 			swal("Please enter vehicle number.");
// 		} else if(!$scope.inhousedcno) {

// 			swal("Please enter DC No.");
// 		} else if(!$scope.inhousedcdate) {

// 			swal("Please select DC Date.");
// 		} else {

// 			if(!$scope.inhouseremarks) {

// 				$scope.inhouseremarks = "";
// 			}


// 			$rootScope.showloader=true;
// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_inhousematerial_to_inventory',
// 			data:{recptinhousemateriallist:$scope.recptinhousemateriallist, vehicleno:$scope.inhousevehicleno, dcno:$scope.inhousedcno, dcdate:$scope.inhousedcdate, remarks:$scope.inhouseremarks, totalqty:$scope.inhousetotalqty, totalcost:$scope.inhousetotalcostofgoods},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$scope.inhouserecptno = "INH/"+result;
// 				$rootScope.showloader=false;
				
// 			}).error(function(data,status){
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});

// 		}


// 	}

// 	$scope.addthirdpartytoinventory = function() {

// 		if(!$scope.thirdpartyvehicleno) {

// 			swal("Please enter vehicle number.");
// 		} else if(!$scope.thirdpartydcno) {

// 			swal("Please enter DC No.");
// 		} else if(!$scope.thirdpartydcdate) {

// 			swal("Please select DC Date.");
// 		} else {

// 			if(!$scope.thirdpartyremarks) {

// 				$scope.thirdpartyremarks = "";
// 			}


// 			$rootScope.showloader=true;
// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_thirdpartymaterial_to_inventory',
// 			data:{recptthirdpartymateriallist:$scope.recptthirdpartymateriallist, vehicleno:$scope.thirdpartyvehicleno, dcno:$scope.thirdpartydcno, dcdate:$scope.thirdpartydcdate, remarks:$scope.thirdpartyremarks, totalqty:$scope.thirdpartytotalqty, totalcost:$scope.thirdpartytotalcostofgoods, thirdparty:$scope.thirdparty},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$scope.thirdpartyrecptno = "THP/"+result;
// 				$rootScope.showloader=false;
				
// 			}).error(function(data,status){
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});

// 		}


// 	}

// 	$scope.thirdpartychange = function() {

// 		$scope.recptthirdpartymateriallist = [];
// 	}


// 	$scope.addselftoinventory = function() {

// 		if($scope.recptmateriallist.length == 0){

// 			swal("Please add atleast one material.");
// 		} else if(!$scope.selfauthorizedby) {

// 			swal("Please enter authorized by.");
// 		} else if(!$scope.selfinvoiceno) {

// 			swal("Please enter invoice numebr.");
// 		} else if(!$scope.selfinvoicedate) {

// 			swal("Please select invoice date.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_to_inventory',
// 			data:{authorized_by:$scope.selfauthorizedby, invoiceno:$scope.selfinvoiceno, invoicedate:$scope.selfinvoicedate, totalqty:$scope.selftotalqty, totalcost:$scope.selftotalcostofgoods, recptmateriallist:$scope.recptmateriallist},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;

// 				if(result == 1) {

// 					swal("Added to Inventory.");
// 					window.location.reload();
// 				} else if(result == 0){

// 					swal("No store mapped to add to inventory.");
// 				} else {

// 					swal("Something went wrong.");
// 				}

// 			}).error(function(data,status){
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				Logging.validation(status);
// 			});
// 		}
// 	}

// 	$scope.searchpo = function() {

// 		if(!$scope.ponumber) {

// 			swal("Please enter purchase order no.");
// 		} else {

// 			$rootScope.showloader=true;

// 			$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/get_po_info',
// 			params:{pono:$scope.ponumber},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;
// 				if(result == 0) {

// 					swal("Purchased Order No doesnot exist.");
// 				} else {
// 					$scope.companydetails = {};

// 					$scope.ponodetails = result;
// 				}

// 			}).error(function(data,status){
// 				console.log(data+status);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				Logging.validation(status);
// 			});
// 		}
// 	}

// 	$scope.blurinput = function(pomaterial, x) {

// 		if(!pomaterial.dcreceived) {

// 			pomaterial.dcreceived = 0;
// 		} 
// 		if(!pomaterial.shortageqty) {

// 			pomaterial.shortageqty = 0
// 		}
// 		if(!pomaterial.damagedqty) {

// 			pomaterial.damagedqty = 0;
// 		}

// 		var totalreceivedndc = parseInt(pomaterial.dcreceived)+parseInt(pomaterial.alreadyreceived);

// 		if(totalreceivedndc > parseInt(pomaterial.quantity)) {

// 			pomaterial.dcreceived = 0;
// 			pomaterial.shortageqty = 0;
// 			pomaterial.acceptedqty = 0;
// 			pomaterial.damagedqty = 0;
// 			$scope.companydetails.totalinvoice = 0;
// 			$scope.companydetails.totalacceptedvalue = 0;

// 			swal("Received quantity cannot be greater than Purchased quantity.");
// 		} else{

// 			var totalaccepted = parseInt(pomaterial.dcreceived)-(parseInt(pomaterial.shortageqty)+parseInt(pomaterial.damagedqty));

// 			$scope.ponodetails[0]['pomaterials'][x-1]['acceptedqty']= totalaccepted;

// 			var totalinvoicecompany = 0,
// 				totalacceptedvaluecompany = 0;

// 			angular.forEach($scope.ponodetails[0]['pomaterials'],function(podet){
							
// 				totalinvoicecompany = totalinvoicecompany + (parseInt(podet.unit_rate)*parseInt(podet.dcreceived));
// 				totalacceptedvaluecompany = totalacceptedvaluecompany + (parseInt(podet.unit_rate)*parseInt(podet.acceptedqty));
				
// 			});

// 			$scope.companydetails.totalinvoice = totalinvoicecompany;
// 			$scope.companydetails.totalacceptedvalue = totalacceptedvaluecompany;
// 		}
// 	}

// 	$scope.receivedcompanyrecpt = function() {

// 		if(!$scope.companydetails.totalinvoice || $scope.companydetails.totalinvoice == "0") {

// 			swal("Total invoice amount cannot be empty or 0.");
// 		} else if(!$scope.companydetails.dcno) {

// 			swal("Please enter DC No.");
// 		} else if(!$scope.companydetails.dcdate) {

// 			swal("Please select DC Date.");
// 		} else if(!$scope.companydetails.vehicleno) {

// 			swal("Please enter vehicle No.");
// 		} else if(!$scope.companydetails.invoiceno) {

// 			swal("Please enter invoice number.");
// 		} else if(!$scope.companydetails.invoicedate) {

// 			swal("Please select invoice date.");
// 		} else if(!$scope.companydetails.taxamount) {

// 			swal("Please enter tax amount.");
// 		} else if(!$scope.companydetails.frieghtcharge) {

// 			swal("Please enter frieght charge.");
// 		} else {

// 			$rootScope.showloader=true;
// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_to_inventory_company',
// 			data:{companydetails:$scope.companydetails, ponodetails:$scope.ponodetails},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;

// 				if(result != 0) {

// 					swal("Added to inventory.");
// 					$scope.transid = result;
// 				} else if(result == 0) {

// 					swal("No store mapped to add to inventory.");
// 				}

// 			}).error(function(data,status){
// 				console.log(data);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}
// 	}

// 	$scope.searchanotherstoredcno = function() {

// 		if(!$scope.anotherstoredcno) {

// 			swal("Please enter DC No.");
// 		} else {

// 			$rootScope.showloader=true;
// 			$http({
// 			method:'GET',
// 			url:$rootScope.requesturl+'/search_dc_no',
// 			params:{dcno:$scope.anotherstoredcno},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;

// 				if(result == 0) {

// 					swal("DC No doenot exist.");
// 				} else if(result == 1) {

// 					swal("Already added to Inventory.");
// 				} else {

// 					$scope.dcnodetails = result;
// 				}


// 			}).error(function(data,status){
// 				console.log(data);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}
// 	}

// 	$scope.bluranotherstoreinput = function(tdata, x) {

		
// 		if(!tdata['shortageqty']) {

// 			tdata['shortageqty'] = 0
// 		}
// 		if(!tdata['damagedqty']) {

// 			tdata['damagedqty'] = 0;
// 		}

// 		var totalaccepetedqty = parseInt(tdata['quantity']) - (parseInt(tdata['shortageqty'])+parseInt(tdata['damagedqty']));

// 		if(totalaccepetedqty < 0) {

// 			tdata['damagedqty'] = 0;
// 			tdata['shortageqty'] = 0;
// 			tdata['acceptedqty'] = 0;
			
// 			swal("Damaged and shortage quantity cannot be greater than issued quantity.");
// 		} else{

// 			tdata['acceptedqty'] = totalaccepetedqty;
// 		}
// 	}

// 	$scope.add_another_store_inventory = function() {

// 		if(!$scope.anotherstorevehicleno) {

// 			swal("Please enter vehicle number.");
// 		} else {

// 			$rootScope.showloader=true;
// 			$http({
// 			method:'POST',
// 			url:$rootScope.requesturl+'/add_to_inventory_anotherstore',
// 			data:{dcnodetails:$scope.dcnodetails, vehicleno:$scope.anotherstorevehicleno, remarks:$scope.anotherremark},
// 			headers:{'JWT-AuthToken':localStorage.pmstoken},
// 			}).
// 			success(function(result){
// 				console.log(result);
// 				$rootScope.showloader=false;

// 				if(result != 0) {

// 					swal("Added to inventory.");
// 					$scope.transidanotherstore = result;
// 				} else {

// 					swal("No store mapped to add to inventory.");
// 				}

// 			}).error(function(data,status){
// 				console.log(data);
// 				$rootScope.showloader=false;
// 				$rootScope.showerror=true;
// 				//Logging.validation(status);
// 			});
// 		}
// 	}

// });

app.controller("WarehouseIssueController",function($scope,$http,$rootScope,$state,Logging,Dates){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.issuematto='manager';
	$scope.issuemats=[];
	$scope.vehno='';
	$scope.rems='';
	$scope.Dates=Dates;
	$scope.issuetype = "new";
	
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_storelist',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.stores=result[0];
		$scope.subcons=result[1];
		$scope.thirdparties=result[2];
	});

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_storemats',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).success(function(result){
		$scope.matcats=result[0];
		$scope.stocks=result[1];
	});

	$scope.catfilter=function(a){
		if($scope.mainmatcat)
		{
			if(a.material.category_id==$scope.mainmatcat.id)
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
			return true;
		}
	}

	$scope.addmat=function(){
		if(parseFloat($scope.issueqty)>parseFloat($scope.mainmat.quantity) && $scope.issuetype=='new')
		{
			swal("You cant issue more than your existing stock.");
		} else if(parseFloat($scope.issueqty)>parseFloat($scope.mainmat.total_received) && $scope.issuetype=='old')
		{
			swal("You cant issue more than your existing stock.");
		}
		else
		{
			var flag=0;
			for(var i=0;i<$scope.issuemats.length;i++)
			{
				if($scope.issuemats[i].stockid==$scope.mainmat.id)
				{
					flag=1;
				}
			}
			if(flag==1)
			{
				swal('Material already added');
			}
			else
			{
				$scope.issuemats.push({stockid:$scope.mainmat.id,descr:$scope.mainmat.material.name,uom:$scope.mainmat.material.units,qty:$scope.issueqty,materialid:$scope.mainmat.material_id,vehno:$scope.vehno,rems:$scope.rems});
			}
		}
		$scope.maimat={};
		$scope.issueqty="";
	}

	$scope.removemat=function(index){
		$scope.issuemats.splice(index,1);
	}

	$scope.issue=function(){
		if($scope.issuemats.length==0)
		{
			swal('Please select the materials to issue');
		}
		else if(!$scope.issuematto)
		{
			swal('Please select whom to issue the materials to')
		}
		else if($scope.issuematto=='manager' && !$scope.mainstore)
		{
			swal('Please select the store');
		}
		else if($scope.issuematto=='subcontractor' && !$scope.mainsubcon)
		{
			swal('Please select the subcontractor');
		}
		else if($scope.issuematto=='thirdparty' && !$scope.maintpty)
		{
			swal('Please select the thirdparty');
		}
		else
		{
			$rootScope.showloader=true;
			$http({
				method:'POST',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				url:$rootScope.requesturl+'/issuematerial',
				data:{type:$scope.issuematto,store:$scope.mainstore,subcon:$scope.mainsubcon,tpty:$scope.maintpty,mats:$scope.issuemats,transport:$scope.tp,rems:$scope.rems, issuetype:$scope.issuetype}
			}).
			success(function(result){
				$rootScope.showloader=false;
				$("#GeneratePoModal").modal('show');
				console.log(result);
				$scope.mainissue=result;
				$scope.issuemats=[];
				$scope.maimat={};
				$scope.issueqty="";
				$scope.tp={};
			});
		}
	}
});

app.controller("WarehouseGroundStockRevisionController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);	

	$rootScope.showloader=true;
	$http({
		method:'GET',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
		url:$rootScope.requesturl+'/getinventorydata'
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.inventorydata = result;
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		//Logging.validation(status);
	});

	$scope.savegstockrevision = function() {

		var ecount = 0,
			remcount = 0;

		angular.forEach($scope.inventorydata,function(inv){
			
			angular.forEach(inv.submaterials,function(invin){

				if(invin['stocks'][0]['physical_qty'] && invin['stocks'][0]['physical_qty'] != "") {

					invin['stocks'][0]['physical_qty'] = parseInt(invin['stocks'][0]['physical_qty']);
				}
					
				if(!invin['stocks'][0]['physical_qty'] || invin['stocks'][0]['physical_qty'] == ""){

					ecount++;
				}
				if(invin['stocks'][0]['quantity'] != invin['stocks'][0]['physical_qty'] && (!invin['stocks'][0]['remarks'] || invin['stocks'][0]['remarks'] == "")){

					remcount++;
				}
			});					
			
		});

		if(ecount > 0) {

			swal("Please enter physical inventory for all stock.");
		} else if(remcount> 0) {

			swal("Please write remarks for those inventory whose physical inventory differs from existing inventory.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{inventorydata:$scope.inventorydata},
				url:$rootScope.requesturl+'/inventoryrevision'
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				if(result == 1) {

					swal("Phyical Inventory updated.");
					$scope.printstock = 1;
				}
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});


		}
	}
});

app.controller("WarehouseReportsReconciliationController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.reconciliationwise = "projectmanager";
});

app.controller("WarehouseReportsStockRevisionController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);

	$scope.storeid = 'select';

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_all_store',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.stores = result;
		
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});

	$scope.storeselect = function() {

		if($scope.storeid == 'select') {

			swal("Please select a store.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_stock_rev__report',
				params:{storeid:$scope.storeid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.inventorydata = result;
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}

	}

	$scope.shiftphysicaltomain = function(stockdata) {

		var ecount = 0;
			

		if(stockdata['stocks'][0]['physical_qty'] && stockdata['stocks'][0]['physical_qty'] != "") {

			stockdata['stocks'][0]['physical_qty'] = parseInt(stockdata['stocks'][0]['physical_qty']);
		}
			
		if(!stockdata['stocks'][0]['physical_qty'] || stockdata['stocks'][0]['physical_qty'] == ""){

			ecount++;
		}
		

		if(ecount > 0) {

			swal("Please enter physical inventory for all stock.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				headers:{'JWT-AuthToken':localStorage.pmstoken},
				data:{inventorydata:stockdata},
				url:$rootScope.requesturl+'/shiftphysicaltoquantity'
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				if(result == 1) {

					swal("Main Inventory has been updated with Phyical Inventory.");
					$scope.printstock = 1;
				}
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});


		}

	}
});

app.controller("WarehouseReportsStockInventoryController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.stockinventoryopt = "storewise";	

	$scope.materialid = 'select';
	$scope.storeid = 'select';

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
		url:$rootScope.requesturl+'/get_all_store',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.stores = result;
		
	}).error(function(data,status){
		$rootScope.showloader=false;
		$rootScope.showerror=true;
		Logging.validation(status);
	});

	$scope.generatestockinvreport = function() {

		if($scope.materialid == 'select') {

			swal("Please select product.");
		} else if($scope.storeid == 'select') {

			swal("Please select a store.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_stock_inv__report',
				params:{materialid:$scope.materialid, storeid:$scope.storeid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				$scope.inventorydata = result;
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				//Logging.validation(status);
			});
		}

	}

	$scope.changestocktype = function() {

		$scope.inventorydata = [];
	}

});

app.controller("WarehouseReportsMaterialIssueController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	$scope.materialissueopt = "projectmanager";
	$scope.periodselect = "yearwise";	
});

app.controller("WarehouseReportsMaterialReceiptController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.content.data.title);
	
});

app.controller("WarehouseThirdPartyController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.add_third_party = function() {

		if(!$scope.partyname) {

			swal("Please enter third party name.");
		} else if(!$scope.partycontact) {

			swal("Please enter contact details.");
		} else if(!$scope.partyaddress) {

			swal("Please enter address.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_thirdparty',
				data:{name:$scope.partyname, contact:$scope.partycontact, address:$scope.partyaddress},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				if(result == 1) {

					swal("Third party added successfully.");
					$scope.partyname = "";
					$scope.partyaddress = "";
					$scope.partycontact = "";
				} else {

					swal("Something went wrong.");
				}
				
			});
		}
	}
	
});

app.controller("WarehouseAddMaterialsController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.materialuom = "select";
	$scope.materialtype = "select";
	$scope.addmattype='normal';
	$scope.materialuoms = [];
	$scope.submattype = "1";
	$scope.fabtype = "1";
	$scope.mataddtype = "newm";
	$scope.uomtype = "single";
	$rootScope.showloader=true;

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_material_subtypes',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_uoms',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(uomresult){

			$rootScope.showloader=false;
			$scope.materials = result;
			$scope.uomlist = uomresult;
		});
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

	$scope.adduomtotable = function() {

		if(!$scope.primaryuom) {

			swal("Please select primary uom.");
		} else if(!$scope.secondaryuom) {

			swal("Please select secondary uom.");
		} else if(!$scope.uommultiplier) {

			swal("Please enter uom multiplier.");
		} else {

			$scope.materialuoms.push({"primaryuom":$scope.primaryuom.uom, "primaryuomid":$scope.primaryuom.id, "secondaryuom":$scope.secondaryuom.uom, "secondaryuomid":$scope.secondaryuom.id, "uommultiplier":$scope.uommultiplier});
			$scope.secondaryuom = "";
			$scope.uommultiplier = "";
		}
	}

	$scope.mapstartclick = function() {

		$scope.mapstart = true;
	}

	$scope.matchange = function() {

		$scope.submattype = angular.copy($scope.submat.type);
		if($scope.submat.type == 3) {

			$scope.fabtype = $scope.submat.fab_type;
		}
		$scope.materialuom = angular.copy($scope.submat.matuom[0]['stmatuom']['id']);

	}

	$scope.addmaterial = function() {

		if(!$scope.projectid) {

			swal("Please select a project.");
		} else if(!$scope.materialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat && $scope.mataddtype == "existingm") {

			swal("Please select material.");
		} else if(!$scope.materialname && $scope.mataddtype == "newm") {

			swal("Please enter material name.");
		} else if($scope.uomtype == 'single' && !$scope.materialuom){

			swal("Please select material uom.");
		} else if($scope.uomtype == 'multiple' && $scope.materialuoms.length == 0){

			swal("Please add atleast one pair of material uom.");
		} else {
			$rootScope.showloader=true;
			
			if(!$scope.submat){

				var submatid = "";
			} else {

				var submatid = $scope.submat.id;
			}
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_material_subtypes',
				data:{materialtype:$scope.materialtype.id, mataddtype:$scope.mataddtype, submatid:submatid, materialname:$scope.materialname, materialuom:$scope.materialuom, projectids:$scope.projectid, uomtype:$scope.uomtype, materialuoms:$scope.materialuoms, submattype:$scope.submattype, fabtype:$scope.fabtype},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;

				if(result == 0) {

					swal("Material already exists with same name.", "", "warning");
				} else {
					swal("Material added successfully!", "", "success");

					$scope.materials = result;
				}
				
			});
		}
	}
	
});

app.controller("WarehouseAddMaterialTypeController",function($scope,$http,$rootScope,$state, Logging){
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

	$scope.addmaterialtype = function() {

		if(!$scope.materialtypename) {

			swal("Please enter material type name.");
		} else {

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_material_types',
				data:{name:$scope.materialtypename},
				headers:{'JWT-AuthToken':localStorage.pmstoken}
			}).
			success(function(result){

				$rootScope.showloader=false;
				if(result == 0) {

					swal("Material type already exists.", "", "warning");

				} else {

					swal("Material type added successfully!", "", "success");

					$scope.materials.push(result);
				}
				
				
			});
		}
	}
	
});

app.controller("WarehouseBoqBomMappingController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	
});

app.controller("WarehouseAddThirdPartyController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	
});

app.controller("WarehouseAddAggregatorController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.materialtypeid = "select";
	$scope.agmateriallist = [];
	$scope.materialuom = "select";
	$scope.addmattype='aggregator';

	$scope.getagmat = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_aggregate_materials',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

				console.log(result);

				$rootScope.showloader=false;
				$scope.agmaterials = result;
				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_uoms',
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(uomresult){

					$rootScope.showloader=false;
					$scope.uomlist = uomresult;

				});
			
		});
	}

	$scope.getagmat();

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

	
	$scope.aggregatefilter = function(matlisttype){

		if(matlisttype==2){

			return true;
		}
	}

	$scope.aggmatchange = function() {

		if($scope.aggregatormatid) {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_aggregator_mat',
				params:{aggmatid:$scope.aggregatormatid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				$scope.agmateriallist= [];
				//$scope.agmateriallist = result.level1mat;
				angular.forEach(result.level1mat, function(inmat) {

					$scope.agmateriallist.push({"materialdesc":inmat.storematerial.name, "qty":inmat.matqty, "matid":inmat.store_material_id, uomid:inmat.store_material_uom_id, "uom":inmat.storeuom.stmatuom.uom});
				});
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
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
			console.log(result);
			$rootScope.showloader=false;

			$scope.uomval = result['units'];

		});
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
			$scope.submaterials = result.submaterials;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
	}

	$scope.addtotable = function() {

		if(!$scope.submattype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select a material.");
		} else if(!$scope.subuomval) {

			swal("Please select a uom.");
		} else if(!$scope.matqty) {

			swal("Please enter quantity.");
		} else {

			$scope.agmateriallist.push({"materialdesc":$scope.submat.name, "qty":$scope.matqty, "matid":$scope.submat.id, uomid:$scope.subuomval.id, "uom":$scope.subuomval.stmatuom.uom});

			$scope.submattype = "";
			$scope.matqty = "";
			$scope.submat = "";
		}
	}

	$scope.removerow = function(key) {

		$scope.agmateriallist.splice(key, 1);
	}

	$scope.addaggregator = function() {

		if(!$scope.aggregatormatid) {

			swal("Please select aggregator material.");
		} else if($scope.agmateriallist.length == 0 || $scope.agmateriallist.length == 1) {

			swal("Please add atleast two material for the aggregator.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_aggregator',
				data:{agmateriallist:$scope.agmateriallist, aggregatormatid:$scope.aggregatormatid},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;

				if(result == 1){

					swal("Material added successfully", "", "success");
					$scope.getagmat();
				} else {

					swal("Material already exists", "", "warning");
				}
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
			});
		}
	}
});

app.controller("WarehouseAddFabricationController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);
	$scope.materialtypeid = "select";
	$scope.submattype1 = 'select';
	$scope.agmateriallist = [];
	$scope.materialuom = "select";
	$scope.addmattype='fabrication';
	$scope.fabricationtype = 'gi';
	$scope.submat1 = 'select';
	$scope.dwgdocs = [];

	$rootScope.showloader=true;
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_ms_materials',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){
		$rootScope.showloader=false;
		$scope.msmaterials = result;
	});

	$scope.calculatewtpc = function() {

		if($scope.msmaterial && $scope.dwglength) {

			$scope.wtpc = angular.copy($scope.msmaterial.wt_per_mtr*parseFloat($scope.dwglength));
		}
	}

	$scope.calculatewtpole = function() {

		if($scope.wtpc && $scope.qtypole) {

			$scope.wtpole = angular.copy(parseFloat($scope.wtpc)*parseFloat($scope.qtypole));
		}
	}

	$scope.calculatewtkm = function() {

		if($scope.wtpc && $scope.qtykm) {

			$scope.wtkm = angular.copy(parseFloat($scope.wtpc)*parseFloat($scope.qtykm));
		}
	}

	$scope.getfabmat = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_fabrication_materials',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

				console.log(result);

				$rootScope.showloader=false;
				$scope.agmaterials = result;
				$http({
					method:'GET',
					url:$rootScope.requesturl+'/get_uoms',
					headers:{'JWT-AuthToken':localStorage.pmstoken},
				}).
				success(function(uomresult){

					$rootScope.showloader=false;
					$scope.uomlist = uomresult;

				});
			
		});
	}

	$scope.getfabmat();

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

	$scope.fabmatchange = function() {

		if($scope.fabricationmatid) {

			$rootScope.showloader=true;
			$http({
				method:'GET',
				url:$rootScope.requesturl+'/get_aggregator_mat',
				params:{aggmatid:$scope.fabricationmatid.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){

				$rootScope.showloader=false;
				console.log(result);
				$scope.agmateriallist= [];
				//$scope.agmateriallist = result.level1mat;
				angular.forEach(result.level1mat, function(inmat) {

					$scope.agmateriallist.push({"materialdesc":inmat.storematerial.name, "matid":inmat.store_material_id, "wtpole":inmat.wt_per_pole, "qtypole":inmat.qty_per_pole, "wtkm":inmat.wt_per_km, "qtykm":inmat.qty_per_km, "wtpc":inmat.wt_per_pc, "dwglength":inmat.length_asper_dwg, "msmaterial":inmat.ms_material_id, "msmaterialname":inmat.msmat.name, "dwgcode":inmat.dwg_code, "nutqty":inmat.qty, "fabricationtype":result.fab_type, uomid:inmat.store_material_uom_id, "uom":inmat.storeuom.stmatuom.uom, "ere_code":inmat.ere_code});

				});
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
				Logging.validation(status);
			});
		}
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
			console.log(result);
			$rootScope.showloader=false;
			$scope.uomval = result['units'];

		});
	}

	$scope.materialchange1 = function() {

		$rootScope.showloader=true;

		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_material_subtypes',
			params:{materialid:$scope.submattype1},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.submat1 = 'select';
			$scope.submaterials1 = result.submaterials;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
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
			$scope.submaterials = result.submaterials;
		}).error(function(data,status){
			$rootScope.showloader=false;
			$rootScope.showerror=true;
			Logging.validation(status);
		});
	}

	$scope.addtotable = function() {

		if(!$scope.submaterialtype) {

			swal("Please select material type.");
		} else if(!$scope.submat) {

			swal("Please select material.");
		} else if(!$scope.subuomval) {

			swal("Please select a uom.");
		} else if(!$scope.msmaterial && $scope.fabricationmatid.fab_type==1) {

			swal("Please select ms material.");
		} else if(!$scope.dwglength && $scope.fabricationmatid.fab_type==1) {

			swal("Please enter length as per dwg.");
		} else if(!$scope.qtypole && $scope.fabricationmatid.fab_type==1) {

			swal("Please enter qty per pole.");
		} else if(!$scope.qtykm && $scope.fabricationmatid.fab_type==1) {

			swal("Please enter qty per km.");
		} else if(!$scope.nutqty && $scope.fabricationmatid.fab_type==2) {

			swal("Please enter quantity.");
		} else {
			var msmatid = "", msmatname="";
			if($scope.msmaterial) {

				msmatid = $scope.msmaterial.id;
				msmatname = $scope.msmaterial.name;
			}

			$scope.agmateriallist.push({"materialdesc":$scope.submat.name, "matid":$scope.submat.id, "wtpole":$scope.wtpole, "qtypole":$scope.qtypole, "wtkm":$scope.wtkm, "qtykm":$scope.qtykm, "wtpc":$scope.wtpc, "dwglength":$scope.dwglength, "msmaterial":msmatid, "msmaterialname":msmatname, "dwgcode":$scope.dwgcode, "nutqty":$scope.nutqty, "fabricationtype":$scope.fabricationmatid.fab_type, uomid:$scope.subuomval});
			$scope.materialtype='';
			$scope.matqty = "";
			$scope.submat = "";
			$scope.subuomval = "";
			$scope.wtpole = "";
			$scope.qtypole = "";
			$scope.wtkm = "";
			$scope.qtykm = "";
			$scope.wtpc = "";
			$scope.dwglength = "";
			$scope.msmaterial = "";
			$scope.dwgcode = "";
			$scope.nutqty = "";
			$scope.submat = "";
		}
	}

	$scope.removerow = function(key) {

		$scope.agmateriallist.splice(key, 1);
	}

	$scope.uploaddwgdoc=function(files){

		var formdata = new FormData();
		formdata.append('file', files[0]);
		$scope.fd = formdata;
		
	}

	$scope.add_dwg_doc=function(){

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
				'filepath':'uploads/fabdwgdocs'},
				transformRequest: function(data) {return data;}
			}).
			success(function(data){

				$rootScope.showloader=false;

				$scope.dwgdocs.push({"doc_url":$scope.requesturl+"/uploads/fabdwgdocs/"+data['1'], "doc_name":data[2]});
					
			});


		}


	}

	$scope.remove_doc = function(key) {

		swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){ 

			
			$scope.dwgdocs.splice(key, 1);
			$scope.$apply();

			swal("File deleted successufully", "", "success");


		})
	}




	$scope.addfabrication = function() {

		if(!$scope.fabricationmatid) {

			swal("Please select fabrication material.");
		} else if($scope.agmateriallist.length == 0 || $scope.agmateriallist.length == 1) {

			swal("Please add atleast two material for the fabrication.");
		} else {

			$rootScope.showloader=true;

			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_fabrication',
				data:{agmateriallist:$scope.agmateriallist, dwgno:$scope.dwgno, dwgdocs:$scope.dwgdocs, fabricationmatid:$scope.fabricationmatid.id},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				console.log(result);
				if(result == 1){

					swal({ 
					  title: "Success",
					   text: "Material added successfully.",
					    type: "success" 
					  },
					  function(){
					    location.reload();
					});

				} else {

					swal("Material already exists", "", "warning");
				}
				
			}).error(function(data,status){
				$rootScope.showloader=false;
				$rootScope.showerror=true;
			});
		}
	}
});

app.controller("AddMsMaterialController",function($scope,$http,$rootScope,$state, Logging){
	$scope.$emit("changeTitle",$state.current.views.pagetopnav.data.title);

	$scope.getmsmat = function() {
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_ms_materials',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.msmaterials = result;
		});
	}

	$scope.getmsmat();

	$scope.addmsmaterial = function() {

		if(!$scope.msmaterialname) {

			swal("Please enter Ms Material name.");
		} else if(!$scope.wtpermtr){

			swal("Please enter wt./mtr.");
		} else {

			$rootScope.showloader=true;
			$http({
				method:'POST',
				url:$rootScope.requesturl+'/add_ms_material',
				data:{msmaterialname:$scope.msmaterialname, wtpermtr:$scope.wtpermtr},
				headers:{'JWT-AuthToken':localStorage.pmstoken},
			}).
			success(function(result){
				$rootScope.showloader=false;
				if(result == 0) {

					swal("Material already exists.");
				} else {

					$scope.getmsmat();

					swal("Material added successfully.", "", "success");
				}
			});
		}
	}
	
});

app.controller("WarehouseAddStocksController",function($scope,$http,$rootScope,$state, Logging){
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

	// $http({
	// 	method:'GET',
	// 	url:$rootScope.requesturl+'/get_project_list',
	// 	headers:{'JWT-AuthToken':localStorage.pmstoken},
	// }).
	// success(function(result){

	// 	$rootScope.showloader=false;
	// 	$scope.projectlist = result;
	// });
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_project',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectdet = result;
	});
	$scope.getprojectwiseenquiries = function(){
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/get_project_enquiry_list',
			headers:{'JWT-AuthToken':localStorage.pmstoken},
			params:{projectid:$scope.projectdet.project.id}
		}).
		success(function(result){
			$rootScope.showloader=false;
			$scope.enquirylist = result;

		});

	};

	$scope.generatemattrackerreport = function() {

		
		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/getmattrackreport',
			params:{projectid:$scope.projectdet.project.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.mattracklist = result;
		});
		
	}

	$scope.qtycheck = function(mat) {

		if(parseFloat(mat['total_issued']) > parseFloat(mat['total_received'])) {

			swal("Issued qty cannot be greater than received qty.");
			mat['total_issued'] = 0;
			mat['total_received'] = 0;
		} else {

			mat['total_stock'] = angular.copy(Math.round((parseFloat(mat['total_received'])-parseFloat(mat['total_issued']))*100)/100);
		}
	}

	$scope.addstocks = function() {

		
		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/addstocks',
			data:{mattracklist:$scope.mattracklist, projdet:$scope.projectdet.project},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			if(result == 1) {

				swal("Stock added succssfully.");
				$scope.submat = "";
				$scope.mainqty = "";
			}
		});
	}
	
});

app.controller("WarehouseAddFabStocksController",function($scope,$http,$rootScope,$state, Logging){
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

	// $http({
	// 	method:'GET',
	// 	url:$rootScope.requesturl+'/get_project_list',
	// 	headers:{'JWT-AuthToken':localStorage.pmstoken},
	// }).
	// success(function(result){

	// 	$rootScope.showloader=false;
	// 	$scope.projectlist = result;
	// });
	$http({
		method:'GET',
		url:$rootScope.requesturl+'/get_store_project',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.projectdet = result;
	});

	$scope.generatematfabreport = function() {

		$rootScope.showloader=true;
		$http({
			method:'GET',
			url:$rootScope.requesturl+'/getmattrackreport',
			params:{projectid:$scope.projectdet.project.id},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			$scope.mattracklist = result;
		});
		
	}

	$http({
		method:'GET',
		url:$rootScope.requesturl+'/getfabmattype',
		headers:{'JWT-AuthToken':localStorage.pmstoken},
	}).
	success(function(result){

		$rootScope.showloader=false;
		$scope.fabmattype = result;
	});
		


	$scope.qtycheck = function(mat) {

		if(parseFloat(mat['total_issued']) > parseFloat(mat['total_received'])) {

			swal("Issued qty cannot be greater than received qty.");
			mat['total_issued'] = 0;
			mat['total_received'] = 0;
		}
	}

	$scope.addfabstocks = function() {

		$rootScope.showloader=true;
		$http({
			method:'POST',
			url:$rootScope.requesturl+'/addfabstocks',
			data:{mattracklist:$scope.submat.level1mat, projdet:$scope.projectdet.project},
			headers:{'JWT-AuthToken':localStorage.pmstoken},
		}).
		success(function(result){

			$rootScope.showloader=false;
			console.log(result);
			if(result == 1) {

				swal("Stock added succssfully.");
			}
		});
	}
	
});