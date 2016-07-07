<?php namespace App\Http\Controllers;

use Request;
use Response;
use App\User;
use App\Store;
use App\StoreMaterial;
use App\Session;
use App\StoreStock;
use App\MaterialCategory;
use Carbon\Carbon;
use App\StoreTransactions;
use App\StoreTransactionData;
use App\PurchaseOrder;
use App\ThirdParty;
use App\InternalDIPo;
use App\Site;
use App\Vendor;
use App\PurchaseOrderInspection;
use App\PurchaseOrderInspectionMaterial;
use App\InspectionDocs;
use App\Uom;
use App\MRN;
use App\BoqBomMapping;
use App\AggregatorProjects;
use App\StoreMaterialProjects;
use App\StoreMaterialsLevel1;
use App\StoreMaterialsLevel2;
use App\StoreMaterialDocs;
use App\StoreTransactionsInvoices;
use App\StoreTransactionsInvoicesDocs;
use App\StoreTransactionsLRDocs;
use App\StoreTransactionsDCDocs;
use App\StoreTransactionsPackDocs;
use App\StoreTransactionsWeighDocs;
use App\PurchaseOrderMaterial;
use App\SubContractor;
use App\MRV;
use App\Projects;
use App\OldPurchaseOrder;
use App\Amendment;
use App\AmendmentDetails;
use App\StoreMaterialUom;
use App\StoreMaterialUomConversion;
use App\MsMaterial;
use App\PoFabricationMaterial;

class WarehouseController extends Controller {

	public function get_mat_store_data(){
		$mat=Request::get('mat');
		return Store::with(array('stock'=>function($query) use ($mat){
			$query->where('material_id','=',$mat);
		}))->orderBy('name')->get();
	}

	public function get_store_list_all(){
		return Store::all();
	}

	public function get_all_mats(){
		return MaterialCategory::with('submaterials')->get();
	}

	public function getinventorydata_store(){
		$storeid=Request::get('store');
		return $matcat = MaterialCategory::whereHas('submaterials.stocks', function($query) use ($storeid)
			{
			    $query->where('store_id', '=', $storeid);
			})->get();
	}

	public function get_recon_report_indi(){
		$data=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];
		if($data['type']=='subcontractor')
		{
			$dat=StoreMaterial::with(array('trans'=>function($query) use ($data){
				$query->where('created_at','>=',$data['dates']['fromdate'])->where('created_at','<=',$data['dates']['todate'].' 23:59:59')->with('transmain')->whereHas('transmain',function($q) use ($data){
						$q->where('subcon_id','=',$data['subcon']['id']);
				});
			}))
			->get()->toArray();
		}
		else
		{
			$dat=StoreMaterial::with(array('trans'=>function($query) use ($data){
				$query->where('created_at','>=',$data['dates']['fromdate'])->where('created_at','<=',$data['dates']['todate'].' 23:59:59')->with('transmain')->whereHas('transmain',function($q) use ($data){
						$q->where('third_party_id','=',$data['tpty']['id']);
				});
			}))
			->get()->toArray();
		}
		for($i=0;$i<count($dat);$i++)
		{
			$dat[$i]['credit']=0.000;
			$dat[$i]['debit']=0.000;
			$dat[$i]['damaged']=0.000;
			for($j=0;$j<count($dat[$i]['trans']);$j++)
			{
				if($dat[$i]['trans'][$j]['transmain']['type']==1)
				{
					$dat[$i]['credit']+=$dat[$i]['trans'][$j]['accepted_qty'];
					$dat[$i]['damaged']+=$dat[$i]['trans'][$j]['damaged_qty'];
				}
				else
				{
					$dat[$i]['debit']+=$dat[$i]['trans'][$j]['quantity'];
				}
			}
		}
		return $dat;
	}

	public function get_recon_data_indi(){
		$data=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];
		if($data['type']=='subcontractor')
		{
			$dat=StoreStock::where('store_id','=',$storeid)->with('material')->with(array('trans'=>function($query) use ($data){
				$query->where('created_at','>=',$data['dates']['fromdate'])->where('created_at','<=',$data['dates']['todate'].' 23:59:59')->with('transmain')->whereHas('transmain',function($q) use ($data){
						$q->where('subcon_id','=',$data['subcon']['id']);
				});
			}))
			->get()->toArray();
		}
		else
		{
			$dat=StoreStock::where('store_id','=',$storeid)->with('material')->with(array('trans'=>function($query) use ($data){
				$query->where('created_at','>=',$data['dates']['fromdate'])->where('created_at','<=',$data['dates']['todate'].' 23:59:59')->with('transmain')->whereHas('transmain',function($q) use ($data){
						$q->where('third_party_id','=',$data['tpty']['id']);
				});
			}))
			->get()->toArray();
		}
		for($i=0;$i<count($dat);$i++)
		{
			$dat[$i]['credit']=0.000;
			$dat[$i]['debit']=0.000;
			$dat[$i]['damaged']=0.000;
			for($j=0;$j<count($dat[$i]['trans']);$j++)
			{
				if($dat[$i]['trans'][$j]['transmain']['type']==1)
				{
					$dat[$i]['credit']+=$dat[$i]['trans'][$j]['accepted_qty'];
					$dat[$i]['damaged']+=$dat[$i]['trans'][$j]['damaged_qty'];
				}
				else
				{
					$dat[$i]['debit']+=$dat[$i]['trans'][$j]['quantity'];
				}
			}
		}
		return $dat;
	}


	public function get_receipt_report_store(){
		$dates=Request::all();
		return StoreTransactions::where('store_id','=',$dates['store']['id'])->where('type','=',1)->where('created_at','>=',$dates['dates']['fromdate'])->where('created_at','<=',$dates['dates']['todate'].' 23:59:59')->with('transdata.matname')->with('transdata.storestock')->with('storename')->with('tptname')->with('subconname')->with('mrndata')->with('mrvdata')->with('dcdata.storename')->orderBy('created_at')->get();
	}

	public function get_receipt_rpt(){
		$dates=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];
		return StoreTransactions::where('store_id','=',$storeid)->where('type','=',1)->where('created_at','>=',$dates['fromdate'])->where('created_at','<=',$dates['todate'].' 23:59:59')->with('transdata.matname')->with('transdata.storestock')->with('storename')->with('tptname')->with('subconname')->with('mrndata')->with('mrvdata')->with('dcdata.storename')->orderBy('created_at')->get();
	}

	public function get_issue_report_store(){
		$dates=Request::all();
		return StoreTransactions::where('store_id','=',$dates['store']['id'])->where('type','=',2)->where('created_at','>=',$dates['dates']['fromdate'])->where('created_at','<=',$dates['dates']['todate'].' 23:59:59')->with('transdata.matname')->with('transdata.storestock')->with('storename')->with('tptname')->with('subconname')->orderBy('dc_date')->get();
	}

	public function get_issue_rpt(){
		$dates=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];
		return StoreTransactions::where('store_id','=',$storeid)->where('type','=',2)->where('created_at','>=',$dates['fromdate'])->where('created_at','<=',$dates['todate'].' 23:59:59')->with('transdata.matname')->with('transdata.storestock')->with('storename')->with('tptname')->with('subconname')->orderBy('dc_date')->get();
	}

	public function get_recon_report_store()
	{
		$dates=Request::all();
		$data=StoreStock::where('store_id','=',$dates['store']['id'])->with('material')->with(array('trans'=>function($query) use ($dates){
			$query->where('created_at','>=',$dates['dates']['fromdate'])->where('created_at','<=',$dates['dates']['todate'].' 23:59:59');
		}))->get()->toArray();

		for($i=0;$i<count($data);$i++)
		{
			$data[$i]['credit']=0.000;
			$data[$i]['debit']=0.000;
			$data[$i]['damaged']=0.000;
			for($j=0;$j<count($data[$i]['trans']);$j++)
			{
				if($data[$i]['trans'][$j]['transmain']['type']==1)
				{
					$data[$i]['credit']+=$data[$i]['trans'][$j]['accepted_qty'];
					$data[$i]['damaged']+=$data[$i]['trans'][$j]['damaged_qty'];
				}
				else
				{
					$data[$i]['debit']+=$data[$i]['trans'][$j]['quantity'];
				}
			}
		}
		return $data;
	}

	public function get_recon_data(){
		$dates=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];
		$data=StoreStock::where('store_id','=',$storeid)->with('material')->with(array('trans'=>function($query) use ($dates){
			$query->where('created_at','>=',$dates['fromdate'])->where('created_at','<=',$dates['todate'].' 23:59:59')->with('transmain');
		}))->get()->toArray();
		for($i=0;$i<count($data);$i++)
		{
			$data[$i]['credit']=0.000;
			$data[$i]['debit']=0.000;
			$data[$i]['damaged']=0.000;
			for($j=0;$j<count($data[$i]['trans']);$j++)
			{
				if($data[$i]['trans'][$j]['transmain']['type']==1)
				{
					$data[$i]['credit']+=$data[$i]['trans'][$j]['accepted_qty'];
					$data[$i]['damaged']+=$data[$i]['trans'][$j]['damaged_qty'];
				}
				else
				{
					$data[$i]['debit']+=$data[$i]['trans'][$j]['quantity'];
				}
			}
		}
		return $data;
	}

	public function getinventorydata() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];

		return $matcat = MaterialCategory::with('submaterials.stocks')->whereHas('submaterials.stocks', function($query) use ($storeid)
			{
			    $query->where('store_id', '=', $storeid);
			})->get();
		
	}

	public function getstoredata() {

		$tkn=Request::header('JWT-AuthToken');
		return $userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		
	}

	public function add_material_types() {

		$name = Request::input('name');
		$addmattype = Request::input("addmattype");

		$mattype = MaterialCategory::where('name', '=', $name)->first();

		if($mattype) {

			return 0;

		} else {

			$singlematerial = array(

					"name"=>$name
				);

			return MaterialCategory::create($singlematerial);
		}
	}

	public function add_material_subtypes() {

		$materialname = Request::input('materialname');
		$materialtype = Request::input('materialtype');
		$materialuom = Request::input('materialuom');
		$projectids = Request::input('projectids');
		$uomtype = Request::input('uomtype');
		$mataddtype = Request::input('mataddtype');
		$submatid = Request::input('submatid');
		$submattype = Request::input('submattype');
		$materialuoms = Request::input('materialuoms');

		$fabtype = Request::input('fabtype');

		if(!isset($fabtype)) {

			$fabtype = 0;
		}

		$explodename = explode(" ", $materialname);

		$material_code = "";

		foreach ($explodename as $value) {
			
			$material_code.=strtoupper($value);
		}

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$storemat = StoreMaterial::where('name', '=', $materialname)->first();

		if($storemat) {

			$out = 0;

		} else {

			if($mataddtype == "newm"){

				$singlematerial = array(

						"name"=>$materialname,
						"category_id"=>$materialtype,
						"type"=>$submattype,
						"fab_type"=>$fabtype,
						"created_by"=>$userdata['users']['id']
					);

				$storematnew = StoreMaterial::create($singlematerial);
				$material_code = substr($material_code, 0, 3);
				$material_code.=$storematnew->id;
				$material_code = substr($material_code, 0, 6);

				$material_code = str_pad($material_code,6,"0");


				$storematnew->material_code = $material_code;
				$storematnew->save();
			} else {

				$submatexisting = StoreMaterial::where("id", "=", $submatid)->first();
				if($submatexisting){

					$submatexisting->type = $submattype;
					$submatexisting->fab_type = $fabtype;
					$submatexisting->save();
				}
			}

			if($uomtype == "single") {

				if($mataddtype == "newm") {

					StoreMaterialUom::create(array("store_material_id"=>$storematnew->id, "uom_id"=>$materialuom));
				}
			} else {

				foreach ($materialuoms as $indimatuom) {
					
					$storematuomcheckp = StoreMaterialUom::where("store_material_id", "=", $storematnew->id)->where("uom_id","=",$indimatuom['primaryuomid'])->first();
					if(!$storematuomcheckp) {

						$storematuomcheckp = StoreMaterialUom::create(array("store_material_id"=>$storematnew->id, "uom_id"=>$indimatuom['primaryuomid']));
					}
					$storematuomchecks = StoreMaterialUom::where("store_material_id", "=", $storematnew->id)->where("uom_id","=",$indimatuom['secondaryuomid'])->first();
					if(!$storematuomchecks) {

						$storematuomchecks = StoreMaterialUom::create(array("store_material_id"=>$storematnew->id, "uom_id"=>$indimatuom['secondaryuomid']));
					}
					$checkstorematconv = StoreMaterialUomConversion::where("store_material_uom_id1", "=", $storematuomcheckp->id)->where("store_material_uom_id2", "=", $storematuomchecks->id)->first();

					if(!$checkstorematconv) {
						StoreMaterialUomConversion::create(array("store_material_uom_id1"=>$storematuomcheckp->id, "store_material_uom_id2"=>$storematuomchecks->id, "ratio"=>$indimatuom['uommultiplier']));
					}
					$revratio = 1/floatval($indimatuom['uommultiplier']);
					$checkstorematconv2 = StoreMaterialUomConversion::where("store_material_uom_id2", "=", $storematuomcheckp->id)->where("store_material_uom_id1", "=", $storematuomchecks->id)->first();					if(!$checkstorematconv2) {

						StoreMaterialUomConversion::create(array("store_material_uom_id2"=>$storematuomcheckp->id, "store_material_uom_id1"=>$storematuomchecks->id, "ratio"=>$revratio));

					}

				}
			}
			
			foreach ($projectids as $pid) {

				if($mataddtype == "newm") {				
					$singleagproj = array("store_material_id"=>$storematnew->id, "project_id"=>$pid);
					$createagproj = StoreMaterialProjects::create($singleagproj);
				} else {

					$storematproj = StoreMaterialProjects::where("store_material_id", "=", $submatid)->where("project_id","=", $pid)->first();
					if(!$storematproj){

						$singleagproj = array("store_material_id"=>$submatid, "project_id"=>$pid);
						$createagproj = StoreMaterialProjects::create($singleagproj);
					}
				}
			}
			

			$out = MaterialCategory::with('submaterials')->get();
		}

		return $out;
	}


	public function get_idis_data() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];

		$id = Request::input('data');
		$q2 = Store::where('user_id','=',$userid)->with("project")->first();
		$sid = $q2['id'];
		$stockdate = $q2['project']['stock_date'];
		$days = 10;
		$newstockdate = date("Y-m-d", strtotime("-".$days." days", strtotime($stockdate)));
		$pos = PurchaseOrder::where("vendor_id", "=", $id)->with(array("pomaterials.intdipo"=>function($que){

			$que->whereRaw("quantity>already_received");
		}))->whereHas("pomaterials.intdipo", function($query) {

			$query->whereRaw("quantity>already_received");
		})->with("pomaterials.intdipo.intdimat.intdi")->with("pomaterials.storematerial")->get();
		$matarr = array();
		$intpos = array();
		$i = 0;
		foreach ($pos as $indipo) {
			
			foreach ($indipo['pomaterials'] as $indipomat) {
				
				if(!in_array($indipomat['material_id'], $matarr)) {

					$q1 = InternalDIPo::where('vendor_id','=',$id)->where('stores_id','=',$sid)->where("material_id", "=", $indipomat['material_id'])->whereRaw('quantity>already_received')->with('podets')->with('storematerial')->with("intdimat.intdi")->get();
					$checkintdi = 0;
					if(!isset($intpos[$i]['intdidets'])) {

						$intpos[$i]['intdidets'] = array();
					}
					foreach ($q1 as $inq1) {

						// if(($inq1['intdimat']['intdi']['manual_flag'] == 1 && $inq1['intdimat']['intdi']['manual_date'] >= $newstockdate) || ($inq1['intdimat']['intdi']['manual_flag'] == 0 && $inq1['intdimat']['intdi']['created_at'] >= $newstockdate)) {
							$matid = $inq1['material_id'];
							$pomatdet = PurchaseOrderMaterial::where("purchase_order_id", "=", $inq1['podets']['id'])->where("material_id", "=", $inq1['material_id'])->with("fabmat.storemainuom.stmatuom")
							->with(array('fabmat.storemat.level1matindi' => function($query) 		
									use ($matid){$query->where("store_aggregator_id", "=", $matid);
								}))->with("uoms.stmatuom")
							->first();
							$inq1['pomatdetails'] = $pomatdet;
							$checkintdi++;
						// }
					}
					// if($checkintdi > 0) {
						$intpos[$i]['intdidets'] = $q1;
						$intpos[$i]['matname'] = $indipomat['storematerial']['name'];
						$i++;
					// }
					
					$matarr[] = $indipomat['material_id'];
					
				}
			}
		}
		
		
		return $intpos;
	}

	public function accept_warehouse_qtys() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];

		$rec = Request::input('receipt');
		$mat = Request::input('idimat');
		$q2 = Store::where('user_id','=',$userid)->with("project")->first();
		$storeid = $q2['id'];
		$days = 10;
		$newstockdate = $q2['project']['stock_date'];
		
			$q1 = new StoreTransactions;
			$q1->created_by = $userid;
			$q1->store_id = $storeid;
			$q1->type = 1;
			$q1->receipt_type = 5;
			$q1->dc_no = $rec['dcno'];
			$q1->dc_date = $rec['dcdate'];
			$q1->transporter_name = $rec['tranportname'];
			$q1->vehicle_no = $rec['vehicleno'];
			$q1->lr_no = $rec['lrno'];
			$q1->lr_date = $rec['lrdate'];
			$q1->way_bill_no = $rec['waybillno'];
			$q1->save();
			$stid = $q1->id;

			$q9 = MRV::where('stores_id','=',$storeid)->orderBy('mrv_sno','desc')->first();
			if(count($q9)==0)
			{
				$sno = 1;
			}
			else
			{
				$sno = floatval($q9['mrv_sno']) + floatval(1);
			}

			$q12 = new MRV;
			$q12->store_transactions_id = $stid;
			$q12->stores_id = $storeid;
			$q12->mrv_sno = $sno;
			$q12->save();
			$mrv_id = $q12->id;
			$mrv_sno = $q12->mrv_sno;

			// return $rec;

			for ($i=0; $i < count($rec['invoices']); $i++) { 
				# code...
				$q3 = new StoreTransactionsInvoices;
				$q3->no = $rec['invoices'][$i]['invoice_no'];
				$q3->date = $rec['invoices'][$i]['invoice_date'];
				$q3->value = $rec['invoices'][$i]['invoice_value'];
				$q3->quantity = $rec['invoices'][$i]['invoice_quantity'];
				$q3->store_transaction_id = $stid;
				$q3->save();
				$stinvid = $q3->id;
				for ($j=0; $j < count($rec['invoices'][$i]['docs']); $j++) { 
					# code...
					$q4 = new StoreTransactionsInvoicesDocs;
					$q4->store_transactions_inovices_id = $stinvid;
					$q4->doc_name = $rec['invoices'][$i]['docs'][$j]['doc_name'];
					$q4->doc_url = $rec['invoices'][$i]['docs'][$j]['doc_url'];
					$q4->save();
				}
			}
			for ($i=0; $i < count($rec['lrdocs']); $i++) { 
				# code...
				$q5 = new StoreTransactionsLRDocs;
				$q5->store_transactions_id = $stid;
				$q5->doc_name = $rec['lrdocs'][$i]['doc_name'];
				$q5->doc_url = $rec['lrdocs'][$i]['doc_url'];
				$q5->save();
			}
			for ($i=0; $i < count($rec['dcdocs']); $i++) { 
				# code...
				$q5 = new StoreTransactionsDCDocs;
				$q5->store_transactions_id = $stid;
				$q5->doc_name = $rec['dcdocs'][$i]['doc_name'];
				$q5->doc_url = $rec['dcdocs'][$i]['doc_url'];
				$q5->save();
			}
			for ($i=0; $i < count($rec['packdocs']); $i++) { 
				# code...
				$q5 = new StoreTransactionsPackDocs;
				$q5->store_transactions_id = $stid;
				$q5->doc_name = $rec['packdocs'][$i]['doc_name'];
				$q5->doc_url = $rec['packdocs'][$i]['doc_url'];
				$q5->save();
			}
			for ($i=0; $i < count($rec['weighdocs']); $i++) { 
				# code...
				$q5 = new StoreTransactionsWeighDocs;
				$q5->store_transactions_id = $stid;
				$q5->doc_name = $rec['weighdocs'][$i]['doc_name'];
				$q5->doc_url = $rec['weighdocs'][$i]['doc_url'];
				$q5->save();
			}

			for ($i=0; $i < count($mat); $i++) { 

				if($mat[$i]['storematerial']['type'] == 3) {

					for($k=0; $k<count($mat[$i]['fabmats']); $k++){
						if($mat[$i]['fabmats'][$k]['dcreceived'] > 0) {
							if(!isset($mat[$i]['fabmats'][$k]['acceptedqty'])) {

								$mat[$i]['fabmats'][$k]['acceptedqty'] = 0;
							}
							if(!isset($mat[$i]['fabmats'][$k]['damagedqty'])) {

								$mat[$i]['fabmats'][$k]['damagedqty'] = 0;
							}
							if(!isset($mat[$i]['fabmats'][$k]['shortageqty'])) {

								$mat[$i]['fabmats'][$k]['shortageqty'] = 0;
							}
							//update internal DI PO and po mat
							$q10 = InternalDIPo::where('id','=', $mat[$i]['id'])->with("intdimat.intdi")->first();
							
							$q6 = StoreStock::where('material_id','=',$mat[$i]['fabmats'][$k]['store_material_id'])->where('material_level1_id','=',$mat[$i]['fabmats'][$k]['store_material_level1_id'])->where('store_id','=',$storeid)->get();
							if($q6->count()==0)
							{
								$q7 = new StoreStock;
								$q7->store_id = $storeid;
								$q7->material_id = $mat[$i]['fabmats'][$k]['store_material_id'];
								$q7->material_level1_id = $mat[$i]['fabmats'][$k]['store_material_level1_id'];
								$q7->opening = 0;
								if($rec['dcdate'] > $newstockdate) {
									$q7->quantity = $mat[$i]['fabmats'][$k]['acceptedqty'];
									$q7->damaged = $mat[$i]['fabmats'][$k]['damagedqty'];
									$q7->shortage_qty = $mat[$i]['fabmats'][$k]['shortageqty'];
								} else {
									$q7->old_quantity = $mat[$i]['fabmats'][$k]['acceptedqty'];
									$q7->old_damaged = $mat[$i]['fabmats'][$k]['damagedqty'];
									$q7->old_shortage_qty = $mat[$i]['fabmats'][$k]['shortageqty'];									
								}
								$q7->created_by = $userid;
								$q7->save();
								$storestockid = $q7->id;
							}
							else
							{	
								if($rec['dcdate'] > $newstockdate) {
									$nqty = floatval($q6[0]['quantity']) + floatval($mat[$i]['fabmats'][$k]['acceptedqty']);
									$dqty = floatval($mat[$i]['fabmats'][$k]['damagedqty']) + floatval($q6[0]['damaged']);
									$shortageqty = floatval($mat[$i]['fabmats'][$k]['shortageqty']) + floatval($q6[0]['shortage_qty']);
									
									$q8 = StoreStock::where('material_id','=',$mat[$i]['fabmats'][$k]['store_material_id'])->where('material_level1_id','=',$mat[$i]['fabmats'][$k]['store_material_level1_id'])->where('store_id','=',$storeid)->update(array('quantity' => $nqty, 'damaged'=> $dqty, 'shortage_qty'=>$shortageqty));
								} else {

									$oldnqty = floatval($q6[0]['old_quantity']) + floatval($mat[$i]['fabmats'][$k]['acceptedqty']);
									$olddqty = floatval($mat[$i]['fabmats'][$k]['damagedqty']) + floatval($q6[0]['old_damaged']);
									$oldshortageqty = floatval($mat[$i]['fabmats'][$k]['shortageqty']) + floatval($q6[0]['old_shortage_qty']);
									
									$q8 = StoreStock::where('material_id','=',$mat[$i]['fabmats'][$k]['store_material_id'])->where('material_level1_id','=',$mat[$i]['fabmats'][$k]['store_material_level1_id'])->where('store_id','=',$storeid)->update(array('old_quantity' => $oldnqty, 'old_damaged'=> $olddqty, 'old_shortage_qty'=>$oldshortageqty));
								}
								$storestockid = $q6[0]['id'];
							}
							if($mat[$i]['fabmats'][$k]['acceptedqty'] > 0) {
								$q9 = new StoreTransactionData;
								$q9->stock_id = $storestockid;
								$q9->pomaterial_id = $mat[$i]['pom_table_id'];
								$q9->material_id = $mat[$i]['fabmats'][$k]['store_material_id'];
								$q9->type = 1;
								$q9->trans_id = $stid;
								$q9->vendor_id = $mat[$i]['vendor_id'];
								if($rec['dcdate'] > $newstockdate) {
									$q9->dc_received_qty = $mat[$i]['fabmats'][$k]['dcreceived'];
									$q9->damaged_qty = $mat[$i]['fabmats'][$k]['damagedqty'];
									$q9->accepted_qty = $mat[$i]['fabmats'][$k]['acceptedqty'];
									$q9->shortage_qty = $mat[$i]['fabmats'][$k]['shortageqty'];
									$q9->quantity = $mat[$i]['fabmats'][$k]['acceptedqty'];
								} else {
									$q9->old_dc_received_qty = $mat[$i]['fabmats'][$k]['dcreceived'];
									$q9->old_damaged_qty = $mat[$i]['fabmats'][$k]['damagedqty'];
									$q9->old_accepted_qty = $mat[$i]['fabmats'][$k]['acceptedqty'];
									$q9->old_shortage_qty = $mat[$i]['fabmats'][$k]['shortageqty'];
									$q9->old_quantity = $mat[$i]['fabmats'][$k]['acceptedqty'];

								}
								$q9->save();
							}
							PoFabricationMaterial::where("id", "=", $mat[$i]['fabmats'][$k]['id'])->increment('already_received_qty', $mat[$i]['fabmats'][$k]['acceptedqty']);
							// $q11 = PurchaseOrderMaterial::where('id','=',$mat[$i]['pom_table_id'])->increment('already_received', $mat[$i]['fabmats'][$k]['acceptedqty']);
						}
					}

					$idiqty  = floatval($mat[$i]['already_received']) + floatval($mat[$i]['acceptedqty']);
					$q10 = InternalDIPo::where('id','=', $mat[$i]['id'])->update(array('already_received' =>$mat[$i]['acceptedqty']));
				} else {
					# code...
					//update internal DI PO and po mat
					
					$q6 = StoreStock::where('material_id','=',$mat[$i]['material_id'])->where('store_id','=',$storeid)->get();
					if($q6->count()==0)
					{

						$q7 = new StoreStock;
						$q7->store_id = $storeid;
						$q7->material_id = $mat[$i]['material_id'];
						$q7->opening = 0;
						if(count($mat[$i]['pomatdetails']['uoms']) == 2) {

							for($k=0;$k<count($mat[$i]['pomatdetails']['uoms']);$k++){

								if($mat[$i]['pomatdetails']['store_material_uom_id'] != $mat[$i]['pomatdetails']['uoms'][$k]['id']) {
									if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'])) {

										$mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'] = 0;
									}
									if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'])) {

										$mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'] = 0;
									}
									if($rec['dcdate'] > $newstockdate) {
										$q7->quantity = $mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'];
										$q7->damaged = $mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'];
									} else {

										$q7->old_quantity = $mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'];
										$q7->old_damaged = $mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'];
									}
								}
							}
							
						} else {
							if($rec['dcdate'] > $newstockdate) {
								$q7->quantity = $mat[$i]['acceptedqty'];
								$q7->damaged = $mat[$i]['damagedqty'];
							} else {
								$q7->old_quantity = $mat[$i]['acceptedqty'];
								$q7->old_damaged = $mat[$i]['damagedqty'];
							}
						}
						$q7->created_by = $userid;
						$q7->save();
						$storestockid = $q7->id;
					}
					else
					{	

						if(count($mat[$i]['pomatdetails']['uoms']) == 2) {

							for($k=0;$k<count($mat[$i]['pomatdetails']['uoms']);$k++){

								if($mat[$i]['pomatdetails']['store_material_uom_id'] != $mat[$i]['pomatdetails']['uoms'][$k]['id']) {
									if($rec['dcdate'] > $newstockdate) {
										$nqty = floatval($q6[0]['quantity']) + floatval($mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty']);
										$dqty = floatval($mat[$i]['pomatdetails']['uoms'][$k]['damagedqty']) + floatval($q6[0]['damaged']);
									} else {

										$nqty = floatval($q6[0]['old_quantity']) + floatval($mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty']);
										$dqty = floatval($mat[$i]['pomatdetails']['uoms'][$k]['damagedqty']) + floatval($q6[0]['old_damaged']);
									}
								}
							}
							
						} else {
							if($rec['dcdate'] > $newstockdate) {
								$nqty = floatval($q6[0]['quantity']) + floatval($mat[$i]['acceptedqty']);
								$dqty = floatval($mat[$i]['damagedqty']) + floatval($q6[0]['damaged']);
							} else {

								$nqty = floatval($q6[0]['old_quantity']) + floatval($mat[$i]['acceptedqty']);
								$dqty = floatval($mat[$i]['damagedqty']) + floatval($q6[0]['old_damaged']);
							}
						}
						if($rec['dcdate'] > $newstockdate) {
							$q8 = StoreStock::where('material_id','=',$mat[$i]['material_id'])->where('store_id','=',$storeid)->update(array('quantity' => $nqty, 'damaged'=> $dqty));
						} else {

							$q8 = StoreStock::where('material_id','=',$mat[$i]['material_id'])->where('store_id','=',$storeid)->update(array('old_quantity' => $nqty, 'old_damaged'=> $dqty));
						}
						$storestockid = $q6[0]['id'];
					}
					if($mat[$i]['acceptedqty'] > 0) {
						$q9 = new StoreTransactionData;
						$q9->stock_id = $storestockid;
						$q9->pomaterial_id = $mat[$i]['pom_table_id'];
						$q9->material_id = $mat[$i]['material_id'];
						if(isset($mat[$i]['intdimat'])) {
							$q9->internal_di_id = $mat[$i]['intdimat']['intdi']['id'];
						}
						$q9->type = 1;
						$q9->trans_id = $stid;
						$q9->vendor_id = $mat[$i]['vendor_id'];
						
						if($rec['dcdate'] > $newstockdate) {
							$q9->dc_received_qty = $mat[$i]['dcreceived'];
							$q9->damaged_qty = $mat[$i]['damagedqty'];
							$q9->accepted_qty = $mat[$i]['acceptedqty'];
							$q9->shortage_qty = $mat[$i]['shortageqty'];
							$q9->quantity = $mat[$i]['acceptedqty'];
						} else {
							$q9->old_dc_received_qty = $mat[$i]['dcreceived'];
							$q9->old_damaged_qty = $mat[$i]['damagedqty'];
							$q9->old_accepted_qty = $mat[$i]['acceptedqty'];
							$q9->old_shortage_qty = $mat[$i]['shortageqty'];
							$q9->old_quantity = $mat[$i]['acceptedqty'];
						}
						if(count($mat[$i]['pomatdetails']['uoms']) == 2) {

							for($k=0;$k<count($mat[$i]['pomatdetails']['uoms']);$k++){

								if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['dcreceived'])) {

									$mat[$i]['pomatdetails']['uoms'][$k]['dcreceived'] = 0;
								}
								if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'])) {

									$mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'] = 0;
								}
								if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'])) {

									$mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'] = 0;
								}
								if(!isset($mat[$i]['pomatdetails']['uoms'][$k]['shortageqty'])) {

									$mat[$i]['pomatdetails']['uoms'][$k]['shortageqty'] = 0;
								}
								if($mat[$i]['pomatdetails']['store_material_uom_id'] != $mat[$i]['pomatdetails']['uoms'][$k]['id']) {
									$nqty = floatval($q6[0]['quantity']) + floatval($mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty']);
									if($rec['dcdate'] > $newstockdate) {
										$q9->sec_dc_received_qty = $mat[$i]['pomatdetails']['uoms'][$k]['dcreceived'];
										$q9->sec_damaged_qty = $mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'];
										$q9->sec_accepted_qty = $mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'];
										$q9->sec_shortage_qty = $mat[$i]['pomatdetails']['uoms'][$k]['shortageqty'];
									} else {

										$q9->old_sec_dc_received_qty = $mat[$i]['pomatdetails']['uoms'][$k]['dcreceived'];
										$q9->old_sec_damaged_qty = $mat[$i]['pomatdetails']['uoms'][$k]['damagedqty'];
										$q9->old_sec_accepted_qty = $mat[$i]['pomatdetails']['uoms'][$k]['acceptedqty'];
										$q9->old_sec_shortage_qty = $mat[$i]['pomatdetails']['uoms'][$k]['shortageqty'];
									}
								}
							}
							
						}
						$q9->save();
					}
					
					$idiqty  = floatval($mat[$i]['already_received']) + floatval($mat[$i]['acceptedqty']);
					$q10 = InternalDIPo::where('id','=', $mat[$i]['id'])->update(array('already_received' =>$idiqty));

					$q11 = PurchaseOrderMaterial::where('id','=',$mat[$i]['pom_table_id'])->first();
					$pomqty = floatval($q11['already_received']) + floatval($mat[$i]['acceptedqty']);
					$q11 = PurchaseOrderMaterial::where('id','=',$mat[$i]['pom_table_id'])->update(array('already_received' =>$pomqty));
				} 

			}

			$pomids = array();
			$poids = array();

			$q90 = StoreTransactionData::where('trans_id','=',$stid)->get();
			for ($i=0; $i < count($q90); $i++) { 
				# code...
				if(!in_array($q90[$i]['pomaterial_id'],$pomids))
				{
					array_push($pomids, $q90[$i]['pomaterial_id']);
				}
			}

			$q91 = PurchaseOrderMaterial::whereIn('id',$pomids)->get();
			for ($i=0; $i < count($q91); $i++) { 
				# code...
				if(!in_array($q91[$i]['purchase_order_id'],$poids))
				{
					array_push($poids, $q91[$i]['purchase_order_id']);
				}
			}

			$q92 = PurchaseOrder::whereIn('id',$poids)
					->with(array('pomaterials.storetransdata' => function($query) 		
						use ($stid){$query->where('trans_id','=',$stid);
					}))
					->with('pomaterials.storematerial')->with('vendor')->with('taxes.taxmaterials.tax')->with('taxes.taxmaterials.mat')->get();


			return array('yes',$q92,$mrv_sno,$mrv_id,$q1,$rec['invoices'],$q2, $newstockdate);
			// return array($poids,$);

		
	}

	public function add_to_inventory() {

		$data = Request::all();

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"authorized_by"=>$data['authorized_by'],
					"receipt_type"=>1,//for local purchase
					"invoice_no"=>$data['invoiceno'],
					"invoice_date"=>$data['invoicedate'],
					"total_qty"=>$data['totalqty'],
					"total_cost"=>$data['totalcost']

				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($data['recptmateriallist'] as $value) {

				$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $value['materialid'])->first();

				if($storestock) {

					$storestock->quantity = $storestock->quantity + $value['qty'];
					$storestock->save();
					$stockid = $storestock->id;
				} else {

					$singlestock = array(
							"store_id"=>$storeid,
							"material_id"=>$value['materialid'],
							"quantity"=>$value['qty'],
							"created_by"=>$userid
						);

					$createstock = StoreStock::create($singlestock);
					$stockid = $createstock->id;
				}
				$singletransdata = array(
							"trans_id"=>$transid,
							"stock_id"=>$stockid,
							"material_id"=>$value['materialid'],
							"quantity"=>$value['qty'],
							"supplier_name"=>$value['suppliername'],
							"unit_rate"=>$value['unitrate'],
							"total_cost"=>$value['valueofgoods']
						);
				$createtransdata = StoreTransactionData::create($singletransdata);

				$out = 1;
			}
		} else {

			$out = 0;
		}

		return $out;

	}

	public function get_po_info() {

		$tkn=Request::header('JWT-AuthToken');
		$companydet=Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$pono = Request::input('pono');
		$explodepo = explode("/", $pono);
		$poid = $explodepo[0];

		$year = date("Y");

		$out['today'] = date('d-m-Y');

		$yearnext = $year+1;
		$finyear = $year."-".substr($yearnext, 2,2);

		$out = PurchaseOrder::where('po_no', '=', $pono)->with('users')->with('pomaterials.storematerial.inversestore')->with('pomaterials.fabmat.storemainuom.stmatuom')->with('pomaterials.storematerial.matuom.stmatuom')->with('pomaterials.fabmat.storemat')->with('pomaterials.storemainuom.stmatuom')->with('vendor')->with('project')->with('taxes')->with('specialterms')->get();

		if($out->count() > 0) {

			for($i=0; $i<count($out); $i++) {
				for($j=0;$j<count($out[$i]['pomaterials']); $j++) {
					$out[$i]['pomaterials'][$j]['storematerial']['id'];
					$alreadyreceived = StoreTransactionData::where("pomaterial_id", "=", $out[$i]['pomaterials'][$j]['storematerial']['id'])->sum('accepted_qty');

					$out[$i]['pomaterials'][$j]['alreadyreceived'] = $alreadyreceived;
					$out[$i]['pomaterials'][$j]['quantity'] = floatval($out[$i]['pomaterials'][$j]['quantity']);
					$out[$i]['pomaterials'][$j]['unit_rate'] = floatval($out[$i]['pomaterials'][$j]['unit_rate']);

				}
			}

			$out2 = Amendment::where("main_po_id", "=", $out[0]['id'])->where("amd_no", "=", $out[0]['amd_no'])->with("amenddetails.pomaterials.storematerial")->with("amenddetails.oldpomaterials.storematerial")->with("amenddetails.potaxes")->with("amenddetails.oldpotaxes")->with("amenddetails.poterms")->with("amenddetails.oldpoterms")->first();
			// if($out2) {

			// 	if($out2->)
			// }

			
			$out[0]['companydet'] = $companydet;
			$out[0]['finyear'] = $finyear;
			$out[0]['amds'] = $out2;
			return $out;
		} else {


			$out = OldPurchaseOrder::where('po_no', '=', $pono)->with('users')->with('pomaterials.storematerial')->with('vendor')->with('project')->with('taxes')->with('specialterms')->get();

			$out2 = Amendment::where("main_po_id", "=", $out[0]['poid'])->where("amd_no", "=", $out[0]['amd_no'])->with("amenddetails.pomaterials.storematerial")->with("amenddetails.oldpomaterials")->with("amenddetails.potaxes")->with("amenddetails.oldpotaxes")->with("amenddetails.poterms")->with("amenddetails.oldpoterms")->first();

			if($out->count() > 0) {

				$out[0]['companydet'] = $companydet;
				$out[0]['finyear'] = $finyear;
				$out[0]['amds'] = $out2;

				return $out;
			} else {

				return 0;
			}
		}
	}


	public function get_po_info_inspec() {

		$tkn=Request::header('JWT-AuthToken');
		$companydet=Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$pono = Request::input('pono');
		$explodepo = explode("/", $pono);
		$poid = $explodepo[0];

		$year = date("Y");

		$out['today'] = date('d-m-Y');

		$yearnext = $year+1;
		$finyear = $year."-".substr($yearnext, 2,2);

		$out = PurchaseOrder::where('po_no', '=', $pono)->with('pomaterials.storematerial')->with('inspections.inspectionmaterials.pomaterial.storematerial')->with('inspections.inspectiondocs')->with('inspections.inspectioncallraises')->with('inspections.inspectioncallraises.sender')->with('vendor')->with('project')->with('taxes')->first();

		if($out) {

			for($j=0;$j<count($out['pomaterials']); $j++) {
				$out['pomaterials'][$j]['storematerial']['id'];
				$alreadyreceived = StoreTransactionData::where("pomaterial_id", "=", $out['pomaterials'][$j]['storematerial']['id'])->sum('accepted_qty');

				$out['pomaterials'][$j]['alreadyreceived'] = $alreadyreceived;

			}

			
			$out['companydet'] = $companydet;
			$out['finyear'] = $finyear;
			return $out;
		} else {

			return 0;
		}
	}

	public function add_to_inventory_company() {

		$companydetails = Request::input('companydetails');
		$ponodetails = Request::input('ponodetails');

		$receipt_type = 2; //for company purchase

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		if(!isset($companydetails['lrno'])) {

			$companydetails['lrno'] = "";
		}
		if(!isset($companydetails['lrdate'])) {

			$companydetails['lrdate'] = "";
		}
		if(!isset($companydetails['waybillno'])) {

			$companydetails['waybillno'] = "";
		}
		if(!isset($companydetails['remarks'])) {

			$companydetails['remarks'] = "";
		}

		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					"invoice_no"=>$companydetails['invoiceno'],
					"invoice_date"=>$companydetails['invoicedate'],
					"dc_no"=>$companydetails['dcno'],
					"dc_date"=>$companydetails['dcdate'],
					"vehicle_no"=>$companydetails['vehicleno'],
					"total_accepted_amount"=>$companydetails['totalacceptedvalue'],
					"total_invoice_amount"=>$companydetails['totalinvoice'],
					"tax_amount"=>$companydetails['taxamount'],
					"frieght_charge"=>$companydetails['frieghtcharge'],
					"lr_no"=>$companydetails['lrno'],
					"lr_date"=>$companydetails['lrdate'],
					"way_bill_no"=>$companydetails['waybillno'],
					"remarks"=>$companydetails['remarks']

				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($ponodetails as $value) {

				$createtrans->pono = $value['id'];
				$createtrans->save();

				foreach ($value['pomaterials'] as $invalue) {
				
					$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $invalue['material_id'])->first();

					if($storestock) {

						$storestock->quantity = $storestock->quantity + $invalue['acceptedqty'];
						$storestock->save();
						$stockid = $storestock->id;
					} else {

						$singlestock = array(
								"store_id"=>$storeid,
								"material_id"=>$invalue['material_id'],
								"quantity"=>$invalue['acceptedqty'],
								"created_by"=>$userid
							);

						$createstock = StoreStock::create($singlestock);
						$stockid = $createstock->id;
					}
					$singletransdata = array(
								"trans_id"=>$transid,
								"stock_id"=>$stockid,
								"material_id"=>$invalue['material_id'],
								"pomaterial_id"=>$invalue['id'],
								"unit_rate"=>$invalue['unit_rate'],
								"dc_received_qty"=>$invalue['dcreceived'],
								"shortage_qty"=>$invalue['shortageqty'],
								"damaged_qty"=>$invalue['damagedqty'],
								"accepted_qty"=>$invalue['acceptedqty']
							);
					$createtransdata = StoreTransactionData::create($singletransdata);
				}

			}

			$out = $transid;

		} else {

			$out = 0;
		}
		return $out;
	}

	public function search_dc_no() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];

		// $dcnoexplode = explode("/",Request::input('dcno'));
		$dcno = Request::input('dcno');//$dcnoexplode[0];

		$out = StoreTransactions::where('dc_no','=',$dcno)->where('issue_type','=', 1)->with('transdata.storestock.material')->with('storename')->whereHas('endstore', function($query) use ($userid)
			{
			    $query->where('user_id', '=', $userid);
			})->get();
		if($out->count() > 0){

			// if($out[0]->status==1) {

			// 	$out = 1;
			// }

		} else {

			$out = 0;
		}

		return $out;

	}


	public function get_sub_contractors() {

		return $q1 = SubContractor::all();
	}


	public function accpt_matret() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$storeid = $userdata['users']['store']['id'];
		$receipt_type = 4;
		$type = 1;
		$mattype = Request::input('type');
		$subc = Request::input('sub');
		$thirdp = Request::input('thirdp');
		$mat = Request::input('mat');

		$store = Store::where('id','=',$storeid)->first();

		if($mattype=='subc')
		{
			$thirdp = '';
			$name = SubContractor::where('id','=',$subc)->first();
		}
		else
		{
			$subc = '';
			$name = ThirdParty::where('id','=',$thirdp)->first();
		}


		$q90 = MRN::where('store_id','=',$storeid)->orderBy('mrn_sno','desc')->first();
		if(count($q90)==0)
		{
			$count = 1;
		}
		else
		{
			$count = floatval($q90['mrn_sno']) + floatval(1);
		}


		$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					'type'=>$type,
					'third_party_id'=>$thirdp,
					'subcon_id' => $subc
				);

		$createtrans = StoreTransactions::create($singletrans);
		$transid = $createtrans->id;

		$mrn = array('mrn_sno' => $count,
					 'store_id' => $storeid,
					 'store_transaction_id' => $transid,
					  );
		$q99 = MRN::create($mrn);
		$mrnid = $q99->id;
		$mrndate = $q99->created_at;

		for ($i=0; $i < count($mat); $i++) { 
			# code...
			$storestock = StoreStock::where('store_id','=',$storeid)->where('material_id','=',$mat[$i]['materialid'])->first();
		
			if($storestock) {

				$storestock->quantity = $storestock->quantity + $mat[$i]['qty'];
				$storestock->damaged = $storestock->damaged + $mat[$i]['damagedqty'];
				$storestock->save();
				$stockid = $storestock->id;

			} else {

				$singlestock = array(
						"store_id"=>$storeid,
						"material_id"=>$mat[$i]['materialid'],
						"quantity"=>$mat[$i]['qty'],
						'damaged' => $mat[$i]['damagedqty'],
						"created_by"=>$userid
					);

				$createstock = StoreStock::create($singlestock);
				$stockid = $createstock->id;
			}

			$singletransdata = array(
						"trans_id"=>$transid,
						"stock_id"=>$stockid,
						"material_id"=>$mat[$i]['materialid'],
						"damaged_qty"=>$mat[$i]['damagedqty'],
						"accepted_qty"=>$mat[$i]['qty']
					);
			$createtransdata = StoreTransactionData::create($singletransdata);
		}

		return array('yes',$count,$mrndate,$name,$store);


	}



	public function add_to_inventory_anotherstore() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$remarks = Request::input('remarks');
		$vehicleno = Request::input('vehicleno');
		$dcnodetails = Request::input('dcnodetails');

		$receipt_type = 3;//from another store

		if(!isset($remarks)) {

			$remarks = "";
		}

		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					"vehicle_no"=>$vehicleno,
					"remarks"=>$remarks

				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($dcnodetails as $value) {

				$createtrans->trans_id = $value['id'];
				$createtrans->save();

				$thistrans = StoreTransactions::where('id', '=', $value['id'])->first();
				$thistrans->status = 1;
				$thistrans->save();

				foreach ($value['transdata'] as $invalue) {
				
					$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $invalue['storestock']['material']['id'])->first();

					$q1 = StoreTransactionData::where('id','=',$invalue['id'])->first();
					$nqt = floatval($q1['already_received']) + floatval($invalue['acceptedqty']);
					$q1 = StoreTransactionData::where('id','=',$invalue['id'])->update(array('already_received' => $nqt));

					if($storestock) {

						$storestock->quantity = $storestock->quantity + $invalue['acceptedqty'];
						$storestock->save();
						$stockid = $storestock->id;
					} else {

						$singlestock = array(
								"store_id"=>$storeid,
								"material_id"=>$invalue['material_id'],
								"quantity"=>$invalue['acceptedqty'],
								"created_by"=>$userid
							);

						$createstock = StoreStock::create($singlestock);
						$stockid = $createstock->id;
					}
					$singletransdata = array(
								"trans_id"=>$transid,
								"stock_id"=>$stockid,
								"material_id"=>$invalue['material_id'],
								"trans_data_id"=>$invalue['id'],
								"shortage_qty"=>$invalue['shortageqty'],
								"damaged_qty"=>$invalue['damagedqty'],
								"accepted_qty"=>$invalue['acceptedqty']
							);
					$createtransdata = StoreTransactionData::create($singletransdata);
				}
			}

			$out = $transid;

		} else {

			$out = 0;
		}

		return $out;

	}

	public function add_thirdparty() {

		$name = Request::input('name');
		$contact = Request::input('contact');
		$address = Request::input('contact');

		$singleparty = array(
				"name"=>$name,
				"contact"=>$contact,
				"address"=>$address
			);

		$createparty = ThirdParty::create($singleparty);
		if($createparty) {
			return 1;
		} else {
			return 0;
		}


	}

	public function add_subcontractor(){
		$con=Request::all();
		$sub=new SubContractor;
		$sub->name=$con['name'];
		$sub->contact=$con['contact'];
		$sub->address=$con['address'];
		$sub->save();
		return 1;
	}

	public function get_third_parties() {
		return ThirdParty::get();
	}

	public function get_subcontractors(){
		return SubContractor::get();
	}

	public function get_storelist(){
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];

		$id = Request::input('data');
		$q2 = Store::where('user_id','!=',$userid)->get();
		$q3 = SubContractor::get();
		$q4 = ThirdParty::get();
		return array($q2,$q3,$q4);
	}

	public function get_storemats(){
		$q1=MaterialCategory::get();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$store = Store::where('user_id','=',$userid)->first();
		$q2=StoreStock::where('store_id','=',$store->id)->with('material.category')->with('material.allmatuom.stmatuom')->get();
		return array($q1,$q2);
	}

	public function issuematerial(){
		$dat=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$store = Store::where('user_id','=',$userid)->first();
		$st=new StoreTransactions;
		$st->created_by=$userid;
		$st->store_id=$store->id;
		$st->type=2;
		if($dat['type']=='manager')
		{
			$st->issue_type=1;
			$st->end_store_id=$dat['store']['id'];
		}
		if($dat['type']=='subcontractor')
		{
			$st->issue_type=2;
			$st->subcon_id=$dat['subcon']['id'];
		}
		if($dat['type']=='thirdparty')
		{
			$st->issue_type=3;
			$st->third_party_id=$dat['tpty']['id'];
		}
		$st->dc_date=date('Y-m-d');
		if(Request::input('rems'))
		{
			$st->remarks=$dat['rems'];
		}
		$st->vehicle_no=$dat['transport']['vehno'];
		$st->transporter_name=$dat['transport']['tpname'];
		$st->driver_name=$dat['transport']['drvname'];
		$st1=StoreTransactions::where('type','=',2)->where('store_id','=',$store->id)->orderBy('dc_no','desc')->first();
		if($st1)
		{
			$x=explode('-', $st1->dc_no);
			$st->dc_no=$store->id.'-'.str_pad((intval($x[1])+1),6,'0',STR_PAD_LEFT);
		}
		else
		{
			$st->dc_no=$store->id.'-'.str_pad(1,6,'0',STR_PAD_LEFT);
		}
		$st->save();
		for($i=0;$i<count($dat['mats']);$i++)
		{
			$std=new StoreTransactionData;
			$std->trans_id=$st->id;
			$std->stock_id=$dat['mats'][$i]['stockid'];
			if($dat['issuetype'] == "new") {
				$std->quantity=$dat['mats'][$i]['qty'];
			} else {
				$std->old_quantity=$dat['mats'][$i]['qty'];
			}
			$std->material_id=$dat['mats'][$i]['materialid'];
			$std->save();
			$ss=StoreStock::where('id','=',$dat['mats'][$i]['stockid'])->first();
			if($dat['issuetype'] == "new") {
				$ss->quantity=$ss->quantity-$dat['mats'][$i]['qty'];
			} else {
				$ss->total_received=$ss->total_received-$dat['mats'][$i]['qty'];
			}
			$ss->save();
		}
		return StoreTransactions::where('id','=',$st->id)->with('transdata.matname')->with('storename')->with('subconname')->with('tptname')->with('userdata')->first();
	}

	public function get_manager_feeders() {

		$manager_id = Request::input('managerid');

		$sites=Site::where('survey_user','=',$manager_id)->with('workids.feederdata')->get();

		$workidarr = array();

		$feederarr = array();
		$j=0;
		for($i=0;$i<count($sites);$i++) {

			if(!in_array($sites[$i]['workids']['feederdata']['work_id'], $workidarr)) {

				$workidarr[] = $sites[$i]['workids']['feederdata']['work_id'];
				$feederarr[$j]['name'] = $sites[$i]['workids']['feederdata']['name'];
				$feederarr[$j]['id'] = $sites[$i]['workids']['feederdata']['id'];
				$j++;
			}
		}

		return json_encode($feederarr);
	}

	public function add_materialreturn_to_inventory() {

		$recptmatlist = Request::input('recptmaterialreturnlist');
		$subtype = Request::input('subtype');
		$vehicleno = Request::input('vehicleno');
		$remarks = Request::input('remarks');
		$totalscrapqty = Request::input('totalscrapqty');
		$totalscrapcost = Request::input('totalscrapcost');
		$totaldefectiveqty = Request::input('totaldefectiveqty');
		$totaldefectivecost = Request::input('totaldefectivecost');
		$totalusableqty = Request::input('totalusableqty');
		$totalusablecost = Request::input('totalusablecost');

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$receipt_type = $subtype;

		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					"vehicle_no"=>$vehicleno,
					"total_qty"=>$totalusableqty,
					"total_cost"=>$totalusablecost,
					"total_defective_qty"=>$totaldefectiveqty,
					"total_defective_cost"=>$totaldefectivecost,
					"total_scrap_qty"=>$totalscrapqty,
					"total_scrap_cost"=>$totalscrapcost,
					"remarks"=>$remarks
				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($recptmatlist as $value) {

				$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $value['materialid'])->first();

				if($storestock) {

					if($subtype == '5') {

						$storestock->scrap = $storestock->scrap + $value['qty'];
					} else if($subtype == '6') {

						$storestock->defective = $storestock->defective + $value['defectiveqty'];
						$storestock->quantity = $storestock->quantity + $value['usableqty'];
					}
					$storestock->save();
					$stockid = $storestock->id;
				} else {

					if($subtype == '5') {

						$singlestock = array(
							"store_id"=>$storeid,
							"material_id"=>$value['materialid'],
							"scrap"=>$value['qty'],
							"created_by"=>$userid
						);
					} else if($subtype == '6') {

						$singlestock = array(
							"store_id"=>$storeid,
							"material_id"=>$value['materialid'],
							"quantity"=>$value['usableqty'],
							"defective"=>$value['defectiveqty'],
							"created_by"=>$userid
						);
					}

					$createstock = StoreStock::create($singlestock);
					$stockid = $createstock->id;
				}

				if(!isset($value['usablevalueofgoods'])) {

					$value['usablevalueofgoods'] = 0;
				}
				if(!isset($value['usableqty'])) {

					$value['usableqty'] = 0;
				}
				if(!isset($value['defectiveqty'])) {

					$value['defectiveqty'] = 0;
				}
				if(!isset($value['defectivevalueofgoods'])) {

					$value['defectivevalueofgoods'] = 0;
				}
				if(!isset($value['qty'])) {

					$value['qty'] = 0;
				}
				if(!isset($value['valueofgoods'])) {

					$value['valueofgoods'] = 0;
				}
				

				$singletransdata = array(
							"trans_id"=>$transid,
							"stock_id"=>$stockid,
							"material_id"=>$value['materialid'],
							"usable_qty"=>$value['usableqty'],
							"usable_cost"=>$value['usablevalueofgoods'],
							"defective_qty"=>$value['defectiveqty'],
							"defective_cost"=>$value['defectivevalueofgoods'],
							"scrap_qty"=>$value['qty'],
							"scrap_cost"=>$value['valueofgoods'],
							"manager_id"=>$value['managerid'],
							"feeder_id"=>$value['feederid']
						);
				$createtransdata = StoreTransactionData::create($singletransdata);

			}

			$out = $transid;

		} else {

			$out = 0;
		}
		return $out;


	}

	public function get_inhouse_vendor() {

		return Vendor::where('inhouse', '=', 1)->get();
	}

	public function add_inhousematerial_to_inventory() {

		$recptmatlist = Request::input('recptinhousemateriallist');
		$vehicleno = Request::input('vehicleno');
		$dcno = Request::input('dcno');
		$dcdate = Request::input('dcdate');
		$remarks = Request::input('remarks');
		$totalqty = Request::input('totalqty');
		$totalcost = Request::input('totalcost');

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$receipt_type = 4; // for inhouse receipt

		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					"vehicle_no"=>$vehicleno,
					"total_qty"=>$totalqty,
					"total_cost"=>$totalcost,
					"dc_no"=>$dcno,
					"dc_date"=>$dcdate,
					"remarks"=>$remarks
				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($recptmatlist as $value) {

				$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $value['materialid'])->first();

				if($storestock) {

					$storestock->quantity = $storestock->quantity + $value['qty'];
					$storestock->save();
					$stockid = $storestock->id;
				} else {

					
					$singlestock = array(
						"store_id"=>$storeid,
						"material_id"=>$value['materialid'],
						"quantity"=>$value['qty'],
						"created_by"=>$userid
					);
					
					$createstock = StoreStock::create($singlestock);
					$stockid = $createstock->id;
				}

				$singletransdata = array(
							"trans_id"=>$transid,
							"stock_id"=>$stockid,
							"material_id"=>$value['materialid'],
							"quantity"=>$value['qty'],
							"total_cost"=>$value['valueofgoods'],
							"vendor_id"=>$value['inhousevendorid']
							
						);
				$createtransdata = StoreTransactionData::create($singletransdata);

			}

			$out = $transid;

		} else {

			$out = 0;
		}
		return $out;
	}

	public function add_thirdpartymaterial_to_inventory() {

		$recptmatlist = Request::input('recptthirdpartymateriallist');
		$vehicleno = Request::input('vehicleno');
		$dcno = Request::input('dcno');
		$dcdate = Request::input('dcdate');
		$remarks = Request::input('remarks');
		$totalqty = Request::input('totalqty');
		$totalcost = Request::input('totalcost');
		$thirdparty = Request::input('thirdparty');

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$userid = $userdata['users']['id'];
		$receipt_type = 7; // for third party receipt

		if($userdata['users']['store']['id']) {

			$storeid = $userdata['users']['store']['id'];

			$singletrans = array(
					"created_by"=>$userdata['users']['id'],
					"store_id"=>$storeid,
					"receipt_type"=>$receipt_type,
					"vehicle_no"=>$vehicleno,
					"total_qty"=>$totalqty,
					"total_cost"=>$totalcost,
					"dc_no"=>$dcno,
					"dc_date"=>$dcdate,
					"third_party_id"=>$thirdparty,
					"remarks"=>$remarks
				);

			$createtrans = StoreTransactions::create($singletrans);

			$transid = $createtrans->id;

			foreach ($recptmatlist as $value) {

				$storestock = StoreStock::where('store_id', '=', $storeid)->where('material_id', '=', $value['materialid'])->first();

				if($storestock) {

					$storestock->quantity = $storestock->quantity + $value['qty'];
					$storestock->save();
					$stockid = $storestock->id;
				} else {

					
					$singlestock = array(
						"store_id"=>$storeid,
						"material_id"=>$value['materialid'],
						"quantity"=>$value['qty'],
						"created_by"=>$userid
					);
					
					$createstock = StoreStock::create($singlestock);
					$stockid = $createstock->id;
				}

				$singletransdata = array(
							"trans_id"=>$transid,
							"stock_id"=>$stockid,
							"material_id"=>$value['materialid'],
							"quantity"=>$value['qty'],
							"total_cost"=>$value['valueofgoods']
							
						);
				$createtransdata = StoreTransactionData::create($singletransdata);

			}

			$out = $transid;

		} else {

			$out = 0;
		}
		return $out;


	}

	public function inventoryrevision() {

		$inventorydata = Request::input('inventorydata');

		foreach ($inventorydata as $inv) {
			
			foreach ($inv['submaterials'] as $invalue) {
				
				
				if(!isset($invalue['stocks'][0]['remarks'])) {

					$remarks = "";
				} else {

					$remarks = $invalue['stocks'][0]['remarks'];
				}
				$phinv = $invalue['stocks'][0]['physical_qty'];
				$id = $invalue['stocks'][0]['id'];

				$stocks = StoreStock::where('id', '=', $id)->first();
				$stocks->physical_qty = $phinv;
				$stocks->remarks = $remarks;
				$stocks->save();
			}
		}

		return 1;
	}

	public function get_all_store() {

		return $stores = Store::get();
	}

	public function get_stock_inv__report() {

		$materialid = Request::input('materialid');
		$storeid = Request::input('storeid');

		if($storeid == 'all') {

			$stockmat = MaterialCategory::where('id', '=', $materialid)->with('submaterials.stocks.store')->get();
		} else {

			$stockmat = MaterialCategory::where('id', '=', $materialid)->with('submaterials.stocks.store')->whereHas('submaterials.stocks', function($query) use ($storeid)
			{
			    $query->where('store_id', '=', $storeid);
			})->get();
		}

		return $stockmat;
	}

	public function get_stock_rev__report() {

		$storeid = Request::input('storeid');

		

		$stockmat = MaterialCategory::with('submaterials.stocks.store')->whereHas('submaterials.stocks', function($query) use ($storeid)
		{
		    $query->where('store_id', '=', $storeid);
		})->get();

		return $stockmat;
	}

	public function shiftphysicaltoquantity() {

		$inventorydata = Request::input('inventorydata');
				
		if(!isset($inventorydata['stocks'][0]['central_store_remarks'])) {

			$central_store_remarks = "";
		} else {

			$central_store_remarks = $inventorydata['stocks'][0]['central_store_remarks'];
		}
		$phinv = $inventorydata['stocks'][0]['physical_qty'];
		$id = $inventorydata['stocks'][0]['id'];

		$stocks = StoreStock::where('id', '=', $id)->first();
		$stocks->quantity = $phinv;
		$stocks->central_store_remarks = $central_store_remarks;
		$stocks->save();
		
		return 1;

	}

	public function get_uoms() {

		return $uomlist = Uom::get();
	}

	public function add_aggregator() {

		$agmateriallist = Request::input("agmateriallist");
		$aggregatormatid = Request::input("aggregatormatid");

		$checkmat = StoreMaterial::where("id", "=", $aggregatormatid)->first();

		if($checkmat) {
			StoreMaterialsLevel1::where("store_aggregator_id", "=", $aggregatormatid)->delete();
			$checkmat->parent_id = $aggregatormatid;
			$checkmat->save();

			$tkn=Request::header('JWT-AuthToken');
			$userdata=Session::where('refreshtoken','=',$tkn)->with('users')->first();

			foreach ($agmateriallist as $agmat) {

				StoreMaterial::where("id", "=", $agmat['matid'])->update(array("parent_id"=>$aggregatormatid));
			
				$singlematlevel1= array(

						"store_aggregator_id"=>$aggregatormatid,
						"store_material_id"=>$agmat['matid'],
						"qty"=>$agmat['qty'],
						"store_material_uom_id"=>$agmat['uomid']
					);
				$creatematlevel1 = StoreMaterialsLevel1::create($singlematlevel1);
			}
			
			$out = 1;
		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_aggregate_materials() {

		return MaterialCategory::whereHas('submaterials', function($query)
			{
			    $query->where('type', '=', 2);
			})->with(array('submaterials'=>function($q){
	        	$q->where('type', '=', 2)->with("level1mat");
	    	}))->get();
	}

	// public function add_fabrication() {

	// 	$agmateriallist = Request::input("agmateriallist");
	// 	$projectids = Request::input("projectids");
	// 	$materialname = Request::input("materialname");
	// 	$materialuom = Request::input("materialuom");
	// 	$dwgno = Request::input("dwgno");

	// 	$checkmat = MaterialCategory::where("name", "=", $materialname)->first();

	// 	if(!$checkmat) {
	// 		$singlematcat = array(

	// 				"name"=>$materialname,
	// 				"units"=>$materialuom,
	// 				"dwgno"=>$dwgno,
	// 				"aggregator"=>2
	// 			);

	// 		$creatematcat = MaterialCategory::create($singlematcat);

	// 		foreach ($projectids as $pid) {
				
	// 			$singleagproj = array("material_category_id"=>$creatematcat->id, "project_id"=>$pid);
	// 			$createagproj = AggregatorProjects::create($singleagproj);
	// 		}

	// 		foreach ($agmateriallist as $agmat) {
	// 			if(!isset($agmat['wtkm'])) {

	// 				$agmat['wtkm'] = "";
	// 			}
	// 			if(!isset($agmat['qtykm'])) {

	// 				$agmat['qtykm'] = "";
	// 			}
	// 			if(!isset($agmat['wtpc'])) {

	// 				$agmat['wtpc'] = "";
	// 			}
	// 			if(!isset($agmat['wtkgmm'])) {

	// 				$agmat['wtkgmm'] = "";
	// 			}
	// 			if(!isset($agmat['dwglength'])) {

	// 				$agmat['dwglength'] = "";
	// 			}
	// 			if(!isset($agmat['msmaterial'])) {

	// 				$agmat['msmaterial'] = "";
	// 			}
	// 			if(!isset($agmat['dwgcode'])) {

	// 				$agmat['dwgcode'] = "";
	// 			}
	// 			if(!isset($agmat['nutqty'])) {

	// 				$agmat['nutqty'] = "";
	// 			}
	// 			if($agmat['fabricationtype'] == "gi") {

	// 				$fabtype = 1;
	// 			} else {

	// 				$fabtype = 2;
	// 			}
				
	// 			$singleboqbom = array(

	// 					"material_category_id"=>$creatematcat->id,
	// 					"store_material_id"=>$agmat['matid'],
	// 					"dwg_code"=>$agmat['dwgcode'],
	// 					"ms_material"=>$agmat['msmaterial'],
	// 					"length_asper_dwg"=>$agmat['dwglength'],
	// 					"wtperkg_msmat_mm"=>$agmat['wtkgmm'],
	// 					"wt_per_pc"=>$agmat['wtpc'],
	// 					"qty_per_km"=>$agmat['qtykm'],
	// 					"wt_per_km"=>$agmat['wtkm'],
	// 					"gi_nutbolt"=>$fabtype,
	// 					"qty"=>$agmat['nutqty']
	// 				);
	// 			$createboqbom = BoqBomMapping::create($singleboqbom);
	// 		}
	// 		$out = 1;
	// 	} else {

	// 		$out = 0;
	// 	}

	// 	return $out;
	// }

	public function add_fabrication() {

		$agmateriallist = Request::input("agmateriallist");
		$dwgno = Request::input("dwgno");
		$dwgdocs = Request::input("dwgdocs");
		$fabricationmatid = Request::input("fabricationmatid");

		$checkmat = StoreMaterial::where("id", "=", $fabricationmatid)->first();

		if($checkmat) {

			$checkmat->parent_id = $fabricationmatid;
			$checkmat->save();

			$tkn=Request::header('JWT-AuthToken');
			$userdata=Session::where('refreshtoken','=',$tkn)->with('users')->first();

				foreach ($dwgdocs as $ddocs) {
				
					$singledwgdoc = array("store_material_id"=>$fabricationmatid, "doc_name"=>$ddocs['doc_name'], "doc_url"=>$ddocs['doc_url']);
					$createdwgdoc = StoreMaterialDocs::create($singledwgdoc);
				}

				foreach ($agmateriallist as $agmat) {

					if(!isset($agmat['wtpole'])) {

						$agmat['wtpole'] = "";
					}
					if(!isset($agmat['qtypole'])) {

						$agmat['qtypole'] = "";
					}
					if(!isset($agmat['wtkm'])) {

						$agmat['wtkm'] = "";
					}
					if(!isset($agmat['qtykm'])) {

						$agmat['qtykm'] = "";
					}
					if(!isset($agmat['wtpc'])) {

						$agmat['wtpc'] = "";
					}
					if(!isset($agmat['dwglength'])) {

						$agmat['dwglength'] = "";
					}
					if(!isset($agmat['msmaterial'])) {

						$agmat['msmaterial'] = "";
					}
					if(!isset($agmat['dwgcode'])) {

						$agmat['dwgcode'] = "";
					}
					if(!isset($agmat['nutqty'])) {

						$agmat['nutqty'] = "";
					}

					StoreMaterial::where("id", "=", $agmat['matid'])->update(array("parent_id"=>$fabricationmatid));
					$level1matcheck = StoreMaterialsLevel1::where("store_aggregator_id", "=", $fabricationmatid)->where("store_material_id", "=", $agmat['matid'])->where("ms_material_id", "=", $agmat['msmaterial'])->where("length_asper_dwg", "=", $agmat['dwglength'])->where("wt_per_pc", "=", $agmat['wtpc'])->where("qty_per_pole", "=", $agmat['qtypole'])->where("qty_per_km", "=", $agmat['qtykm'])->first();

					if(!$level1matcheck) {

						$singlematlevel1= array(

							"store_aggregator_id"=>$fabricationmatid,
							"store_material_id"=>$agmat['matid'],
							"dwg_code"=>$agmat['dwgcode'],
							"ms_material_id"=>$agmat['msmaterial'],
							"length_asper_dwg"=>$agmat['dwglength'],
							"wt_per_pc"=>$agmat['wtpc'],
							"qty_per_pole"=>$agmat['qtypole'],
							"wt_per_pole"=>$agmat['wtpole'],
							"qty_per_km"=>$agmat['qtykm'],
							"wt_per_km"=>$agmat['wtkm'],
							"gi_nutbolt"=>$agmat['fabricationtype'],
							"qty"=>$agmat['nutqty'],
							"store_material_uom_id"=>$agmat['uomid']
						);
						$creatematlevel1 = StoreMaterialsLevel1::create($singlematlevel1);
				
						
					}
					
				}

			$out = 1;

		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_fabrication_materials() {

		return MaterialCategory::whereHas('submaterials', function($query)
			{
			    $query->where('type', '=', 3);
			})->with(array('submaterials'=>function($q){
	        	$q->where('type', '=', 3)->with("level1mat.msmat");
	    	}))->get();
	}

	public function get_ms_materials() {

		return MsMaterial::get();
	}

	public function add_ms_material() {

		$msmaterialname = Request::input("msmaterialname");
		$wtpermtr = Request::input("wtpermtr");

		$checkmsmat= MsMaterial::where("name", "=", $msmaterialname)->first();
		if($checkmsmat) {

			return 0;
		} else {

			MsMaterial::create(array("name"=>$msmaterialname, "wt_per_mtr"=>$wtpermtr));
			return 1;
		}
	}

	public function get_aggregator_mat() {

		$aggmatid = Request::input("aggmatid");

		return StoreMaterial::where("id", "=", $aggmatid)->with("level1mat.msmat")->with("level1mat.storematerial")->with("level1mat.storeuom.stmatuom")->first();
	}

	public function addstocks() {

		$mattracklist = Request::input("mattracklist");
		$projdet = Request::input("projdet");
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];

		foreach ($mattracklist as $inmat) {
			$storest = StoreStock::where("store_id", "=", $storeid)->where("material_id", "=", $inmat['id'])->first();

			if($storest) {

				$storest->quantity = $inmat['total_stock'];
				$storest->opening = $inmat['total_stock'];
				$storest->total_received = $inmat['total_received'];
				$storest->total_issued = $inmat['total_issued'];
				$storest->save();
			} else {

				$singlestorestock = array(
					"store_id"=>$storeid,
					"material_id"=>$inmat['id'],
					"total_received"=>$inmat['total_received'],
					"total_issued"=>$inmat['total_issued'],
					"created_by"=>$userdata['users']['id'],
					"quantity"=>$inmat['total_stock'],
					"opening"=>$inmat['total_stock']
					);

				StoreStock::create($singlestorestock);
			}
		}
		Projects::where("id", "=", $projdet['id'])->update(array("stock_date"=>$projdet['stock_date']));
		
		return 1;
	}

	public function addfabstocks() {

		$mattracklist = Request::input("mattracklist");
		$projdet = Request::input("projdet");
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];

		foreach ($mattracklist as $inmat) {
			$storest = StoreStock::where("store_id", "=", $storeid)->where("material_level1_id", "=", $inmat['id'])->where("material_id", "=", $inmat['store_material_id'])->where("fab_flag", "=", 1)->first();

			if($storest) {

				$storest->quantity = $inmat['total_stock'];
				$storest->opening = $inmat['total_stock'];
				$storest->total_received = $inmat['total_received'];
				$storest->total_issued = $inmat['total_issued'];
				$storest->save();
			} else {

				$singlestorestock = array(
					"store_id"=>$storeid,
					"material_id"=>$inmat['store_material_id'],
					"material_level1_id"=>$inmat['id'],
					"total_received"=>$inmat['total_received'],
					"total_issued"=>$inmat['total_issued'],
					"created_by"=>$userdata['users']['id'],
					"quantity"=>$inmat['total_stock'],
					"opening"=>$inmat['total_stock'],
					"fab_flag"=>1
					);

				StoreStock::create($singlestorestock);
			}
		}
		Projects::where("id", "=", $projdet['id'])->update(array("stock_date"=>$projdet['stock_date']));
		
		return 1;
	}
	
}
