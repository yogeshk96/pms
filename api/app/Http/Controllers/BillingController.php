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
use App\ActivityGroup;
use App\ActivityGroupMaterial;
use App\ActivityGroupSubMaterial;
use App\SubScheduleMaterialActivityGroup;
use App\BillingTax;
use sendMail;
use DB;

class BillingController extends Controller {

	public function get_material_activities() {

		$projectid = Request::input("projectid");
		$materialid = Request::input("materialid");
		$subprojectid = Request::input("subprojectid");
		$i=-1;
		$out = array();
		$projinfo = Projects::where("id", "=", $projectid)->with("subprojects.multiplier")->first();
		$schedulelist = Schedule::where("project_id", "=", $projectid)
		->with(array('subschedules.subschmaterials'=>function($query) use ($materialid){
	        $query->where('material_id', '=', $materialid)->with("material");
	    }))->whereHas('subschedules.subschmaterials', function($query) use ($materialid)
		{
		    $query->where('material_id', '=', $materialid);
		})
		->with(array('subschedules.subschprojqty'=>function($query) use ($materialid, $subprojectid){
	        $query->where('sub_project_id', '=', $subprojectid)->with('subschprojmatbilled');
	    }))
	    ->with("schproj")->get();
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
	 	    $maincount = 0;
		    
		    foreach ($data['subschedules'] as $subschin) {

		    	$out[$i]['sub'][$j]['id'] = $subschin['id'];
		    	$out[$i]['sub'][$j]['srno'] = $subschin['no'];
		    	$out[$i]['sub'][$j]['desc'] = $subschin['descr'];
		    	$out[$i]['sub'][$j]['unit_qty'] = $subschin['unit_qty'];
		    	$out[$i]['sub'][$j]['supply_rate'] = $subschin['supply_rate'];
		    	$out[$i]['sub'][$j]['tot_qty'] = $subschin['qty'];
		    	$out[$i]['sub'][$j]['uom'] = $subschin['units'];
		    	$x = 1;
		    	$h=0;
		    	foreach ($subschin['subschprojqty'] as $subschproj) {

				    $out[$i]['sub'][$j]['qty'][$h]['indiqty'] = $subschproj['qty'];
				    if(count($subschproj['subschprojmatbilled']) > 0) {

				    	$out[$i]['sub'][$j]['qty'][$h]['total_billed_qty'] = $subschproj['subschprojmatbilled'][0]['total_billed_qty'];
				    } else {
				    	$out[$i]['sub'][$j]['qty'][$h]['total_billed_qty'] = 0;
				    }
				    $out[$i]['sub'][$j]['qty'][$h]['current_billed_qty'] = 0;
				    $out[$i]['sub'][$j]['qty'][$h]['id'] = $subschproj['id'];
				    $out[$i]['sub'][$j]['qty'][$h]['indiqtycurrentindent'] = 0;
				    $x++;
				    $h++;
				}

				$out[$i]['sub'][$j]['matmapped'] = array();
		    	foreach ($subschin['subschmaterials'] as $subscmat) {

				    array_push($out[$i]['sub'][$j]['matmapped'], array("matid"=>$subscmat['material_id'], "materialdesc"=>$subscmat->material['name'], "uom"=>$subscmat->material['units'], "qty"=>$subscmat['qty'], "unitqty"=>$subscmat['unit_qty'], "currentindentqty"=>0, "id"=>$subscmat['id']));

		    	}
		    	$out[$i]['sub'][$j]['count'] = count($subschin['subschmaterials']);
		    	if(count($subschin['subschmaterials']) > 0) {

		    		$maincount++;
		    	}
		    	$j++;
		    }
		    $out[$i]['count'] = $maincount;
				
		}

		return $out;
	}

	public function get_billing_taxes() {

		return BillingTax::get();
	}

	public function get_companydetails() {

		$tkn=Request::header('JWT-AuthToken');
		$adminuser=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		return User::with("company.compdetails")->where("id", "=", $adminuser->users->id)->first();
	}

}