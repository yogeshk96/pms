<?php namespace App\Http\Controllers;

use Request;
use Response;
use Carbon\Carbon;
use App\User;
use App\StoreMaterial;
use App\UserRoles;
use App\Session;
use App\DocumentTypes;
use App\Projects;
use App\SubProjects;
use App\ProjectDocuments;
use App\Work;
use App\WorkDivision;
use App\WorkId;
use App\BoqMaterial;
use App\Schedule;
use App\SubSchedule;
use App\Site;
use App\Taxes;
use App\Uom;
use App\Store;
use App\StoreProjects;
use App\Office;
use App\MaterialCategory;
use App\SiteItems;
use App\SiteItemDetails;
use App\SiteItemDescr;
use App\SubScheduleMaterials;
use App\SubScheduleProjectQty;
use App\ScheduleProjectQty;
use App\PurchaseOrder;
use App\PurchaseOrderMaterial;
use App\Indent;
use App\Indenttotal;
use App\IndentMaterial;
use App\ScheduleIndents;
use App\SubScheduleIndents;
use App\SubScheduleIndentEditReason;
use App\ScheduleProjectIndent;
use App\SubScheduleProjectIndent;
use App\SubScheduleMaterialActivityGroup;
use App\SubScheduleProjectMaterialQty;
use App\ActivityGroup;
use App\ActivityGroupMaterial;
use App\ActivityGroupSubMaterial;
use App\StoreMaterialUom;
use sendMail;
use DB;
use App\StoreStock;

class AdminController extends Controller {

	public function get_uom_list(){
		return Uom::all();
	}
	
	public function edit_uom(){
		$data=Request::all();
		$tx=Uom::where('id','=',$data['id'])->first();
		$tx->uom=$data['uom'];
		$tx->save();
		return 'UOM modified.';
	}

	public function add_uom(){
		$data=Request::all();
		$tx=new Uom;
		$tx->uom=$data['uom'];
		$tx->save();
		return 'UOM added.';
	}

	public function get_tax_list(){
		return Taxes::all();
	}


	public function edit_tax(){
		$data=Request::all();
		$tx=Taxes::where('id','=',$data['id'])->first();
		$tx->tax=$data['tax'];
		$tx->percentage=$data['percentage'];
		$tx->type=$data['type'];
		$tx->save();
		return 'Tax/Discount modified.';
	}

	public function add_tax(){
		$data=Request::all();
		$tx=new Taxes;
		$tx->tax=$data['name'];
		$tx->percentage=$data['percent'];
		$tx->type=$data['type'];
		$tx->save();
		return 'Tax/Discount added.';
	}

	public function create_store(){
		$data=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$managercount=Store::where('user_id','=',$data['manager'])->count();
		if($managercount==0)
		{
			$str=new Store;
			$str->name=$data['name'];
			$str->location=$data['address'];
			$str->company_id=$adminuser->users->company_id;
			$str->user_id=$data['manager'];
			$str->office_id=$data['office'];
			$str->project_id=$data['project'];
			$str->created_by=$adminuser->users->id;
			$str->save();
			return array('Success','Store has been created.');
		}
		else
		{
			return array('Error','This manager already has a store assigned to him.');
		}
	}

	public function get_store_managers(){
		return User::where('role','=',5)->select('id','office_id','name')->get();
	}


	public function get_user_roles()
	{
		return UserRoles::orderBy('role')->get();
	}

	public function get_project_heads(){
		return User::where('role','=',2)->select('id','office_id','name')->get();
	}

	public function get_user_list(){
		$ofc=Request::input('officetype');
		$role=Request::input('usertype');
		return User::where('role','=',$role)->where('office_id','=',$ofc)->select('id','email','designation','name','phoneno','address')->get();
	}

	public function edit_user(){
		$user=Request::all();
		$muser=User::where('id','=',$user['id'])->first();
		$muser->name=$user['name'];
		$muser->phoneno=$user['phoneno'];
		$muser->address=$user['address'];
		$muser->email=$user['email'];
		$muser->designation=$user['designation'];
		$muser->save();
		return User::where('role','=',$muser->role)->where('office_id','=',$muser->office_id)->select('id','email','designation','name','phoneno','address')->get();	
	}

	public function create_user(){
		$user=Request::all();
		$usercount=User::where('username','=',$user['username'])->count();
		$out=array();
		if($usercount=='0')
		{
			$tkn=Request::header('JWT-AuthToken');
			$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
			$newuser=new User;
			$newuser->username=$user['username'];
			$newuser->email=$user['email'];
			$newuser->password=hash("sha256",$user['username'].'123456ssepms');
			$newuser->designation=$user['designation'];
			$newuser->name=$user['name'];
			$newuser->phoneno=$user['phone'];
			$newuser->address=$user['address'];
			$newuser->role=$user['role'];
			$newuser->company_id=$adminuser->users->company_id;
			$newuser->office_id=$user['office'];
			$newuser->save();
			$out=array('success','User created with Username:"'.$user['username'].'" and password "123456"');
		}
		else
		{
			$out=array('error','Username already exists.');
		}
		return $out;
	}

	public function create_office(){
		$office=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$newoffice=new Office;
		$newoffice->name=$office['name'];
		$newoffice->address=$office['address'];
		$newoffice->company_id=$adminuser->users->company_id;
		$newoffice->save();
		$out=array('success','New Office created.');
		return $out;
	}

	public function get_offices(){
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		return Office::where('company_id','=',$adminuser->users->company_id)->get();
	}

	public function create_project(){
		$projectdets=Request::input('projectdets');
		$docdets=Request::input('docdets');
		$projcount=Projects::where('projectcode','=',$projectdets['code'])->count();
		$ptype=Request::input('projecttype');
		if($projcount=='0')
		{
			$tkn=Request::header('JWT-AuthToken');
			$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
			$newproj=new Projects;
			$newproj->company_id=$adminuser->users->company_id;
			$newproj->office_id=$projectdets['office'];
			$newproj->created_by=$adminuser->users->id;
			$newproj->user_id=$projectdets['head'];
			$newproj->name=$projectdets['name'];
			$newproj->descr=$projectdets['descr'];
			$newproj->loano=$projectdets['loano'];
			$newproj->client=$projectdets['client'];
			$newproj->cost=$projectdets['cost'];
			$newproj->projectcode=$projectdets['code'];
			$newproj->projecttype=strtoupper($ptype);
			$newproj->save();
			$pjid=$newproj->id;
			for($i=0;$i<count($docdets);$i++)
			{
				$doc=new ProjectDocuments;
				$doc->doctype=$docdets[$i]['docid'];
				$doc->docpath=$docdets[$i]['docpath'];
				$doc->project_id=$pjid;
				$doc->save();
			}
			$out=array('success','Project created with code '.$projectdets['code'],$pjid);
		}
		else
		{
			$out=array('error','This project code already exists');
		}
		return $out;
	}

	public function get_doc_types(){
		$type=Request::input('type');
		return DocumentTypes::where('doctype','=',$type)->get();
	}

	public function get_project_info(){
		$pid=Request::input('project');
		return Projects::where('id','=',$pid)->first();
	}

	public function add_ss_feeder(){
		$project=Request::input('project');
		$data=Request::input('dat');
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$sproject=Projects::where('id','=',$project['id'])->first();
		$sproject->status=1;
		$sproject->save();
		$work=new Work;
		$work->project_id=$project['id'];
		$work->tires=5;
		$work->code=$project['projectcode'];
		$work->created_by=$adminuser->users->id;
		$work->assigned_to=$adminuser->users->id;
		$work->save();
		for($i=0;$i<count($data);$i++)
		{
			$wd=new WorkDivision;
			$wd->work_id=$work->id;
			$wd->assigned_to=$adminuser->users->id;
			$wd->assigned_by=$adminuser->users->id;
			$wd->tire=3;
			$wd->type=$i+1;
			$wd->name=$data[$i]['ssname'];
			$wd->save();
			for($j=0;$j<count($data[$i]['feederdat']);$j++)
			{
				$wda=new WorkDivision;
				$wda->work_id=$work->id;
				$wda->assigned_to=$adminuser->users->id;
				$wda->assigned_by=$adminuser->users->id;
				$wda->tire=4;
				$wda->type=$j+1;
				$wda->name=$data[$i]['feederdat'][$j]['feedername'];
				$wda->backlink=$wd->id;
				$wda->save();
				for($k=1;$k<=intval($data[$i]['feederdat'][$j]['mdtrno']);$k++)
				{
					$wi=new WorkId;
					$wi->work_id=$wda->id;
					$wi->code=str_pad($k,4,'0',STR_PAD_LEFT);
					$wi->save();
				}
			}
		}
		return array('success','Feeders and Substations added');
	}

	public function get_boq_mats(){
		$pid=Request::input('project');
		return MaterialCategory::with('submaterials')->get();
	}

	public function add_sch(){
		$data=Request::input('data');
		$project=Request::input('project');
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$sproject=Projects::where('id','=',$project)->first();
		$sproject->status=2;
		$sproject->save();
		for($i=0;$i<count($data);$i++)
		{
			$sch=new Schedule;
			$sch->name=$data[$i]['name'];
			$sch->created_by=$adminuser->users->id;
			$sch->project_id=$project;
			$sch->save();
			for($j=0;$j<count($data[$i]['subschedule']);$j++)
			{
				$sub=new SubSchedule;
				$sub->no=$data[$i]['subschedule'][$j]['no'];
				$sub->descr=$data[$i]['subschedule'][$j]['descr'];
				$sub->material_id=$data[$i]['subschedule'][$j]['boqmat']['id'];
				$sub->unit_rate=$data[$i]['subschedule'][$j]['unitrate'];
				$sub->qty=$data[$i]['subschedule'][$j]['qty'];
				$sub->erect_rate=$data[$i]['subschedule'][$j]['erectrate'];
				$sub->total_rate=($data[$i]['subschedule'][$j]['qty']*$data[$i]['subschedule'][$j]['unitrate'])+($data[$i]['subschedule'][$j]['qty']*$data[$i]['subschedule'][$j]['erectrate']);
				$sub->schedule_id=$sch->id;
				$sub->save();
			}
		}
		return array('success','Schedules successfully created');
	}

	public function get_project_schedules(){
		$projectid=Request::input('project');
		return SubSchedule::whereHas('mainschedule',function($query) use ($projectid){
			$query->where('project_id','=',$projectid);
		})->get();
	}

	public function create_survey_items(){
		$project=Request::input('project');
		$items=Request::input('items');
		$sproject=Projects::where('id','=',$project)->first();
		$sproject->status=3;
		$sproject->save();
		for($i=0;$i<count($items);$i++)
		{
			$item=new SiteItems;
			$item->name=$items[$i]['name'];
			$item->icon=$items[$i]['icon'];
			$item->itemtype=1;
			$item->save();
			for($j=0;$j<count($items[$i]['slist']);$j++)
			{
				if($items[$i]['slist'][$j]['applicable']=='1')
				{
					$sid=new SiteItemDetails;
					$sid->item_id=$item->id;
					$sid->schedule_id=$items[$i]['slist'][$j]['id'];
					$sid->data=$items[$i]['slist'][$j]['question'];
					$sid->datatype=$items[$i]['slist'][$j]['datatype'];
					$sid->type=$items[$i]['slist'][$j]['type'];
					$sid->save();
					if($items[$i]['slist'][$j]['type']=='0')
					{
						$sdescr=new SiteItemDescr;
						$sdescr->itemdata_id=$sid->id;
						$sdescr->response='Yes';
						$sdescr->save();
						$sdescr1=new SiteItemDescr;
						$sdescr1->itemdata_id=$sid->id;
						$sdescr1->response='No';
						$sdescr1->save();
					}
					else
					{
						if($items[$i]['slist'][$j]['datatype']=='0')
						{
							foreach (range(floatval($items[$i]['slist'][$j]['min']),floatval($items[$i]['slist'][$j]['max']),floatval($items[$i]['slist'][$j]['step'])) as $number) {
								$sdescr=new SiteItemDescr;
								$sdescr->itemdata_id=$sid->id;
								$sdescr->response=$number;
								$sdescr->save();
							}
						}
					}
				}
			}
		}
		return 'Survey Items Created.';
	}

	// public function get_project_list(){
	// 	$tkn=Request::header('JWT-AuthToken');
	// 	$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
	// 	$company_id=$adminuser->users->company_id;
	// 	return Projects::where('company_id','=',$company_id)->get();
	// }

	
	public function get_project_managers_list(){
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$company_id=$adminuser->users->company_id;
		return User::where('company_id','=',$company_id)->where('role','=',3)->get();
	}

	public function get_feeder_list(){
		$project=Request::input('project');
		return Work::where('project_id','=',$project)->with('feeders')->get();
	}

	public function get_workid_list(){
		$feeder=Request::input('feeder');
		return Workid::where('work_id','=',$feeder)->with('feederdata')->with('feederdata.ssdata')->with('feederdata.workdata')->with('sitedata')->get();
	}

	public function save_workids(){
		$data=Request::input('data');
		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		for($i=0;$i<count($data);$i++)
		{
			$workid=Workid::where('id','=',$data[$i]['id'])->first();
			$workid->name=$data[$i]['name'];
			$workid->save();
			$site=Site::where('work_id','=',$workid->id)->orderBy('id','desc')->first();
			if($site)
			{
				if($site->user_id!=$data[$i]['sitedata']['user_id'])
				{
					$site=new Site;
					$site->work_id=$workid->id;
					$site->user_id=$data[$i]['sitedata']['user_id'];
					$site->survey_user=$data[$i]['sitedata']['user_id'];
					$site->save();
				}
			}
			else
			{
				$site=new Site;
				$site->work_id=$workid->id;
				$site->user_id=$data[$i]['sitedata']['user_id'];
				$site->survey_user=$data[$i]['sitedata']['user_id'];
				$site->save();
			}
		}
		return array('success','Project Manager Assigned');
	}

	public function send_generalmail(sendMail $sendm) {

		$to = Request::input("to");
		$subject = "Password reset - PD portal";
		$userid = Request::input("userid");
		$flag = Request::input("flag");

		$rand = Request::input("rand");

		if($flag == 1) {

			$message = "Hello sir/madam,<br>
						Your new password for userid ".$userid." in PD portal is: ".$rand."<br>
						Please login and change this password from the 'Change password' option in the menu.";
		}
		else {

			$message = "Hello sir/madam,<br>
				A password reset request came from userid ".$userid." in PD portal.
				";

				$to = "prad.ads1990@gmail.com";
		}

		$x = $sendm->sendEmail($to,$subject, $message);
		if($x == 1) {

			return 3;
		} else {

			return 4;
		}
	}

	public function get_boq_file_data() {

		$filename = Request::input("filename");
		$projectid = Request::input("projectid");

		$fp=fopen('uploads/boqdocs/'.$filename,'r');
		$i=-1;
		$out = array();

		$upper = '\b[A-Z]+[0-9]+\b';

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();

		while($data=fgetcsv($fp)){
			
			 if(preg_match('/[A-Z]/', $data[0]) || stripos($data[0], "PART") !== false){    

			    $i++;
			    $j=0;
			    
			    if(trim($data[0]) != "" && trim($data[1]) != "") {
			    	$out[$i]['srno'] = trim($data[0]);
				    $out[$i]['desc'] = trim($data[1]);
				    $out[$i]['uom'] = trim($data[2]);
				    $out[$i]['unit_qty'] = trim($data[3]);
				    $x = 1;
				    $y = 4;
				    $h=0;
				    foreach ($projinfo->subprojects as $subpro) {

				    	foreach ($subpro->multiplier as $subpromulti) {

						    $out[$i]['qty'][$h]['indiqty'] = trim($data[$y]);
						    $y++;
						    $x++;
						    $h++;
						}
					}
					$totnum = $y;
				    $out[$i]['tot_qty'] = trim($data[$totnum]);
				}
			    
			 } else {

			 	if(trim($data[0]) != "" && trim($data[1]) != "") {

					$stomat = StoreMaterial::where("name", "=", trim($data[1]))->first();

					$data[1] = mb_convert_encoding($data[1], 'UTF-8', 'UTF-8');
					$data[2] = mb_convert_encoding($data[2], 'UTF-8', 'UTF-8');
					$data[3] = mb_convert_encoding($data[3], 'UTF-8', 'UTF-8');

					$out[$i]['sub'][$j]['srno'] = $out[$i]['srno'].trim($data[0]);

					
				    $out[$i]['sub'][$j]['desc'] = trim($data[1]);
				    
				    $out[$i]['sub'][$j]['uom'] = trim($data[2]);
				    $out[$i]['sub'][$j]['unit_qty'] = trim($data[3]);
				    $x = 1;
				    $y = 4;
				    $h=0;
				    foreach ($projinfo->subprojects as $subpro) {

				    	foreach ($subpro->multiplier as $subpromulti) {

						    $out[$i]['sub'][$j]['qty'][$h]['indiqty'] = trim($data[$y]);
						    $y++;
						    $x++;
						    $h++;
						}
					}
					$totnum = $y;
				    $out[$i]['sub'][$j]['tot_qty'] = trim($data[$totnum]);
				    $out[$i]['sub'][$j]['projectarr'] = $projinfo->subprojects;
				    $out[$i]['sub'][$j]['matmapped'] = array();
				    if($stomat){

				    	array_push($out[$i]['sub'][$j]['matmapped'], array("matid"=>$stomat->id, "materialdesc"=>$stomat->name, "uom"=>$stomat->units, "qty"=>$data[$totnum]));
				    }
				    $j++;
				}
			}

		}

		return $out;
	}

	public function add_activity_to_project() {

		$filedata = Request::input("filedata");

		$projectid = Request::input("projectid");

		$schtype = Request::input("schtype");

		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();

		foreach ($filedata as $fdata) {

			if(trim($fdata['srno']) != "") {
			
				$srno = $fdata['srno'];
				$desc = $fdata['desc'];
				$total_qty = $fdata['tot_qty'];

				$singlesch = array(

						"name"=>$srno,
						"desc"=>$desc,
						"created_by"=>$userinfo->users['id'],
						"project_id"=>$projectid,
						"type"=>$schtype,
						"qty"=>$total_qty
					);

				$createsch = Schedule::create($singlesch);
				$k=0;
				foreach ($projinfo->subprojects as $subpro) {

					foreach ($subpro->multiplier as $subpromulti) {
						
						$thisschprojqty = $fdata['qty'][$k]['indiqty'];

						$singleschproj = array(

							"schedule_id"=>$createsch->id,
							"sub_project_id"=>$subpromulti['id'],
							"qty"=>$thisschprojqty
						);

						$createschproj = ScheduleProjectQty::create($singleschproj);

						$k++;
					}
				}
				foreach ($fdata['sub'] as $subdata) {
					
					$subsrno = $subdata['srno'];
					$subdesc = $subdata['desc'];
					$subtotal_qty = $subdata['tot_qty'];
					$subunit_qty = $subdata['unit_qty'];

					if(!isset($subdata['uom'])) {

						$subunits_uom['uom'] = "";
					}
					$subunits_uom = $subdata['uom'];

					$singlesubsch = array(

						"no"=>$subsrno,
						"descr"=>$subdesc,
						"unit_qty"=>$subunit_qty,
						"qty"=>$subtotal_qty,
						"units"=>$subunits_uom,
						"schedule_id"=>$createsch->id
					);

					$createsubsch = SubSchedule::create($singlesubsch);

					$k = 0;
					foreach ($projinfo->subprojects as $subpro) {

						foreach ($subpro->multiplier as $subpromulti) {
						
							$thisprojqty = $subdata['qty'][$k]['indiqty'];

							$singleschproj = array(

								"sub_schedule_id"=>$createsubsch->id,
								"sub_project_id"=>$subpromulti['id'],
								"qty"=>$thisprojqty
							);

							$createschproj = SubScheduleProjectQty::create($singleschproj);

							$k++;
						}
					}

					if(isset($subdata['matmapped'])) {

						foreach ($subdata['matmapped'] as $subschmat) {
							if(!isset($subschmat['unitqty'])) {

								$subschmat['unitqty'] = 0;
							}
							$singleschmat = array(

								"sub_schedule_id"=>$createsubsch->id,
								"material_id"=>$subschmat['matid'],
								"unit_qty"=>$subschmat['unitqty'],
								"qty"=>$subschmat['qty']
							);

							$createschmat = SubScheduleMaterials::create($singleschmat);
						}

					}
				}
			}
		}

		return 1;
	}


	public function get_activity_mat_data() {

		$projectid = Request::input("projectid");

		$actinfo = Schedule::where("project_id", "=", $projectid)->with("subschedules.subschmaterials.material")->with(array('subschedules.subschmaterials.budgetrate'=>function($query) use ($projectid){
	        $query->where('project_id', "=", $projectid);
	    }))->get();

		$matmainarr = array();
		$matactivityarr = array();
		$matactivityarr[0]['proj_budget_cost'] = 0;
		$i=0;

		foreach ($actinfo as $indiact) {
			
			foreach ($indiact->subschedules as $insubact) {
				
				foreach ($insubact->subschmaterials as $subschmat) {

					$matid = $subschmat['material_id'];

					$stmat = StoreMaterial::where("id", "=", $matid)->with("level1mat.storematerial.matuom.stmatuom")->with(array("level1mat.budgetrate"=>function($query) use ($projectid){

						$query->where("project_id", "=", $projectid);
					}))->first();
					if($stmat->type==2) {

						foreach ($stmat->level1mat as $indilevel1) {

							$pomat = PurchaseOrderMaterial::where("material_id", "=", $indilevel1['store_material_id'])->whereHas('purchaseorder', function($query) use ($projectid)
							{
							    $query->where('project_id', '=', $projectid);
							})->with(array('purchaseorder'=>function($query) use ($projectid, $matid){
						        $query->where('project_id', '=', $projectid)->with('taxes.taxmaterials');
						    }))->get();


						    foreach ($pomat as $inpomat) {

						    	$thisunitrate = $inpomat->unit_rate;
						    	$totalbrate += $inpomat->unit_rate;
						    	$freightcheck = 0;
						    	foreach ($inpomat['purchaseorder']['taxes'] as $inpotaxes) {

						    		if($inpotaxes['tax_id'] == 11) {

						    			$freightcheck++;
						    		}
						    			
					    			foreach ($inpotaxes['taxmaterials'] as $inpotaxmat) {
					    				
					    				if($inpotaxmat['material_id'] == $inpomat['id']) {

					    					$thisunitrate += $thisunitrate*$inpotaxes['taxpercentage']/100;
					    				}
					    			}
						    	}
						    	if($freightcheck > 0 && ($inpomat['freightinsurance_rate'] == 0.00 || $inpomat['freightinsurance_rate'] == 0)) {

						    		$inpomat['taxedrate'] = round($thisunitrate, 2);
						    	} else {
						    		$thisunitrate += $inpomat['freightinsurance_rate'];
						    		$inpomat['taxedrate'] = round($thisunitrate, 2);
						    	}
						    	
						    	$totalunitrate += $thisunitrate;

						    }
						    if($pomat->count() > 0) {
						   		$avgfordrate = round($totalunitrate/$pomat->count());
						   		$avgbuyrate = round($totalbrate/$pomat->count());
						   	} else{
						   		$avgfordrate = 0;
						   		$avgbuyrate = 0;
						   	}
							if(!in_array($indilevel1['store_material_id'], $matmainarr)) {

								if($pomat) {

							    	$avgrate = $avgfordrate;
							    	$avgbrate = $avgbuyrate;
							    } else {

							    	$avgrate = 0;
							    	$avgbrate = 0;
							    }
								$matmainarr[$i] = $indilevel1['store_material_id'];
								$matactivityarr[$i]['id'] = $indilevel1['store_material_id'];
								$matactivityarr[$i]['avgfordrate'] = $avgrate;
								$matactivityarr[$i]['avgbuyrate'] = $avgbrate;
								$matactivityarr[$i]['name'] = $indilevel1->storematerial['name'];
								$matactivityarr[$i]['uom'] = $indilevel1->matuom[0]['stmatuom']['uom'];
								$matactivityarr[$i]['qty'] = round(($subschmat['qty']*$indilevel1['qty']),2);
								$matactivityarr[$i]['activities'] = $insubact['no']."(".round(($subschmat['qty']*$indilevel1['qty']), 2).")";
								if(isset($indilevel1['budgetrate'][0])) {
									$matactivityarr[$i]['budget_rate'] = $indilevel1['budgetrate'][0]['budget_rate'];
									$matactivityarr[$i]['total_budget_cost'] = round($matactivityarr[$i]['qty'], 2)*$indilevel1['budgetrate'][0]['budget_rate'];
									$matactivityarr[0]['proj_budget_cost'] += round($matactivityarr[$i]['qty'], 2)*$indilevel1['budgetrate'][0]['budget_rate'];
								}
								$i++;

							} else {


								$thiskey = array_search($subschmat['material_id'], $matmainarr);

								$matactivityarr[$thiskey]['qty'] = $matactivityarr[$thiskey]['qty']+round(($subschmat['qty']*$indilevel1['qty']), 2);
								$matactivityarr[$thiskey]['activities'] = $matactivityarr[$thiskey]['activities'].", ".$insubact['no']."(".round($subschmat['qty'], 2).")";
								if(isset($indilevel1['budgetrate'][0])) {
									$matactivityarr[$thiskey]['total_budget_cost'] += round(($subschmat['qty']*$indilevel1['qty']), 2)*$indilevel1['budgetrate'][0]['budget_rate'];
									$matactivityarr[0]['proj_budget_cost'] += round(($subschmat['qty']*$indilevel1['qty']), 2)*$indilevel1['budgetrate'][0]['budget_rate'];
								}

							}


						}
					} else {
						$pomat = PurchaseOrderMaterial::where("material_id", "=", $matid)->whereHas('purchaseorder', function($query) use ($projectid)
						{
						    $query->where('project_id', '=', $projectid);
						})->with(array('purchaseorder'=>function($query) use ($projectid, $matid){
					        $query->where('project_id', '=', $projectid)->with('taxes.taxmaterials');
					    }))->get();
					    $totalunitrate = 0;
					    $totalbrate = 0;

					    foreach ($pomat as $inpomat) {

					    	$thisunitrate = $inpomat->unit_rate;
					    	$totalbrate += $inpomat->unit_rate;
					    	$freightcheck = 0;
					    	foreach ($inpomat['purchaseorder']['taxes'] as $inpotaxes) {

					    		if($inpotaxes['tax_id'] == 11) {

					    			$freightcheck++;
					    		}
					    			
				    			foreach ($inpotaxes['taxmaterials'] as $inpotaxmat) {
				    				
				    				if($inpotaxmat['material_id'] == $inpomat['id']) {

				    					$thisunitrate += $thisunitrate*$inpotaxes['taxpercentage']/100;
				    				}
				    			}
					    	}
					    	if($freightcheck > 0 && ($inpomat['freightinsurance_rate'] == 0.00 || $inpomat['freightinsurance_rate'] == 0)) {

					    		$inpomat['taxedrate'] = round($thisunitrate, 2);
					    	} else {
					    		$thisunitrate += $inpomat['freightinsurance_rate'];
					    		$inpomat['taxedrate'] = round($thisunitrate, 2);
					    	}
					    	
					    	$totalunitrate += $thisunitrate;

					    }
					    if($pomat->count() > 0) {
					   		$avgfordrate = round($totalunitrate/$pomat->count());
					   		$avgbuyrate = round($totalbrate/$pomat->count());
					   	} else{
					   		$avgfordrate = 0;
					   		$avgbuyrate = 0;
					   	}
						if(!in_array($subschmat['material_id'], $matmainarr)) {

							if($pomat) {

						    	$avgrate = $avgfordrate;
						    	$avgbrate = $avgbuyrate;
						    } else {

						    	$avgrate = 0;
						    	$avgbrate = 0;
						    }
							$matmainarr[$i] = $subschmat['material_id'];
							$matactivityarr[$i]['id'] = $subschmat['material_id'];
							$matactivityarr[$i]['avgfordrate'] = $avgrate;
							$matactivityarr[$i]['avgbuyrate'] = $avgbrate;
							$matactivityarr[$i]['name'] = $subschmat->material['name'];
							$matactivityarr[$i]['uom'] = $subschmat->material['units'];
							$matactivityarr[$i]['qty'] = round($subschmat['qty'],2);
							$matactivityarr[$i]['activities'] = $insubact['no']."(".round($subschmat['qty'], 2).")";
							if(isset($subschmat['budgetrate'][0])) {
								$matactivityarr[$i]['budget_rate'] = $subschmat['budgetrate'][0]['budget_rate'];
								$matactivityarr[$i]['total_budget_cost'] = round($subschmat['qty'], 2)*$subschmat['budgetrate'][0]['budget_rate'];
								$matactivityarr[0]['proj_budget_cost'] += round($subschmat['qty'], 2)*$subschmat['budgetrate'][0]['budget_rate'];
							}
							$i++;

						} else {


							$thiskey = array_search($subschmat['material_id'], $matmainarr);

							$matactivityarr[$thiskey]['qty'] = $matactivityarr[$thiskey]['qty']+round($subschmat['qty'], 2);
							$matactivityarr[$thiskey]['activities'] = $matactivityarr[$thiskey]['activities'].", ".$insubact['no']."(".round($subschmat['qty'], 2).")";
							if(isset($subschmat['budgetrate'][0])) {
								$matactivityarr[$thiskey]['total_budget_cost'] += round($subschmat['qty'], 2)*$subschmat['budgetrate'][0]['budget_rate'];
								$matactivityarr[0]['proj_budget_cost'] += round($subschmat['qty'], 2)*$subschmat['budgetrate'][0]['budget_rate'];
							}

						}
					}
				}
			}
		}

		return $matactivityarr;

	}

	public function get_boq_edit_data() {

		$projectid = Request::input("projectid");
		$schtype = Request::input("schtype");
		$i=-1;
		$out = array();
		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();
		$schedulelist = Schedule::where("type", "=", $schtype)->where("project_id", "=", $projectid)->with("subschedules.subschmaterials.material.matuom.stmatuom")->with("subschedules.subschmaterials.subschmatactgrp.actgrp.material.submaterial.storelevel1mat.storematerial")->with("subschedules.subschmaterials.subschmatactgrp.actgrp.material.submaterial.storelevel1mat.msmat")->with("subschedules.subschprojqty.subscheduleprojmatqty")->with("schproj")->get();
		foreach ($schedulelist as $data) {
			
			    $i++;
			    $j=0;
			    $out[$i]['id'] = $data['id'];
			    $out[$i]['srno'] = $data['name'];
			    $out[$i]['desc'] = $data['desc'];
			    $out[$i]['uom'] = "";
			    $out[$i]['unit_qty'] = "";
			    $x = 1;
			    $y = 4;
			    $h=0;
			    foreach ($data['schproj'] as $schpro) {

				    $out[$i]['qty'][$h]['indiqty'] = $schpro['qty'];
				    $out[$i]['qty'][$h]['id'] = $schpro['id'];
				    $out[$i]['qty'][$h]['total_indent_qty'] = $schpro['total_indent_qty'];
				    $out[$i]['qty'][$h]['indiqtycurrentindent'] = 0;
				    $y++;
				    $x++;
				    $h++;
				}
		 	    $out[$i]['tot_qty'] = $data['qty'];
			    
			    foreach ($data['subschedules'] as $subschin) {

			    	$out[$i]['sub'][$j]['id'] = $subschin['id'];
			    	$out[$i]['sub'][$j]['srno'] = $subschin['no'];
			    	$out[$i]['sub'][$j]['desc'] = $subschin['descr'];
			    	$out[$i]['sub'][$j]['unit_qty'] = $subschin['unit_qty'];
			    	$out[$i]['sub'][$j]['supply_rate'] = $subschin['supply_rate'];
			    	$out[$i]['sub'][$j]['erection_rate'] = $subschin['erection_rate'];
			    	$out[$i]['sub'][$j]['fi_rate'] = $subschin['fi_rate'];
			    	$out[$i]['sub'][$j]['tot_qty'] = $subschin['qty'];
			    	$out[$i]['sub'][$j]['uom'] = $subschin['units'];
			    	$x = 1;
			    	$h=0;
			    	foreach ($subschin['subschprojqty'] as $subschproj) {

					    $out[$i]['sub'][$j]['qty'][$h]['indiqty'] = $subschproj['qty'];
					    $out[$i]['sub'][$j]['qty'][$h]['id'] = $subschproj['id'];
					    $out[$i]['sub'][$j]['qty'][$h]['indiqtycurrentindent'] = 0;
					    $out[$i]['sub'][$j]['qty'][$h]['total_indent_qty'] = $subschproj['total_indent_qty'];
					    $t=0;
					    foreach ($subschproj['subscheduleprojmatqty'] as $insubschprmat) {

					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['qty'] = $insubschprmat['qty'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['total_indent_qty'] = $insubschprmat['total_indent_qty'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['material_id'] = $insubschprmat['material_id'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['id'] = $subschproj['id'];
						    $t++;
					    }
					    $x++;
					    $h++;

					}

					$out[$i]['sub'][$j]['matmapped'] = array();
					
			    	foreach ($subschin['subschmaterials'] as $subscmat) {
			    		$actgroupcheck= false;
			    		$actgridarr = array();
			    		$submatarr = array();
			    		$g=0;
			    		if(count($subscmat['subschmatactgrp']) > 0) {

			    			$actgroupcheck=true;
			    			foreach ($subscmat['subschmatactgrp'] as $indisub) {
			    				$actgridarr[$g]['id'] = $indisub['activity_group_id'];
			    				$actgrdet = ActivityGroup::where("id", "=", $indisub['activity_group_id'])->first();
			    				$actgridarr[$g]['qty'] = $indisub['qty'];
			    				$actgridarr[$g]['name'] = $actgrdet['name'];

			    				foreach ($indisub['actgrp']['material'] as $indim) {
			    					
			    					foreach ($indim['submaterial'] as $indisubm) {
			    						$totq = $indisubm['storelevel1mat']['qty_per_pole']*$indisub['qty'];
			    						array_push($submatarr, array("matid"=>$indisubm['material_level1_id'], "matname"=>$indisubm['storelevel1mat']['storematerial']['name'], "msmatname"=>$indisubm['storelevel1mat']['msmat']['name'], 'qty_per_pole'=>$indisubm['storelevel1mat']['qty_per_pole'], 'thisactqty'=>$indisub['qty'], "totqty"=>$totq ));
			    					}
			    				}
			    				$g++;
			    			}
			    		}
			    		
					    array_push($out[$i]['sub'][$j]['matmapped'], array("matid"=>$subscmat['material_id'], "materialdesc"=>$subscmat->material['name'], "uom"=>$subscmat->material['matuom'][0]['stmatuom']['uom'], "qty"=>$subscmat['qty'], "unitqty"=>$subscmat['unit_qty'], "currentindentqty"=>0, "id"=>$subscmat['id'], "actgroupcheck"=>$actgroupcheck, "actgridarr"=>$actgridarr, "submatarr"=>$submatarr));

			    	}
			    	$j++;
			    }
				
		}
			

		return $out;


	}


	public function edit_activity_to_project() {

		$filedata = Request::input("filedata");

		$projectid = Request::input("projectid");
		$schtype = Request::input("schtype");
		if(!isset($schtype)) {

			$schtype = 1;
		}
		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();
		foreach ($filedata as $fdata) {

			$schcheck = Schedule::where("id", "=", $fdata['id'])->first();
			if($schcheck) {
			
				$srno = $fdata['srno'];
				$desc = $fdata['desc'];
				$total_qty = $fdata['tot_qty'];
				$subscharr = array();
				$subschmatarr = array();
				Schedule::where("id", "=", $fdata['id'])->update(array("name"=>$srno, "desc"=>$desc, "qty"=>$total_qty));
				foreach ($fdata['qty'] as $schproqty) {
					if(!isset($schproqty['indiqty'])) {
						$schproqty['indiqty'] = 0;
					}
					ScheduleProjectQty::where("id", "=", $schproqty['id'])->update(array("qty"=>$schproqty['indiqty']));
				}
				foreach ($fdata['sub'] as $subdata) {
					
					$subsrno = $subdata['srno'];
					$subdesc = $subdata['desc'];
					$subtotal_qty = $subdata['tot_qty'];
					$subunit_qty = $subdata['unit_qty'];
					if(!isset($subdata['supply_rate'])) {

						$subdata['supply_rate'] = 0;
					}
					$supply_rate = $subdata['supply_rate'];
					if(!isset($subdata['fi_rate'])) {

						$subdata['fi_rate'] = 0;
					}
					$fi_rate = $subdata['fi_rate'];
					if(!isset($subdata['uom'])) {

						$subdata['uom'] = "";
					}
					$subunits = $subdata['uom'];
					SubSchedule::where("id", "=", $subdata['id'])->update(array("no"=>$subsrno, "descr"=>$subdesc, "unit_qty"=>$subunit_qty, "qty"=>$subtotal_qty, "units"=>$subunits, "supply_rate"=>$supply_rate, "fi_rate"=>$fi_rate));
					// if($schtype == 1) {

					// 	SubSchedule::where("id", "=", $subdata['id'])->update(array("no"=>$subsrno, "descr"=>$subdesc, "unit_qty"=>$subunit_qty, "qty"=>$subtotal_qty, "units"=>$subunits, "supply_rate"=>$supply_rate, "fi_rate"=>$fi_rate));
					// } else {

					// 	SubSchedule::where("id", "=", $subdata['id'])->update(array("no"=>$subsrno, "descr"=>$subdesc, "unit_qty"=>$subunit_qty, "qty"=>$subtotal_qty, "units"=>$subunits, "erect_rate"=>$supply_rate, "fi_rate"=>$fi_rate));
					// }
					if(isset($subdata['qty'])) {
						$mai = 0;

						foreach ($subdata['qty'] as $indiprojq) {
							if(!isset($indiprojq['indiqty'])) {
								$indiprojq['indiqty'] = 0;
							}
							SubScheduleProjectQty::where("id", "=", $indiprojq['id'])->update(array("qty"=>$indiprojq['indiqty']));

							if(isset($subdata['matmapped'])) {

								foreach ($subdata['matmapped'] as $subschmat) {

									$subschprojmatcheck = SubScheduleProjectMaterialQty::where("material_id", "=", $subschmat['matid'])->where("sub_schedule_project_id", "=", $indiprojq['id'])->first();
									if(!$subschprojmatcheck) {
						
										$singleschprojmat = array(

											"sub_schedule_project_id"=>$indiprojq['id'],
											"material_id"=>$subschmat['matid'],
											"qty"=>$fdata['qty'][$mai]['indiqty']*$subschmat['unitqty']
										);
										$createschprojmat = SubScheduleProjectMaterialQty::create($singleschprojmat);
									} else {

										$subschprojmatcheck->qty = $fdata['qty'][$mai]['indiqty']*$subschmat['unitqty'];
										$subschprojmatcheck->save();
									}
								
								}
							}
							$mai++;
						}
					}

					foreach ($fdata['qty'] as $schproqty) {
						if(!isset($schproqty['indiqty'])) {
							$schproqty['indiqty'] = 0;
						}
						ScheduleProjectQty::where("id", "=", $schproqty['id'])->update(array("qty"=>$schproqty['indiqty']));
					}

					$subscharr[] = $subdata['id'];

					if(isset($subdata['matmapped'])) {

						foreach ($subdata['matmapped'] as $subschmat) {

							if(!isset($subschmat['unitqty'])) {

								$subschmat['unitqty'] = 0;
							}

							if(isset($subschmat['id'])) {

								SubScheduleMaterials::where("id", "=", $subschmat['id'])->update(array("unit_qty"=>$subschmat['unitqty'], "qty"=>$subschmat['qty']));
								$subschmatarr[] = $subschmat['id'];

								SubScheduleMaterialActivityGroup::where("sub_schedule_material_id", "=", $subschmat['id'])->delete();
								foreach ($subschmat['actgridarr'] as $indiactgrid) {
									SubScheduleMaterialActivityGroup::create(array("sub_schedule_material_id"=>$subschmat['id'], "activity_group_id"=>$indiactgrid['id'], "qty"=>$indiactgrid['qty']));
								}
							} else {

								$subschmatcheck = SubScheduleMaterials::where("material_id", "=", $subschmat['matid'])->where("sub_schedule_id", "=", $subdata['id'])->first();

								if(!$subschmatcheck) {
							
									$singleschmat = array(

										"sub_schedule_id"=>$subdata['id'],
										"unit_qty"=>$subschmat['unitqty'],
										"material_id"=>$subschmat['matid'],
										"qty"=>$subschmat['qty']
									);
									$createschmat = SubScheduleMaterials::create($singleschmat);
									$subschmatarr[] = $createschmat->id;

									foreach ($subschmat['actgridarr'] as $indiactgrid) {
										SubScheduleMaterialActivityGroup::create(array("sub_schedule_material_id"=>$createschmat->id, "activity_group_id"=>$indiactgrid['id'], "qty"=>$indiactgrid['qty']));
									}
								} else {
									SubScheduleMaterialActivityGroup::where("sub_schedule_material_id", "=", $subschmatcheck->id)->delete();
									foreach ($subschmat['actgridarr'] as $indiactgrid) {
										SubScheduleMaterialActivityGroup::create(array("sub_schedule_material_id"=>$subschmatcheck->id, "activity_group_id"=>$indiactgrid['id'], "qty"=>$indiactgrid['qty']));
									}

									$subschmatarr[] = $subschmatcheck->id;
									$subschmatcheck->unit_qty = $subschmat['unitqty'];
									$subschmatcheck->qty = $subschmat['qty'];
									$subschmatcheck->save();

								}
							}
						}

					}
					SubScheduleMaterials::where("sub_schedule_id", "=", $subdata['id'])->whereNotIn("id", $subschmatarr)->delete();
				}

				SubSchedule::where("schedule_id", "=", $fdata['id'])->whereNotIn("id", $subscharr)->delete();

			} else {

				$srno = $fdata['srno'];
				$desc = $fdata['desc'];
				$total_qty = $fdata['tot_qty'];

				$singlesch = array(

						"name"=>$srno,
						"desc"=>$desc,
						"created_by"=>$userinfo->users['id'],
						"project_id"=>$projectid,
						"type"=>$schtype,
						"qty"=>$total_qty
					);

				$createsch = Schedule::create($singlesch);
				$k=0;
				foreach ($projinfo->subprojects as $subpro) {

					foreach ($subpro->multiplier as $subpromulti) {
						
						$thisschprojqty = $fdata['qty'][$k]['indiqty'];

						$singleschproj = array(

							"schedule_id"=>$createsch->id,
							"sub_project_id"=>$subpromulti['id'],
							"qty"=>$thisschprojqty
						);

						$createschproj = ScheduleProjectQty::create($singleschproj);

						$k++;
					}
				}
				foreach ($fdata['sub'] as $subdata) {
					
					$subsrno = $subdata['srno'];
					$subdesc = $subdata['desc'];
					$subtotal_qty = $subdata['tot_qty'];
					$subunit_qty = $subdata['unit_qty'];

					if(!isset($subdata['uom'])) {

						$subunits_uom['uom'] = "";
					}
					$subunits_uom = $subdata['uom'];

					$singlesubsch = array(

						"no"=>$subsrno,
						"descr"=>$subdesc,
						"unit_qty"=>$subunit_qty,
						"qty"=>$subtotal_qty,
						"units"=>$subunits_uom,
						"schedule_id"=>$createsch->id
					);

					$createsubsch = SubSchedule::create($singlesubsch);

					$k = 0;
					foreach ($projinfo->subprojects as $subpro) {

						foreach ($subpro->multiplier as $subpromulti) {
						
							$thisprojqty = $subdata['qty'][$k]['indiqty'];

							$singleschproj = array(

								"sub_schedule_id"=>$createsubsch->id,
								"sub_project_id"=>$subpromulti['id'],
								"qty"=>$thisprojqty
							);

							$createschproj = SubScheduleProjectQty::create($singleschproj);

							$k++;
						}
					}

					if(isset($subdata['matmapped'])) {

						foreach ($subdata['matmapped'] as $subschmat) {
							if(!isset($subschmat['unitqty'])) {

								$subschmat['unitqty'] = 0;
							}
							$singleschmat = array(

								"sub_schedule_id"=>$createsubsch->id,
								"material_id"=>$subschmat['matid'],
								"unit_qty"=>$subschmat['unitqty'],
								"qty"=>$subschmat['qty']
							);

							$createschmat = SubScheduleMaterials::create($singleschmat);
						}

					}
				}

			}


		}

		return 1;
	}

	public function update_activity_to_project() {

		$filedata = Request::input("filedata");

		$projectid = Request::input("projectid");

		$schdel = Schedule::where("project_id", "=", $projectid)->get();

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects")->first();		

		foreach ($filedata as $fdata) {
			
			$srno = trim($fdata['srno']);
			$desc = $fdata['desc'];
			$total_qty = $fdata['tot_qty'];

			$mschedule = Schedule::where("name","=",$srno)->first();

			if($mschedule) {
				$mschedule->qty = $total_qty;

				$mschedule->save();

				$k=1;

				foreach ($projinfo->subprojects as $subpro) {

					foreach ($subpro->multiplier as $subpromulti) {
					
						if(!isset($fdata['qty'.$k])) {

							$fdata['qty'.$k] = 0;
						}
						$thisschprojqty = $fdata['qty'.$k];

						$schpqty = ScheduleProjectQty::where("schedule_id", "=", $mschedule->id)->where("sub_project_id", "=", $subpromulti['id'])->first();

						
						$schpqty->qty = $thisschprojqty;
						$schpqty->save();

						$k++;
					}
				}
				foreach ($fdata['sub'] as $subdata) {
					
					$subsrno = trim($subdata['srno']);
					// if($subsrno == "A28a"){

					// 	return $subdata;
					// }
					$subdesc = $subdata['desc'];
					$subtotal_qty = $subdata['tot_qty'];
					$subunit_qty = $subdata['unit_qty'];
					if(!isset($subdata['uom'])) {

						$subdata['uom'] = "";
					}
					$subunits = $subdata['uom'];

					$subsch = SubSchedule::where("no", "=", $subsrno)->where("schedule_id", "=", $mschedule->id)->first();

					if($subsch) {

						$subsch->unit_qty = $subunit_qty;
						$subsch->qty = $subtotal_qty;
						$subsch->units = $subunits;
						$subsch->save();

						$k = 1;
						foreach ($projinfo->subprojects as $subpro) {

							foreach ($subpro->multiplier as $subpromulti) {
							
								$thisprojqty = $subdata['qty'.$k];

								$subschpr = SubScheduleProjectQty::where("sub_schedule_id", "=", $subsch->id)->where("sub_project_id", "=", $subpromulti['id'])->first();

								$subschpr->qty = $thisprojqty;
								$subschpr->save();

								$k++;
							}
						}
					}

				}
			}
		}

		return 1;
	}

	public function save_budget_rate() {

		$projectid = Request::input("projectid");
		$activitydata = Request::input("activitydata");

		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		foreach ($activitydata as $inactivity) {
			
			$matid = $inactivity['id'];

			if(isset($inactivity['budget_rate'])) {

				$budget_rate = $inactivity['budget_rate'];
			} else {

				$budget_rate = 0;
			}
			if(isset($inactivity['total_budget_cost'])) {

				$total_budget_cost = $inactivity['total_budget_cost'];
			} else {

				$total_budget_cost = 0;
			}
			$qty = $inactivity['qty'];

			$boqmatcheck = BoqMaterial::where("project_id","=", $projectid)->where("material_id","=",$matid)->with("material.level1mat")->first();

			if($boqmatcheck) {

				$thisdatetime = date("Y-m-d H:i:s");

				$boqmatcheck->budget_rate = $budget_rate;
				$boqmatcheck->total_budget_cost = $total_budget_cost;
				$boqmatcheck->created_by = $userinfo->users['id'];
				$boqmatcheck->qty = $qty;
				$boqmatcheck->updated_at = $thisdatetime;

				$boqmatcheck->save();
				if($boqmatcheck->material->type == 2) {
					foreach ($boqmatcheck->material['level1mat'] as $inmat) {
						$boqinmat = BoqMaterial::where("project_id", "=", $projectid)->where("material_id", "=", $inmat['store_material_id'])->first();
						if($boqinmat) {

							$boqinmat->budget_rate = $budget_rate;
							$boqinmat->total_budget_cost = $total_budget_cost;
							$boqinmat->created_by = $userinfo->users['id'];
							$boqinmat->qty = $qty*$inmat['qty'];
							$boqinmat->updated_at = $thisdatetime;
							$boqinmat->save();
						} else {
							$inqty = $qty*$inmat['qty'];
							$singleboqinmat = array("project_id"=> $projectid, "material_id"=> $inmat['store_material_id'], "budget_rate"=>$budget_rate, "total_budget_cost"=>$total_budget_cost, "created_by"=> $userinfo->users['id'], "qty"=>$inqty);

							BoqMaterial::create($singleboqinmat);
						}
					}
						
				}

			} else {

				$singleboqmat = array("project_id"=> $projectid, "material_id"=> $matid, "budget_rate"=>$budget_rate, "total_budget_cost"=>$total_budget_cost, "created_by"=> $userinfo->users['id'], "qty"=>$qty);

				BoqMaterial::create($singleboqmat);
				$boqinmatcheck = StoreMaterial::where("id", "=", $matid)->with("level1mat")->first();
				if($boqinmatcheck->type == 2) {
					foreach ($boqinmatcheck->level1mat as $ininmat) {
						$thisinqty = $qty*$ininmat['qty'];
						BoqMaterial::create(array("project_id"=> $projectid, "material_id"=> $ininmat['store_material_id'], "budget_rate"=>$budget_rate, "total_budget_cost"=>$total_budget_cost, "created_by"=> $userinfo->users['id'], "qty"=>$thisinqty));
					}
				}
			}

			
		}
		return 1;
	}

	public function get_sub_projects() {

		$projectid = Request::input("projectid");

		return SubProjects::where("project_id", "=", $projectid)->with("multiplier")->get();
	}

	public function get_boq_mat_data() {

		$projectid = Request::input("projectid");

		return $boqmat = BoqMaterial::where("project_id", "=", $projectid)->with("material")->get();
	}

	public function insert_indent() {

		$projectid = Request::input("projectid");
		$indentmaterials = Request::input("indentmaterials");
		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$singleindent = array("project_id"=>$projectid, "created_by"=>$userinfo->users->id);

		$createindent = Indent::create($singleindent);

		foreach ($indentmaterials as $indiindent) {

			$totalindentqty = floatval($indiindent['total_indent_qty'])+floatval($indiindent['current_indent_qty']);

			$boqmatmain = BoqMaterial::where("id", "=", $indiindent['boq_material_id'])->update(array("total_indent_qty"=>$totalindentqty));
			
			$singleinmat = array("indent_id"=>$createindent->id, "boq_material_id"=>$indiindent['boq_material_id'], "qty"=>$indiindent['current_indent_qty'], "buy_by"=>$indiindent['buy_by']);

			$createindimat = IndentMaterial::create($singleinmat);

		}

		if($createindent) {

			return 1;
		} else {

			return 0;
		}


	}

	public function copyactivity() {

		$sourceprojectid = Request::input("sourceprojectid");
		$destprojectid = Request::input("destprojectid");
		$checksource = Schedule::where("project_id", "=", $sourceprojectid)->get();

		$projinfo = Projects::where("id", "=", $destprojectid)->with("subprojects")->first();
		foreach ($projinfo->subprojects as $subpro) {

			foreach ($subpro->multiplier as $subpromulti) {
			
				$subprojarr[] = $subpromulti['id'];
			}
		}

		if($checksource->count() > 0) {

			$checkschedule = Schedule::where("project_id", "=", $destprojectid)->get();

			foreach ($checkschedule as $indidest) {
				$subsch = SubSchedule::where("schedule_id", "=", $indidest['id'])->get();
				ScheduleProjectQty::where("schedule_id", "=", $indidest['id'])->delete();

				foreach ($subsch as $indisubsch) {
					
					SubScheduleMaterials::where("sub_schedule_id", "=", $indisubsch['id'])->delete();
					SubScheduleProjectQty::where("sub_schedule_id", "=", $indisubsch['id'])->delete();
				}
				SubSchedule::where("schedule_id", "=", $indidest['id'])->delete();
			}
			Schedule::where("project_id", "=", $destprojectid)->delete();


			//if($checkschedule->count() == 0) {

				foreach ($checksource as $indisource) {
					
					$createindisch = Schedule::create($indisource->toArray());

					$createindisch->project_id = $destprojectid;
					$createindisch->save();

					$schproj = ScheduleProjectQty::where("schedule_id", "=", $indisource['id'])->get();
					$y=0;
					foreach ($schproj as $inschproj) {
						if($y<2) {
							if(isset($subprojarr[$y])) {
								$schprojnew = ScheduleProjectQty::create($inschproj->toArray());
								$schprojnew->schedule_id = $createindisch->id;
								$schprojnew->sub_project_id = $subprojarr[$y];
								$schprojnew->save();
							}
						}
						$y++;
					}

					$subsch = SubSchedule::where("schedule_id", "=", $indisource['id'])->get();

					foreach ($subsch as $indisubsch) {
						
						$createsubsch = SubSchedule::create($indisubsch->toArray());
						$createsubsch->schedule_id = $createindisch->id;
						$createsubsch->save();

						$subschmat = SubScheduleMaterials::where("sub_schedule_id", "=", $indisubsch['id'])->get();

						foreach ($subschmat as $indisubschmat) {
							
							$createsubschmat = SubScheduleMaterials::create($indisubschmat->toArray());
							$createsubschmat->sub_schedule_id = $createsubsch->id;
							$createsubschmat->save();
						}

						$subschproj = SubScheduleProjectQty::where("sub_schedule_id", "=", $indisubsch['id'])->get();
						$x =0;
						foreach ($subschproj as $indisubschproj) {
							if($x<2) {
								if(isset($subprojarr[$x])) {
									$createsubschproj = SubScheduleProjectQty::create($indisubschproj->toArray());
									$createsubschproj->sub_schedule_id = $createsubsch->id;
									$createsubschproj->sub_project_id = $subprojarr[$x];
									$createsubschproj->save();
								}
							}
							$x++;
						}
					}
				}

				$boqmat = BoqMaterial::where("project_id", "=", $sourceprojectid)->get();
				foreach ($boqmat as $inboqmat) {
					$boqmatnew = BoqMaterial::create($inboqmat->toArray());
					$boqmatnew->project_id = $destprojectid;
					$boqmatnew->save();
				}

				return 1;
			//} else {

			// 	return 0;
			// }
		} else {

			return 2;
		}


	}


	public function copyactmaterial() {

		$sourceprojectid = Request::input("sourceprojectid");
		$destprojectid = Request::input("destprojectid");
		$checksource = Schedule::where("project_id", "=", $sourceprojectid)->with("subschedules.subschmaterials.subschmatactgrp")->get();

		if($checksource->count() > 0) {

			foreach ($checksource as $indis) {
				
				$schname = $indis['name'];
				$schdetdest = Schedule::where("project_id", "=", $destprojectid)->where("name", "=", $schname)->first();
				foreach ($indis['subschedules'] as $indisub) {
					$subschno = $indisub['no'];
					$destsub = SubSchedule::where("no", "=", $subschno)->where("schedule_id", "=", $schdetdest->id)->first();
					if(isset($indisub['subschmaterials'])) {
						foreach ($indisub['subschmaterials'] as $indisubmat) {
							$indimatid = $indisubmat['material_id'];
							$unitqty = $indisubmat['unit_qty'];
							$qty = $destsub['qty']*$indisubmat['unit_qty'];
							$subschmatdet = SubScheduleMaterials::where("sub_schedule_id", "=", $destsub->id)->where("material_id", "=", $indimatid)->first();
							if(!$subschmatdet) {

								echo $destsub->id."=".$indimatid."<br>";

								$subschmatcreate = SubScheduleMaterials::create(array("sub_schedule_id"=>$destsub->id, "material_id"=>$indimatid, "unit_qty"=>$unitqty, "qty"=>$qty));
								if(isset($indisubmat['subschmatactgrp'])) {

									foreach ($indisubmat['subschmatactgrp'] as $inactgrp) {
										
										$actgrpid = $inactgrp['activity_group_id'];
										$actgrpqty = $inactgrp['qty'];
										$subschactcreate = SubScheduleMaterialActivityGroup::create(array("activity_group_id"=>$actgrpid, "sub_schedule_material_id"=>$subschmatcreate->id, "qty"=>$actgrpqty));

									}

								}
							} else {

								// $subschmatdet->unit_qty = $indisubmat['unit_qty'];
								// $submatqty = $indisubmat['unit_qty']*$destsub['qty'];
								// $subschmatdet->qty = $submatqty;
								// $subschmatdet->save();
							}
							
							
						}
					}
				}
			}
		}

	}



	public function custom_activity_to_project() {

		$filedata = Request::input("filedata");

		$projectid = Request::input("projectid");

		$schdel = Schedule::where("project_id", "=", $projectid)->get();

		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();

		foreach ($filedata as $fdata) {

			$schd = Schedule::where("name", "=", $fdata['srno'])->where("project_id", "=", $projectid)->with("subschedules")->first();

			if($schd) {

				$schd->qty = $fdata['tot_qty'];
				$schd->save();

				ScheduleProjectQty::where("schedule_id", "=", $schd->id)->delete();

				$k=1;
				$h = 0;

				foreach ($projinfo->subprojects as $subpro) {

					foreach ($subpro->multiplier as $subpromulti) {
					
						if(!isset($fdata['qty'])) {

							$fdata['qty'][$h]['indiqty'] = 0;
						}
						$thisschprojqty = $fdata['qty'][$h]['indiqty'];

						$singleschproj = array(

							"schedule_id"=>$schd->id,
							"sub_project_id"=>$subpromulti['id'],
							"qty"=>$thisschprojqty
						);

						$createschproj = ScheduleProjectQty::create($singleschproj);

						$k++;
						$h++;
					}
				}



				foreach ($schd['subschedules'] as $subdata) {
				
					$subunit_qty = $subdata['unit_qty'];
					SubScheduleProjectQty::where("sub_schedule_id", "=", $subdata['id'])->delete();

					$totalqty = 0;
					foreach ($projinfo->subprojects as $subpro) {

						foreach ($subpro->multiplier as $subpromulti) {

							$schprojqty = ScheduleProjectQty::where("schedule_id", "=", $schd->id)->where("sub_project_id", "=", $subpromulti['id'])->first();

							if($schprojqty) {
						
								$thisprojqty = $schprojqty->qty*$subunit_qty;

								$totalqty = $totalqty+$thisprojqty;

								$singleschproj = array(

									"sub_schedule_id"=>$subdata['id'],
									"sub_project_id"=>$subpromulti['id'],
									"qty"=>$thisprojqty
								);

								$createschproj = SubScheduleProjectQty::create($singleschproj);
							}

						}
					}

					SubSchedule::where("id", "=", $subdata['id'])->update(array("qty"=>$totalqty));

				
				}
			}
		}

		return 1;

	}


	public function calculateactivityvar() {

		$activityinfo = Request::input("activityinfo");			
		$actinfoback = $activityinfo;
		$projectid = Request::input("projectid");
		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects")->first();
		$total_qty = 0;
		$k=0;
		foreach ($projinfo->subprojects as $subpro) {
			foreach ($subpro->multiplier as $subpromulti) {
				if(!isset($activityinfo['qty'][$k])) {
					$activityinfo['qty'][$k]['indiqtycurrentindent'] = 0;
				}
				$total_qty += floatval($activityinfo['qty'][$k]['indiqtycurrentindent']); 
				$k++;
			}
		}
		$activityinfo['tot_qty'] = $total_qty;
		for($x=0;$x<count($activityinfo['sub']);$x++) {
			$subtotal_qty = 0;
			$subunit_qty = $activityinfo['sub'][$x]['unit_qty'];
			$k = 0;
			foreach ($projinfo['subprojects'] as $subpro) {
				foreach ($subpro['multiplier'] as $subpromulti) {
					$currindiindent = $subunit_qty*$activityinfo['qty'][$k]['indiqtycurrentindent'];
					$totalin = $currindiindent+$activityinfo['sub'][$x]['qty'][$k]['total_indent_qty'];
					
					if(floatval($totalin) > floatval($activityinfo['sub'][$x]['qty'][$k]['indiqty'])) {

						$activityinfo['sub'][$x]['qty'][$k]['indiqtycurrentindent'] = 0;
					} else {
						$activityinfo['sub'][$x]['qty'][$k]['indiqtycurrentindent'] = $currindiindent;
						$subtotal_qty += $activityinfo['sub'][$x]['qty'][$k]['indiqtycurrentindent'];
					}
					$k++;
				}
			}
			$activityinfo['sub'][$x]['tot_qty'] = $subtotal_qty;

			for($s=0;$s<count($activityinfo['sub'][$x]['matmapped']);$s++) {
				$y=0;
				$mapqty = 0;
				foreach ($projinfo['subprojects'] as $subpro) {
					foreach ($subpro['multiplier'] as $subpromulti) {

						$currindiindentm =  $activityinfo['sub'][$x]['matmapped'][$s]['unitqty']*$activityinfo['qty'][$y]['indiqtycurrentindent'];

						for ($m=0; $m<count($activityinfo['sub'][$x]['qty'][$y]['mat']); $m++) {
							
							if($activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['material_id'] == $activityinfo['sub'][$x]['matmapped'][$s]['matid']) {

								$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['total_indent_qty'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['total_indent_qty'];
								$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['qty'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['qty'];
								$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['id'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['id'];
								$totalin = $currindiindentm+$activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['total_indent_qty'];

								if(floatval($totalin) > floatval($activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['qty'])) {

									$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'] = 0;
								} else {
									$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'] = $activityinfo['sub'][$x]['matmapped'][$s]['unitqty']*$activityinfo['qty'][$y]['indiqtycurrentindent'];
									$mapqty += $activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'];
								}
								
							}
						}
						$y++;
						
					}
				}
				$activityinfo['sub'][$x]['matmapped'][$s]['totalprojqty'] = $mapqty;
			}
		}
		return $activityinfo;
	}

	public function generatesmapleboq() {

		$activityinfo = Request::input("activityinfo");
		$projectid = Request::input("projectid");
		$matmainarr = array();
		$matactivityarr = array();
		$i = 0;
		foreach ($activityinfo as $indiact) {
			foreach ($indiact['sub'] as $insubact) {
				foreach ($insubact['matmapped'] as $subschmat) {

					if(!in_array($subschmat['matid'], $matmainarr)) {

						$indenttot = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $subschmat['matid'])->first();
						$matactivityarr[$i]['qty'] = round($subschmat['totalprojqty'],2);

						$boqmat = BoqMaterial::where("project_id", "=", $projectid)->where("material_id", "=", $subschmat['matid'])->first();

						$matinfo = StoreMaterial::where("id", "=", $subschmat['matid'])->first();
						if($matinfo) {
							$matmainarr[$i] = $subschmat['matid'];
							$matactivityarr[$i]['id'] = $subschmat['matid'];
							$matactivityarr[$i]['name'] = $matinfo->name;
							$matactivityarr[$i]['uom'] = $matinfo->units;
							if($indenttot) {

								$totind = $indenttot->total_indent_qty;
							} else {

								$totind = 0;
							}
							$matactivityarr[$i]['totalindentqty'] = $totind;
							$matactivityarr[$i]['loa_qty'] = $boqmat['qty'];
							// $matactivityarr[$i]['qty'] = 0;
							// foreach ($subschmat['projqty'] as $indiprojqty) {
							// 	$matactivityarr[$i]['qty'] += round($indiprojqty['currentindentqty'],2);
							// }
							$matactivityarr[$i]['activities'] = $insubact['srno']."(".round($subschmat['qty'], 2).")";
							$i++;
						}
					} else {


						$thiskey = array_search($subschmat['matid'], $matmainarr);
						$matactivityarr[$thiskey]['qty'] += round($subschmat['totalprojqty'],2);

						// foreach ($subschmat['projqty'] as $indiprojqty) {
						// 	$matactivityarr[$thiskey]['qty'] += round($indiprojqty['currentindentqty'],2);
						// }
						$matactivityarr[$thiskey]['activities'] = $matactivityarr[$thiskey]['activities'].", ".$insubact['srno']."(".round($subschmat['qty'], 2).")";
					}
				}
			}
		}

		return $matactivityarr;
	}

	public function saveindent() {

		$activityinfo = Request::input("activityinfo");

		$projectid = Request::input("projectid");
		$buy_from = Request::input("buy_from");
		$buy_to = Request::input("buy_to");

		if(!isset($buy_from)) {

			$buy_from = "";
		}
		if(!isset($buy_to)) {

			$buy_to = "";
		}
		$actdata = Request::input("actdata");
		$matmainarr = array();
		$matactivityarr = array();
		$i = 0;
		$tkn=Request::header('JWT-AuthToken');
		$userinfo=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$newindent = Indent::create(array("project_id"=>$projectid,"created_by"=>$userinfo->users->id, "buy_from"=>$buy_from, "buy_to"=>$buy_to));
		foreach ($actdata as $inact) {
			if($inact['qty'] != 0 && isset($inact['id'])) {
				$checkmat = StoreMaterial::where("id", "=", $inact['id'])->where("type", "=", 2)->with("level1mat")->first();
				if($checkmat) {
					foreach ($checkmat->level1mat as $inmat) {
						
						$thismatqty = $inact['qty']*$inmat['qty'];
						IndentMaterial::create(array("indent_id"=>$newindent->id, "indent_qty"=>$thismatqty, "material_id"=>$inmat['store_material_id'], "buy_from"=>$buy_from, "buy_to"=>$buy_to));
					}
				}
				IndentMaterial::create(array("indent_id"=>$newindent->id, "indent_qty"=>$inact['qty'], "material_id"=>$inact['id'], "buy_from"=>$buy_from, "buy_to"=>$buy_to));
			}
		}
		foreach ($activityinfo as $indiact) {

			foreach ($indiact['qty'] as $indiactqty) {
				if(isset($indiactqty['id'])) {
					$schprojqty = ScheduleProjectQty::where("id", "=", $indiactqty['id'])->first();
					if($schprojqty) {
						
						$schprojindent = ScheduleProjectIndent::create(array("indent_id"=> $newindent->id, "schedule_project_id"=>$schprojqty->id, "indent_qty"=>$indiactqty['indiqtycurrentindent']));
						ScheduleIndents::create(array("indent_id"=>$newindent->id,"schedule_project_id"=>$indiactqty['id'], "indent_qty"=>$indiactqty['indiqtycurrentindent']));
					}
				}
			}
			foreach ($indiact['sub'] as $insubact) {

				foreach ($insubact['qty'] as $insubactqty) {
					if(isset($insubactqty['id'])) {
						
						SubScheduleIndents::create(array("indent_id"=>$newindent->id, "sub_schedule_project_id"=>$insubactqty['id'], "indent_qty"=>$insubactqty['indiqtycurrentindent']));
					}
				}
				foreach ($insubact['matmapped'] as $subschmat) {

					$matid = $subschmat['matid'];

					foreach ($subschmat['projqty'] as $inpq) {

							$schprojindent = SubScheduleProjectIndent::create(array("indent_id"=> $newindent->id, "sub_schedule_project_id"=>$inpq['id'], "indent_qty"=>$inpq['currentindentqty'], "material_id"=>$matid));
					
					}
					
					$indents = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $matid)->first();
					if(isset($subschmat['totalprojqty'])) {
						$totalqty = round($subschmat['totalprojqty'],2);

					} else {

						$totalqty = 0;
					}
					
				}
					
			}
		}
		return $newindent;
	}

	public function edit_subschedule_mat() {

		$actdet = Request::input("actdet");
		SubScheduleMaterialEdit::create(array("sub_schedule_material_id"=> $actdet['matmapped'][0]['id'], "old_qty"=>$actdet['matmapped'][0]['qty'], "edited_qty"=>$actdet['matmapped'][0]['editqty'], "reason"=>$actdet['matmapped'][0]['editreason']));
		SubScheduleMaterials::where("id", "=", $actdet['matmapped'][0]['id'])->update(array("qty"=>$actdet['matmapped'][0]['editqty']));
		return 1;

	}
	public function get_indent_file_data() {
		$projectid = Request::input("projectid");
		$schtype = Request::input("schtype");
		$filename = Request::input("filename");
		$i=-1;
		$out = array();
		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();
		// $schedulelist = Schedule::where("type", "=", $schtype)->where("project_id", "=", $projectid)->with("subschedules.subschmaterials.material")->with("subschedules.subschprojqty")->with("schproj")->get();
		$schedulelist = Schedule::where("type", "=", $schtype)->where("project_id", "=", $projectid)->with("subschedules.subschmaterials.material")->with("subschedules.subschmaterials.subschmatactgrp.actgrp.material.submaterial.storelevel1mat.storematerial")->with("subschedules.subschmaterials.subschmatactgrp.actgrp.material.submaterial.storelevel1mat.msmat")->with("subschedules.subschprojqty.subscheduleprojmatqty")->with("schproj")->get();
		if($schedulelist) {
			foreach ($schedulelist as $data) {
			    $i++;
			    $j=0;
			    $out[$i]['id'] = $data['id'];
			    $out[$i]['srno'] = $data['name'];
			    $out[$i]['desc'] = $data['desc'];
			    $out[$i]['uom'] = "";
			    $out[$i]['unit_qty'] = "";
			    $x = 1;
			    $y = 4;
			    $h=0;
			    $fp=fopen('uploads/indents/'.$filename,'r');
			    while($indentdata=fgetcsv($fp)){
			    	if(trim($indentdata[0]) == trim($data['name'])) {
			    		$temcount = 1;
					    foreach ($data['schproj'] as $schpro) {

						    $out[$i]['qty'][$h]['indiqty'] = $schpro['qty'];
						    $out[$i]['qty'][$h]['id'] = $schpro['id'];
						    $out[$i]['qty'][$h]['total_indent_qty'] = $schpro['total_indent_qty'];
						    $out[$i]['qty'][$h]['indiqtycurrentindent'] = $indentdata[$temcount];
						    $y++;
						    $x++;
						    $h++;
						    $temcount++;
						}
					}
				}
				fclose($fp);
		 	    $out[$i]['tot_qty'] = 0;
			    
			   foreach ($data['subschedules'] as $subschin) {

			    	$out[$i]['sub'][$j]['id'] = $subschin['id'];
			    	$out[$i]['sub'][$j]['srno'] = $subschin['no'];
			    	$out[$i]['sub'][$j]['desc'] = $subschin['descr'];
			    	$out[$i]['sub'][$j]['unit_qty'] = $subschin['unit_qty'];
			    	$out[$i]['sub'][$j]['supply_rate'] = $subschin['supply_rate'];
			    	$out[$i]['sub'][$j]['erection_rate'] = $subschin['erection_rate'];
			    	$out[$i]['sub'][$j]['fi_rate'] = $subschin['fi_rate'];
			    	$out[$i]['sub'][$j]['tot_qty'] = $subschin['qty'];
			    	$out[$i]['sub'][$j]['uom'] = $subschin['units'];
			    	$x = 1;
			    	$h=0;
			    	foreach ($subschin['subschprojqty'] as $subschproj) {

					    $out[$i]['sub'][$j]['qty'][$h]['indiqty'] = $subschproj['qty'];
					    $out[$i]['sub'][$j]['qty'][$h]['id'] = $subschproj['id'];
					    $out[$i]['sub'][$j]['qty'][$h]['indiqtycurrentindent'] = 0;
					    $out[$i]['sub'][$j]['qty'][$h]['total_indent_qty'] = $subschproj['total_indent_qty'];
					    $t=0;
					    foreach ($subschproj['subscheduleprojmatqty'] as $insubschprmat) {

					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['qty'] = $insubschprmat['qty'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['total_indent_qty'] = $insubschprmat['total_indent_qty'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['material_id'] = $insubschprmat['material_id'];
					    	$out[$i]['sub'][$j]['qty'][$h]['mat'][$t]['id'] = $subschproj['id'];
						    $t++;
					    }
					    $x++;
					    $h++;

					}

					$out[$i]['sub'][$j]['matmapped'] = array();
					
			    	foreach ($subschin['subschmaterials'] as $subscmat) {
			    		$actgroupcheck= false;
			    		$actgridarr = array();
			    		$submatarr = array();
			    		$g=0;
			    		if(count($subscmat['subschmatactgrp']) > 0) {

			    			$actgroupcheck=true;
			    			foreach ($subscmat['subschmatactgrp'] as $indisub) {
			    				$actgridarr[$g]['id'] = $indisub['activity_group_id'];
			    				$actgrdet = ActivityGroup::where("id", "=", $indisub['activity_group_id'])->first();
			    				$actgridarr[$g]['qty'] = $indisub['qty'];
			    				$actgridarr[$g]['name'] = $actgrdet['name'];

			    				foreach ($indisub['actgrp']['material'] as $indim) {
			    					
			    					foreach ($indim['submaterial'] as $indisubm) {
			    						$totq = $indisubm['storelevel1mat']['qty_per_pole']*$indisub['qty'];
			    						array_push($submatarr, array("matid"=>$indisubm['material_level1_id'], "matname"=>$indisubm['storelevel1mat']['storematerial']['name'], "msmatname"=>$indisubm['storelevel1mat']['msmat']['name'], 'qty_per_pole'=>$indisubm['storelevel1mat']['qty_per_pole'], 'thisactqty'=>$indisub['qty'], "totqty"=>$totq ));
			    					}
			    				}
			    				$g++;
			    			}
			    		}
			    		
					    array_push($out[$i]['sub'][$j]['matmapped'], array("matid"=>$subscmat['material_id'], "materialdesc"=>$subscmat->material['name'], "uom"=>$subscmat->material['units'], "qty"=>$subscmat['qty'], "unitqty"=>$subscmat['unit_qty'], "currentindentqty"=>0, "id"=>$subscmat['id'], "actgroupcheck"=>$actgroupcheck, "actgridarr"=>$actgridarr, "submatarr"=>$submatarr));

			    	}
			    	$j++;
			    }
					
			}
			
		} else {

			$out = 0;
		}

		return $out;
	}

	public function calculateactivityvarall() {

		$activityinfopre = Request::input("activityinfo");
					
		$projectid = Request::input("projectid");

		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects")->first();		
		$out = array();
		
		foreach ($activityinfopre as $activityinfo) {

			$total_qty = 0;
			$k=0;
			foreach ($projinfo->subprojects as $subpro) {
				foreach ($subpro->multiplier as $subpromulti) {
					if(!isset($activityinfo['qty'][$k])) {

						$activityinfo['qty'][$k]['indiqtycurrentindent'] = 0;
					}
					$total_qty += floatval($activityinfo['qty'][$k]['indiqtycurrentindent']); 
					$k++;
				}
			}
			$activityinfo['tot_qty'] = $total_qty;
			for($x=0;$x<count($activityinfo['sub']);$x++) {
				$subtotal_qty = 0;
				$subunit_qty = $activityinfo['sub'][$x]['unit_qty'];
				$k = 0;
				foreach ($projinfo['subprojects'] as $subpro) {
					foreach ($subpro['multiplier'] as $subpromulti) {
						$activityinfo['sub'][$x]['qty'][$k]['indiqtycurrentindent'] = $subunit_qty*$activityinfo['qty'][$k]['indiqtycurrentindent'];
						$subtotal_qty += $activityinfo['sub'][$x]['qty'][$k]['indiqtycurrentindent'];
						$k++;
					}
				}
				$activityinfo['sub'][$x]['tot_qty'] = $subtotal_qty;
				for($s=0;$s<count($activityinfo['sub'][$x]['matmapped']);$s++) {

					$y=0;
					$mapqty = 0;
					foreach ($projinfo['subprojects'] as $subpro) {
						foreach ($subpro['multiplier'] as $subpromulti) {

							// $cinqty = $activityinfo['sub'][$x]['matmapped'][$s]['unitqty']*$activityinfo['qty'][$y]['indiqtycurrentindent'];
							// $activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'] = $cinqty;
							// $activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['id'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['id'];
							// $mapqty += $activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'];

							$currindiindentm =  $activityinfo['sub'][$x]['matmapped'][$s]['unitqty']*$activityinfo['qty'][$y]['indiqtycurrentindent'];


							for ($m=0; $m<count($activityinfo['sub'][$x]['qty'][$y]['mat']); $m++) {
							
								if($activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['material_id'] == $activityinfo['sub'][$x]['matmapped'][$s]['matid']) {

									$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['total_indent_qty'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['total_indent_qty'];
									$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['qty'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['qty'];
									$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['id'] = $activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['id'];
									$totalin = $currindiindentm+$activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['total_indent_qty'];

									if(floatval($totalin) > floatval($activityinfo['sub'][$x]['qty'][$y]['mat'][$m]['qty'])) {

										$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'] = 0;
									} else {
										$activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'] = $activityinfo['sub'][$x]['matmapped'][$s]['unitqty']*$activityinfo['qty'][$y]['indiqtycurrentindent'];
										$mapqty += $activityinfo['sub'][$x]['matmapped'][$s]['projqty'][$y]['currentindentqty'];
									}
									
								}
							}
							$y++;
						}
					}
					$mid = $activityinfo['sub'][$x]['matmapped'][$s]['matid'];
					$stdet = StoreMaterialUom::where("store_material_id", "=", $mid)->with("stmatuom")->get();
					if($stdet[0]['stmatuom']['uom'] == "NOS" || $stdet[0]['stmatuom']['uom'] == "SET") {
						$activityinfo['sub'][$x]['matmapped'][$s]['totalprojqty'] = round($mapqty);
					} else {

						$activityinfo['sub'][$x]['matmapped'][$s]['totalprojqty'] = $mapqty;
					}
				}
			}

			array_push($out, $activityinfo);
		}
		return $out;
	}

	public function getsubprojboq() {

		$schdet = Schedule::where("project_id", "=", 2)->with("subschedules.subschprojqty")->with(array('subschedules.subschmaterials'=>function($query) {
		        $query->where('material_id', '=', 9);
		    }))->whereHas('subschedules.subschmaterials', function($query)
			{
			    $query->where('material_id', '=', 9);
			})->get();
		$out = array();
		$checkmat = array();
		foreach ($schdet as $inschdet) {
			
			foreach ($inschdet['subschedules'] as $insubsch) {
				
				foreach ($insubsch['subschmaterials'] as $insubmat) {
					
					if(!in_array($insubmat['material_id'], $checkmat)) {

						foreach ($insubsch['subschprojqty'] as $inschproj) {
							
							$out[$insubmat['material_id']][$inschproj['sub_project_id']] = $inschproj['qty'];
						}
						$checkmat[] = $insubmat['material_id'];
					} else {

						foreach ($insubsch['subschprojqty'] as $inschproj) {
							
							$out[$insubmat['material_id']][$inschproj['sub_project_id']] += $inschproj['qty'];
						}
					}
				}
			}
		}

		return $out;
	}

	public function approveindent() {

		$indentid = Request::input("indentid");
		$indentlist = Request::input("indentlist");
		$schprojindent = ScheduleProjectIndent::where("indent_id", "=", $indentid)->get();

		foreach ($indentlist as $indiindent) {
			if(isset($indiindent['matindentdet'])) {
				IndentMaterial::where("id", "=", $indiindent['id'])->update(array("indent_qty"=>$indiindent['indent_qty']));

				foreach ($indiindent['matindentdet'] as $inmatdet) {
					
					foreach ($inmatdet['subschprojqty'] as $inmatqty) {

						foreach ($inmatqty['subscheduleprojindent'] as $inqtyy) {

							SubScheduleProjectIndent::where("id", "=", $inqtyy['id'])->update(array("indent_qty"=>$inqtyy['indentqtyedit']));
						}
					}
				}
			}
		}
		foreach ($schprojindent as $indiactqty) {
			$schprojqty = ScheduleProjectQty::where("id", "=", $indiactqty['schedule_project_id'])->first();
			if($schprojqty) {
				$totschprojqty = $schprojqty->total_indent_qty+$indiactqty['indent_qty'];
				$schprojqty->total_indent_qty = $totschprojqty;
				$schprojqty->save();
			}
		}
		$subschprojindent = SubScheduleProjectIndent::where("indent_id", "=", $indentid)->get();
		foreach ($subschprojindent as $subindiactqty) {
			$subschprojqty = SubScheduleProjectQty::where("id", "=", $subindiactqty['sub_schedule_project_id'])->first();
			if($subschprojqty) {
				$totsubschprojqty = $subschprojqty->total_indent_qty+$subindiactqty['indent_qty'];
				$subschprojqty->total_indent_qty = $totsubschprojqty;
				$subschprojqty->save();
			}

			$subschprojmatqty = SubScheduleProjectMaterialQty::where("sub_schedule_project_id", "=", $subindiactqty['sub_schedule_project_id'])->where("material_id", "=", $subindiactqty['material_id'])->first();
			if($subschprojmatqty) {
				$totsubschprojmatqty = $subschprojmatqty->total_indent_qty+$subindiactqty['indent_qty'];
				$subschprojmatqty->total_indent_qty = $totsubschprojmatqty;
				$subschprojmatqty->save();
			}
		}

		$indentdet = Indent::where("id", "=", $indentid)->first();
		$indentmat = IndentMaterial::where("indent_id", "=", $indentid)->get();
		foreach ($indentmat as $indimat) {
			$indents = Indenttotal::where("project_id", "=", $indentdet->project_id)->where("material_id", "=", $indimat['material_id'])->first();
			if($indents) {

				$indents->total_indent_qty = $indents->total_indent_qty+$indimat['indent_qty'];
				$indents->save();
			} else {

				Indenttotal::create(array("project_id"=>$indentdet->project_id, "material_id"=>$indimat['material_id'], "total_indent_qty"=>$indimat['indent_qty']));
			}
		}
		
		Indent::where("id", "=", $indentid)->update(array("status"=>1));
		return 1;	
	}

	public function rejectindent() {
		$indentid = Request::input("indentid");
		$remarks = Request::input("remarks");
		Indent::where("id", "=", $indentid)->update(array("status"=>2, "remarks"=>$remarks));
		return 1;
	}

	public function saveactivitygroup() {

		$projectid = Request::input("projectid");
		$matlist = Request::input("matlist");
		$activityname = Request::input("activityname");
		$actarr = array(
				"project_id"=>$projectid,
				"name"=>$activityname
			);
		$createactgroup = ActivityGroup::create($actarr);

		foreach ($matlist as $indimat) {
			
			$actgrmat = array(
					"activity_groups_id"=>$createactgroup->id,
					"material_id"=>$indimat['materialid'],
					"qty"=>$indimat['quantity']
				);
			$createactgrpmat = ActivityGroupMaterial::create($actgrmat);

			foreach ($indimat['materials'] as $ininmat) {

				$actgrsubmat = array(
						"activity_group_material_id"=>$createactgrpmat->id,
						"material_level1_id"=>$ininmat['level1matid'],
						"qty"=>$ininmat['qty']
					);	

				$createactgrpsubmat = ActivityGroupSubMaterial::create($actgrsubmat);				
			}
		}

		return 1;
	}

	public function get_activity_group_list() {

		$matid = Request::input("matid");
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store.project')->first();
		$storeid = $userdata['users']['store']['id'];
		$projectid = Request::input("projectid");
		if(!isset($projectid)) {
			$projectid = $userdata['users']['store']['project']['id'];
		}

		if($projectid == 2) {

			$projectid = 4;
		}
		if(!isset($matid)) {
			$actdet = ActivityGroup::where("project_id", "=", $projectid)->with("material.submaterial.storelevel1mat.storematerial.matuom.stmatuom")->with("material.submaterial.storelevel1mat.msmat")->with("material.submaterial.storelevel1mat.storeuom")->get();
		} else {
			$actdet = ActivityGroup::where("project_id", "=", $projectid)->with(array('material'=>function($query) use ($matid){
			        $query->where('material_id', '=', $matid)->with("submaterial.storelevel1mat.storematerial.matuom.stmatuom")->with("submaterial.storelevel1mat.storeuom")->with("submaterial.storelevel1mat.msmat");
			    }))->whereHas('material', function($query) use ($matid)
				{
				    $query->where('material_id', '=', $matid);
				})->get();
		}
		foreach ($actdet as $inactdet) {
			
			foreach ($inactdet['material'] as $inactmat) {
				
				foreach ($inactmat['submaterial'] as $insubamt) {
					
					$storest = StoreStock::where("store_id", "=", $storeid)->where("material_id", "=", $insubamt['storelevel1mat']['store_material_id'])->where("material_level1_id", "=", $insubamt['storelevel1mat']['id'])->where("fab_flag", "=", 1)->first();
					if($storest) {
						$insubamt['storelevel1mat']['total_received'] = $storest['total_received'];
						$insubamt['storelevel1mat']['total_issued'] = $storest['total_issued'];
						$insubamt['storelevel1mat']['total_stock'] = $storest['quantity'];
						$insubamt['storelevel1mat']['physical_qty'] = $storest['physical_qty'];
						$insubamt['storelevel1mat']['stockid'] = $storest['id'];
					} else {
						$insubamt['storelevel1mat']['total_received'] = 0;
						$insubamt['storelevel1mat']['total_issued'] = 0;
						$insubamt['storelevel1mat']['total_stock'] = 0;
						$insubamt['storelevel1mat']['physical_qty'] = 0;
						$insubamt['storelevel1mat']['stockid'] = 0;
					}
				}
			}
		}

		return $actdet;
	}


	public function get_activity_group_list_unique() {

		$matid = Request::input("matid");
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store.project')->first();
		$storeid = $userdata['users']['store']['id'];
		$projectid = $userdata['users']['store']['project']['id'];

		if($projectid == 2) {

			$projectid = 4;
		}
		if(!isset($matid)) {
			$actdet = ActivityGroup::where("project_id", "=", $projectid)->with("material.submaterial.storelevel1mat.storematerial.matuom.stmatuom")->with("material.submaterial.storelevel1mat.msmat")->with("material.submaterial.storelevel1mat.storeuom")->get();
		} else {
			$actdet = ActivityGroup::where("project_id", "=", $projectid)->with(array('material'=>function($query) use ($matid){
			        $query->where('material_id', '=', $matid)->with("submaterial.storelevel1mat.storematerial.matuom.stmatuom")->with("submaterial.storelevel1mat.storeuom")->with("submaterial.storelevel1mat.msmat");
			    }))->whereHas('material', function($query) use ($matid)
				{
				    $query->where('material_id', '=', $matid);
				})->get();
		}

		$out = array();
		$matcheck = array();
		
		foreach ($actdet as $inactdet) {
			
			foreach ($inactdet['material'] as $inactmat) {
				foreach ($inactmat['submaterial'] as $insubamt) {
					
					$storest = StoreStock::where("store_id", "=", $storeid)->where("material_id", "=", $insubamt['storelevel1mat']['store_material_id'])->where("material_level1_id", "=", $insubamt['storelevel1mat']['id'])->where("fab_flag", "=", 1)->first();
					if($storest) {
						$insubamt['storelevel1mat']['total_received'] = $storest['total_received'];
						$insubamt['storelevel1mat']['total_issued'] = $storest['total_issued'];
						$insubamt['storelevel1mat']['total_stock'] = $storest['quantity'];
						if($storest['physical_qty'] > 0) {
							$insubamt['storelevel1mat']['physical_qty'] = $storest['physical_qty'];
						} else {
							$insubamt['storelevel1mat']['physical_qty'] = $storest['quantity'];
						}
						$insubamt['storelevel1mat']['stockid'] = $storest['id'];
					} else {
						$insubamt['storelevel1mat']['total_received'] = 0;
						$insubamt['storelevel1mat']['total_issued'] = 0;
						$insubamt['storelevel1mat']['total_stock'] = 0;
						$insubamt['storelevel1mat']['physical_qty'] = 0;
						$insubamt['storelevel1mat']['stockid'] = 0;
					}	

					if(!in_array($insubamt['storelevel1mat']['ere_code']."=".$insubamt['storelevel1mat']['msmat']['id'], $matcheck)) {			

						array_push($out, $insubamt);
						$matcheck[] = $insubamt['storelevel1mat']['ere_code']."=".$insubamt['storelevel1mat']['msmat']['id'];
					}					
					
				}
				
			}
		}

		return $out;
	}

	public function calculateactivityvarqty() {

		$activityinfo = Request::input("activityinfo");			
		$projectid = Request::input("projectid");
		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();
		$total_qty = 0;
		$k=0;
		foreach ($projinfo->subprojects as $subpro) {
			foreach ($subpro->multiplier as $subpromulti) {
				if(!isset($activityinfo['qty'][$k])) {
					$activityinfo['qty'][$k]['indiqty'] = 0;
				}
				$total_qty += floatval($activityinfo['qty'][$k]['indiqty']); 
				$k++;
			}
		}
		$activityinfo['tot_qty'] = $total_qty;
		for($x=0;$x<count($activityinfo['sub']);$x++) {
			$subtotal_qty = 0;
			$subunit_qty = $activityinfo['sub'][$x]['unit_qty'];
			$k = 0;
			foreach ($projinfo['subprojects'] as $subpro) {
				foreach ($subpro['multiplier'] as $subpromulti) {
					$activityinfo['sub'][$x]['qty'][$k]['indiqty'] = $subunit_qty*$activityinfo['qty'][$k]['indiqty'];
					$subtotal_qty += $activityinfo['sub'][$x]['qty'][$k]['indiqty'];
					$k++;
				}
			}
			$activityinfo['sub'][$x]['tot_qty'] = $subtotal_qty;
			for($z=0;$z<count($activityinfo['sub'][$x]['matmapped']);$z++) {
				if($subunit_qty > 0) {
	    			$activityinfo['sub'][$x]['matmapped'][$z]['qty'] = $activityinfo['sub'][$x]['matmapped'][$z]['unitqty']*($subtotal_qty/$subunit_qty);
	    		} else {

	    			$activityinfo['sub'][$x]['matmapped'][$z]['qty'] = 0;
	    		}
	    		
			    // array_push($out[$i]['sub'][$j]['matmapped'], array("matid"=>$subscmat['material_id'], "materialdesc"=>$subscmat->material['name'], "uom"=>$subscmat->material['units'], "qty"=>$subscmat['qty'], "unitqty"=>$subscmat['unit_qty'], "currentindentqty"=>0, "id"=>$subscmat['id'], "actgroupcheck"=>$actgroupcheck, "actgridarr"=>$actgridarr, "submatarr"=>$submatarr));

	    	}
		}
		return $activityinfo;
	}

	public function getmatindentinfo() {

		$indentid = Request::input("indentid");
		$matid = Request::input("matid");
		$projectid = Request::input("projectid");
		$subproj = SubProjects::where("project_id", "=", $projectid)->with("multiplier")->get();

		$subprojmatin = SubSchedule::whereHas("subschprojqty.subscheduleprojindent", function($query) use ($indentid, $matid){
			$query->where("indent_id", "=", $indentid)->where("material_id", "=", $matid);

		})->with(array("subschprojqty.subscheduleprojindent"=>function($q) use ($indentid, $matid) {

			$q->where("indent_id", "=", $indentid)->where("material_id", "=", $matid);
		}))->with(array("subschprojqty.subscheduleprojmatqty"=>function($q) use ($matid) {

			$q->where("material_id", "=", $matid);
		}))->get();

		foreach ($subprojmatin as $insubsch) {
			
			foreach ($insubsch['subschprojqty'] as $insubproj) {
				$x = 0;
				foreach ($subproj as $insubpr) {
				
					foreach ($insubpr['multiplier'] as $inmulti) {
						
						if($inmulti['id'] == $insubproj['sub_project_id']) {
							$insubproj['subscheduleprojindent'][0]['indentqtyedit'] = $insubproj['subscheduleprojindent'][0]['indent_qty'];
							$x++;
						}
					}
				}
				if($x == 0) {

					array_push($insubsch['subschprojqty'], array('id'=>0, 'sub_project_id'=>0, 'subscheduleprojindent'=>array('id'=>0, 'indent_qty'=>0, 'indentqtyedit'=>0)));
				}
			}
		}

		return $subprojmatin;
	}

	public function get_material_indent() {

		$projectid = Request::input("projectid");
		$matid = Request::input("matid");
		$out = array();
		$indenttot = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $matid)->first();
		if($indenttot) {

			$totindent = $indenttot->total_indent_qty;
		} else {

			$totindent = 0;
		}

		$purchasedet = PurchaseOrderMaterial::where("material_id", "=", $matid)->whereHas("purchaseorder", function($query) use ($projectid){

			$query->where("project_id", "=", $projectid);
		})->sum("quantity");

		$tobepurchased = $totindent-$purchasedet;
		array_push($out, $totindent);
		array_push($out, $tobepurchased);
		return $out;
	}

	public function savenonbillindent() {

		$projectid = Request::input("projectid");
		$matdet = Request::input("matdet");

		$indenttotdet = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $matdet['id'])->first();
		if($indenttotdet) {

			$indenttotdet->total_indent_qty = $indenttotdet->total_indent_qty+$matdet['currentindentqty'];
			$indenttotdet->save();
		} else {

			Indenttotal::create(array("project_id"=>$projectid, "material_id"=>$matdet['id'], "total_indent_qty"=>$matdet['currentindentqty']));

		}
		return 1;
	}
}

