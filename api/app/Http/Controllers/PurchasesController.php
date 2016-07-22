<?php namespace App\Http\Controllers;

use Request;
use Response;
use App\User;
use App\Store;
use App\StoreMaterial;
use App\Session;
use App\StoreStock;
use Carbon\Carbon;
use App\MaterialCategory;
use App\Vendor;
use App\VendorMaterials;
use App\VendorAccountDetails;
use App\InspectionMaterial;
use App\Projects;
use App\PurchaseOrder;
use App\RoadPermits;
// use App\Store;
use App\RoadPermitMaterial;
use App\RoadPermitDocs;
use App\RoadPermitInvoices;
use App\RoadPermitInvoiceDocs;
use App\RoadPermitIDI;
use App\SiteAreas;
use App\PurchaseOrderMaterial;
use App\Payments;
use App\PaymentMaterials;
use App\OldPurchaseOrder;
use App\InternalDiDocs;
use App\InternalDI;
use App\InternalDIPo;
use App\InternalDiPoIds;
use App\InternalDIMaterial;
use App\OldPurchaseOrderMaterial;
use App\Company;
use App\InspectionPoMaterial;
use App\DispatchMaterial;
use App\DispatchPoMaterial;
use App\PurchaseTaxes;
use App\Inspections;
use App\InspectionPo;
use App\PurchaseTaxMaterials;
use App\DispatchCallRaising;
use App\DispatchCallRaisingAttachments;
use App\PurchaseTerms;
use App\OldPurchaseTaxes;
use App\OldPurchaseTaxMaterials;
use App\OldPurchaseTerms;
use App\SpecialTerm;
use App\InspectionCallRaising;
use App\InspectionCallRaisingAttachments;
use App\Enquiry;
use App\EnquiryMaterial;
use App\EnquiryVendor;
use App\EnquiryVendorAttachments;
use App\EnquiryProjects;
use App\EnquiryTaxes;
use App\EnquiryTaxMaterials;
use App\OldEnquiryMaterial;
use App\OldEnquiryVendor;
use App\OldEnquiryProjects;
use App\OldEnquiryTaxes;
use App\OldEnquiryTaxMaterials;
use App\Taxes;
use App\PurchaseOrderInspection;
use App\PurchaseOrderInspectionMaterial;
use App\InspectionDocs;
use App\OldPurchaseOrderInspection;
use App\OldPurchaseOrderInspectionMaterial;
use App\OldInspectionDocs;
use App\InspectionDispatch;
use App\InspectionDispatchDocs;
use App\InspectionDispatchMaterial;
use App\InspectionDispatchMailer;
use App\InspectionDispatchMailerAttachments;
use App\QuotationDefaultTerms;
use App\QuotationTerms;
use App\OldQuotationTerms;
use App\GtpDrawings;
use App\EnquiryVendorQuotationDocs;
use App\OldEnquiryVendorQuotationDocs;
use App\QuotationPaymentTerms;
use App\OldQuotationPaymentTerms;
use App\Amendment;
use App\AmendmentDetails;
use App\Cs;
use App\CsRef;
use App\OldCsRef;
use App\PaymentPo;
use App\PaymentDocs;
use App\CsRefDetails;
use App\OldCsRefDetails;
use App\StoreMaterialUom;
use App\StoreMaterialUomConversion;
use App\PoFabricationMaterial;
use App\OldPoFabricationMaterial;
use App\StoreMaterialsLevel1;
use App\Indent;
use App\Indenttotal;
use App\IndentMaterial;
use App\Schedule;
use App\SubSchedule;
use App\BoqMaterial;
use DB;
use SendMail;
use SendRawMail;
use App\ScheduleProjectIndent;
use App\ActivityGroup;

class PurchasesController extends Controller {

	public function get_material_types() {

		$projectid = Request::input("projectid");
		$storeid = Request::input("storeid");
		if(isset($projectid) && !isset($storeid)) {
			// $matdet = MaterialCategory::orderBy('name')->with('submaterials.matuom.stmatuom')->with('submaterials.level1mat.storematerial.matuom.stmatuom')->with('submaterials.level1mat.storeuom.stmatuom')->with('submaterials.level1mat.msmat')->with(array('submaterials.indenttotal'=>function($query) use ($projectid){
			//         $query->where('project_id', '=', $projectid);
			//     }))->with(array('submaterials.level1mat.indenttotal'=>function($query) use ($projectid){
			//         $query->where('project_id', '=', $projectid);
			//     }))->with("submaterials.projects")->get();

		    $matdet = MaterialCategory::orderBy('name')->with('submaterials.matuom.stmatuom')->with(array('submaterials.indenttotal'=>function($query) use ($projectid){
		        $query->where('project_id', '=', $projectid);
		    }))->with("submaterials.projects")
		    ->with(array("submaterials.level1mat"=>function($qu) use ($projectid){

				$qu->whereHas("storematprojects", function($qq) use($projectid){

					$qq->where("project_id", "=", $projectid);
				})->with("storematerial.matuom.stmatuom")->with("msmat")->with('storeuom.stmatuom')
				->with(array('indenttotal'=>function($query) use ($projectid){
			        $query->where('project_id', '=', $projectid);
			    }));
			}))->with("submaterials.parent")->get();

				//calculating to be purchased qty
				foreach ($matdet as $inmatdet) {
			    	foreach ($inmatdet['submaterials'] as $insubm) {
			    		
			    		$pomatsum = PurchaseOrderMaterial::whereHas("purchaseorder", function($query) use ($projectid){

			    			$query->where("project_id", "=", $projectid);
			    		})->where("material_id", "=", $insubm['id'])->sum("quantity");
			    		if(isset($insubm['indenttotal'][0])) {
			    			$insubm['tobepurchasedqty'] = $insubm['indenttotal'][0]['total_indent_qty']-$pomatsum;
			    		}

			    		if(isset($insubm['level1mat'])) {

			    			foreach ($insubm['level1mat'] as $inlevelm) {
			    				
			    				$pomatlevel1sum = PurchaseOrderMaterial::whereHas("purchaseorder", function($query) use ($projectid){

					    			$query->where("project_id", "=", $projectid);
					    		})->where("material_id", "=", $inlevelm['store_material_id'])->sum("quantity");

				    			if(isset($inlevelm['indenttotal'][0])) {
				    				$inlevelm['tobepurchasedqty'] = $inlevelm['indenttotal'][0]['total_indent_qty']-$pomatlevel1sum;
				    			}
				    			
					    		
			    			}
			    		}
			    	}
			    }

		} else if(isset($projectid) && isset($storeid)) {
			$matdet = MaterialCategory::orderBy('name')->with('submaterials.matuom.stmatuom')->with('submaterials.level1mat.storematerial.matuom.stmatuom')->with('submaterials.level1mat.storeuom.stmatuom')->with('submaterials.level1mat.msmat')->with(array('submaterials.indenttotal'=>function($query) use ($projectid){
			        $query->where('project_id', '=', $projectid);
			    }))->with(array('submaterials.stocks'=>function($query) use ($storeid){
			        $query->where('store_id', '=', $storeid);
			    }))->with(array('submaterials.level1mat.stocks'=>function($query) use ($storeid){
			        $query->where('store_id', '=', $storeid);
			    }))->with(array('submaterials.level1mat.indenttotal'=>function($query) use ($projectid){
			        $query->where('project_id', '=', $projectid);
			    }))->with("submaterials.projects")->with("submaterials.parent")->get();
			     foreach ($matdet as $inmatdet) {
			    	foreach ($inmatdet['submaterials'] as $insubm) {
			    		
			    		$pomatsum = PurchaseOrderMaterial::whereHas("purchaseorder", function($query) use ($projectid){

			    			$query->where("project_id", "=", $projectid);
			    		})->where("material_id", "=", $insubm['material_id'])->sum("quantity");
			    		$insubm['indenttotal'][0]['total_po_qty'] = $pomatsum;
			    	}
			    }

		}else {

			$matdet = MaterialCategory::orderBy('name')->with('submaterials.matuom.stmatuom')->with('submaterials.level1mat.storematerial.matuom.stmatuom')->with('submaterials.level1mat.storeuom.stmatuom')->with("submaterials.projects")->with('submaterials.level1mat.msmat')->with("submaterials.parent")->get();
		}

		return $matdet;
		
	}
	public function get_material_subtypes() {

		if(Request::input('materialid')) {

			$id = Request::input('materialid');

			$matdet = MaterialCategory::where('id','=',$id)->with('submaterials.matuom.stmatuom')->with('submaterials.level1mat.storematerial.matuom.stmatuom')->with('submaterials.level1mat.storeuom.stmatuom')->with("submaterials.projects")->first();
			foreach ($matdet['submaterials'] as $inmatdet) {
				foreach ($inmatdet['projects'] as $inproj) {
					$out[$inmatdet['id']]['projectarr'][]=$inproj['project_id'];
				}
			}
			$matdet['projectarr'] = $out;
		} else {

			$matdet = MaterialCategory::with('submaterials.matuom.stmatuom')->with('submaterials.level1mat.storematerial.matuom.stmatuom')->with('submaterials.level1mat.storeuom.stmatuom')->with("submaterials.projects")->orderBy("name")->get();
		}
		
		return $matdet;
		
	}

	public function put_vendor_info() {

		$data = Request::all();

		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$vendor = Vendor::where('name', '=', $data['name'])->first();

		if(!isset($data['email2'])) {

			$data['email2'] = "";
		}
		if(!isset($data['phoneno2'])) {

			$data['phoneno2'] = "";
		}
		if(!isset($data['cin'])) {

			$data['cin'] = "";
		}
		if(!isset($data['tin'])) {

			$data['tin'] = "";
		}
		if(!isset($data['pan'])) {

			$data['pan'] = "";
		}
		if(!isset($data['servicetaxno'])) {

			$data['servicetaxno'] = "";
		}

		if(!isset($data['vat'])) {

			$data['vat'] = "";
		}
		if(!isset($data['cst'])) {

			$data['cst'] = "";
		}
		if(!isset($data['excise_registration_no'])) {

			$data['excise_registration_no'] = "";
		}

		if(!$vendor) {

			$coderep = str_ireplace(" &", "", $data['name']);
			$codeexp = explode(" ", $coderep);
			$code = "";
			foreach ($codeexp as $singlecode) {
				
				$code .= strtoupper(substr($singlecode, 0,1));
			}
			$data['name'] = strtoupper($data['name']);

			$singlevendor = array(

					"name"=>$data['name'],
					"emailid"=>$data['email'],
					"alternate_emailid"=>$data['email2'],
					"phoneno"=>$data['phoneno'],
					"alternate_phoneno"=>$data['phoneno2'],
					"address"=>$data['address'],
					"inhouse"=>$data['type'],
					"contact_person"=>$data['contact_person'],
					"cin"=>$data['cin'],
					"tin"=>$data['tin'],
					"pan"=>$data['pan'],
					"vat"=>$data['vat'],
					"cst"=>$data['cst'],
					"excise_registration_no"=>$data['excise_registration_no'],
					"servicetaxno"=>$data['servicetaxno'],
					"created_by"=>$user['users']['id']
				);

			$createvendor = Vendor::create($singlevendor);
			$code = substr($code, 0,3);
			$code = $code.$createvendor->id;

			$createvendor->vendor_code = $code;
			$createvendor->save();

			$vendorid = $createvendor->id;


			foreach ($data['accountdetails'] as $indiacdet) {
				
				$singleacdet = array(

						"vendor_id"=>$vendorid,
						"bank_name"=>$indiacdet['bank_name'],
						"bank_branch"=>$indiacdet['bank_branch'],
						"ifsc_code"=>$indiacdet['ifsc_code'],
						"account_number"=>$indiacdet['account_number']
					);

				VendorAccountDetails::create($singleacdet);
			}

			foreach ($data['materialvalues'] as $mval) {
				
				$singlevenmat = array(

						"store_material_id"=>$mval,
						"vendor_id"=>$vendorid
					);
				$createvenmat = VendorMaterials::create($singlevenmat);

			}

			$out = 1;

			
		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_material_vendors() {

		$submat = Request::input("submatid");

		foreach ($submat as $insubmat) {
			
			$idarr[] = $insubmat['id'];
		}
		return Vendor::whereHas('materials', function($query) use ($idarr)
			{
			    $query->whereIn('store_material_id', $idarr);
			})->with(array('materials.materials'=>function($query) use ($idarr){
		        $query->whereIn('id', $idarr);
		    }))->with(array('materials'=>function($query) use ($idarr){
		        $query->whereIn('store_material_id', $idarr);
		    }))->get();
	}

	public function raiseinspcall(SendRawMail $sendraw) {
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		
		$to = trim(Request::input('to'));
		$cc = Request::input('cc');

		$pos = Request::input("pos");
		//$name = Request::input('ref');
		$vendorid = Request::input('vendor');
		$projid = Request::input('project');

		$vendordet = Vendor::where("id", "=", $vendorid)->first();
	
		$q1 = new Inspections;
		//$q1->inspection_ref_no = $name;
		$q1->save();
		$inspid = $q1->id;

		for ($i=0; $i < count($pos); $i++) { 
			# code...
			$q2 = new InspectionPo;
			$q2->inspection_id = $inspid;
			$q2->po_id = $pos[$i];
			$q2->save();
		}
		$poclub = implode("-", $pos);
		$poinsprefno = $vendordet->vendor_code."/".$poclub."/INSP".$inspid;
		$q1->inspection_ref_no = $poinsprefno;
		$q1->save();

		if(trim($cc) != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$subject = Request::input('subject');
		$emailcontent = Request::input('emailcontent');
		$attachments = Request::input('attachments');
		$from = $user['users']['email'];
		$out = array();

		$templatecontent = file_get_contents("/var/www/html/inspection_cr_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);

		$singleCR = array(
			// "poid"=>$poid,
			"po_inspid"=>$inspid,
			"tomail"=>$to,
			"cc"=>$cc,
			"subject"=>$subject,
			"content"=>$emailcontent,
			"sent_by"=>$user['users']['id']
		);

		$createICR = InspectionCallRaising::create($singleCR);

		$ICRid = $createICR->id;
		$ICRno = 'ICR'+$ICRid;
		$templatecontent = str_ireplace("{{icrno}}", $ICRno, $templatecontent);
		if(count($attachments)>0){
			for($d=0;$d<count($attachments);$d++){
				$singleCRAttachment = array("inspection_call_raising_id"=>$ICRid, "doc_name"=>$attachments[$d]['doc_name'], "doc_url"=>$attachments[$d]['doc_url']);
				$createICRdoc = InspectionCallRaisingAttachments::create($singleCRAttachment);
			}
		}
		// InspectionCallRaisingAttachments

		$failedemail = array();
		$tomailids = explode(",", $to);
		foreach ($tomailids as $indiemailid) {
			$indiemailid = trim($indiemailid);
			$res = $sendraw->sendRawEmail($from, $indiemailid, $cc, $subject, $templatecontent, $attachments);
		}
		
		$cc = "";
		$to = $user['users']['email'];
		$res = $sendraw->sendRawEmail($from, $to, $cc, $subject, $templatecontent, $attachments);
		if($res == 0) {

			$failedemail[] = $to;
		}
		// return $res;
		// foreach ($ccarr as $ccmail) {
		// 	$ccmail = trim($ccmail);
		// 	$res = $sendraw->sendRawEmail($from, $ccmail, $subject, $templatecontent, $attachments);
		// 	if($res == 0) {

		// 		$failedemail[] = $ccmail;
		// 	}
		// }

		$out['ICRno'] = $ICRno;
		$out['failedmail'] = $failedemail;
		$out['newrefno'] = $poinsprefno;

		if(count($failedemail)>0)
		{
			$q9 = InspectionCallRaising::where('po_inspid','=',$inspid)->update(array('successflag' => 0));
		}

		return $out;		
	}

	public function raisedicall(SendRawMail $sendraw) {
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		
		$to = trim(Request::input('to'));
		$cc = Request::input('cc');

		$iid = Request::input("insp");
		$vendorid = Request::input('vendor');
		$projid = Request::input('project');
	
		$q1 = new InspectionDispatch;
		// $q1->dispatch_reference = $name;
		$q1->inspection_id = $iid;
		$q1->save();
		$diid = $q1->id;

		$vendordet = Vendor::where("id", "=", $vendorid)->first();
		$podisrefno = $vendordet->vendor_code."/".$iid."/DIS".$diid;
		$q1->dispatch_reference = $podisrefno;
		$q1->save();

		// for ($i=0; $i < count($pos); $i++) { 
		// 	# code...
		// 	$q2 = new InspectionPo;
		// 	$q2->inspection_id = $inspid;
		// 	$q2->po_id = $pos[$i];
		// 	$q2->save();
		// }


		if(trim($cc) != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$subject = Request::input('subject');
		$emailcontent = Request::input('emailcontent');
		$attachments = Request::input('attachments');
		$from = $user['users']['email'];
		$out = array();

		$templatecontent = file_get_contents("/var/www/html/dispatch_cr_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);

		$singleCR = array(
			// "poid"=>$poid,
			"dispatch_id"=>$diid,
			"tomail"=>$to,
			"cc"=>$cc,
			"subject"=>$subject,
			"content"=>$emailcontent,
			"sent_by"=>$user['users']['id']
		);

		$createICR = DispatchCallRaising::create($singleCR);

		$ICRid = $createICR->id;
		$ICRno = 'ICR'+$ICRid;
		$templatecontent = str_ireplace("{{icrno}}", $ICRno, $templatecontent);
		if(count($attachments)>0){
			for($d=0;$d<count($attachments);$d++){
				$singleCRAttachment = array("dispatch_call_raising_id"=>$ICRid, "doc_name"=>$attachments[$d]['doc_name'], "doc_url"=>$attachments[$d]['doc_url']);
				$createICRdoc = DispatchCallRaisingAttachments::create($singleCRAttachment);
			}
		}
		// InspectionCallRaisingAttachments

		$failedemail = array();
		$tomailids = explode(",", $to);
		foreach ($tomailids as $indiemailid) {
			$indiemailid = trim($indiemailid);
			$res = $sendraw->sendRawEmail($from, $indiemailid, $cc, $subject, $templatecontent, $attachments);
		}
		
		$res = $sendraw->sendRawEmail($from, $user['users']['email'], "", $subject, $templatecontent, $attachments);
		if($res == 0) {

			$failedemail[] = $to;
		}
		// return $res;
		// foreach ($ccarr as $ccmail) {
		// 	$ccmail = trim($ccmail);
		// 	$res = $sendraw->sendRawEmail($from, $ccmail, $subject, $templatecontent, $attachments);
		// 	if($res == 0) {

		// 		$failedemail[] = $ccmail;
		// 	}
		// }

		$out['ICRno'] = $ICRno;
		$out['failedmail'] = $failedemail;
		$out['disrefno'] = $podisrefno;

		if(count($failedemail)>0)
		{
			$q9 = DispatchCallRaising::where('dispatch_id','=',$diid)->update(array('successflag' => 0));
		}

		return $out;		
	}

	public function dispatchinfomailer(SendRawMail $sendraw) {
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$poid = Request::input('poid');
		$inspid = Request::input('inspid');
		$to = trim(Request::input('to'));
		$cc = Request::input('cc');
		$receiver_type = Request::input('rec_type');
		if($receiver_type=='vendor'){
			$vmail = Vendor::where('id','=',$to)->first();
			$to = $vmail['emailid'];
		}
		if(trim($cc) != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$subject = Request::input('subject');
		$emailcontent = Request::input('emailcontent');
		$attachments = Request::input('attachments');
		$from = $user['users']['email'];
		$out = array();

		$templatecontent = file_get_contents("/var/www/html/dispatch_info_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);

		$singleDIM = array(
			"poid"=>$poid,
			"po_inspid"=>$inspid,
			"tomail"=>$to,
			"cc"=>$cc,
			"subject"=>$subject,
			"content"=>$emailcontent,
			"receiver_type"=>$receiver_type,
			"sent_by"=>$user['users']['id']
		);

		$createDIM = InspectionDispatchMailer::create($singleDIM);

		$DIMid = $createDIM->id;
		$DIMno = 'DIM'+$DIMid;
		$templatecontent = str_ireplace("{{dimno}}", $DIMno, $templatecontent);
		if(count($attachments)>0){
			for($d=0;$d<count($attachments);$d++){
				$singleCRAttachment = array("inspection_dispatch_id"=>$DIMid, "doc_name"=>$attachments[$d]['doc_name'], "doc_url"=>$attachments[$d]['doc_url']);
				$createICRdoc = InspectionDispatchMailerAttachments::create($singleCRAttachment);
			}
		}
		// InspectionCallRaisingAttachments

		$failedemail = array();
		$res = $sendraw->sendRawEmail($from, $to, $cc, $subject, $templatecontent, $attachments);
		$res = $sendraw->sendRawEmail($from, $user['users']['email'], "", $subject, $templatecontent, $attachments);
		if($res == 0) {

			$failedemail[] = $to;
		}
		// return $res;
		// foreach ($ccarr as $ccmail) {
		// 	$ccmail = trim($ccmail);
		// 	$res = $sendraw->sendRawEmail($from, $ccmail, $subject, $templatecontent, $attachments);
		// 	if($res == 0) {

		// 		$failedemail[] = $ccmail;
		// 	}
		// }

		$out['DIMno'] = $DIMno;
		$out['failedmail'] = $failedemail;

		return $out;		
	}

	public function sendenquiry(SendRawMail $sendraw) {

		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$vendorlist = Request::input('vendorlist');
		$projectids = Request::input('projectids');
		$subject = Request::input('subject');
		$emailcontent = Request::input('emailcontent');
		$cc = Request::input('cc');
		if($cc != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$emailcontent = Request::input('emailcontent');
		$enqmateriallist = Request::input('enqmateriallist');
		$from = $user['users']['email'];

		$out = array();

		

		$singleenq = array(
				"subject"=>$subject,
				"cc"=>$cc,
				"content"=>$emailcontent,
				"sent_by"=>$user['users']['id']
			);

		$createenq = Enquiry::create($singleenq);

		$enqid = $createenq->id;

		foreach ($projectids as $pid) {
			
			$singleproject = array("enquiry_id"=>$enqid, "project_id"=>$pid);
			$createproject = EnquiryProjects::create($singleproject);
		}

		$enqno = "E".$enqid;
		foreach ($vendorlist as $vid) {

			$templatecontent = file_get_contents("/var/www/html/enquiry_mail_template.html");
			$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
			$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
			$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
			$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
			$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
			$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
			$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
			
			$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
			$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
			$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

			$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);

			$templatecontent = str_ireplace("{{enqno}}", $enqno, $templatecontent);

			$singlevendor = array("vendor_id"=>$vid['id'], "enquiry_id"=>$enqid);
			$createenqven = EnquiryVendor::create($singlevendor);
			if(!isset($vid['enqdocs'])) {

				$vid['enqdocs'] = array();
			}
			for($d=0;$d<count($vid['enqdocs']);$d++){

				$singlevendoc = array("enquiry_vendor_id"=>$createenqven->id, "doc_name"=>$vid['enqdocs'][$d]['doc_name'], "doc_url"=>$vid['enqdocs'][$d]['doc_url']);
				$createvendoc = EnquiryVendorAttachments::create($singlevendoc);
			}

			$vendorinfo = Vendor::where('id', '=', $vid['id'])->first();

			$explodevenmat = explode("=> ", $vid['material']);

			$venmatarr = array();

			$j = 1;

			$tablerow = "";

			foreach ($vid['matid'] as $matidthis) {

				$matthis = 0;
				$qtythis = 0;
				
				foreach ($enqmateriallist as $enqmatl) {
					
					if($enqmatl['id'] == $matidthis) {

						$matthis = $enqmatl['id'];
						$uomidthis = $enqmatl['uomid'];
						$qtythis = $enqmatl['quantity'];
						$units = $enqmatl['units'];
						$tablerow .= "<tr><td style='text-align:center;'>".$j."</td><td>".$enqmatl['name']."</td><td style='text-align:center;'>".$units."</td><td style='text-align:center;'>".$qtythis."</td></tr>";
						$j++;
					}
				}

				$singleenqmat = array(
						"material_id"=>$matthis,
						"store_material_uom_id"=>$uomidthis,
						"enquiry_vendor_id"=>$createenqven->id,
						"quantity"=>$qtythis,
					);
				$createenqmat = EnquiryMaterial::create($singleenqmat);

			}

			$templatecontent = str_ireplace("{{tablerow}}", $tablerow, $templatecontent);

			$failedemail = array();

			$explodevmails = explode(",", $vid['emailid']);
			foreach ($explodevmails as $vmail) {
				$vmail = trim($vmail);
				$res = $sendraw->sendRawEmail($from, $vmail, $cc, $subject, $templatecontent, $vid['enqdocs']);
				$res = $sendraw->sendRawEmail($from, $user['users']['email'], "", $subject, $templatecontent, $vid['enqdocs']);
				// if($res == 0) {

				// 	$failedemail[] = $vmail;
				// }
				
			}
			// foreach ($ccarr as $ccmail) {
			// 	$ccmail = trim($ccmail);
			// 	$res = $sendraw->sendRawEmail($from, $ccmail, $subject, $templatecontent, $vid['enqdocs']);
			// 	if($res == 0) {

			// 		$failedemail[] = $ccmail;
			// 	}
			// }

			
			
			
		}
		$failedemail = array();

		$out['enqno'] = $enqno;
		$out['failedmail'] = $failedemail;

		return $out;
	}




	public function resendenquiry(SendRawMail $sendraw) {

		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$vendorlist = Request::input('vendorlist');
		$enquiryid = Request::input('enquiryid');
		$projectids = Request::input('projectids');
		$subject = Request::input('subject');
		$emailcontent = Request::input('emailcontent');
		$cc = Request::input('cc');
		$failedemail = array();
		if($cc != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$emailcontent = Request::input('emailcontent');
		$enqmateriallist = Request::input('enqmateriallist');
		$from = $user['users']['email'];

		$out = array();		
		$enqid = $enquiryid;

		$enqno = "E".$enqid;	
		

		foreach ($vendorlist as $vid) {

			$templatecontent = file_get_contents("/var/www/html/enquiry_mail_template.html");
			$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
			$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
			$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
			$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
			$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
			$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
			$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
			
			$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
			$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
			$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

			$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);
			$templatecontent = str_ireplace("{{enqno}}", $enqno, $templatecontent);


			$createenqven = EnquiryVendor::where("vendor_id", "=", $vid['id'])->where("enquiry_id", "=", $enqid)->first();

			if(!$createenqven) {

				$singlevendor = array("vendor_id"=>$vid['id'], "enquiry_id"=>$enqid);
				$createenqven = EnquiryVendor::create($singlevendor);				
			}

			
			if(!isset($vid['enqdocs'])) {

				$vid['enqdocs'] = array();
			}
			for($d=0;$d<count($vid['enqdocs']);$d++){

				$singlevendoc = array("enquiry_vendor_id"=>$createenqven->id, "doc_name"=>$vid['enqdocs'][$d]['doc_name'], "doc_url"=>$vid['enqdocs'][$d]['doc_url']);
				$createvendoc = EnquiryVendorAttachments::create($singlevendoc);
			}

			$vendorinfo = Vendor::where('id', '=', $vid['id'])->first();

			$explodevenmat = explode("=> ", $vid['material']);

			$venmatarr = array();

			$j = 1;

			$tablerow = "";

				foreach ($vid['matid'] as $matid) {

					$matthis = 0;
					$qtythis = 0;

					foreach ($enqmateriallist as $enqmatl) {
					
						if($enqmatl['id'] == $matid) {

							$matthis = $enqmatl['id'];
							$qtythis = $enqmatl['quantity'];
							$units = $enqmatl['units'];

							$createenqmat = EnquiryMaterial::where("material_id", "=", $matthis)->where("enquiry_vendor_id", "=", $createenqven->id)->where("quantity", "=", $qtythis)->with("materialdetails")->first();

							if(!$createenqmat) {

								$createenqmatnew = EnquiryMaterial::where("material_id", "=", $matthis)->where("enquiry_vendor_id", "=", $createenqven->id)->with("materialdetails")->first();


								if($createenqmatnew) {

									$createenqmatnew->quantity= $qtythis;
									$createenqmatnew->save();

								} else {
									$singleenqmat = array(
											"material_id"=>$matthis,
											"enquiry_vendor_id"=>$createenqven->id,
											"store_material_uom_id"=>$enqmatl['uomid'],
											"quantity"=>$qtythis,
										);
									$createenqmat = EnquiryMaterial::create($singleenqmat);

								}

								$tablerow .= "<tr><td style='text-align:center;'>".$j."</td><td>".$enqmatl['name']."</td><td style='text-align:center;'>".$units."</td><td style='text-align:center;'>".$qtythis."</td></tr>";
									$j++;

							}
						}
					}

						
					

				}

				if($j > 1) {

					$templatecontent = str_ireplace("{{tablerow}}", $tablerow, $templatecontent);
					$failedemail = array();

					$explodevmails = explode(",", $vid['emailid']);
					foreach ($explodevmails as $vmail) {
						$vmail = trim($vmail);
						$res = $sendraw->sendRawEmail($from, $vmail, $cc, $subject, $templatecontent, $vid['enqdocs']);
						$res = $sendraw->sendRawEmail($from, $user['users']['email'], "", $subject, $templatecontent, $vid['enqdocs']);
						if($res == 0) {

							$failedemail[] = $vmail;
						}
						
					}
				}
			
			
		}

		$out['enqno'] = $enqno;
		$out['failedmail'] = $failedemail;

		return $out;
	}




	public function get_vendor_list() {

		return Vendor::orderBy("name")->get();
	}

	public function get_pos_inspections() {

		$pos = Request::input('dat');
		$count = count($pos);
		$iids = array();

		$podet = PurchaseOrder::whereIn("id", $pos)->where(function ($q) {
	      $q->where("vendor_approved_po", "=", "")->orWhere("company_approved_po", "=", "");
	    })->get();
		if($podet->count() > 0) {

			return 2;
		} else {
 
			$q1 = DB::table('inspection_po')
	                     ->select(DB::raw('inspection_id,count(*)'))
	                     ->whereIn('po_id',$pos)
	                     ->groupBy('inspection_id')
	                     ->having('count(*)','=',$count)
	                     ->get();
	       
	        for ($i=0; $i < count($q1); $i++) { 
	        	# code...
	        	$q2 = InspectionPo::where('inspection_id','=',$q1[$i]->inspection_id)->get();
	        	
	        	if($q2->count()==$count)
	        	{
	        		array_push($iids, $q1[$i]->inspection_id);
	        	}
	       	}

			$q3 = Inspections::whereIn('id',$iids)->get();
			return $q3;
		}

		
	}


	public function get_vendor_inspection_ref() {

		$vid = Request::input('vendorid');
		$pid = Request::input('projectid');
		$poids = Request::input('ponumber');
		//$poids = array();
		$insids = array();
		if(!isset($poids)) {

			$q1 = PurchaseOrder::where('project_id','=',$pid)->where('vendor_id','=',$vid)->select('id')->get();
		
			for ($i=0; $i < count($q1); $i++) { 
				# code...
				array_push($poids, $q1[$i]['id']);
			}
		}
		

		$q2 = InspectionPo::whereIn('po_id',$poids)->select('inspection_id')->get();

		for ($i=0; $i < count($q2); $i++) { 
			# code...
			array_push($insids, $q2[$i]['inspection_id']);
		}

		$q3 = Inspections::whereIn('id',$insids)->with('callraise.attachments')->with('insdocs.doctype')->with('insmat.inseachpomat.podets')->with('insmat.matdes')->get();

		return $q3;
		
	}


	public function get_poslinked_toins() {

		$iid = Request::input('dat');
		$poids = array();

		$q1 = InspectionPo::where('inspection_id','=',$iid)->get();
		for ($i=0; $i < count($q1); $i++) { 
			# code...
			array_push($poids,$q1[$i]['po_id']);
		}
		$q2 = PurchaseOrder::whereIn('id',$poids)->with('pomaterials.storematerial.category')->with('pomaterials.storeuom.stmatuom')->get();
		return $q2;

	}

	public function get_roadpermits_data() {

		$idi = Request::input('idis');
		$rpids = array();

		// return $idi;
		
		$q1 = RoadPermitIDI::distinct()->select('road_permit_id')->whereIn('idi_id',$idi)->get();
		for ($i=0; $i < count($q1); $i++) { 
			# code...
			array_push($rpids,$q1[$i]['road_permit_id']);
		}

		return $q2 = RoadPermits::whereIn('id',$rpids)->with('rpdocs')->with('invoices.docs')->with('material.matdes')->get();

	}

	public function get_vendor_code() {

		$id = Request::input('id');

		$vendor = Vendor::where('id','=', $id)->first();

		$out['code'] = $vendor->vendor_code;


	}

	public function get_material_uom() {

		$id = Request::input('materialid');

		return StoreMaterial::select('units')->where('id','=',$id)->first();
	}

	public function raiseinspcallmanual() {

		$pos = Request::input("pos");
		$date = Request::input('date');
		$att = Request::input('attachments');
		$vendorid = Request::input("vendor");
		$jointflag = Request::input('joint');
		if($jointflag)
		{
			$jflag = 1;
		}
		else
		{
			$jflag = 0;
		}
		$vendordet = Vendor::where("id", "=", $vendorid)->first();
		$q1 = new Inspections;
		//$q1->inspection_ref_no = $name;
		$q1->joint_inspection_flag = $jflag;
		$q1->save();
		$inspid = $q1->id;

		for ($i=0; $i < count($pos); $i++) { 
			# code...
			$q2 = new InspectionPo;
			$q2->inspection_id = $inspid;
			$q2->po_id = $pos[$i];
			$q2->save();
		}

		$poclub = implode("-", $pos);
		$poinsprefno = $vendordet->vendor_code."/".$poclub."/INSP".$inspid;
		$q1->inspection_ref_no = $poinsprefno;
		$q1->save();

		$new = new InspectionCallRaising;
		$new->po_inspid = $inspid;
		$new->manual_date = $date;
		$new->manual_flag = 1;
		$new->save();
		$new->id;

		if(count($att)>0)
		{
			for ($i=0; $i < count($att); $i++) { 
				# code...
				$q4 = new InspectionCallRaisingAttachments;
				$q4->inspection_call_raising_id = $new->id;
				$q4->doc_name = $att[$i]['doc_name'];
				$q4->doc_url = $att[$i]['doc_url'];
				$q4->save();
			}
		}
		$out['res'] = 1;
		$out['insprefno'] = $poinsprefno;
		return $out;
	}
	public function raisedispcallmanual() {

		// $pos = Request::input("pos");
		$vendorid = Request::input('vendor');
		$date = Request::input('date');
		$iid = Request::input('insp');
		$att = Request::input('attachments');
		
	
		$q1 = new InspectionDispatch;
		$q1->inspection_id = $iid;
		//$q1->dispatch_reference = $name;
		$q1->save();
		$diid = $q1->id;
		$vendordet = Vendor::where("id", "=", $vendorid)->first();

		// for ($i=0; $i < count($pos); $i++) { 
		// 	# code...
		// 	$q2 = new InspectionPo;
		// 	$q2->inspection_id = $inspid;
		// 	$q2->po_id = $pos[$i];
		// 	$q2->save();
		// }
		$podisrefno = $vendordet->vendor_code."/".$iid."/DIS".$diid;
		$q1->dispatch_reference = $podisrefno;
		$q1->save();

		$new = new DispatchCallRaising;
		$new->dispatch_id = $diid;
		$new->manual_date = $date;
		$new->manual_flag = 1;
		$new->save();
		$new->id;

		if(count($att)>0)
		{
			for ($i=0; $i < count($att); $i++) { 
				# code...
				$q4 = new DispatchCallRaisingAttachments;
				$q4->dispatch_call_raising_id = $new->id;
				$q4->doc_name = $att[$i]['doc_name'];
				$q4->doc_url = $att[$i]['doc_url'];
				$q4->save();
			}
		}

		$out['res'] = 1;

		$out['disrefno'] = $podisrefno;

		return $out;
	}

	public function generatepo() {

		$data = Request::all();
		$prevmonthdate = date('Y-m-d', strtotime(date('Y-m-d')." -1 month"));
		if(!isset($data['pomanualdate'])) {

			$data['pomanualdate'] = date("Y-m-d H:i:s");
		}
		if(isset($data['repeatpo'])) {
			// if($data['csrefid'] == 0) {

			// 	return 3;
			// }

		} else {
			if($data['csrefid'] == 0 && !isset($data['pomanualdate']) && $data['projectid'] != 3) {

				return 3;
			} 
			if($data['csrefid'] == 0 && $data['pomanualdate'] > $prevmonthdate && $data['projectid'] != 3){

				return 4;
			}
		}
		$check = 0;

		if(isset($data['ponothis'])) {

			$checkoldpo = PurchaseOrder::where("po_no", "=", $data['ponothis'])->first();
			if($checkoldpo) {

				$check = 1;
			}
		}
		if($check == 0) {

			$maxpoid = PurchaseOrder::max('id');

			$out = array();

			$year = date("Y");
			$thismon = date("m");

			$project = Projects::where('id', '=', $data['projectid'])->first();
			if($thismon >= 1 && $thismon <=3) {
				$year = $year-1;
				$yearnext = $year;
			} else {

				$yearnext = $year+1;
			}
			
			$out['year'] = $year."-".substr($yearnext, 2,2);
			$tkn=Request::header('JWT-AuthToken');

			$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

			$userid = $user['users']['id'];

			$companydetails = Company::where('id', '=', $user['users']['company_id'])->with('compdetails')->first();

			$out['companydetails'] = $companydetails;

			$vendor = Vendor::where('id', '=', $data['vendorid'])->first();
			$out['vendordetails'] = $vendor;

			if($data) {

				if(!isset($data['reference'])) {

					$data['reference'] = "";
				}
				if(!isset($data['transportmode'])) {

					$data['transportmode'] = "";
				}

				
				$out['today'] = date("d-m-Y", strtotime($data['pomanualdate']));
				$data['totalvalueofgoods'] = round($data['totalvalueofgoods']);
				$singlepurchase = array(

						"vendor_id"=>$data['vendorid'],
						"project_id"=>$data['projectid'],
						"billingaddress"=>$data['billingaddress'],
						"transporttype"=>$data['transporttype'],
						"termsnconditions"=>$data['termsnconditions'],
						"reference"=>$data['reference'],
						"total_cost"=>$data['totalvalueofgoods'],
						"transport_mode"=>$data['transportmode'],
						"po_date"=>$data['pomanualdate'],
						"billable"=>$data['potype'],
						"po_no"=>$maxpoid+1,
						"csref_id"=>$data['csrefid'],
						"created_by"=>$userid
					);
				$createpurchase = PurchaseOrder::create($singlepurchase);
				$totalqty = 0;
				$totalcost = 0;
				$vendormaterialids=[];
				$vmat = VendorMaterials::where("vendor_id", "=", $data['vendorid'])->get();
				if(count($vmat)){
					foreach ($vmat as $index => $vmaterial) {
						array_push($vendormaterialids, $vmaterial['store_material_id']);
					}
				}

				foreach ($data['materiallist'] as $mlistmain) {

					if($mlistmain['type'] != 3) {

						if(isset($mlistmain['materials'])) {

							foreach ($mlistmain['materials'] as $mlist) {
							
								if (!in_array($mlist['materialid'], $vendormaterialids)){
									$newMaterial = array(
														"created_at"=>date("Y-m-d H:i:s"),
														"updated_at"=>date("Y-m-d H:i:s"),
														"store_material_id"=>$mlist['materialid'],
														"vendor_id"=>$data['vendorid']
													);
									VendorMaterials::create($newMaterial);
								}

								

									$totalqty = $totalqty+$mlist['qty'];
									$totalcost = $totalcost+$mlist['valueofgoods'];
									if(!isset($mlist['remarks'])) {

										$mlist['remarks'] = "";
									}
									if(!isset($mlist['freightinsurance_rate'])) {

										$mlist['freightinsurance_rate'] = "";
									}
									if(!isset($mlistmain['mainuomid'])) {

										$mlistmain['mainuomid'] = 0;
									}
									
									$singlepurmat = array(

											"purchase_order_id"=>$createpurchase->id,
											"material_id"=>$mlist['materialid'],
											"quantity"=>$mlist['qty'],
											"unit_rate"=>$mlist['unitrate'],
											"freightinsurance_rate"=>$mlist['freightinsurance_rate'],
											"value_of_goods"=>$mlist['valueofgoods'],
											"remarks"=>$mlist['remarks'],
											"store_material_uom_id"=>$mlist['uomid'],
											"store_material_main_uom_id"=>$mlistmain['mainuomid'],
										);

								$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);
								$inddet = Indenttotal::where("material_id", "=",$mlist['materialid'])->where("project_id", "=", $data['projectid'])->first();
								if($inddet) {
									$inddet->total_po_qty = $inddet->total_po_qty+$mlist['qty'];
									$inddet->save();
								}
							}
						}
					} else {

						if(!isset($mlistmain['quantity'])) {

							$mlistmain['quantity'] = $mlistmain['qty'];
						}

							$totalqty = $totalqty+$mlistmain['quantity'];
							$totalcost = $totalcost+$mlistmain['valueofgoods'];
							if(!isset($mlistmain['remarks'])) {

								$mlistmain['remarks'] = "";
							}
							if(!isset($mlistmain['freightinsurance_rate'])) {

								$mlistmain['freightinsurance_rate'] = "";
							}
							
							$singlepurmatmain = array(

									"purchase_order_id"=>$createpurchase->id,
									"material_id"=>$mlistmain['materialid'],
									"quantity"=>$mlistmain['quantity'],
									"unit_rate"=>$mlistmain['unitrate'],
									"freightinsurance_rate"=>$mlistmain['freightinsurance_rate'],
									"value_of_goods"=>$mlistmain['valueofgoods'],
									"remarks"=>$mlistmain['remarks'],
									"store_material_uom_id"=>$mlistmain['mainuomid'],
								);

							$createsinglemat = PurchaseOrderMaterial::create($singlepurmatmain);

							$inddet = Indenttotal::where("material_id", "=",$mlistmain['materialid'])->where("project_id", "=", $data['projectid'])->first();
							if($inddet) {
								$inddet->total_po_qty = $inddet->total_po_qty+$mlistmain['quantity'];
								$inddet->save();
							}
							if(isset($mlistmain['materials'])) {
								foreach ($mlistmain['materials'] as $mlist) {

									if (!in_array($mlist['materialid'], $vendormaterialids)){
										$newMaterial = array(
															"created_at"=>date("Y-m-d H:i:s"),
															"updated_at"=>date("Y-m-d H:i:s"),
															"store_material_id"=>$mlist['materialid'],
															"vendor_id"=>$data['vendorid']
														);
										VendorMaterials::create($newMaterial);
									}
									
									$singlefabmat = array(

										"purchase_order_material_id"=>$createsinglemat->id,
										"qty"=>$mlist['qty'],
										"store_material_uom_id"=>$mlist['uomid'],
										"store_material_id"=>$mlist['materialid'],
										"store_material_level1_id"=>$mlist['level1matid']
									);

									$createsinglefabmat = PoFabricationMaterial::create($singlefabmat);
								}
							}
						}
					
				}

				$createpurchase->total_qty= $totalqty;
				$createpurchase->save();

				if(isset($data['taxdetails']) && count($data['taxdetails']) > 0) {

					foreach ($data['taxdetails'] as $tax) {

						if(!isset($tax['taxdescription'])) {

							$tax['taxdescription'] = "";
						}

						$singlepurchasetaxes = array(
								"purchase_id"=>$createpurchase->id,
								"name"=>$tax['taxtitle'],
								"type"=>$tax['taxtype'],
								"tax_id"=>$tax['id'],
								"tax_desc"=>$tax['taxdescription'],
								"taxpercentage"=>$tax['taxpercentage'],
								"inclusive_taxpercentage"=>$tax['inclusivetaxpercentage'],
								"value"=>$tax['taxamount'],
								"lumpsum"=>$tax['lumpsum']
							);

						$taxcreate = PurchaseTaxes::create($singlepurchasetaxes);

						foreach ($tax['taxmaterials'] as $taxmat) {
							
							$materialidthis = $taxmat['material_id'];
							if(!isset($taxmat['tax'])) {

								$taxmat['tax']['tax_id'] = 0;
							}
							$potaxes = PurchaseTaxes::where("purchase_id", "=", $createpurchase->id)->where("tax_id", "=", $taxmat['tax']['tax_id'])->first();
							if($potaxes) {

								$purchase_tax_id = $potaxes->id;
							} else {

								$purchase_tax_id = 0;
							}
							if($materialidthis != 0) {

								$pomatid = PurchaseOrderMaterial::where("purchase_order_id", "=", $createpurchase->id)->where("material_id", "=", $materialidthis)->first();
								if($pomatid){
									$materialidthis = $pomatid->id;
								}
							}
							$singletaxmat = array("tax_id"=>$taxcreate->id, "purchase_taxes_id"=>$purchase_tax_id, "material_id"=>$materialidthis);
							$createtaxmat = PurchaseTaxMaterials::create($singletaxmat);
						}
					}
				}

				if(isset($data['specialterms']) && count($data['specialterms']) > 0) {

					foreach ($data['specialterms'] as $sterm) {

						$singlespecial = array(
								"purchase_id"=>$createpurchase->id,
								"name"=>$sterm['termtitle'],
								"condition"=>$sterm['termdesc']
							);

						$specialcreate = PurchaseTerms::create($singlespecial);
					}
				}
				$poid = $createpurchase->id;

				$out['poid'] = $poid;

				$out['podetails'] = $createpurchase;
				
				if(!isset($data['ponothis'])) {

					$pono = "SSEL/".$project->projectcode."/".$vendor->vendor_code."/".$out['year']."/".$poid;
					$serachpono = PurchaseOrder::where("po_no", "=", $pono)->first();
					if($serachpono) {

						$pono = "SSEL/".$project->projectcode."/".$vendor->vendor_code."/".$out['year']."/".($poid+1);
					}

					$out['pono'] = $pono;
				} else {
					$pono = $data['ponothis'];
					$out['pono'] = $data['ponothis'];
				}

				$createpurchase->po_no = $pono;
				$createpurchase->save();

				
			}

			$mainpoidnew = $createpurchase->id;

			$pomatcal = PurchaseOrderMaterial::where("purchase_order_id", "=", $mainpoidnew)->get();

			$pomatcalarr = array();

			foreach ($pomatcal as $indipomatcal) {
				
				$pomatcalarr[$indipomatcal->id]['amount'] = $indipomatcal->value_of_goods;
				$pomatcalarr[$indipomatcal->id]['tax'] = $indipomatcal->value_of_goods;
				$pomatcalarr[$indipomatcal->id]['freightinsurance_rate'] = $indipomatcal->freightinsurance_rate;
				$pomatcalarr[$indipomatcal->id]['quantity'] = $indipomatcal->quantity;
			}

			$potaxescal = PurchaseTaxes::where("purchase_id", "=", $mainpoidnew)->get();

			foreach ($potaxescal as $indipotaxescal) {
				
				if($indipotaxescal->lumpsum == 1 && $indipotaxescal->tax_id != 11) {

					foreach ($pomatcalarr as $key => $value) {
						
						$pomatcalarr[$indipomatcal->id]['tax'] += (($indipotaxescal->tax_amount*$pomatcalarr[$indipomatcal->id]['quantity'])/$createpurchase->total_qty);
					}

				} else {


					$potaxmatcal = PurchaseTaxMaterials::where("tax_id", "=", $indipotaxescal->id)->get();
					foreach ($potaxmatcal as $indipotaxtmatcal) {
						
						if($indipotaxtmatcal->material_id != 0) {

							$pomatcalarr[$indipotaxtmatcal->material_id]['tax'] += (($indipotaxescal->taxpercentage*$pomatcalarr[$indipotaxtmatcal->material_id]['amount'])/100);
						} else if($indipotaxtmatcal->purchase_taxes_id != 0){

							$caltaxontax = PurchaseTaxes::where("id", "=", $indipotaxtmatcal->purchase_taxes_id)->with("taxmaterials")->first();

							foreach ($potaxmatcal as $taxmatin) {

								if($indipotaxtmatcal->material_id != 0) {

									foreach ($caltaxontax->taxmaterials as $intaxmat) {
										
										if($taxmatin['material_id'] == $intaxmat['material_id']) {

											$pomatcalarr[$taxmatin['material_id']]['tax'] += (($indipotaxtmatcal->taxpercentage*($caltaxontax->taxpercentage * $pomatcalarr[$taxmatin->material_id]['amount']/100))/100);
										}
									}

									
								}	
							}
							
						}
					}
				}
			}

			foreach ($pomatcalarr as $key => $value) {

			
				$taxtotalrate = ($value['tax']/$value['quantity']) + $value['freightinsurance_rate'];
				PurchaseOrderMaterial::where("id", "=", $key)->update(array("unit_rate_taxed"=>$taxtotalrate));

			}

		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_project_list() {

		return Projects::with('subprojects.multiplier')->with("pendingindents")->with("approvedindents")->get();
	}

	public function get_vendor_polist_inspections() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$mainarr = array();

		if($vendorid == "All") {

			$out = PurchaseOrder::where('status','=', 1)->where('project_id', '=', $projectid)/*->with('project')*/->with('inspections')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 1)->where('project_id', '=', $projectid)/*->with('project')*/->with('inspections')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->where('project_id', '=', $projectid)/*->with('project')*/->with('inspections')->with("vendor")->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->where('project_id', '=', $projectid)/*->with('project')*/->with('inspections')->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function get_vendor_polistdatewise() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$fromdate = Request::input("pofromdate");
		$todate = Request::input("potodate");
		$mainarr = array();

		if($vendorid == "All" && $projectid == "All") {

			$out = PurchaseOrder::with('project')->with("vendor")->with('pomaterials.storematerial')->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::with('project')->with("vendor")->with('pomaterials.storematerial')->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid == "All" && $projectid != "All") {

			$out = PurchaseOrder::where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid != "All" && $projectid == "All") {

			$out = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate)->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function get_vendor_polist() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$fromdate = Request::input("pofromdate");
		$todate = Request::input("potodate");
		$mainarr = array();

		if($vendorid == "All" && $projectid == "All") {

			$out = PurchaseOrder::with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid == "All" && $projectid != "All") {

			$out = PurchaseOrder::where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid != "All" && $projectid == "All") {

			$out = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function get_datewise_polist() {

		$fromdate = Request::input('fromdate');

		$todate = Request::input('todate');
		$todate = date('Y-m-d', strtotime($todate . ' +1 day'));
		$projectid = Request::input('projectid');
		$mainarr = array();

		// $todate = date("Y-m-d",strtotime("+1 day", strtotime($todate)));
		//$todate = date("Y-m-d",strtotime($todate));
		if($projectid == "All") {

			$out = PurchaseOrder::where('po_date', '>=', $fromdate)->where('po_date', '<=', $todate)->with('project')->with('vendor')->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('po_date', '>=', $fromdate)->where('po_date', '<=', $todate)->with('project')->with('vendor')->orderBy('po_date', 'DESC')->sum('total_cost');
		} else {

			$out = PurchaseOrder::where('po_date', '>=', $fromdate)->where('po_date', '<=', $todate)->where('project_id', '=', $projectid)->with('project')->with('vendor')->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('po_date', '>=', $fromdate)->where('po_date', '<=', $todate)->where('project_id', '=', $projectid)->with('project')->with('vendor')->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);

		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function edit_materials() {

		$submat = Request::input('submat');
		
		$checkpo = PurchaseOrderMaterial::where("material_id", "=", $submat['id'])->get();
		if($checkpo->count() == 0) {

			$storemat = StoreMaterial::where("id", "=",  $submat['id'])->first();

			$materialcodecheck = StoreMaterial::where("id", "!=",  $submat['id'])->where("material_code", "=", $submat['material_code'])->where("material_code","!=", "")->get();
			if($materialcodecheck->count() == 0) {
				$storemat->name = $submat['name'];
				$storemat->units = $submat['unitss'];
				$storemat->material_code = $submat['material_code'];
				$storemat->save();
				$out = 1;
			} else {

				$out = 2;
			}

		} else {

			$out = 0;
		}

		return $out;
	}

	public function delete_materials() {

		$matid = Request::input('matid');
		
		$checkpo = PurchaseOrderMaterial::where("material_id", "=", $matid)->get();
		if($checkpo->count() == 0) {

			$checkvendormat = VendorMaterials::where("store_material_id", "=", $matid)->get();

			if($checkvendormat->count() == 0) {

				$storemat = StoreMaterial::where("id", "=",  $matid)->delete();
				$out = 1;
			} else {

				VendorMaterials::where("store_material_id", "=", $matid)->delete();
				$storemat = StoreMaterial::where("id", "=",  $matid)->delete();
				$out = 1;
			}
			
			

		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_vendor_materials() {

		$vendorid = Request::input("vendorid");

		$allmat = VendorMaterials::select('store_material_id')->where('vendor_id', '=', $vendorid)->get()->toArray();
		$cc = array(1,3,4);
		return $venmat = MaterialCategory::with(array('submaterials'=>function($query) use ($allmat){
	        $query->whereIn('id', $allmat);
	    }))->whereHas('submaterials', function($query) use ($allmat)
		{
		    $query->whereIn('id', $allmat);
		})->get();

		
	}

	public function insert_po_docs(){

		$type = Request::input("type");
		$path = Request::input("path");

		$pono = Request::input("pono");

		$podet = PurchaseOrder::where("po_no", "=", $pono)->first();

		if($type=="Company") {

			$podet->company_approved_po = $path;
		} else if($type=="Vendor") {

			$podet->vendor_approved_po = $path;
		} else {

			$podet->gtp_doc = $path;
		}
		$podet->save();
		return 1;


	}

	public function delete_po_docs() {

		$id = Request::input('pono');

		$type = Request::input('type');

		$podocs = PurchaseOrder::where('po_no', '=', $id)->first();
		if($type == "Company") {

			unlink('/var/www/html'.$podocs->company_approved_po);

			$podocs->company_approved_po = "";
		} else if($type == "Vendor") {

			unlink('/var/www/html'.$podocs->vendor_approved_po);

			$podocs->vendor_approved_po = "";
		} else {

			unlink('/var/www/html'.$podocs->gtp_doc);

			$podocs->gtp_doc = "";
		}

		$podocs->save();

		return 1;
	}

	public function delete_docs() {

		$path = Request::input("path");
		// unlink("/var/www/html".$path);
		return 1;
	}

	public function raise_road_permit() {

		$data = Request::input('data');
		$idis = Request::input('idis');
		// return $data;

		$q = new RoadPermits;
		$q->no = $data['rpno'];
		$q->raise_date = $data['raisedate'];
		$q->valid_till = $data['validtill'];
		$q->truck_no = $data['truckno'];
		$q->transporter_name = $data['transportername'];
		$q->checkpost = $data['checkpost'];
		$q->remarks = $data['remarks'];
		$q->save();
		$rpid = $q->id;

		for ($i=0; $i < count($idis); $i++) { 
			# code...
			$q1 = new RoadPermitIDI;
			$q1->road_permit_id = $rpid;
			$q1->idi_id = $idis[$i];
			$q1->save();
		}

		for ($i=0; $i < count($data['materials']); $i++) { 
			# code...
			$q2 = new RoadPermitMaterial;
			$q2->material_id = $data['materials'][$i]['matid'];
			$q2->road_permit_id = $rpid;
			$q2->quantity = $data['materials'][$i]['quantity'];
			$q2->save();

			//update quantities in IDI mat table
			$totmat = floatval($data['materials'][$i]['quantity']);
			for ($j=0; $j < count($data['materials'][$i]['idimatids']); $j++) { 
				# code...
				$q6 = InternalDIMaterial::where('id','=',$data['materials'][$i]['idimatids'][$j])->first();
				$diff = floatval($q6['quantity'])-floatval($q6['road_permit_quantity']);
				if($totmat>=floatval($diff))
				{
					InternalDIMaterial::where('id','=',$data['materials'][$i]['idimatids'][$j])->update(array('road_permit_quantity' => floatval($q6['quantity'])));
					$totmat = floatval($totmat) - floatval($diff);
				}
				else if($diff == 0 || $totmat==0)
				{
				}
				else
				{
					$nqty = floatval($totmat) + floatval($q6['road_permit_quantity']);
					InternalDIMaterial::where('id','=',$data['materials'][$i]['idimatids'][$j])->update(array('road_permit_quantity' => floatval($nqty)));
					$totmat = 0;
				}
			}
		}

		for ($i=0; $i < count($data['docs']); $i++) { 
			# code...
			$q3 = new RoadPermitDocs;
			$q3->road_permit_id = $rpid;
			$q3->doc_name = $data['docs'][$i]['doc_name'];
			$q3->doc_url = $data['docs'][$i]['doc_url'];
			$q3->save();
		}

		for ($i=0; $i < count($data['invoices']); $i++) { 
			# code...
			$q4 = new RoadPermitInvoices;
			$q4->road_permit_id = $rpid;
			$q4->no = $data['invoices'][$i]['no'];
			$q4->date = $data['invoices'][$i]['date'];
			$q4->quantity = $data['invoices'][$i]['quantity'];
			$q4->value = $data['invoices'][$i]['value'];
			$q4->save();
			$rpinvid = $q4->id;
			for ($j=0; $j < count($data['invoices'][$i]['docs']); $j++) { 
				# code...
				$q5 = new RoadPermitInvoiceDocs;
				$q5->road_permit_invoice_id = $rpinvid;
				$q5->doc_name = $data['invoices'][$i]['docs'][$j]['doc_name'];
				$q5->doc_url = $data['invoices'][$i]['docs'][$j]['doc_url'];
				$q5->save();
			}
		}

		return 'yes';


	}

	public function get_special_terms() {

		return SpecialTerm::get();
	}

	public function insert_special_terms() {

		$termslist = Request::input('terms');

		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$deletespecial = SpecialTerm::truncate();

		foreach ($termslist as $term) {
			
			$title = $term['termtitle'];
			$desc = $term['termdesc'];

			$singleterm = array(
					"termtitle"=>$title,
					"termdesc"=>$desc,
					"created_by"=>$user['users']['id']
				);
			$createterm = SpecialTerm::create($singleterm);

		}

		return 1;
	}

	public function delete_vendor_materials() {

		$matid = Request::input('matid');
		$vendorid = Request::input('vendorid');
		
		$checkpo = PurchaseOrder::where('vendor_id','=', $vendorid)->whereHas('pomaterials', function($query) use ($matid)
			{
			    $query->where('material_id', '=', $matid);
			})->get();
		if($checkpo->count() == 0) {

			$storemat = VendorMaterials::where("store_material_id", "=",  $matid)->where('vendor_id', '=', $vendorid)->delete();
			
			$out = 1;

		} else {

			$out = 0;
		}

		return $out;
	}

	public function add_vendor_materials() {

		$data = Request::all();
		$vendorid = Request::input('vendorid');
		$name = Request::input('name');
		$contact_person = Request::input('contact_person');
		$emailid = Request::input('emailid');
		$alternate_emailid = Request::input('alternate_emailid');
		$phoneno = Request::input('phoneno');
		$alternate_phoneno = Request::input('alternate_phoneno');
		$address = Request::input('address');
		$materialvalues = Request::input('materialvalues');
		$vendor = Vendor::where('id', '=', $data['vendorid'])->first();
		if($vendor) {

			if(!isset($data['alternate_emailid'])) {

				$data['alternate_emailid'] = "";
			}
			if(!isset($data['alternate_phoneno'])) {

				$data['alternate_phoneno'] = "";
			}
			if(!isset($data['cin'])) {

				$data['cin'] = "";
			}
			if(!isset($data['tin'])) {

				$data['tin'] = "";
			}
			if(!isset($data['pan'])) {

				$data['pan'] = "";
			}
			if(!isset($data['servicetaxno'])) {

				$data['servicetaxno'] = "";
			}
			$vendor->name = $data['name'];
			$vendor->emailid = $data['emailid'];
			$vendor->alternate_emailid = $data['alternate_emailid'];
			$vendor->phoneno = $data['phoneno'];
			$vendor->alternate_phoneno = $data['alternate_phoneno'];
			$vendor->address = $data['address'];
			$vendor->cin = $data['cin'];
			$vendor->tin = $data['tin'];
			$vendor->pan = $data['pan'];
			$vendor->contact_person = $data['contact_person'];
			$vendor->servicetaxno = $data['servicetaxno'];
			$vendor->save();

			VendorAccountDetails::where("vendor_id", "=", $vendor->id)->delete();

			foreach ($data['accountdetails'] as $indiacdet) {
				
				$singleacdet = array(

						"vendor_id"=>$vendorid,
						"bank_name"=>$indiacdet['bank_name'],
						"bank_branch"=>$indiacdet['bank_branch'],
						"ifsc_code"=>$indiacdet['ifsc_code'],
						"account_number"=>$indiacdet['account_number']
					);

				VendorAccountDetails::create($singleacdet);
			}
			if(isset($materialvalues)) {
				foreach ($data['materialvalues'] as $mval) {
					
					$checkmat = VendorMaterials::where('store_material_id', '=', $mval)->where('vendor_id','=', $data['vendorid'])->first();
					if(!$checkmat) {
						$singlevenmat = array(

								"store_material_id"=>$mval,
								"vendor_id"=>$data['vendorid']
							);
						$createvenmat = VendorMaterials::create($singlevenmat);
					}

				}
			}

			$out = 1;

			
		} else {

			$out = 0;
		}

		return $out;
	}

	public function get_vendor_info() {

		$vendorid = Request::input('vendorid');

		return Vendor::where('id', '=', $vendorid)->with("accountdetails")->first();
	}

	public function post_internal_di_manual() {

		$dat = Request::input('dat');
		$date = Request::input('date');
		// $name = Request::input('name');
		$dtype = Request::input('dtype');
		$delid = Request::input('deliverylocid');
		$vid = Request::input('vendorid');
		$old_flag = Request::input("old_flag");
		if(!isset($old_flag)) {

			$old_flag = 0;
		}

		if($dtype=='site')
		{
			$stores_id = '';
			$site_areas_id = $delid;
		}
		else if($dtype=='store')
		{
			$stores_id = $delid;
			$site_areas_id = '';
		}

		$iid = Request::input('iid');
		$diid = $dat['id'];
		$vendordet = Vendor::where("id", "=", $vid)->first();

		$q1 = new InternalDI;

		$q1->di_id = $diid;
		$q1->manual_date = $date;
		$q1->manual_flag = 1;
		$q1->old_flag = $old_flag;
		// $q1->ref_name = $name;
		$q1->save();

		$internal_di_id = $q1->id;
		$name = $vendordet->vendor_code."/IDI/".$internal_di_id;
		$q1->ref_name = $name;
		$q1->save();

		for ($m=0; $m < count($dat['internaldidocs']); $m++) { 
			# code...
			$q4 = new InternalDIDocs;
			$q4->internal_di_id = $internal_di_id;
			$q4->doc_name = $dat['internaldidocs'][$m]['doc_name'];
			$q4->doc_url = $dat['internaldidocs'][$m]['doc_url'];
			$q4->save();
		}

		for ($i=0; $i < count($dat['dimat']); $i++) { 
			# code...	
			if(floatval($dat['dimat'][$i]['total_internal_di'])>0)
			{
				$q2 = new InternalDIMaterial;
				$q2->internal_di_id = $internal_di_id;
				$q2->di_material_id = $dat['dimat'][$i]['material_id'];
				$q2->quantity = $dat['dimat'][$i]['total_internal_di'];
				$q2->save();

				$internal_di_mat_id = $q2->id;
				//update DI mat Insp mat table
				$q21 = DispatchMaterial::where('dispatch_id','=',$diid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->first();
				$nqdimat = floatval($q21['internal_di']) + floatval($dat['dimat'][$i]['total_internal_di']);

				$q312 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->first();

				$ninspmat = floatval($q312['internal_di_quantity']) + floatval($dat['dimat'][$i]['total_internal_di']);
				// return $ninspmat;
				$q313 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->update(array('internal_di_quantity' =>$ninspmat));
				$inspmatid = $q312['id'];
				// return $inspmatid;

				$q23 = DispatchMaterial::where('dispatch_id','=',$diid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->update(array('internal_di' =>$nqdimat));

				for ($j=0; $j < count($dat['dimat'][$i]['dieachpomat']); $j++) { 
					# code...
					if($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']>0)
					{
						$q3 = new InternalDIPo;
						$q3->internal_di_material_id = $internal_di_mat_id;
						$q3->po_id = $dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'];
						$q3->material_id = $dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'];
						$q3->quantity = $dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity'];
						$q3->pom_table_id = $dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'];
						$q3->stores_id = $stores_id;
						$q3->site_areas_id = $site_areas_id;
						$q3->vendor_id = $vid;
						$q3->save();


						$q5 = DispatchPoMaterial::where('dispatch_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('dispatch_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_material_id'])->where('pom_table_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->first();

						$qty = floatval($q5['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q5 = DispatchPoMaterial::where('dispatch_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('dispatch_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_material_id'])->where('pom_table_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->update(array('internal_di_quantity' => $qty));
						//update DIPOmat table
						$q43 = InspectionPoMaterial::where('inspection_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('inspection_material_id','=',$inspmatid)->where('pom_table_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->first();
						$inspo = floatval($q43['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q43 = InspectionPoMaterial::where('inspection_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('inspection_material_id','=',$inspmatid)->where('pom_table_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->update(array('internal_di_quantity' =>$inspo));
						
						//update PO mat table
						$q6 = PurchaseOrderMaterial::where('id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->first();
						$nqty = floatval($q6['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q6 = PurchaseOrderMaterial::where('id','=',$dat['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->update(array('internal_di_quantity' =>$nqty));

					}
				}
			}
		}

		
		return $q1->id;
		//put docs
		
	}

	public function post_internal_di_mail(SendRawMail $sendraw) {
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		
		$to = trim(Request::input('to'));
		$cc = Request::input('cc');
		$subject = Request::input('subject');
		$emailcontent = Request::input('content');
		$attachments = Request::input('attachments');
		$store_id = Request::input('deliverylocid');
		$vid = Request::input('vendorid');
		$old_flag = Request::input('old_flag');
		if(!isset($old_flag)) {

			$old_flag = 0;
		}

		//do what ever you want here
		$dat = Request::input('dat');
		// $date = Request::input('date');
		// $name = Request::input('name');
		$iid = Request::input('iid');
		$vendordet = Vendor::where("id", "=", $vid)->first();
		$diid = $dat['id'];

		$q1 = new InternalDI;
		$q1->di_id = $diid;
		$q1->manual_date = '0000-00-00';
		$q1->manual_flag = 0;
		$q1->old_flag = $old_flag;
		$q1->to = $to;
		$q1->cc = $cc;
		$q1->subject = $subject;
		$q1->content = $emailcontent;
		// $q1->ref_name = $name;
		$q1->save();
		$internal_di_id = $q1->id;
		$name = $vendordet->vendor_code."/IDI/".$internal_di_id;
		$q1->ref_name = $name;
		$q1->save();

		for ($m=0; $m < count($dat['internaldidocs']); $m++) { 
			# code...
			$q4 = new InternalDIDocs;
			$q4->internal_di_id = $internal_di_id;
			$q4->doc_name = $dat['internaldidocs'][$m]['doc_name'];
			$q4->doc_url = $dat['internaldidocs'][$m]['doc_url'];
			$q4->save();
		}
		$tablerow = "";
		for ($i=0; $i < count($dat['dimat']); $i++) { 
			# code...	
			if(floatval($dat['dimat'][$i]['total_internal_di'])>0)
			{
				$q2 = new InternalDIMaterial;
				$q2->internal_di_id = $internal_di_id;
				$q2->di_material_id = $dat['dimat'][$i]['material_id'];
				$q2->quantity = $dat['dimat'][$i]['total_internal_di'];
				$q2->save();

				
				$storematdet = StoreMaterial::where("id", "=", $dat['dimat'][$i]['material_id'])->with('matuom.stmatuom')->first();	
				$tablerow .= "<tr><td style='text-align:center;'>".($i+1)."</td><td>".$storematdet->name."</td><td style='text-align:center;'>".$storematdet['matuom'][0]['stmatuom']['uom']."</td><td style='text-align:center;'>".$dat['dimat'][$i]['total_internal_di']."</td></tr>";
					
				$internal_di_mat_id = $q2->id;
				//update DI mat Insp mat table
				$q21 = DispatchMaterial::where('dispatch_id','=',$diid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->first();
				$nqdimat = floatval($q21['internal_di']) + floatval($dat['dimat'][$i]['total_internal_di']);

				$q312 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->first();

				$ninspmat = floatval($q312['internal_di_quantity']) + floatval($dat['dimat'][$i]['total_internal_di']);
				// return $ninspmat;
				$q313 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->update(array('internal_di_quantity' =>$ninspmat));
				$inspmatid = $q312['id'];
				// return $inspmatid;

				$q23 = DispatchMaterial::where('dispatch_id','=',$diid)->where('material_id','=',$dat['dimat'][$i]['material_id'])->update(array('internal_di' =>$nqdimat));

				for ($j=0; $j < count($dat['dimat'][$i]['dieachpomat']); $j++) { 
					# code...
					if($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']>0)
					{
						$q3 = new InternalDIPo;
						$q3->internal_di_material_id = $internal_di_mat_id;
						$q3->po_id = $dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'];
						$q3->material_id = $dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'];
						$q3->quantity = $dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity'];
						$q3->vendor_id = $vid;
						$q3->stores_id = $store_id;
						$q3->save();


						$q5 = DispatchPoMaterial::where('dispatch_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('dispatch_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_material_id'])->first();

						$qty = floatval($q5['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q5 = DispatchPoMaterial::where('dispatch_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('dispatch_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_material_id'])->update(array('internal_di_quantity' => $qty));
						//update DIPOmat table
						$q43 = InspectionPoMaterial::where('inspection_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('inspection_material_id','=',$inspmatid)->first();
						$inspo = floatval($q43['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q43 = InspectionPoMaterial::where('inspection_po_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('inspection_material_id','=',$inspmatid)->update(array('internal_di_quantity' =>$inspo));
						
						//update PO mat table
						$q6 = PurchaseOrderMaterial::where('purchase_order_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->first();
						$nqty = floatval($q6['internal_di_quantity']) + floatval($dat['dimat'][$i]['dieachpomat'][$j]['new_internal_di_quantity']);
						$q6 = PurchaseOrderMaterial::where('purchase_order_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('material_id','=',$dat['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->update(array('internal_di_quantity' =>$nqty));

					}
				}
			}
		}
		//////////////////////////


		if(trim($cc) != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		
		$from = $user['users']['email'];
		$out = array();

		$templatecontent = file_get_contents("/var/www/html/internaldi_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);
		$templatecontent = str_ireplace("{{tablerow}}", $tablerow, $templatecontent);
		// $singleCR = array(
		// 	// "poid"=>$poid,
		// 	"po_inspid"=>$inspid,
		// 	"tomail"=>$to,
		// 	"cc"=>$cc,
		// 	"subject"=>$subject,
		// 	"content"=>$emailcontent,
		// 	"sent_by"=>$user['users']['id']
		// );

		// $createICR = InspectionCallRaising::create($singleCR);

		$ICRid = $internal_di_id;
		$ICRno = 'ICR'+$ICRid;
		$templatecontent = str_ireplace("{{icrno}}", $ICRno, $templatecontent);
		// if(count($attachments)>0){
		// 	for($d=0;$d<count($attachments);$d++){
		// 		$singleCRAttachment = array("inspection_call_raising_id"=>$ICRid, "doc_name"=>$attachments[$d]['doc_name'], "doc_url"=>$attachments[$d]['doc_url']);
		// 		$createICRdoc = InspectionCallRaisingAttachments::create($singleCRAttachment);
		// 	}
		// }
		// InspectionCallRaisingAttachments

		$failedemail = array();
		$res = $sendraw->sendRawEmail($from, $to, $cc, $subject, $templatecontent, $attachments);
		if($res == 0) {

			$failedemail[] = $to;
		}
		// return $res;
		foreach ($ccarr as $ccmail) {
			$ccmail = trim($ccmail);
			$res = $sendraw->sendRawEmail($from, $ccmail, $subject, $templatecontent, $attachments);
			if($res == 0) {

				$failedemail[] = $ccmail;
			}
		}

		$out['ICRno'] = $ICRno;
		$out['failedmail'] = $failedemail;
		$out['indiid'] = $q1->id;

		// if(count($failedemail)>0)
		// {
		// 	$q9 = InspectionCallRaising::where('po_inspid','=',$inspid)->update(array('successflag' => 0));
		// }

		return $out;		
	}


	public function get_pomain_info() {

		$pono = Request::input("pono");
		$type = Request::input("type");
		
		$now = date('Y-m-d H:i:s');
		$aflag =0;
		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$userid = $user['users']['id'];

		$companydetails = Company::where('id', '=', $user['users']['company_id'])->with('compdetails')->first();

		$poinfo = PurchaseOrder::where('po_no', '=', $pono)->with("vendor")->with("project")->with('csref.csrefdet.csvendor.materials.materialdetails')->first();
		$poinfo['companydet'] = $companydetails;
		
		if($type == 'normal') // normal edit
		{
			$inspectioncheck = PurchaseOrderMaterial::where("purchase_order_id", "=", $poinfo->id)->where("inspected_quantity", ">", 0)->first();
			$date = strtotime('+7 days', strtotime($poinfo['po_date']) );
			$adate = date('Y-m-d H:i:s',$date);

			if($now>$adate)
			{
				$aflag = 1;
			} else if($inspectioncheck) {

				$aflag = 1;
			} else {

				$aflag = 2;
			}
		}

		if($aflag == 2 || $aflag==0)
		{
			if($poinfo) 
			{
				return $poinfo;
			} 
			else 
			{
				return 0;
			}
		}
		else
		{
			return 'dateover';
		}
	}

	public function get_pomateriallist() {

		$pono = Request::input("pono");
		$podet = PurchaseOrder::where("id", "=", $pono)->first();
		$projectid = $podet->project_id;

		$pomat = PurchaseOrderMaterial::where('purchase_order_id', '=', $pono)->with('storematerial.inversestore')->with('fabmat.storemainuom.stmatuom')->with('storematerial.matuom.stmatuom')->with('fabmat.storemat')->with('storemainuom.stmatuom')->with(array('indenttotal'=>function($query) use ($projectid){
	        	$query->where('project_id', '=', $projectid);
	    	}))->get();
		foreach ($pomat as $inpomat) {
			foreach ($inpomat['fabmat'] as $infabmat) {
				$storelevel1 = StoreMaterialsLevel1::where("store_aggregator_id", "=", $inpomat['material_id'])->where("store_material_id", "=", $infabmat['store_material_id'])->first();
				$infabmat['matdetails'] = $storelevel1;
			}
		}

		return $pomat;
	}

	public function get_potaxes() {

		$pono = Request::input("pono");

		return PurchaseTaxes::where('purchase_id', '=', $pono)->with('taxmaterials.tax')->with('taxmaterials.mat')->get();
	}

	public function get_pospecialterms() {

		$pono = Request::input("pono");

		return PurchaseTerms::where('purchase_id', '=', $pono)->get();
	}

	public function savepo() {

		$data = Request::all();

		$out = array();

		$year = date("Y");

		$project = Projects::where('id', '=', $data['projectid'])->first();

		$out['today'] = date('d-m-Y');

		$purchaseorderold = PurchaseOrder::where("po_no", "=", $data['poid'])->first()->toArray();

		$createrevisedpo = OldPurchaseOrder::create($purchaseorderold);
		$createrevisedpo->poid = $purchaseorderold['id'];
		$createrevisedpo->save();

		$totalamds = OldPurchaseOrder::where("poid", "=", $purchaseorderold['id'])->get();

		PaymentPo::where("po_id", "=", $purchaseorderold['id'])->update(array("old_po_id"=>$createrevisedpo->id));

		// $purchaseordermaterialold = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->get()->toArray();

		// foreach ($purchaseordermaterialold as $porevisedmat) {
			
		// 	$createrevisedpomaterial = OldPurchaseOrderMaterial::create($porevisedmat);
		// }

		$purchaseordertaxesold = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->get()->toArray();

		foreach ($purchaseordertaxesold as $porevisedtax) {
			
			$createrevisedpotaxes = OldPurchaseTaxes::create($porevisedtax);
			$purchaseordertaxmat = PurchaseTaxMaterials::where("tax_id", "=", $porevisedtax['id'])->get()->toArray();
			foreach ($purchaseordertaxmat as $oldtaxmat) {
				
				$createrevisedtaxmat = OldPurchaseTaxMaterials::create($oldtaxmat);
				$createrevisedtaxmat->tax_id = $createrevisedpotaxes->id;
				$createrevisedtaxmat->save();
			}
		}

		$purchaseordertermsold = PurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->get()->toArray();

		foreach ($purchaseordertermsold as $porevisedterm) {
			
			$createrevisedpoterms = OldPurchaseTerms::create($porevisedterm);
		}
		//$updateoldpomat = OldPurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->update(array("purchase_order_id" => $createrevisedpo->id));
		$updateoldtax = OldPurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->update(array("purchase_id" => $createrevisedpo->id));
		$updateoldterms = OldPurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->update(array("purchase_id" => $createrevisedpo->id));
		

		$yearnext = $year+1;
		$out['year'] = $year."-".substr($yearnext, 2,2);
		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$userid = $user['users']['id'];

		$companydetails = Company::where('id', '=', $user['users']['company_id'])->with('compdetails')->first();

		$out['companydetails'] = $companydetails;

		$vendor = Vendor::where('id', '=', $data['vendorid'])->first();
		$out['vendordetails'] = $vendor;

		if($data) {
			$amdno = $totalamds->count();
			$oldamdno = $amdno-1;
			
			$currentpurchaseorder = PurchaseOrder::where("po_no", "=", $data['poid'])->first();

			if($amdno == 1) {

				$newpono = $currentpurchaseorder->po_no."/amd".$amdno;
			} else {

				$newpono = str_ireplace("amd".$oldamdno, "amd".$amdno, $currentpurchaseorder->po_no);
			}

			$currentpurchaseorder->termsnconditions=$data['termsnconditions'];
			$currentpurchaseorder->total_cost=$data['totalvalueofgoods'];
			$currentpurchaseorder->amendment = 1;
			$currentpurchaseorder->amd_no = $amdno;
			$currentpurchaseorder->po_no = $newpono;
			$currentpurchaseorder->po_date = date("Y-m-d H:i:s");

			$currentpurchaseorder->save();
				
			$deletepotaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->delete();

			
			$totalqty = 0;
			$totalcost = 0;

			$elementcountarr = array();

			foreach ($data['materiallist'] as $mlist) {

				if($mlist) {

					if($mlist['type'] == 3){

						$elementcountarr[] = $mlist['materialid'];
					} else {

						foreach ($mlist['materials'] as $inmat) {
							
							$elementcountarr[] = $inmat['materialid'];
						}
					}

				}

				
			}

			PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->whereNotIn("material_id", $elementcountarr)->delete();

			foreach ($data['materiallist'] as $mlist) {

				if($mlist) {

					if($mlist['type'] == 3) {

						$totalqty = $totalqty+$mlist['qty'];
						$totalcost = $totalcost+$mlist['valueofgoods'];
						if(!isset($mlist['remarks'])) {

							$mlist['remarks'] = "";
						}
						if(!isset($mlist['freightinsurance_rate'])) {

							$mlist['freightinsurance_rate'] = "";
						}
						if(!isset($mlist['inspected_quantity'])) {

							$mlist['inspected_quantity'] = 0;
						}
						if(!isset($mlist['approved_quantity'])) {

							$mlist['approved_quantity'] = 0;
						}
						if(!isset($mlist['dispatch_quantity'])) {

							$mlist['dispatch_quantity'] = 0;
						}
						if(!isset($mlist['internal_di_quantity'])) {

							$mlist['internal_di_quantity'] = 0;
						}
						if(!isset($mlist['payment_qty'])) {

							$mlist['payment_qty'] = 0;
						}

						$deletepomaterials = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $mlist['materialid'])->first();

						$singlepurmat = array(

								"purchase_order_id"=>$purchaseorderold['id'],
								"material_id"=>$mlist['materialid'],
								"store_material_uom_id"=>$mlist['uomid'],
								"store_material_main_uom_id"=>$mlist['mainuomid'],
								"quantity"=>$mlist['qty'],
								"unit_rate"=>$mlist['unitrate'],
								"value_of_goods"=>$mlist['valueofgoods'],
								"remarks"=>$mlist['remarks'],
								"freightinsurance_rate"=>$mlist['freightinsurance_rate'],
								"inspected_quantity"=>$mlist['inspected_quantity'],
								"approved_quantity"=>$mlist['approved_quantity'],
								"dispatch_quantity"=>$mlist['dispatch_quantity'],
								"internal_di_quantity"=>$mlist['internal_di_quantity'],
								"payment_qty"=>$mlist['payment_qty']
							);

						$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);

						foreach ($mlist['materials'] as $inmlistf) {

							$singlefabmat = array(

									"purchase_order_material_id"=>$createsinglemat->id,
									"store_material_id"=>$inmlistf['materialid'],
									"store_material_uom_id"=>$inmlistf['uomid'],
									"qty"=>$inmlistf['qty']
								);

							PoFabricationMaterial::create($singlefabmat);
						}

						if($deletepomaterials) {

							$createrevisedpomaterial = OldPurchaseOrderMaterial::create($deletepomaterials->toArray());
							$createrevisedpomaterial->purchase_order_id = $createrevisedpo->id;
							$createrevisedpomaterial->save();
							$fabmats = PoFabricationMaterial::where("purchase_order_material_id", "=", $deletepomaterials->id)->get();
							foreach ($fabmats as $indifabmat) {
								
								$pofabold = OldPoFabricationMaterial::create($indifabmat->toArray());
								$pofabold->purchase_order_material_id=$createrevisedpomaterial->id;
								$pofabold->save();
							}

							InternalDIPo::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));
							InspectionPoMaterial::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));
							DispatchPoMaterial::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));

							PaymentMaterials::where("purchase_order_material_id", "=", $deletepomaterials->id)->update(array("old_purchase_order_material_id"=>$createrevisedpomaterial->id, "purchase_order_material_id"=>$createsinglemat->id));

							$deletepomaterials->delete();
							PoFabricationMaterial::where("purchase_order_material_id", "=", $deletepomaterials->id)->delete();
						}
					} else {

						foreach ($mlist['materials'] as $inmlist) {


							$totalqty = $totalqty+$inmlist['qty'];
							$totalcost = $totalcost+$inmlist['valueofgoods'];
							if(!isset($inmlist['remarks'])) {

								$inmlist['remarks'] = "";
							}
							if(!isset($inmlist['freightinsurance_rate'])) {

								$inmlist['freightinsurance_rate'] = "";
							}
							if(!isset($inmlist['inspected_quantity'])) {

								$inmlist['inspected_quantity'] = 0;
							}
							if(!isset($inmlist['approved_quantity'])) {

								$inmlist['approved_quantity'] = 0;
							}
							if(!isset($inmlist['dispatch_quantity'])) {

								$inmlist['dispatch_quantity'] = 0;
							}
							if(!isset($inmlist['internal_di_quantity'])) {

								$inmlist['internal_di_quantity'] = 0;
							}
							if(!isset($inmlist['payment_qty'])) {

								$inmlist['payment_qty'] = 0;
							}

							$deletepomaterials = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $inmlist['materialid'])->first();

							$singlepurmat = array(

									"purchase_order_id"=>$purchaseorderold['id'],
									"material_id"=>$inmlist['materialid'],
									"store_material_uom_id"=>$inmlist['uomid'],
									"quantity"=>$inmlist['qty'],
									"unit_rate"=>$inmlist['unitrate'],
									"value_of_goods"=>$inmlist['valueofgoods'],
									"remarks"=>$inmlist['remarks'],
									"freightinsurance_rate"=>$inmlist['freightinsurance_rate'],
									"inspected_quantity"=>$inmlist['inspected_quantity'],
									"approved_quantity"=>$inmlist['approved_quantity'],
									"dispatch_quantity"=>$inmlist['dispatch_quantity'],
									"internal_di_quantity"=>$inmlist['internal_di_quantity'],
									"payment_qty"=>$inmlist['payment_qty']
								);

							$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);

							foreach ($mlist['materials'] as $inmlistf) {

								$singlefabmat = array(

										"purchase_order_material_id"=>$purchaseorderold['id'],
										"store_material_id"=>$inmlistf['materialid'],
										"store_material_uom_id"=>$inmlistf['uomid'],
										"qty"=>$inmlistf['qty']
									);

								PoFabricationMaterial::create($singlefabmat);
							}

							if($deletepomaterials) {

								$createrevisedpomaterial = OldPurchaseOrderMaterial::create($deletepomaterials->toArray());

								$createrevisedpomaterial->purchase_order_id = $createrevisedpo->id;
								$createrevisedpomaterial->save();

								$fabmats = PoFabricationMaterial::where("purchase_order_material_id", "=", $deletepomaterials->id)->get();

								foreach ($fabmats as $indifabmat) {
									
									$pofabold = PoFabricationMaterial::create($indifabmat->toArray());
									$pofabold->purchase_order_material_id=$createrevisedpomaterial->id;
									$pofabold->save();
								}

								InternalDIPo::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));
								InspectionPoMaterial::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));
								DispatchPoMaterial::where("pom_table_id", "=", $deletepomaterials->id)->update(array("pom_table_id"=>$createsinglemat->id));

								PaymentMaterials::where("purchase_order_material_id", "=", $deletepomaterials->id)->update(array("old_purchase_order_material_id"=>$createrevisedpomaterial->id, "purchase_order_material_id"=>$createsinglemat->id));

								$deletepomaterials->delete();
								PoFabricationMaterial::where("purchase_order_material_id", "=", $deletepomaterials->id)->delete();
							}		

						}
					}

				}

				
			}

			$currentpurchaseorder->total_qty= $totalqty;
			$currentpurchaseorder->save();

			if(isset($data['taxdetails']) && count($data['taxdetails']) > 0) {

				foreach ($data['taxdetails'] as $tax) {

					if(!isset($tax['taxdescription'])) {

						$tax['taxdescription'] = "";
					}

					if(!isset($tax['inclusivetaxpercentage'])) {

						$tax['inclusivetaxpercentage'] = 0;
					}

					$singlepurchasetaxes = array(
							"purchase_id"=>$purchaseorderold['id'],
							"name"=>$tax['taxtitle'],
							"type"=>$tax['taxtype'],
							"tax_id"=>$tax['tax_id'],
							"tax_desc"=>$tax['taxdescription'],
							"taxpercentage"=>$tax['taxpercentage'],
							"inclusive_taxpercentage"=>$tax['inclusivetaxpercentage'],
							"value"=>$tax['taxamount'],
							"lumpsum"=>$tax['lumpsum']
						);

					$taxcreate = PurchaseTaxes::create($singlepurchasetaxes);

					foreach ($tax['taxmaterials'] as $taxmat) {
						
						$materialidthis = $taxmat['material_id'];
						$potaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->where("tax_id", "=", $taxmat['tax']['tax_id'])->first();
						if($potaxes) {

							$purchase_tax_id = $potaxes->id;
						} else {

							$purchase_tax_id = 0;
						}
						if($materialidthis != 0) {

							$pomatid = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $materialidthis)->first();
							$materialidthis = $pomatid->id;
						}
						$singletaxmat = array("tax_id"=>$taxcreate->id, "purchase_taxes_id"=>$purchase_tax_id, "material_id"=>$materialidthis);
						$createtaxmat = PurchaseTaxMaterials::create($singletaxmat);
					}
				}
			}

			$deletepoterms = PurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->delete();

			if(isset($data['specialterms']) && count($data['specialterms']) > 0) {

				foreach ($data['specialterms'] as $sterm) {

					$singlespecial = array(
							"purchase_id"=>$purchaseorderold['id'],
							"name"=>$sterm['termtitle'],
							"condition"=>$sterm['termdesc']
						);

					$specialcreate = PurchaseTerms::create($singlespecial);
				}
			}
			$poid = $purchaseorderold['id'];

			$out['poid'] = $poid;

			$out['podetails'] = $currentpurchaseorder;
			
			$pono = $currentpurchaseorder->po_no;

			$out['pono'] = $pono;

			
		}

		$cpo=$currentpurchaseorder->id;
		$opo=$createrevisedpo->id;
		$oldamend=Amendment::where('main_po_id','=',$cpo)->where('po_id','=',$cpo)->first();
		if($oldamend)
		{
			$oldamend->po_id="";
			$opoid=$oldamend->old_po_id;
			$oldamend->old_po_id2=$opoid;
			$oldamend->old_po_id=$opo;
			$oldamend->save();
			$oldamends=AmendmentDetails::where('amend_id','=',$oldamend->id)->where('type','!=',3)->get()->toArray();
			for($i=0;$i<count($oldamends);$i++)
			{
				if($oldamends[$i]['material_id'])
				{
					$opomatid=OldPurchaseOrderMaterial::where('material_id','=',$oldamends[$i]['material_id'])->where('purchase_order_id','=',$opo)->first();
					$noamend=AmendmentDetails::where('id','=',$oldamends[$i]['id'])->first();
					$noamend->po_material_id='';
					$opodat=$noamend->old_po_material_id;
					$noamend->old_po_material_id=$opomatid->id;
					$noamend->old_po_material_id2=$opodat;
					$noamend->save();
				}
				else if($oldamends[$i]['tax_id'])
				{
					$opomatid=OldPurchaseTaxes::where('tax_id','=',$oldamends[$i]['tax_id'])->where('purchase_id','=',$opo)->first();
					$noamend=AmendmentDetails::where('id','=',$oldamends[$i]['id'])->first();
					$noamend->po_tax_id='';
					$opodat=$noamend->old_po_tax_id;
					if($opomatid) {
						$noamend->old_po_tax_id=$opomatid->id;
						
					}
					$noamend->old_po_tax_id2=$opodat;
					$noamend->save();

				}
				else if($oldamends[$i]['po_term_name'])
				{
					$opomatid=OldPurchaseTerms::where('name','=',$oldamends[$i]['po_term_name'])->where('purchase_id','=',$opo)->first();
					$noamend=AmendmentDetails::where('id','=',$oldamends[$i]['id'])->first();
					$noamend->po_term_id='';
					$opodat=$noamend->old_po_term_id;
					$noamend->old_po_term_id=$opomatid->id;
					$noamend->old_po_term_id2=$opodat;
					$noamend->save();
				}
			}
		}
		$amdcount=Amendment::where('main_po_id','=',$cpo)->count();
		$amend=new Amendment;
		$amend->amd_no=$amdcount+1;
		$amend->main_po_id=$cpo;
		$amend->po_id=$cpo;
		$amend->old_po_id=$opo;
		$amend->save();
		$apomats=PurchaseOrderMaterial::where("purchase_order_id", "=", $cpo)->get()->toArray();
		for($i=0;$i<count($apomats);$i++)
		{
			$opomat=OldPurchaseOrderMaterial::where('material_id','=',$apomats[$i]['material_id'])->where("purchase_order_id", "=", $opo)->first();
			if(!$opomat)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->material_id=$apomats[$i]['material_id'];
				$namend->po_material_id=$apomats[$i]['id'];
				$namend->type=2;
				$namend->save();
			}
			else if($opomat->value_of_goods!=$apomats[$i]['value_of_goods'])
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->material_id=$apomats[$i]['material_id'];
				$namend->po_material_id=$apomats[$i]['id'];
				$namend->old_po_material_id=$opomat->id;
				$namend->type=1;
				$namend->save();
			}
		}
		$apomats=OldPurchaseOrderMaterial::where("purchase_order_id", "=", $opo)->get()->toArray();
		for($i=0;$i<count($apomats);$i++)
		{
			$opomat=PurchaseOrderMaterial::where('material_id','=',$apomats[$i]['material_id'])->where("purchase_order_id", "=", $cpo)->first();
			if(!$opomat)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->material_id=$apomats[$i]['material_id'];
				$namend->old_po_material_id=$apomats[$i]['id'];
				$namend->type=3;
				$namend->save();
			}
		}
		$apotax=PurchaseTaxes::where("purchase_id", "=", $cpo)->get()->toArray();
		for($i=0;$i<count($apotax);$i++)
		{
			$opotax=OldPurchaseTaxes::where('tax_id','=',$apotax[$i]['tax_id'])->where("purchase_id", "=", $opo)->first();
			if(!$opotax)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->tax_id=$apotax[$i]['tax_id'];
				$namend->po_tax_id=$apotax[$i]['id'];
				$namend->type=2;
				$namend->save();
			}
			else if($opotax->value!=$apotax[$i]['value'])
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->tax_id=$apotax[$i]['tax_id'];
				$namend->po_tax_id=$apotax[$i]['id'];
				$namend->old_po_tax_id=$opotax->id;
				$namend->type=1;
				$namend->save();
			}
		}
		$apotax=OldPurchaseTaxes::where("purchase_id", "=", $opo)->get()->toArray();
		for($i=0;$i<count($apotax);$i++)
		{
			$opotax=PurchaseTaxes::where('tax_id','=',$apotax[$i]['tax_id'])->where("purchase_id", "=", $cpo)->first();
			if(!$opotax)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->tax_id=$apotax[$i]['tax_id'];
				$namend->old_po_tax_id=$apotax[$i]['id'];
				$namend->type=3;
				$namend->save();
			}
		}
		$apoterm=PurchaseTerms::where("purchase_id", "=", $cpo)->get()->toArray();
		for($i=0;$i<count($apoterm);$i++)
		{
			$opoterm=OldPurchaseTerms::where('name','=',$apoterm[$i]['name'])->where("purchase_id", "=", $opo)->first();
			if(!$opoterm)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->po_term_name=$apoterm[$i]['name'];
				$namend->po_term_id=$apoterm[$i]['id'];
				$namend->type=2;
				$namend->save();
			}
			else if($opoterm->condition!=$apoterm[$i]['condition'])
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->po_term_name=$apoterm[$i]['name'];
				$namend->po_term_id=$apoterm[$i]['id'];
				$namend->old_po_term_id=$opoterm->id;
				$namend->type=1;
				$namend->save();
			}
		}
		$apoterm=OldPurchaseTerms::where("purchase_id", "=", $opo)->get()->toArray();
		for($i=0;$i<count($apoterm);$i++)
		{
			$opoterm=PurchaseTerms::where('name','=',$apoterm[$i]['name'])->where("purchase_id", "=", $cpo)->first();
			if(!$opoterm)
			{
				$namend=new AmendmentDetails;
				$namend->amend_id=$amend->id;
				$namend->po_term_name=$apoterm[$i]['name'];
				$namend->old_po_term_id=$apoterm[$i]['id'];
				$namend->type=3;
				$namend->save();
			}
		}

		$mainpoidnew = $purchaseorderold['id'];

		$pomatcal = PurchaseOrderMaterial::where("purchase_order_id", "=", $mainpoidnew)->get();

		$pomatcalarr = array();

		foreach ($pomatcal as $indipomatcal) {
			
			$pomatcalarr[$indipomatcal->id]['amount'] = $indipomatcal->value_of_goods;
			$pomatcalarr[$indipomatcal->id]['tax'] = $indipomatcal->value_of_goods;
			$pomatcalarr[$indipomatcal->id]['freightinsurance_rate'] = $indipomatcal->freightinsurance_rate;
			$pomatcalarr[$indipomatcal->id]['quantity'] = $indipomatcal->quantity;
		}

		$potaxescal = PurchaseTaxes::where("purchase_id", "=", $mainpoidnew)->get();

		foreach ($potaxescal as $indipotaxescal) {
			
			if($indipotaxescal->lumpsum == 1 && $indipotaxescal->tax_id != 11) {

				foreach ($pomatcalarr as $key => $value) {
					
					$pomatcalarr[$indipomatcal->id]['tax'] += (($indipotaxescal->tax_amount*$pomatcalarr[$indipomatcal->id]['quantity'])/$createpurchase->total_qty);
				}

			} else {


				$potaxmatcal = PurchaseTaxMaterials::where("tax_id", "=", $indipotaxescal->id)->get();
				foreach ($potaxmatcal as $indipotaxtmatcal) {
					
					if($indipotaxtmatcal->material_id != 0) {

						$pomatcalarr[$indipotaxtmatcal->material_id]['tax'] += (($indipotaxescal->taxpercentage*$pomatcalarr[$indipotaxtmatcal->material_id]['amount'])/100);
					} else if($indipotaxtmatcal->purchase_taxes_id != 0){


						$caltaxontax = PurchaseTaxes::where("id", "=", $indipotaxtmatcal->purchase_taxes_id)->with("taxmaterials")->first();

						foreach ($potaxmatcal as $taxmatin) {

							if($indipotaxtmatcal->material_id != 0) {

								foreach ($caltaxontax->taxmaterials as $intaxmat) {
									
									if($taxmatin['material_id'] == $intaxmat['material_id']) {

										$pomatcalarr[$taxmatin['material_id']]['tax'] += (($indipotaxtmatcal->taxpercentage*($caltaxontax->taxpercentage * $pomatcalarr[$taxmatin->material_id]['amount']/100))/100);
									}
								}

								
							}	
						}
						
					}
				}
			}
		}

		foreach ($pomatcalarr as $key => $value) {

		
			$taxtotalrate = ($value['tax']/$value['quantity']) + $value['freightinsurance_rate'];
			PurchaseOrderMaterial::where("id", "=", $key)->update(array("unit_rate_taxed"=>$taxtotalrate));

		}
		$amd=Amendment::where('id','=',$amend->id)->with('amenddetails')->with('amenddetails.pomaterials.storematerial')->with('amenddetails.oldpomaterials.storematerial')->with('amenddetails.potaxes')->with('amenddetails.oldpotaxes')->with('amenddetails.poterms')->with('amenddetails.oldpoterms')->first();
		return array($out,$amd);
	}

	// public function savepo() {

	// 	$data = Request::all();

	// 	$out = array();

	// 	$year = date("Y");

	// 	$project = Projects::where('id', '=', $data['projectid'])->first();

	// 	$out['today'] = date('d-m-Y');

	// 	$purchaseorderold = PurchaseOrder::where("po_no", "=", $data['poid'])->first()->toArray();

	// 	$createrevisedpo = OldPurchaseOrder::create($purchaseorderold);
	// 	$createrevisedpo->poid = $purchaseorderold['id'];
	// 	$createrevisedpo->save();

	// 	$purchaseordermaterialold = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->get()->toArray();

	// 	foreach ($purchaseordermaterialold as $porevisedmat) {
			
	// 		$createrevisedpomaterial = OldPurchaseOrderMaterial::create($porevisedmat);
	// 	}

	// 	$purchaseordertaxesold = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->get()->toArray();

	// 	foreach ($purchaseordertaxesold as $porevisedtax) {
			
	// 		$createrevisedpotaxes = OldPurchaseTaxes::create($porevisedtax);

	// 		$purchaseordertaxmat = PurchaseTaxMaterials::where("tax_id", "=", $porevisedtax['id'])->get()->toArray();
	// 		foreach ($purchaseordertaxmat as $oldtaxmat) {
				
	// 			$createrevisedtaxmat = OldPurchaseTaxMaterials::create($oldtaxmat);
	// 			$createrevisedtaxmat->tax_id = $createrevisedpotaxes->id;
	// 			$createrevisedtaxmat->save();
	// 		}
	// 	}

	// 	$purchaseordertermsold = PurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->get()->toArray();

	// 	foreach ($purchaseordertermsold as $porevisedterm) {
			
	// 		$createrevisedpoterms = OldPurchaseTerms::create($porevisedterm);
	// 	}
	// 	$updateoldpomat = OldPurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->update(array("purchase_order_id" => $createrevisedpo->id));
	// 	$updateoldtax = OldPurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->update(array("purchase_id" => $createrevisedpo->id));
	// 	$updateoldterms = OldPurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->update(array("purchase_id" => $createrevisedpo->id));
		

	// 	$yearnext = $year+1;
	// 	$out['year'] = $year."-".substr($yearnext, 2,2);
	// 	$tkn=Request::header('JWT-AuthToken');

	// 	$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

	// 	$userid = $user['users']['id'];

	// 	$companydetails = Company::where('id', '=', $user['users']['company_id'])->with('compdetails')->first();

	// 	$out['companydetails'] = $companydetails;

	// 	$vendor = Vendor::where('id', '=', $data['vendorid'])->first();
	// 	$out['vendordetails'] = $vendor;

	// 	if($data) {

	// 		if(!isset($data['reference'])) {

	// 			$data['reference'] = "";
	// 		}
	// 		if(!isset($data['transportmode'])) {

	// 			$data['transportmode'] = "";
	// 		}
	// 		$currentpurchaseorder = PurchaseOrder::where("po_no", "=", $data['poid'])->first();

	// 		$currentpurchaseorder->vendor_id=$data['vendorid'];
	// 		$currentpurchaseorder->project_id=$data['projectid'];
	// 		$currentpurchaseorder->billingaddress=$data['billingaddress'];
	// 		$currentpurchaseorder->transporttype=$data['transporttype'];
	// 		$currentpurchaseorder->deliverylocation=$data['deliverylocation'];
	// 		$currentpurchaseorder->termsnconditions=$data['termsnconditions'];
	// 		$currentpurchaseorder->reference=$data['reference'];
	// 		$currentpurchaseorder->total_cost=$data['totalvalueofgoods'];
	// 		$currentpurchaseorder->transport_mode=$data['transportmode'];
	// 		$currentpurchaseorder->amendment = 1;

	// 		$currentpurchaseorder->save();
				
	// 		$deletepotaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->delete();

	// 		$deletepomaterials = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->delete();
	// 		$totalqty = 0;
	// 		$totalcost = 0;

	// 		foreach ($data['materiallist'] as $mlist) {

	// 			$totalqty = $totalqty+$mlist['qty'];
	// 			$totalcost = $totalcost+$mlist['valueofgoods'];
	// 			if(!isset($mlist['remarks'])) {

	// 				$mlist['remarks'] = "";
	// 			}
				
	// 			$singlepurmat = array(

	// 					"purchase_order_id"=>$purchaseorderold['id'],
	// 					"purchase_unique_id"=>$mlist['elementcount'],
	// 					"material_id"=>$mlist['material_id'],
	// 					"quantity"=>$mlist['qty'],
	// 					"unit_rate"=>$mlist['unitrate'],
	// 					"value_of_goods"=>$mlist['valueofgoods'],
	// 					"remarks"=>$mlist['remarks'],
	// 					"deliveryaddress"=>$mlist['deliveryaddress']
	// 				);

	// 			$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);
	// 		}

	// 		$currentpurchaseorder->total_qty= $totalqty;
	// 		$currentpurchaseorder->save();

	// 		if(isset($data['taxdetails']) && count($data['taxdetails']) > 0) {

	// 			foreach ($data['taxdetails'] as $tax) {

	// 				if(!isset($tax['taxdescription'])) {

	// 					$tax['taxdescription'] = "";
	// 				}

	// 				$singlepurchasetaxes = array(
	// 						"purchase_id"=>$purchaseorderold['id'],
	// 						"name"=>$tax['taxtitle'],
	// 						"type"=>$tax['taxtype'],
	// 						"tax_id"=>$tax['tax_id'],
	// 						"tax_desc"=>$tax['taxdescription'],
	// 						"taxpercentage"=>$tax['taxpercentage'],
	// 						"inclusive_taxpercentage"=>$tax['inclusivetaxpercentage'],
	// 						"value"=>$tax['taxamount'],
	// 						"lumpsum"=>$tax['lumpsum']
	// 					);

	// 				$taxcreate = PurchaseTaxes::create($singlepurchasetaxes);

	// 				foreach ($tax['taxmaterials'] as $taxmat) {
						
	// 					$materialidthis = $taxmat['material_id'];
	// 					$potaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->where("tax_id", "=", $taxmat['tax']['tax_id'])->first();
	// 					if($potaxes) {

	// 						$purchase_tax_id = $potaxes->id;
	// 					} else {

	// 						$purchase_tax_id = 0;
	// 					}
	// 					if($materialidthis != 0) {

	// 						$pomatid = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("purchase_unique_id", "=", $taxmat['elementcount'])->first();
	// 						$materialidthis = $pomatid->id;
	// 					}
	// 					$singletaxmat = array("tax_id"=>$taxcreate->id, "purchase_taxes_id"=>$purchase_tax_id, "material_id"=>$materialidthis);
	// 					$createtaxmat = PurchaseTaxMaterials::create($singletaxmat);
	// 				}
	// 			}
	// 		}

	// 		$deletepoterms = PurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->delete();

	// 		if(isset($data['specialterms']) && count($data['specialterms']) > 0) {

	// 			foreach ($data['specialterms'] as $sterm) {

	// 				$singlespecial = array(
	// 						"purchase_id"=>$purchaseorderold['id'],
	// 						"name"=>$sterm['termtitle'],
	// 						"condition"=>$sterm['termdesc']
	// 					);

	// 				$specialcreate = PurchaseTerms::create($singlespecial);
	// 			}
	// 		}
	// 		$poid = $purchaseorderold['id'];

	// 		$out['poid'] = $poid;

	// 		$out['podetails'] = $currentpurchaseorder;
			
	// 		$pono = $currentpurchaseorder->po_no;

	// 		$out['pono'] = $pono;

			
	// 	}

	// 	return $out;
	// }

	public function editpo() {

		$data = Request::all();

		$out = array();

		$year = date("Y");

		$project = Projects::where('id', '=', $data['projectid'])->first();

		$out['today'] = date('d-m-Y');

		$purchaseorderold = PurchaseOrder::where("po_no", "=", $data['poid'])->first()->toArray();

		$yearnext = $year+1;
		$out['year'] = $year."-".substr($yearnext, 2,2);
		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$userid = $user['users']['id'];

		$companydetails = Company::where('id', '=', $user['users']['company_id'])->with('compdetails')->first();

		$out['companydetails'] = $companydetails;

		$vendor = Vendor::where('id', '=', $data['vendorid'])->first();
		$out['vendordetails'] = $vendor;

		if($data) {

			if(!isset($data['reference'])) {

				$data['reference'] = "";
			}
			if(!isset($data['transportmode'])) {

				$data['transportmode'] = "";
			}
			$currentpurchaseorder = PurchaseOrder::where("po_no", "=", $data['poid'])->first();

			$currentpurchaseorder->vendor_id=$data['vendorid'];
			$currentpurchaseorder->project_id=$data['projectid'];
			$currentpurchaseorder->billingaddress=$data['billingaddress'];
			$currentpurchaseorder->transporttype=$data['transporttype'];
			$currentpurchaseorder->deliverylocation=$data['deliverylocation'];
			$currentpurchaseorder->termsnconditions=$data['termsnconditions'];
			$currentpurchaseorder->reference=$data['reference'];
			$currentpurchaseorder->total_cost=$data['totalvalueofgoods'];
			$currentpurchaseorder->transport_mode=$data['transportmode'];

			$currentpurchaseorder->save();
				
			$deletepotaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->delete();

			$deletepomaterials = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->get();
			$totalqty = 0;
			$totalcost = 0;

			foreach ($data['materiallist'] as $mlistmain) {

				if($mlistmain) {

					if($mlistmain['type'] == 3) {

						$totalqty = $totalqty+$mlistmain['qty'];
						$totalcost = $totalcost+$mlistmain['valueofgoods'];
						if(!isset($mlistmain['remarks'])) {

							$mlistmain['remarks'] = "";
						}

						if(!isset($mlistmain['freightinsurance_rate'])) {

							$mlistmain['freightinsurance_rate'] = "";
						}
						if(!isset($mlistmain['inspected_quantity'])) {

							$mlistmain['inspected_quantity'] = 0;
						}
						if(!isset($mlistmain['approved_quantity'])) {

							$mlistmain['approved_quantity'] = 0;
						}
						if(!isset($mlistmain['dispatch_quantity'])) {

							$mlistmain['dispatch_quantity'] = 0;
						}
						if(!isset($mlistmain['internal_di_quantity'])) {

							$mlistmain['internal_di_quantity'] = 0;
						}
						if(!isset($mlistmain['payment_qty'])) {

							$mlistmain['payment_qty'] = 0;
						}

						$delpomat = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $mlistmain['materialid'])->where("internal_di_quantity", ">", 0)->first();
						
						$singlepurmat = array(

								"purchase_order_id"=>$purchaseorderold['id'],
								"material_id"=>$mlistmain['materialid'],
								"store_material_uom_id"=>$mlistmain['uomid'],
								"quantity"=>$mlistmain['qty'],
								"unit_rate"=>$mlistmain['unitrate'],
								"value_of_goods"=>$mlistmain['valueofgoods'],
								"remarks"=>$mlistmain['remarks'],
								"freightinsurance_rate"=>$mlistmain['freightinsurance_rate'],
								"inspected_quantity"=>$mlistmain['inspected_quantity'],
								"approved_quantity"=>$mlistmain['approved_quantity'],
								"dispatch_quantity"=>$mlistmain['dispatch_quantity'],
								"internal_di_quantity"=>$mlistmain['internal_di_quantity'],
								"payment_qty"=>$mlistmain['payment_qty'],
								"store_material_uom_id"=>$mlistmain['uomid'],
								"store_material_main_uom_id"=>$mlistmain['mainuomid']
							);

						$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);

						foreach ($mlistmain['materials'] as $inmlistf) {

							$singlefabmat = array(

									"purchase_order_material_id"=>$createsinglemat->id,
									"store_material_id"=>$inmlistf['materialid'],
									"store_material_uom_id"=>$inmlistf['uomid'],
									"qty"=>$inmlistf['qty']
								);

							PoFabricationMaterial::create($singlefabmat);
						}


						if($delpomat) {

							InternalDIPo::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
							InspectionPoMaterial::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
							DispatchPoMaterial::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
							PoFabricationMaterial::where("purchase_order_material_id", "=", $delpomat->id)->delete();
							$delpomat->delete();
						}
					} else {

						foreach ($mlistmain['materials'] as $mlist) {
							
							$totalqty = $totalqty+$mlist['qty'];
							$totalcost = $totalcost+$mlist['valueofgoods'];
							if(!isset($mlist['remarks'])) {

								$mlist['remarks'] = "";
							}

							if(!isset($mlist['freightinsurance_rate'])) {

								$mlist['freightinsurance_rate'] = "";
							}
							if(!isset($mlist['inspected_quantity'])) {

								$mlist['inspected_quantity'] = 0;
							}
							if(!isset($mlist['approved_quantity'])) {

								$mlist['approved_quantity'] = 0;
							}
							if(!isset($mlist['dispatch_quantity'])) {

								$mlist['dispatch_quantity'] = 0;
							}
							if(!isset($mlist['internal_di_quantity'])) {

								$mlist['internal_di_quantity'] = 0;
							}
							if(!isset($mlist['payment_qty'])) {

								$mlist['payment_qty'] = 0;
							}
							if(!isset($mlist['mainuomid'])) {

								$mlist['mainuomid'] = 0;
							}

							$delpomat = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $mlist['materialid'])->where("internal_di_quantity", ">", 0)->first();
							
							$singlepurmat = array(

									"purchase_order_id"=>$purchaseorderold['id'],
									"material_id"=>$mlist['materialid'],
									"store_material_uom_id"=>$mlist['uomid'],
									"quantity"=>$mlist['qty'],
									"unit_rate"=>$mlist['unitrate'],
									"value_of_goods"=>$mlist['valueofgoods'],
									"remarks"=>$mlist['remarks'],
									"freightinsurance_rate"=>$mlist['freightinsurance_rate'],
									"inspected_quantity"=>$mlist['inspected_quantity'],
									"approved_quantity"=>$mlist['approved_quantity'],
									"dispatch_quantity"=>$mlist['dispatch_quantity'],
									"internal_di_quantity"=>$mlist['internal_di_quantity'],
									"payment_qty"=>$mlist['payment_qty'],
									"store_material_uom_id"=>$mlist['uomid'],
									"store_material_main_uom_id"=>$mlist['mainuomid']
								);

							$createsinglemat = PurchaseOrderMaterial::create($singlepurmat);

							if($delpomat) {

								InternalDIPo::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
								InspectionPoMaterial::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
								DispatchPoMaterial::where("pom_table_id", "=", $delpomat->id)->update(array("pom_table_id"=>$createsinglemat->id));
								$delpomat->delete();
							}
						}
					}

				}
			}

			foreach ($deletepomaterials as $indipomat) {
				PurchaseOrderMaterial::where("id", "=", $indipomat['id'])->delete();
			}

			$currentpurchaseorder->total_qty= $totalqty;
			$currentpurchaseorder->save();

			if(isset($data['taxdetails']) && count($data['taxdetails']) > 0) {

				foreach ($data['taxdetails'] as $tax) {

					if(!isset($tax['taxdescription'])) {

						$tax['taxdescription'] = "";
					}

					$singlepurchasetaxes = array(
							"purchase_id"=>$purchaseorderold['id'],
							"name"=>$tax['taxtitle'],
							"type"=>$tax['taxtype'],
							"tax_id"=>$tax['tax_id'],
							"tax_desc"=>$tax['taxdescription'],
							"taxpercentage"=>$tax['taxpercentage'],
							"value"=>$tax['taxamount'],
							"lumpsum"=>$tax['lumpsum']
						);

					$taxcreate = PurchaseTaxes::create($singlepurchasetaxes);

					foreach ($tax['taxmaterials'] as $taxmat) {
						
						$materialidthis = $taxmat['material_id'];
						if(!isset($taxmat['tax'])) {

							$taxmat['tax']['tax_id'] = 0;
						}
						$potaxes = PurchaseTaxes::where("purchase_id", "=", $purchaseorderold['id'])->where("tax_id", "=", $taxmat['tax']['tax_id'])->first();
						if($potaxes) {

							$purchase_tax_id = $potaxes->id;
						} else {

							$purchase_tax_id = 0;
						}
						if($materialidthis != 0) {

							$pomatid = PurchaseOrderMaterial::where("purchase_order_id", "=", $purchaseorderold['id'])->where("material_id", "=", $materialidthis)->first();
							$materialidthis = $pomatid->id;
						}
						$singletaxmat = array("tax_id"=>$taxcreate->id, "purchase_taxes_id"=>$purchase_tax_id, "material_id"=>$materialidthis);
						$createtaxmat = PurchaseTaxMaterials::create($singletaxmat);
					}
				}
			}

			$deletepoterms = PurchaseTerms::where("purchase_id", "=", $purchaseorderold['id'])->delete();

			if(isset($data['specialterms']) && count($data['specialterms']) > 0) {

				foreach ($data['specialterms'] as $sterm) {

					$singlespecial = array(
							"purchase_id"=>$purchaseorderold['id'],
							"name"=>$sterm['termtitle'],
							"condition"=>$sterm['termdesc']
						);

					$specialcreate = PurchaseTerms::create($singlespecial);
				}
			}
			$poid = $purchaseorderold['id'];

			$out['poid'] = $poid;

			$out['podetails'] = $currentpurchaseorder;
			
			$pono = $currentpurchaseorder->po_no;

			$out['pono'] = $pono;

			
		}


		$mainpoidnew = $purchaseorderold['id'];

		$pomatcal = PurchaseOrderMaterial::where("purchase_order_id", "=", $mainpoidnew)->get();

		$pomatcalarr = array();

		foreach ($pomatcal as $indipomatcal) {
			
			$pomatcalarr[$indipomatcal->id]['amount'] = $indipomatcal->value_of_goods;
			$pomatcalarr[$indipomatcal->id]['tax'] = $indipomatcal->value_of_goods;
			$pomatcalarr[$indipomatcal->id]['freightinsurance_rate'] = $indipomatcal->freightinsurance_rate;
			$pomatcalarr[$indipomatcal->id]['quantity'] = $indipomatcal->quantity;
		}

		$potaxescal = PurchaseTaxes::where("purchase_id", "=", $mainpoidnew)->get();

		foreach ($potaxescal as $indipotaxescal) {
			
			if($indipotaxescal->lumpsum == 1 && $indipotaxescal->tax_id != 11) {

				foreach ($pomatcalarr as $key => $value) {
					
					$pomatcalarr[$indipomatcal->id]['tax'] += (($indipotaxescal->tax_amount*$pomatcalarr[$indipomatcal->id]['quantity'])/$createpurchase->total_qty);
				}

			} else {


				$potaxmatcal = PurchaseTaxMaterials::where("tax_id", "=", $indipotaxescal->id)->get();
				foreach ($potaxmatcal as $indipotaxtmatcal) {
					
					if($indipotaxtmatcal->material_id != 0) {

						$pomatcalarr[$indipotaxtmatcal->material_id]['tax'] += (($indipotaxescal->taxpercentage*$pomatcalarr[$indipotaxtmatcal->material_id]['amount'])/100);
					} else if($indipotaxtmatcal->purchase_taxes_id != 0){


						$caltaxontax = PurchaseTaxes::where("id", "=", $indipotaxtmatcal->purchase_taxes_id)->with("taxmaterials")->first();

						foreach ($potaxmatcal as $taxmatin) {

							if($indipotaxtmatcal->material_id != 0) {

								foreach ($caltaxontax->taxmaterials as $intaxmat) {
									
									if($taxmatin['material_id'] == $intaxmat['material_id']) {

										$pomatcalarr[$taxmatin['material_id']]['tax'] += (($indipotaxtmatcal->taxpercentage*($caltaxontax->taxpercentage * $pomatcalarr[$taxmatin->material_id]['amount']/100))/100);
									}
								}

								
							}	
						}
						
					}
				}
			}
		}

		foreach ($pomatcalarr as $key => $value) {
			if($value['quantity'] > 0) {
				$taxtotalrate = ($value['tax']/$value['quantity']) + $value['freightinsurance_rate'];
				PurchaseOrderMaterial::where("id", "=", $key)->update(array("unit_rate_taxed"=>$taxtotalrate));
			}

		}

		return $out;
	}


	public function get_material_vend_list() {

		$matid = Request::input("dat");
		$vids = array();

		$q = VendorMaterials::distinct()->where('store_material_id','=',$matid)->get();
		for ($i=0; $i < count($q); $i++) { 
			# code...
			array_push($vids, $q[$i]['vendor_id']);
		}

		return $q1 = Vendor::whereIn('id',$vids)->get();

	}

	public function get_material_list() {

		return $q = StoreMaterial::all();

	}

	public function get_enquiry_details() {

		$enqno = Request::input("enqno");
		$enqno = str_ireplace("E", "", trim($enqno));

		$enq = Enquiry::where("id","=",$enqno)->first();
		if($enq) {
			$out = Enquiry::where("id", "=", $enqno)->with("vendors.taxes.taxdetails")->with("vendors.taxes.taxmaterials.enqtaxdetails.taxdetails")->with("vendors.taxes.taxmaterials.enqtaxmat")->with("vendors.materials.materialdetails")->with("vendors.materials.uomdet.stmatuom")->with("vendors.quotationterms.quotationdefault")->with("vendors.vendordetails")->with("vendors.quotationdocs")->with("projects.projectdetails")->with("vendors.quotpayterms")->first();

		} else {

			$out = 0;
		}

		return $out;


	}

	public function saveinspection_details_total() {

		$insp = Request::input("dat");
		$iid = $insp['id'];
		$vendor = Request::input('vendor');
		$project = Request::input('project');
		$pos = array();
		$mids = array();
		$gtpflag = 0;
		$podocflag = 0;
		$out = array();

		$q12 = InspectionPo::where('inspection_id','=',$iid)->get();

		for ($m=0; $m < count($q12); $m++) { 
			# code...
			array_push($pos, $q12[$m]['po_id']);
		}

		for ($x=0; $x < count($pos); $x++) { 
			# code...
			$q13 = PurchaseOrder::where('id','=',$pos[$x])->first();
			if($q13['company_approved_po']!='' && $q13['vendor_approved_po']!='')
			{

			}
			else
			{
				$podocflag = 1; //check if po docs are uploaded
			}
		}

		for ($i=0; $i < count($insp['insmat']); $i++) { 
			# code...
			array_push($mids, $insp['insmat'][$i]['material_id']);
		}
		// return $mids;
		for ($m=0; $m < count($mids); $m++) { 
			# code...
			$q11 = GtpDrawings::where('project_id','=',$project)->where('vendor_id','=',$vendor)->where('material_id','=',$mids[$m])->get();
			
			if($q11->count()==0)
			{
				$gtpflag = 1; //check if gtp is uploaded
				$matname = StoreMaterial::where("id", "=", $mids[$m])->first();
				$gtpdrarr[] = $matname;
			}
		}

		if($gtpflag==0 && $podocflag == 0)
		{
			$q1 = Inspections::where('id','=',$iid)->update(array('inspec_call_supplier_date' => $insp['inspec_call_supplier_date'],
			'inspec_call_supplier_refno' => $insp['inspec_call_supplier_refno'],
			'inspec_call_supplier_remarks'=>$insp['inspec_call_supplier_remarks'],
			'inspec_report_date'=> $insp['inspec_report_date'],
			'inspec_report_refno' => $insp['inspec_report_refno'],
			'inspection_location' => $insp['inspection_location'],
			'approved_inspec_date' => $insp['approved_inspec_date'],
			'approved_inspec_refno' => $insp['approved_inspec_refno'],
			'inspection_readiness_date' => $insp['inspection_readiness_date'],
			'inspection_ref_no' => $insp['inspection_ref_no'],
			'inspector_name' => $insp['inspector_name'],
			'remarks' => $insp['remarks']
			));

			//fill docs
			$q2 = InspectionDocs::where('purchase_order_inspection_id','=',$iid)->delete();
			if(count($insp['insdocs']) >0)
			{
				for ($i=0; $i < count($insp['insdocs']); $i++) { 
					# code...
					$doc = new InspectionDocs;
					$doc->purchase_order_inspection_id = $iid;
					$doc->doc_name = $insp['insdocs'][$i]['doc_name'];
					$doc->doc_url = $insp['insdocs'][$i]['doc_url'];
					$doc->doc_type = $insp['insdocs'][$i]['doc_type'];
					$doc->save();
				}
			}

			//add po insp dets
			$ids = array();
			$q3 = InspectionMaterial::where('inspection_id','=',$iid)->select('id')->get();
			for ($m=0; $m < count($q3); $m++) { 
				# code...
				array_push($ids, $q3[$m]->id);
			}

			//update PO materials
			$q9 = InspectionPoMaterial::whereIn('inspection_material_id',$ids)->get();
			if($q9->count()>0)
			{
				for ($i=0; $i < count($q9); $i++) { 
					# code... 
					$q10 = PurchaseOrderMaterial::where('id','=',$q9[$i]['pom_table_id'])->first();

					$niqty = floatval($q10['inspected_quantity']) - floatval($q9[$i]['inspected_quantity']);
					$naqty = floatval($q10['approved_quantity']) - floatval($q9[$i]['approved_quantity']);

					$q11 = PurchaseOrderMaterial::where('id','=',$q9[$i]['pom_table_id'])->update(array('inspected_quantity' => $niqty,'approved_quantity'=> $naqty));

				}
			}
			
			$insmatids = array();
			$inspomatids = array();
			
			for ($j=0; $j < count($insp['insmat']); $j++) { 
				# code...
				if($insp['insmat'][$j]['id']=='')
				{
					// return '12';
					$insmat = new InspectionMaterial;
					$insmat->inspection_id = $iid;
					$insmat->material_id =  $insp['insmat'][$j]['material_id'];
					$insmat->inspected_quantity =  $insp['insmat'][$j]['inspected_quantity'];
					$insmat->approved_quantity =  $insp['insmat'][$j]['approved_quantity'];
					$pomtabid=PurchaseOrderMaterial::where('id','=',$insp['insmat'][$j]['inseachpomat'][0]['pom_table_id'])->first();
					$insmat->uom_id=$pomtabid->store_material_uom_id;
					$insmat->save();
					$imatid = $insmat->id;
					array_push($insmatids,$imatid);
					// array_push($out, $insp['insmat'][$j]['approved_quantity']);

				}
				else
				{
					$q9 = InspectionMaterial::where('id','=',$insp['insmat'][$j]['id'])->update(array('approved_quantity' =>$insp['insmat'][$j]['approved_quantity']));
					$imatid = $insp['insmat'][$j]['id'];
					array_push($insmatids,$insp['insmat'][$j]['id']);
				}
				

				for ($k=0; $k < count($insp['insmat'][$j]['inseachpomat']); $k++) { 
					# code...
					if($insp['insmat'][$j]['inseachpomat'][$k]['id']=='')
					{
						
						$new = new InspectionPoMaterial;
						$new->inspection_po_id = $insp['insmat'][$j]['inseachpomat'][$k]['inspection_po_id'];
						$new->po_material_id = $insp['insmat'][$j]['inseachpomat'][$k]['po_material_id'];
						$new->pom_table_id = $insp['insmat'][$j]['inseachpomat'][$k]['pom_table_id'];
						$pomtabid=PurchaseOrderMaterial::where('id','=',$insp['insmat'][$j]['inseachpomat'][$k]['pom_table_id'])->first();
						$new->uom_id=$pomtabid->store_material_uom_id;
						$new->inspection_material_id = $imatid;
						$new->inspected_quantity = $insp['insmat'][$j]['inseachpomat'][$k]['inspected_quantity'];
						$new->approved_quantity = $insp['insmat'][$j]['inseachpomat'][$k]['approved_quantity'];
						$new->save();
						
					}
					else
					{
						$q11 = InspectionPoMaterial::where('id','=',$insp['insmat'][$j]['inseachpomat'][$k]['id'])->update(array('approved_quantity' => $insp['insmat'][$j]['inseachpomat'][$k]['approved_quantity']));
					}
					
					

					$q12 = PurchaseOrderMaterial::where('id','=',$insp['insmat'][$j]['inseachpomat'][$k]['pom_table_id'])->first();
					$iqty = floatval($q12['inspected_quantity']) + floatval($insp['insmat'][$j]['inseachpomat'][$k]['inspected_quantity']);
					$aqty = floatval($q12['approved_quantity']) + floatval($insp['insmat'][$j]['inseachpomat'][$k]['approved_quantity']);
					$q12 = PurchaseOrderMaterial::where('id','=',$insp['insmat'][$j]['inseachpomat'][$k]['pom_table_id'])->update(array('inspected_quantity' => $iqty,'approved_quantity'=>$aqty));

				}
			}

			//keep all stuff which have ids and delete rest

			$q4 = InspectionMaterial::where('inspection_id','=',$iid)->whereNotIn('id',$insmatids)->select('id')->get();
			for ($i=0; $i < count($q4); $i++) { 
				# code...
				array_push($inspomatids,$q4[$i]['id']);
			}
			$q4 = InspectionMaterial::where('inspection_id','=',$iid)->whereNotIn('id',$insmatids)->delete();
			$q5 = InspectionPoMaterial::whereIn('inspection_material_id',$inspomatids)->delete();

			$out['res'] = 'yes';
			// return $out;
		}
		else if($gtpflag==1 && $podocflag==0)
		{
			$out['res'] = 'nogtp';
			$out['mat'] = implode(",", $gtpdrarr);
		}
		else if($gtpflag==0 && $podocflag==1)
		{
			$out['res'] = 'nopodocs';
		}
		else if($gtpflag==1 && $podocflag==1)
		{
			$out['res'] = 'both';
		}

		// return array($gtpflag,$podocflag);
		// return $insp['insmat'];
		return $out;
	}

	public function create_new_insp_ref() {

		$pos = Request::input("pos");
		$name = Request::input('ref');

		$q1 = new Inspections;
		$q1->inspection_ref_no = $name;
		$q1->save();
		$id = $q1->id;

		for ($i=0; $i < count($pos); $i++) { 
			# code...
			$q2 = new InspectionPo;
			$q2->inspection_id = $id;
			$q2->po_id = $pos[$i];
			$q2->save();
		}

		

		return 'donedude';


	}

	public function get_enquiry_venmat() {

		$enqid = Request::input("enqid");

		$vendorid = Request::input("vendorid");

		$enq = Enquiry::where("id","=",$enqid)->first();
		if($enq) {
			return $out = EnquiryVendor::where("enquiry_id", "=", $enqid)->where("vendor_id","=", $vendorid)->with("taxes.taxdetails")->with("materials.materialdetails")->with("vendordetails")->first();

		} else {

			$out = 0;
		}

		return $out;


	}

	public function get_enquiry_detailsreport() {

		$enqno = Request::input("enqno");
		$enqno = str_ireplace("E", "", trim($enqno));

		$enq = Enquiry::where("id","=",$enqno)->first();
		if($enq) {
			$enq = Enquiry::where("id", "=", $enqno)->with('vendors')->first();
			$venarr = array();
	    	foreach ($enq->vendors as $ven) {
	    		$venarr[] = $ven['id'];
	    	}	

	    	return $enqmat = EnquiryMaterial::whereIn("enquiry_vendor_id", $venarr)->with("materialdetails")->with("taxes")->get();

		} else {

			$out = 0;
		}

		return $out;


	}

	public function get_enquiry_list() {

		$projectid = Request::input("projectid");
		$vendorid = Request::input("vendorid");

		if($projectid != "All") {
			return $out = Enquiry::whereHas('vendors', function($query) use ($vendorid)
				{
				    $query->where('vendor_id', '=', $vendorid);
				})->whereHas('projects', function($query) use ($projectid)
				{
				    $query->where('project_id', '=', $projectid);
				})->with("vendors.taxes.taxdetails")->with("vendors.materials.materialdetails")->with("vendors.vendordetails")->with("projects")->get();
		} else {
			return $out = Enquiry::whereHas('vendors', function($query) use ($vendorid)
				{
				    $query->where('vendor_id', '=', $vendorid);
				})->with("vendors.taxes.taxdetails")->with("vendors.materials.materialdetails")->with("vendors.vendordetails")->with("projects")->get();

		}

		

	}

	public function get_project_enquiry_list() {
		$projectid = Request::input("projectid");
		if($projectid != "") {
			$enquiries = array();
			$out = EnquiryProjects::where('project_id','=',$projectid)->with('enquirydetails.cs.csref')/*->with('enquirydetails.vendors')->with('enquirydetails.vendors.vendordetails')->with('enquirydetails.vendors.materials')*/->get();
			foreach ($out as $key => $enquiry) {
				array_push($enquiries, $enquiry['enquirydetails']);
			}
			return $enquiries;
			// return $out = Enquiry::whereHas('projects', function($query) use ($projectid)
			// 	{
			// 	    $query->where('project_id', '=', $projectid);
			// 	})->get();
		}		
	}

	public function get_dispatches_list() {
		$insid = Request::input("dat");
		$q1check = InspectionDispatch::where('inspection_id','=',$insid)->with('intdi.intdimat')->get();
		$matarr = array();
		foreach ($q1check as $inq1) {
			foreach ($inq1['intdi'] as $indiint) {
				foreach ($indiint['intdimat'] as $inma) {
					if(!in_array($inma['di_material_id'], $matarr)) {
						array_push($matarr, $inma['di_material_id']);
					}
				}
			}
			
		}
		$q1 = InspectionDispatch::where('inspection_id','=',$insid)->with('intdi.intdidocs')->with('intdi.intdimat.matdes')->with('intdi.intdimat.intdipo.podets')->with('intdi.intdimat.intdipo.storename')->with('intdi.intdimat.intdipo.siteareas')->with('callraise.attachments')->with('didocs')->with('dimat.dieachpomat.podets.taxes.taxmaterials')->with('dimat.dieachpomat.podets.project')->with('dimat.dieachpomat.podets.vendor')->with('dimat.dieachpomat.podets.csref.csrefdet.csvendor')->with('dimat.matdes')->with(array('dimat.dieachpomat.podets.pomaterials'=>function($q) use ($matarr){

			$q->whereIn("material_id", $matarr)->with("storematerial");
		}))->get();
		
		return $q1;
			
	}

	public function del_dimat_totals() {
		$data = Request::input("dat");
		$iid = Request::input('iid');
		$diid = Request::input('diid');

		// $q1 = InternalDIMaterial::where('internal_di_id','=',$data['id'])->get();

		$q1 = InternalDI::where('id','=',$data['id'])->delete();
		$q12 = InternalDiDocs::where('internal_di_id','=',$data['id'])->delete();		

		for ($i=0; $i < count($data['intdimat']); $i++) { 
			# code...
			$q2 = InspectionMaterial::where('material_id','=',$data['intdimat'][$i]['di_material_id'])->where('inspection_id','=',$iid)->first();
			$q9 = DispatchMaterial::where('material_id','=',$data['intdimat'][$i]['di_material_id'])->where('dispatch_id','=',$diid)->first();
			$q4 = InternalDIMaterial::where('id','=',$data['intdimat'][$i]['id'])->first();

			//calculate
			$dimat = floatval($q9['internal_di']) - floatval($q4['quantity']);
			$insmat = floatval($q2['internal_di_quantity']) - floatval($q4['quantity']);
			
			//update inspection material, dispatch material and internal di mat
			$q24 = InspectionMaterial::where('material_id','=',$data['intdimat'][$i]['di_material_id'])->where('inspection_id','=',$iid)->update(array('internal_di_quantity' =>$insmat));
			$q91 = DispatchMaterial::where('material_id','=',$data['intdimat'][$i]['di_material_id'])->where('dispatch_id','=',$diid)->update(array('internal_di' => $dimat));
			$q6 = InternalDIMaterial::where('id','=',$data['intdimat'][$i]['id'])->delete();
			//

			$inspmid = $q2['id'];
			$dispmatid = $q9['id'];

			for ($j=0; $j < count($data['intdimat'][$i]['intdipo']); $j++) { 
				# code...
				$q3 = InspectionPoMaterial::where('inspection_material_id','=',$inspmid)->where('po_material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->where('inspection_po_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->first();
				$q10 = DispatchPoMaterial::where('dispatch_material_id','=',$dispmatid)->where('po_material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->where('dispatch_po_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->first();
				$q51 = PurchaseOrderMaterial::where('purchase_order_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->where('material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->first();
				$q7 = InternalDIPo::where('id','=',$data['intdimat'][$i]['intdipo'][$j]['id'])->first();

				//update insppomat, disppomat, internaldipo and po mat tables
				$nidi = floatval($q3['internal_di_quantity']) - floatval($q7['quantity']);

				$ndpoq = floatval($q10['internal_di_quantity']) - floatval($q7['quantity']);

				$pomat  = floatval($q51['internal_di_quantity']) - floatval($q7['quantity']);

				//update
				$q3 = InspectionPoMaterial::where('inspection_material_id','=',$inspmid)->where('po_material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->where('inspection_po_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->update(array('internal_di_quantity' =>$nidi));

				$q15 =  DispatchPoMaterial::where('dispatch_material_id','=',$dispmatid)->where('po_material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->where('dispatch_po_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->update(array('internal_di_quantity' => $ndpoq));

				$q51 = PurchaseOrderMaterial::where('purchase_order_id','=',$data['intdimat'][$i]['intdipo'][$j]['po_id'])->where('material_id','=',$data['intdimat'][$i]['intdipo'][$j]['material_id'])->update(array('internal_di_quantity' => $pomat));
				$q7 = InternalDIPo::where('id','=',$data['intdimat'][$i]['intdipo'][$j]['id'])->delete();
			}
		}

		



		
		return 'yes';
			
	}

	public function savedi_data_final() {
		
		$di = Request::input('di');
		$insp = Request::input("insp");
		$iid = Request::input('iid');
		$diid = Request::input('diid');
		$dimatids = array();
		$mids = array();
		$dipomatids = array();

		$q17 = DispatchMaterial::where('dispatch_id','=',$diid)->with('dieachpomat')->get();
			//reduce inspection_mat & insppomat and po_mat table values
			if($q17->count()>0)
			{
				for ($i=0; $i < count($q17); $i++) { 
					# code...
					$q1 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$q17[$i]['material_id'])->first();
					if(count($q1)>0)
					{
						$x = floatval($q1['dispatch_quantity']) - floatval($q17[$i]['quantity']);
						$q2 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$q17[$i]['material_id'])->update(array('dispatch_quantity' =>$x));

						for ($m=0; $m < count($q17[$i]['dieachpomat']); $m++) { 
							# code...

							$q5 = PurchaseOrderMaterial::where('id','=',$q17[$i]['dieachpomat'][$m]['pom_table_id'])->first();
							$pp = floatval($q5['dispatch_quantity']) - floatval($q17[$i]['dieachpomat'][$m]['dispatch_quantity']);
							$q5 = PurchaseOrderMaterial::where('id','=',$q17[$i]['dieachpomat'][$m]['pom_table_id'])->update(array('dispatch_quantity' => $pp));


							$q4 = InspectionPoMaterial::where('inspection_material_id','=',$q1['id'])->get();
							for ($z=0; $z < count($q4); $z++) { 
								# code...
								if($q4[$z]['po_material_id'] == $q17[$i]['dieachpomat'][$m]['po_material_id'] && $q4[$z]['inspection_po_id'] == $q17[$i]['dieachpomat'][$m]['dispatch_po_id']&&$q4[$z]['pom_table_id'] == $q17[$i]['dieachpomat'][$m]['pom_table_id'])
								{
									$qz = floatval($q4[$z]['dispatch_quantity']) - floatval($q17[$i]['dieachpomat'][$m]['dispatch_quantity']);
									$q5 = InspectionPoMaterial::where('id','=',$q4[$z]['id'])->update(array('dispatch_quantity' =>$qz));
									
								}
							}
						}
					}
					
				}
			}


		for ($i=0; $i < count($di['dimat']); $i++) { 
			# code...
			
			if(!$di['dimat'][$i]['id'])
			{
				$newdi = array('dispatch_id' => $diid,
						'material_id'=> $di['dimat'][$i]['material_id'],
						'quantity' => $di['dimat'][$i]['quantity']
						);
				$q1 = DispatchMaterial::create($newdi);
				$dmid = $q1->id;
				array_push($dimatids, $dmid);
			}
			else
			{
				$q10 = DispatchMaterial::where('id','=',$di['dimat'][$i]['id'])->update(array('quantity' => $di['dimat'][$i]['quantity']));
				$dmid = $di['dimat'][$i]['id'];
				array_push($dimatids, $di['dimat'][$i]['id']);
			}

			//add to ins totals
			$q14 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$di['dimat'][$i]['material_id'])->first();
			$inspmatidz = $q14['id'];
			$inspdi = floatval($q14['dispatch_quantity']) + floatval($di['dimat'][$i]['quantity']);
			$q14 = InspectionMaterial::where('inspection_id','=',$iid)->where('material_id','=',$di['dimat'][$i]['material_id'])->update(array('dispatch_quantity' =>$inspdi));


			for ($j=0; $j < count($di['dimat'][$i]['dieachpomat']); $j++) { 

				if(!$di['dimat'][$i]['dieachpomat'][$j]['id'])
				{
					$q2 = new DispatchPoMaterial;
					$q2->dispatch_po_id = $di['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'];
					$q2->po_material_id = $di['dimat'][$i]['dieachpomat'][$j]['po_material_id'];
					$q2->pom_table_id = $di['dimat'][$i]['dieachpomat'][$j]['pom_table_id'];
					$q2->dispatch_material_id = $dmid;
					$q2->dispatch_quantity = $di['dimat'][$i]['dieachpomat'][$j]['dispatch_quantity'];
					// $q2->delivery_address = $di['dimat'][$i]['dieachpomat'][$j]['delivery_address'];
					$q2->save();

				}
				else
				{
					//update just
					$q11 = DispatchPoMaterial::where('id','=',$di['dimat'][$i]['dieachpomat'][$j]['id'])->update(array('dispatch_quantity' => $di['dimat'][$i]['dieachpomat'][$j]['dispatch_quantity']));
				}
				
				//add values to insppomat table

				$q32 = InspectionPoMaterial::where('inspection_po_id','=', $di['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$di['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('pom_table_id','=',$di['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->where('inspection_material_id','=',$inspmatidz)->first();
				$rr = floatval($q32['dispatch_quantity']) + floatval($di['dimat'][$i]['dieachpomat'][$j]['dispatch_quantity']);
				$q34 = InspectionPoMaterial::where('inspection_po_id','=', $di['dimat'][$i]['dieachpomat'][$j]['dispatch_po_id'])->where('po_material_id','=',$di['dimat'][$i]['dieachpomat'][$j]['po_material_id'])->where('inspection_material_id','=',$inspmatidz)->where('pom_table_id','=',$di['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->update(array('dispatch_quantity' => $rr));

				//add values to po mat table
				$q10 = PurchaseOrderMaterial::where('id','=',$di['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->first();
				// $dqt = $q10['dispatch_quantity'];
				$ndqt = floatval($q10['dispatch_quantity']) + floatval($di['dimat'][$i]['dieachpomat'][$j]['dispatch_quantity']);
				$q13 = PurchaseOrderMaterial::where('id','=',$di['dimat'][$i]['dieachpomat'][$j]['pom_table_id'])->update(array('dispatch_quantity' => $ndqt));
			}
		}
		
		//delete all shit

		$q4 = DispatchMaterial::where('dispatch_id','=',$diid)->whereNotIn('id',$dimatids)->select('id')->get();
		for ($i=0; $i < count($q4); $i++) { 
			# code...
			array_push($dipomatids,$q4[$i]['id']);
		}
		$q4 = DispatchMaterial::where('dispatch_id','=',$diid)->whereNotIn('id',$dimatids)->delete();
		$q5 = DispatchPoMaterial::whereIn('dispatch_material_id',$dipomatids)->delete();

		// //add di docs and date
		$q4 = InspectionDispatch::where('id','=',$diid)->update(array('dispatch_date' => $di['dispatch_date'],'dispatch_no'=>$di['dispatch_no'],'complete_flag'=>1));
		$q8 = InspectionDispatchDocs::where('inspection_dispatch_id','=',$diid)->delete();
		for ($m=0; $m < count($di['didocs']); $m++) { 
			# code...
			$q5 = new InspectionDispatchDocs;
			$q5->inspection_dispatch_id = $diid;
			$q5->doc_name = $di['didocs'][$m]['doc_name'];
			$q5->doc_url = $di['didocs'][$m]['doc_url'];
			$q5->save();
		}
			
		//

		return 'yes';
		
	}

	public function get_enquiry_details_id() {

		$enqid = Request::input("enqid");
		$projectid = Request::input("projectid");
		if($enqid) {
			$mainout = array();
			$out = EnquiryVendor::where("enquiry_id",'=',$enqid)->with("vendordetails")->with('materials')->with('materials.materialdetails.category')->with('materials.boqmaterial')->with('taxes')->with('taxes.taxdetails')->with('taxes.taxmaterials.enqtaxmat')->with('taxes')->with('quotationterms')->has('quotationterms')->with('quotationterms.quotationdefault')->with('quotpayterms')->with('quotationdocs')->get();
			if($out->count() > 0) {
				$matarr = array();
				$matcheckarr = array();
				$submatarr = array();
				$submatdetarr = array();
				$matqtyarr = array();
				$latestindent = array();
				array_push($mainout, $out);

				foreach ($out as $inout) {
					
					foreach ($inout->materials as $inmat) {
						
						if(!in_array($inmat->materialdetails['category']['id'], $matcheckarr)) {

							$matcheckarr[] = $inmat->materialdetails['category']['id'];
							$matarr[] = $inmat->materialdetails['category']['name'];
							//for rggvy 12 plan
						}
						if(!in_array($inmat->materialdetails['id'], $submatarr)) {

							$submatarr[] = $inmat->materialdetails['id'];
							$submatdetarr[] = $inmat;
						}
						$matqtyarr[$inmat['material_id']] = $inmat['quantity'];
					}
				}

				$totindentqtyarr = array();
				$indenttot = Indenttotal::where("project_id", "=", $projectid)->get();
				$outboq = array();
				$outmatboq = array();
				$outindent = array();
				$checkmat = array();
				$indentcheck = array();
				$c2 = 0;
				foreach ($indenttot as $indiindent) {

					
					$totindentqtyarr[$indiindent['material_id']] = $indiindent['total_indent_qty'];

					$totpoqty = PurchaseOrderMaterial::where("material_id", "=", $indiindent['material_id'])->whereHas("purchaseorder", function($query) use ($projectid){

						$query->where("project_id", "=", $projectid);
					})->sum("quantity");
					$latestindent[$indiindent['material_id']]['currentindent'] = $indiindent['total_indent_qty']-$totpoqty;

					$boqqty = BoqMaterial::where("project_id", "=", $projectid)->where("material_id", "=", $indiindent['material_id'])->first();

					if($boqqty) {
						$outmatboq[$indiindent['material_id']]['qty'] = $boqqty->qty;
						$outmatboq[$indiindent['material_id']]['budget_rate'] = $boqqty->budget_rate;

					} else {
						$outmatboq[$indiindent['material_id']]['qty'] = 0;
						$outmatboq[$indiindent['material_id']]['budget_rate'] = 0;
					}
					$outmatboq[$indiindent['material_id']]['previndent'] = $indiindent['total_indent_qty']-$latestindent[$indiindent['material_id']]['currentindent'];

					//current indent
					$indentlatest = IndentMaterial::where("material_id", "=", $indiindent['material_id'])->
					whereHas('indent', function($query) use ($projectid)
					{
					    $query->where('project_id', '=', $projectid)->where("status", "=", 1);
					})
					->orderBy("created_at", "desc")->first();

					if($indentlatest) {
						
						if(!in_array($indentlatest->indent['id'], $indentcheck)) {

							$latestindentid = $indentlatest->indent['id'];
							$schdet = Schedule::where("project_id", "=", $projectid)
							->with(array('subschedules.subschprojqty.subscheduleindent'=>function($query) use ($latestindentid){
						        $query->where('indent_id', '=', $latestindentid);
						    }))
							->with('subschedules.subschmaterials')->get();
							
							foreach ($schdet as $inschdet) {
								
								foreach ($inschdet['subschedules'] as $insubsch) {
									
									foreach ($insubsch['subschmaterials'] as $insubmat) {

										if(!in_array($insubmat['material_id'], $checkmat)) {
											$c = 0;
											foreach ($insubsch['subschprojqty'] as $inschproj) {
												if($projectid == 5) {

													$inschproj['sub_project_id'] = 4;
												}
												
												if(($projectid == 5 && $c == 0 && $c2== 0) || $projectid != 5 && $c2==0) {
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] = 0;
													$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] = 0;
													
												}
												$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($inschproj['qty']);
												foreach ($inschproj['subscheduleindent'] as $insubschind) {
													
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($insubschind['indent_qty']);
												}
												
												$c++;
											}
											$checkmat[] = $insubmat['material_id'];
										} else {

											foreach ($insubsch['subschprojqty'] as $inschproj) {
												if($projectid == 5) {

													$inschproj['sub_project_id'] = 4;
												}
												$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($inschproj['qty']);
												foreach ($inschproj['subscheduleindent'] as $insubschind) {
																					
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($insubschind['indent_qty']);
												}
											}
											
										}
									}
								}
							}
							$indentcheck[] = $indentlatest->indent['id'];

						}
					}
					$c2++;
					
				}
				
				array_push($mainout, $matarr);

				array_push($mainout, $submatdetarr);

				array_push($mainout, $outmatboq);

				array_push($mainout, $outindent);

				array_push($mainout, $totindentqtyarr);

				array_push($mainout, $latestindent);
			} else {

				$mainout = 0;
			}
		} else {

			$mainout = 2;
		}

		return $mainout;
	}

	public function get_enquiry_details_id_enq() {

		$enqid = Request::input("enqid");
		
		// $enqno = str_ireplace("E", "", trim($enqno));
// ->with('enquirydetails.vendors')->with('enquirydetails.vendors.vendordetails')->with('enquirydetails.vendors.materials')
		// $enq = Enquiry::where("id","=",$enqno)->first();
		if($enqid) {
			$mainout = array();
		// 	$out = Enquiry::where("id", "=", $enqno)->with("vendors.taxes.taxdetails")->with("vendors.taxes.taxmaterials.enqtaxdetails.taxdetails")->with("vendors.taxes.taxmaterials.enqtaxmat")->with("vendors.materials.materialdetails")->with("vendors.quotationterms.quotationdefault")->with("vendors.vendordetails")->with("projects.projectdetails")->first();
			$out = EnquiryVendor::where("enquiry_id",'=',$enqid)->with("vendordetails")->with('materials.storematuom.stmatuom')->with('materials.materialdetails.category')->with('materials.materialdetails.level1mat.storematerial')->with('materials.boqmaterial')->with('taxes')->with('taxes.taxdetails')->with('taxes.taxmaterials.enqtaxmat')->with('taxes')->with('quotationterms')->with('quotationterms.quotationdefault')->with('quotpayterms')->with('quotationdocs')->get();
			$matarr = array();
			$matcheckarr = array();
			$submatarr = array();
			$submatdetarr = array();

			array_push($mainout, $out);

			foreach ($out as $inout) {
				
				foreach ($inout->materials as $inmat) {
					
					if(!in_array($inmat->materialdetails['category']['id'], $matcheckarr)) {

						$matcheckarr[] = $inmat->materialdetails['category']['id'];
						$matarr[] = $inmat->materialdetails['category']['name'];
					}
					if(!in_array($inmat->materialdetails['id'], $submatarr)) {

						$submatarr[] = $inmat->materialdetails['id'];
						$submatdetarr[] = $inmat;
					}
				}
			}

			array_push($mainout, $matarr);

			array_push($mainout, $submatdetarr);
		} else {

			$mainout = 0;
		}

		return $mainout;


	}

	public function get_enquiry_ref_details() {

		$csrefid = Request::input("csrefid");

		$projectid = Request::input("projectid");

		$csrefdet = CsRefDetails::where("cs_ref_id", "=", $csrefid)->get();

		$enqvenarr = array();
		$mainout = array();

		foreach ($csrefdet as $indicsref) {
			
			if($indicsref->enquiry_vendor_id != 0) {


				$out = EnquiryVendor::where("id",'=',$indicsref->enquiry_vendor_id)->with("vendordetails")->with('materials')->with('materials.materialdetails.category')->with('materials.boqmaterial')->with('taxes')->with('taxes.taxdetails')->with('taxes.taxmaterials.enqtaxmat')->with('taxes')->with('quotationterms')->has('quotationterms')->with('quotationterms.quotationdefault')->with('quotpayterms')->with('quotationdocs')->first();

				array_push($enqvenarr, $out);
			} else {


				$out = OldEnquiryVendor::where("id",'=',$indicsref->old_enquiry_vendor_id)->with("vendordetails")->with('materials')->with('materials.materialdetails.category')->with('materials.boqmaterial')->with('taxes')->with('taxes.taxdetails')->with('taxes.taxmaterials.enqtaxmat')->with('taxes')->with('quotationterms')->has('quotationterms')->with('quotationterms.quotationdefault')->with('quotpayterms')->with('quotationdocs')->first();

				array_push($enqvenarr, $out);
			}
		}


		if(count($enqvenarr) > 0) {
				$matarr = array();
				$matcheckarr = array();
				$submatarr = array();
				$submatdetarr = array();
				$matqtyarr = array();
				$latestindent = array();
				array_push($mainout, $enqvenarr);

				foreach ($enqvenarr as $inout) {
					
					foreach ($inout->materials as $inmat) {
						
						if(!in_array($inmat->materialdetails['category']['id'], $matcheckarr)) {

							$matcheckarr[] = $inmat->materialdetails['category']['id'];
							$matarr[] = $inmat->materialdetails['category']['name'];
							//for rggvy 12 plan
						}
						if(!in_array($inmat->materialdetails['id'], $submatarr)) {

							$submatarr[] = $inmat->materialdetails['id'];
							$submatdetarr[] = $inmat;
						}
						$matqtyarr[$inmat['material_id']] = $inmat['quantity'];
					}
				}

				$totindentqtyarr = array();
				$indenttot = Indenttotal::where("project_id", "=", $projectid)->get();
				$outboq = array();
				$outmatboq = array();
				$outindent = array();
				$checkmat = array();
				$indentcheck = array();
				$c2 = 0;
				foreach ($indenttot as $indiindent) {

					
					$totindentqtyarr[$indiindent['material_id']] = $indiindent['total_indent_qty'];

					$totpoqty = PurchaseOrderMaterial::where("material_id", "=", $indiindent['material_id'])->whereHas("purchaseorder", function($query) use ($projectid){

						$query->where("project_id", "=", $projectid);
					})->sum("quantity");
					$latestindent[$indiindent['material_id']]['currentindent'] = $indiindent['total_indent_qty']-$totpoqty;

					$boqqty = BoqMaterial::where("project_id", "=", $projectid)->where("material_id", "=", $indiindent['material_id'])->first();

					if($boqqty) {
						$outmatboq[$indiindent['material_id']]['qty'] = $boqqty->qty;
						$outmatboq[$indiindent['material_id']]['budget_rate'] = $boqqty->budget_rate;

					} else {
						$outmatboq[$indiindent['material_id']]['qty'] = 0;
						$outmatboq[$indiindent['material_id']]['budget_rate'] = 0;
					}
					$outmatboq[$indiindent['material_id']]['previndent'] = $indiindent['total_indent_qty']-$latestindent[$indiindent['material_id']]['currentindent'];

					//current indent
					$indentlatest = IndentMaterial::where("material_id", "=", $indiindent['material_id'])->
					whereHas('indent', function($query) use ($projectid)
					{
					    $query->where('project_id', '=', $projectid)->where("status", "=", 1);
					})
					->orderBy("created_at", "desc")->first();

					if($indentlatest) {
						
						if(!in_array($indentlatest->indent['id'], $indentcheck)) {

							$latestindentid = $indentlatest->indent['id'];
							$schdet = Schedule::where("project_id", "=", $projectid)
							->with(array('subschedules.subschprojqty.subscheduleindent'=>function($query) use ($latestindentid){
						        $query->where('indent_id', '=', $latestindentid);
						    }))
							->with('subschedules.subschmaterials')->get();
							
							foreach ($schdet as $inschdet) {
								
								foreach ($inschdet['subschedules'] as $insubsch) {
									
									foreach ($insubsch['subschmaterials'] as $insubmat) {

										if(!in_array($insubmat['material_id'], $checkmat)) {
											$c = 0;
											foreach ($insubsch['subschprojqty'] as $inschproj) {
												if($projectid == 5) {

													$inschproj['sub_project_id'] = 4;
												}
												
												if(($projectid == 5 && $c == 0 && $c2== 0) || $projectid != 5 && $c2==0) {
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] = 0;
													$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] = 0;
													
												}
												$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($inschproj['qty']);
												foreach ($inschproj['subscheduleindent'] as $insubschind) {
													
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($insubschind['indent_qty']);
												}
												
												$c++;
											}
											$checkmat[] = $insubmat['material_id'];
										} else {

											foreach ($insubsch['subschprojqty'] as $inschproj) {
												if($projectid == 5) {

													$inschproj['sub_project_id'] = 4;
												}
												$outboq[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($inschproj['qty']);
												foreach ($inschproj['subscheduleindent'] as $insubschind) {
																					
													$outindent[$insubmat['material_id']][$inschproj['sub_project_id']]['qty'] += floatval($insubschind['indent_qty']);
												}
											}
											
										}
									}
								}
							}
							$indentcheck[] = $indentlatest->indent['id'];

						}
					}
					$c2++;
					
				}
				
				array_push($mainout, $matarr);

				array_push($mainout, $submatdetarr);

				array_push($mainout, $outmatboq);

				array_push($mainout, $outindent);

				array_push($mainout, $totindentqtyarr);

				array_push($mainout, $latestindent);
			} else {

				$mainout = 0;
			}
		

		return $mainout;
	}

	public function get_enquiry_list_datewise() {

		$projectid = Request::input("projectid");
		$fromdate = Request::input("fromdate");
		$todate = Request::input("todate");

		if($projectid != "All") {
			return $out = Enquiry::where("created_at", ">=", $fromdate)->where("created_at","<=", $todate)->whereHas('projects', function($query) use ($projectid)
				{
				    $query->where('project_id', '=', $projectid);
				})->with("vendors.taxes.taxdetails")->with("vendors.materials.materialdetails")->with("vendors.vendordetails")->with("projects")->get();
		} else {
			return $out = Enquiry::where("created_at", ">=", $fromdate)->where("created_at","<=", $todate)->with("vendors.taxes.taxdetails")->with("vendors.materials.materialdetails")->with("vendors.vendordetails")->with("projects")->get();

		}
	}

	public function save_quotations() {

		$enquirydetails = Request::input("enquirydetails");
		$quotationterms = Request::input("quotationterms");
		$enqvendor = EnquiryVendor::where("id", "=", $enquirydetails['id'])->with("quotationterms")->first();

		if(count($enqvendor->quotationterms) > 0) {

			$enqvendorn = EnquiryVendor::where("id", "=", $enquirydetails['id'])->first();

			$createoldenqven = OldEnquiryVendor::create($enqvendorn->toArray());
			$createoldenqven->main_enquiry_vendor_id = $enqvendorn->id;
			$createoldenqven->save();

			//putting old enquiry vendor id in cs ref details
			CsRefDetails::where("enquiry_vendor_id", "=", $enquirydetails['id'])->update(array("old_enquiry_vendor_id"=>$createoldenqven->id, "enquiry_vendor_id"=>0));

			$getoldenqmat = EnquiryMaterial::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();

			foreach ($getoldenqmat as $indioldenqmat) {
				
				$createoldenqmat = OldEnquiryMaterial::create($indioldenqmat->toArray());
				$createoldenqmat->enquiry_vendor_id = $createoldenqven->id;
				$createoldenqmat->save();
			}

			$getoldenqtax = EnquiryTaxes::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();
			foreach ($getoldenqtax as $indioldenqtax) {
				
				$createoldenqtax = OldEnquiryTaxes::create($indioldenqtax->toArray());
				$createoldenqtax->enquiry_vendor_id = $createoldenqven->id;
				$createoldenqtax->save();

				$getoldenqtaxmat = EnquiryTaxMaterials::where("tax_id", "=", $indioldenqtax->id)->get();

				foreach ($getoldenqtaxmat as $indioldtaxmat) {
					
					$createoldenqtaxmat = OldEnquiryTaxMaterials::create($indioldtaxmat->toArray());
					$createoldenqtaxmat->tax_id = $createoldenqtax->id;
					$createoldenqtaxmat->save();
				}
			}

			$getoldquotdocs = EnquiryVendorQuotationDocs::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();
			foreach ($getoldquotdocs as $indiquotdocs) {
				
				$createoldquotdocs = OldEnquiryVendorQuotationDocs::create($indiquotdocs->toArray());
				$createoldquotdocs->enquiry_vendor_id = $createoldenqven->id;
				$createoldquotdocs->save();
			}

			$getoldpayterm = QuotationPaymentTerms::where("enquiry_vendor_id", "=", $enquirydetails['id'])->first();
			$createoldpayterm = OldQuotationPaymentTerms::create($getoldpayterm->toArray());
			$createoldpayterm->enquiry_vendor_id = $createoldenqven->id;
			$createoldpayterm->save();

			$getoldquotterm = QuotationTerms::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();

			foreach ($getoldquotterm as $indiquotterm) {
				
				$createoldquotterm = OldQuotationTerms::create($indiquotterm->toArray());
				$createoldquotterm->enquiry_vendor_id = $createoldenqven->id;
				$createoldquotterm->save();
			}

		}
		
		QuotationTerms::where('enquiry_vendor_id', '=', $enquirydetails['id'])->delete();
		foreach ($quotationterms as $quot) {

			if(!isset($quot['terms'][0]['term_desc']) || $quot['terms'][0]['term_desc'] == ""){

				$quot['terms'][0]['term_desc'] = "-";
			}
			$singlequot = array(
					"enquiry_vendor_id"=>$enquirydetails['id'],
					"quotation_default_term_id"=>$quot['id'],
					"term_desc"=>$quot['terms'][0]['term_desc']
				);

			$createsinglequot = QuotationTerms::create($singlequot);
		}

		$total_basic_value = 0;
		$total_basic_taxed = 0;
		$net_value_taxed = 0;
		$enqmatunit = array();

		$totalqtymat = 0;

		foreach ($enquirydetails['materials'] as $enqmat) {

			if(!isset($enqmat['freightinsurance_rate'])) {

				$enqmat['freightinsurance_rate'] = 0;
			}
			
			$enqmaterial = EnquiryMaterial::where("id","=",$enqmat['id'])->first();
			$enqmaterial->quotation_total_cost = $enqmat['quotation_total_cost'];
			$enqmaterial->quotation_unit_rate = $enqmat['quotation_unit_rate'];
			$enqmaterial->quantity = $enqmat['quantity'];
			$enqmaterial->freightinsurance_rate = $enqmat['freightinsurance_rate'];
			$enqmaterial->save();

			$total_basic_value = $total_basic_value+$enqmat['quotation_total_cost'];

			$enqmatunit[$enqmat['id']]['unitrate'] = $enqmat['quotation_unit_rate'];
			$enqmatunit[$enqmat['id']]['totalcost'] = $enqmat['quotation_total_cost'];
			$enqmatunit[$enqmat['id']]['quantity'] = $enqmaterial['quantity'];
			$enqmatunit[$enqmat['id']]['tax'] = $enqmat['quotation_total_cost'];
			$enqmatunit[$enqmat['id']]['freightinsurance_rate'] = $enqmat['freightinsurance_rate'];
			$totalqtymat += $enqmaterial['quantity'];

		}

		$net_value = round($total_basic_value);

		$enqtax = EnquiryTaxes::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();

		foreach ($enqtax as $etax) {
			
			EnquiryTaxMaterials::where("tax_id", "=", $etax['id'])->delete();
		}

		$oldenqtaxes = EnquiryTaxes::where("enquiry_vendor_id", "=", $enquirydetails['id'])->get();

		for($i=0;$i<count($oldenqtaxes); $i++) {

			EnquiryTaxMaterials::where("tax_id", "=", $oldenqtaxes[$i]['id'])->delete();
		}
		EnquiryTaxes::where("enquiry_vendor_id", "=", $enquirydetails['id'])->delete();

		foreach ($enquirydetails['taxes'] as $enqtax) {

			if(!isset($enqtax['taxdetails']['description'])) {

				$enqtax['taxdetails']['description'] = "";
			}
			
			$singletax = array(
					"tax_id"=>$enqtax['tax_id'],
					"tax_amount"=>$enqtax['tax_amount'],
					"tax_percentage"=>$enqtax['tax_percentage'],
					"enquiry_vendor_id"=>$enquirydetails['id'],
					"description"=>$enqtax['taxdetails']['description'],
					"lumpsum"=>$enqtax['lumpsum']
				);

			$createtax = EnquiryTaxes::create($singletax);

			if($enqtax['lumpsum'] == 1 && $enqtax['tax_id'] != 11) {

				$matidarr = array();

				foreach ($enquirydetails['taxes'] as $enqtaxth) {

					foreach ($enqtaxth['taxmaterials'] as $enqtaxmatth) {
						if($enqtaxmatth['enquiry_material_id'] != 0) {

							if(!in_array($enqtaxmatth['enquiry_material_id'], $matidarr)) {

								$enqmatunit[$enqtaxmatth['enquiry_material_id']]['tax'] =  $enqmatunit[$enqtaxmatth['enquiry_material_id']]['tax']+(($enqtax['tax_amount']*$enqmatunit[$enqtaxmatth['enquiry_material_id']]['quantity'])/$totalqtymat);

								$matidarr[] = $enqtaxmatth['enquiry_material_id'];
							}
						}
					}
				}
				
			}

			foreach ($enqtax['taxmaterials'] as $enqtaxmat) {

				if($enqtaxmat['enquiry_material_id'] == 0) {

					$taxname = $enqtaxmat['enqtaxdetails']['taxdetails']['tax'];

					$taxidthis = Taxes::where("tax", "=", $taxname)->first();

					$enquiry_tax_idthischeck = EnquiryTaxes::where("tax_id","=", $taxidthis->id)->where("enquiry_vendor_id", "=", $enquirydetails['id'])->first();
					if($enquiry_tax_idthischeck) {

						$enquiry_tax_idthis = $enquiry_tax_idthischeck->id;
					} else{
						$enquiry_tax_idthis = 0;
					}
				} else {

						$enquiry_tax_idthis = 0;
				}

				if($enqtaxmat['enquiry_material_id'] != 0) {

					$enqmatunit[$enqtaxmat['enquiry_material_id']]['tax'] = $enqmatunit[$enqtaxmat['enquiry_material_id']]['tax'] + (($enqtax['tax_percentage']*$enqmatunit[$enqtaxmat['enquiry_material_id']]['totalcost'])/100);	
					
				}
				
				$singletaxmat = array("tax_id"=>$createtax->id, "enquiry_material_id"=>$enqtaxmat['enquiry_material_id'], "enquiry_tax_id"=>$enquiry_tax_idthis );

				$createtaxmat = EnquiryTaxMaterials::create($singletaxmat);
			}

			$taxtype = Taxes::where("id", "=", $enqtax['tax_id'])->first();	

			if($taxtype->type == "Discount" || $taxtype->type == "discount") {

				//$net_value_taxed = $net_value_taxed - round($enqtax['tax_amount']);

				$net_value = $net_value - round($enqtax['tax_amount']);
			} else {

				//$net_value_taxed = $net_value_taxed + round($enqtax['tax_amount']);

				$net_value = $net_value + round($enqtax['tax_amount']);
			}
		}


		$enqtaxnew = EnquiryTaxes::where("enquiry_vendor_id", "=", $enquirydetails['id'])->with("taxmaterials")->get();

		foreach ($enqtaxnew as $enqtax) {


			foreach ($enqtax['taxmaterials'] as $enqtaxmat) {

				if($enqtaxmat['enquiry_tax_id'] != 0) {

					$caltaxontax = EnquiryTaxes::where("id", "=", $enqtaxmat['enquiry_tax_id'])->with("taxmaterials")->first();

					foreach ($enqtax['taxmaterials'] as $enqtaxmatin) {

						if($enqtaxmatin['enquiry_material_id'] != 0) {

							foreach ($caltaxontax->taxmaterials as $intaxmat) {
								
								if($enqtaxmatin['enquiry_material_id'] == $intaxmat['enquiry_material_id']) {

									$enqmatunit[$enqtaxmatin['enquiry_material_id']]['tax'] = $enqmatunit[$enqtaxmatin['enquiry_material_id']]['tax'] + (($enqtax['tax_percentage']*($caltaxontax->tax_percentage * $enqmatunit[$enqtaxmatin['enquiry_material_id']]['totalcost']/100))/100);
								}
							}

							
						}	
					}
				}

			}


		}
		
		

		$quotpayterms = QuotationPaymentTerms::where("enquiry_vendor_id", "=", $enquirydetails['id'])->first();

		if(!isset($enquirydetails['quotpayterms']['pdc_time_period'])) {

			$enquirydetails['quotpayterms']['pdc_time_period'] = "";
		}

		if(!isset($enquirydetails['quotpayterms']['bg_time_period'])) {

			$enquirydetails['quotpayterms']['bg_time_period'] = "";
		}

		if(!isset($enquirydetails['quotpayterms']['lc_time_period'])) {

			$enquirydetails['quotpayterms']['lc_time_period'] = "";
		}
		if(!isset($enquirydetails['quotpayterms']['lc_interest_percentage'])) {

			$enquirydetails['quotpayterms']['lc_interest_percentage'] = "";
		}
		if(!isset($enquirydetails['quotpayterms']['lc_interest_value'])) {

			$enquirydetails['quotpayterms']['lc_interest_value'] = "";
		}
		if(!isset($enquirydetails['quotpayterms']['interest_amount_sselac'])) {

			$enquirydetails['quotpayterms']['interest_amount_sselac'] = 0;
		}
		if(!isset($enquirydetails['quotpayterms']['interest_amount_vendorac'])) {

			$enquirydetails['quotpayterms']['interest_amount_vendorac'] = "";
		}
		if(!isset($enquirydetails['quotpayterms']['lc_interest_days_vendor'])) {

			$enquirydetails['quotpayterms']['lc_interest_days_vendor'] = "";
		}
		if(!isset($enquirydetails['quotpayterms']['lc_interest_days_sse'])) {

			$enquirydetails['quotpayterms']['lc_interest_days_sse'] = "";
		}

		if(!isset($enquirydetails['quotpayterms']['direct_payment_desc'])) {

			$enquirydetails['quotpayterms']['direct_payment_desc'] = "";
		}



		$enqvenarr = array();
		$thistottaxed = 0;

		foreach ($enqmatunit as $key => $value) {

			$enqmatthis = EnquiryMaterial::where("id", "=", $key)->first();
			
			$taxtotalrate = ($value['tax']/$value['quantity']) + $value['freightinsurance_rate'];

			$newtotalcost = $taxtotalrate*$value['quantity'];

			$total_basic_taxed = $total_basic_taxed+$newtotalcost;

			EnquiryMaterial::where("id", "=", $key)->update(array("quotation_taxed_rate"=>$taxtotalrate, "quotation_total_taxed"=>$newtotalcost));

			$thisenqmat = EnquiryMaterial::where("id", "=", $key)->first();

			$thistottaxed = $thistottaxed+($thisenqmat->quotation_taxed_rate*$thisenqmat->quantity);

		}



		$net_value_taxed = $thistottaxed+$enquirydetails['quotpayterms']['interest_amount_sselac'];

		

		$enqvendor->total_basic_value = $total_basic_value;
		$enqvendor->total_basic_taxed = $total_basic_taxed;
		$enqvendor->net_value = $net_value;
		$enqvendor->net_value_taxed = $net_value_taxed;
		$enqvendor->save();



		if($quotpayterms) {

			$quotpayterms->payment_advance = $enquirydetails['quotpayterms']['payment_advance'];
			$quotpayterms->payment_balance = $enquirydetails['quotpayterms']['payment_balance'];
			$quotpayterms->payment_type = $enquirydetails['quotpayterms']['payment_type'];
			$quotpayterms->lc_time_period = $enquirydetails['quotpayterms']['lc_time_period'];
			$quotpayterms->pdc_time_period = $enquirydetails['quotpayterms']['pdc_time_period'];
			$quotpayterms->bg_time_period = $enquirydetails['quotpayterms']['bg_time_period'];
			$quotpayterms->lc_interest_percentage = $enquirydetails['quotpayterms']['lc_interest_percentage'];
			$quotpayterms->lc_interest_value = $enquirydetails['quotpayterms']['lc_interest_value'];
			$quotpayterms->interest_amount_sselac = $enquirydetails['quotpayterms']['interest_amount_sselac'];
			$quotpayterms->interest_amount_vendorac = $enquirydetails['quotpayterms']['interest_amount_vendorac'];
			$quotpayterms->lc_interest_days_sse = $enquirydetails['quotpayterms']['lc_interest_days_sse'];
			$quotpayterms->lc_interest_days_vendor = $enquirydetails['quotpayterms']['lc_interest_days_vendor'];
			$quotpayterms->direct_payment_desc = $enquirydetails['quotpayterms']['direct_payment_desc'];
			$quotpayterms->save();

		} else {

			$singlequotpayterm = array(

					"enquiry_vendor_id" => $enquirydetails['id'],
					"payment_advance" => $enquirydetails['quotpayterms']['payment_advance'],
					"payment_balance" => $enquirydetails['quotpayterms']['payment_balance'],
					"payment_type" => $enquirydetails['quotpayterms']['payment_type'],
					"lc_time_period" => $enquirydetails['quotpayterms']['lc_time_period'],
					"pdc_time_period" => $enquirydetails['quotpayterms']['pdc_time_period'],
					"bg_time_period" => $enquirydetails['quotpayterms']['bg_time_period'],
					"lc_interest_percentage" => $enquirydetails['quotpayterms']['lc_interest_percentage'],
					"lc_interest_value" => $enquirydetails['quotpayterms']['lc_interest_value'],
					"interest_amount_sselac" => $enquirydetails['quotpayterms']['interest_amount_sselac'],
					"interest_amount_vendorac" => $enquirydetails['quotpayterms']['interest_amount_vendorac'],
					"lc_interest_days_sse" => $enquirydetails['quotpayterms']['lc_interest_days_sse'],
					"lc_interest_days_vendor" => $enquirydetails['quotpayterms']['lc_interest_days_vendor'],
					"direct_payment_desc"=> $enquirydetails['quotpayterms']['direct_payment_desc']
				);

			QuotationPaymentTerms::create($singlequotpayterm);


		}

		return 1;
	}

	public function get_cs_details() {

		$enqvendors = Request::input("selectedvendors");
		$materialarr = array();
		$enquiry_vendor_idarr = array();

		foreach ($enqvendors as $enqven) {
			$enquiry_vendor_idarr[] = $enqven['id'];

			foreach ($enqven['materials'] as $enqmat) {
				
				if(!in_array($enqmat['material_id'], $materialarr)) {

					$materialarr[] = $enqmat['material_id'];
				}
			}
			
			
		}

		return $enqmat = StoreMaterial::whereIn("id", $materialarr)->whereHas('enqmaterials', function($query) use ($enquiry_vendor_idarr)
			{
			    $query->whereIn('enquiry_vendor_id', $enquiry_vendor_idarr);
			})->with(array('enqmaterials'=>function($query) use ($enquiry_vendor_idarr){
	        $query->whereIn('enquiry_vendor_id', $enquiry_vendor_idarr)->orderBy('enquiry_vendor_id');
	    }))->get();
	}

	public function get_cs_vendorcosts() {

		$enqvendors = Request::input("selectedvendors");
		$materialarr = array();
		$enquiry_vendor_idarr = array();

		foreach ($enqvendors as $enqven) {
			$enquiry_vendor_idarr[] = $enqven['id'];
			
		}

		return $enqmat = EnquiryVendor::whereIn("id", $enquiry_vendor_idarr)->orderBy('id')->get();
	}

	public function get_stores_list() {

		return $q = Store::all();
	}


	public function get_site_areas_list() {

		return $q = SiteAreas::all();
	}


	public function get_cs_taxes() {

		$enqvendors = Request::input("selectedvendors");
		$enquiry_vendor_idarr = array();

		foreach ($enqvendors as $enqven) {
			$enquiry_vendor_idarr[] = $enqven['id'];
			
		}

		return $enqtax = Taxes::with(array('enqtaxes'=>function($query) use ($enquiry_vendor_idarr){
	        $query->whereIn('enquiry_vendor_id', $enquiry_vendor_idarr)->orderBy('enquiry_vendor_id');
	    }))->get();
	}

	public function save_inspection() {

		$inspdetails = Request::input("inspdetails");
		$editflag = Request::input("editflag");

		if($editflag == 0) {

			$poinspection = PurchaseOrderInspection::where("id", "=", $inspdetails['id'])->first();
			$poinspection->inspector_name = $inspdetails['inspector_name'];
			$poinspection->inspection_location = $inspdetails['inspection_location'];
			$poinspection->inspection_readiness_date = $inspdetails['inspection_readiness_date'];
			$poinspection->inspec_call_supplier_date = $inspdetails['inspec_call_supplier_date'];
			$poinspection->inspec_call_supplier_remarks = $inspdetails['inspec_call_supplier_remarks'];
			$poinspection->inspec_report_date = $inspdetails['inspec_report_date'];
			$poinspection->approved_inspec_date = $inspdetails['approved_inspec_date'];
			$poinspection->inspec_call_supplier_refno = $inspdetails['inspec_call_supplier_refno'];
			$poinspection->inspec_report_refno = $inspdetails['inspec_report_refno'];
			$poinspection->approved_inspec_refno = $inspdetails['approved_inspec_refno'];
			$poinspection->remarks = $inspdetails['remarks'];
			$poinspection->save();


			foreach($inspdetails['inspectionmaterials'] as $newinspmat) {

				$newsingleinspmat = array(
					"purchase_order_inspection_id"=>$poinspection->id,
					"purchase_order_material_id"=>$newinspmat['purchase_order_material_id'],
					"inspected_quantity"=>$newinspmat['inspected_quantity'],
					"approved_quantity"=>$newinspmat['approved_quantity'],
					);

				$createsingleinsmat = PurchaseOrderInspectionMaterial::create($newsingleinspmat);

				$pomatthis = PurchaseOrderMaterial::where("id", "=", $newinspmat['purchase_order_material_id'])->first();

				$pomatthis->inspected_quantity = $pomatthis->inspected_quantity+$newinspmat['inspected_quantity'];
				$pomatthis->approved_quantity = $pomatthis->approved_quantity+$newinspmat['approved_quantity'];
				$pomatthis->save();
			}

			foreach($inspdetails['inspectiondocs'] as $newinspdoc){

				$newsingledoc = array(
					"purchase_order_inspection_id"=>$poinspection->id,
					"doc_name"=>$newinspdoc['doc_name'],
					"doc_url"=>$newinspdoc['doc_url'],
					"doc_type"=>$newinspdoc['doc_type']
					);
				$createnewdoc = InspectionDocs::create($newsingledoc);
			}


		} else {

			$poinspection = PurchaseOrderInspection::where("id", "=", $inspdetails['id'])->first();
			$oldpoinspection = OldPurchaseOrderInspection::create($poinspection->toArray());
			$oldpoinspection->purchase_order_inspection_id = $poinspection->id;
			$oldpoinspection->save();
			$poinspection->inspector_name = $inspdetails['inspector_name'];
			$poinspection->inspection_location = $inspdetails['inspection_location'];
			$poinspection->inspection_readiness_date = $inspdetails['inspection_readiness_date'];
			$poinspection->inspec_call_supplier_date = $inspdetails['inspec_call_supplier_date'];
			$poinspection->inspec_call_supplier_remarks = $inspdetails['inspec_call_supplier_remarks'];
			$poinspection->inspec_report_date = $inspdetails['inspec_report_date'];
			$poinspection->approved_inspec_date = $inspdetails['approved_inspec_date'];
			$poinspection->inspec_call_supplier_refno = $inspdetails['inspec_call_supplier_refno'];
			$poinspection->inspec_report_refno = $inspdetails['inspec_report_refno'];
			$poinspection->approved_inspec_refno = $inspdetails['approved_inspec_refno'];
			$poinspection->remarks = $inspdetails['remarks'];
			$poinspection->save();

			$poinspectionmat = PurchaseOrderInspectionMaterial::where("purchase_order_inspection_id", "=", $poinspection->id)->get()->toArray();

			foreach ($poinspectionmat as $posinglemat) {

				$oldpoinspmat = OldPurchaseOrderInspectionMaterial::create($posinglemat);
				$oldpoinspmat->purchase_order_inspection_id = $oldpoinspection->id;
				$oldpoinspmat->save();

				$pomat = PurchaseOrderMaterial::where("id", "=", $posinglemat['purchase_order_material_id'])->first();
				$pomat->inspected_quantity = $pomat->inspected_quantity-$posinglemat['inspected_quantity'];
				$pomat->approved_quantity = $pomat->approved_quantity-$posinglemat['approved_quantity'];
				$pomat->save();

			}

			PurchaseOrderInspectionMaterial::where("purchase_order_inspection_id", "=", $poinspection->id)->delete();

			foreach($inspdetails['inspectionmaterials'] as $newinspmat) {

				$newsingleinspmat = array(
					"purchase_order_inspection_id"=>$poinspection->id,
					"purchase_order_material_id"=>$newinspmat['purchase_order_material_id'],
					"inspected_quantity"=>$newinspmat['inspected_quantity'],
					"approved_quantity"=>$newinspmat['approved_quantity'],
					);

				$createsingleinsmat = PurchaseOrderInspectionMaterial::create($newsingleinspmat);

				$pomatthis = PurchaseOrderMaterial::where("id", "=", $newinspmat['purchase_order_material_id'])->first();

				$pomatthis->inspected_quantity = $pomatthis->inspected_quantity+$newinspmat['inspected_quantity'];
				$pomatthis->approved_quantity = $pomatthis->approved_quantity+$newinspmat['approved_quantity'];
				$pomatthis->save();
			}

			$inspecdocs = InspectionDocs::where("purchase_order_inspection_id", "=", $poinspection->id)->where("doc_type", "!=", 3)->get();
			if($inspecdocs->count() > 0) {
				$inspecdocs = $inspecdocs->toArray();
				foreach ($inspecdocs as $singledoc) {
					
					$oldinspecdoc = OldInspectionDocs::create($singledoc);
					$oldinspecdoc->purchase_order_inspection_id = $oldpoinspection->id;
					$oldinspecdoc->save();
				}
			}
			$inspecdocs = InspectionDocs::where("purchase_order_inspection_id", "=", $poinspection->id)->where("doc_type", "!=", 3)->delete();

			foreach($inspdetails['inspectiondocs'] as $newinspdoc){

				$newsingledoc = array(
					"purchase_order_inspection_id"=>$poinspection->id,
					"doc_name"=>$newinspdoc['doc_name'],
					"doc_url"=>$newinspdoc['doc_url'],
					"doc_type"=>$newinspdoc['doc_type']
					);
				$createnewdoc = InspectionDocs::create($newsingledoc);
			}


		}

		return 1;
	}

	public function check_inspection_ref() {
		$data = Request::all();
		return GtpDrawings::where("vendor_id", "=", $data['vendorid'])->where("project_id", "=", $data['projectid'])->where("material_id", "=", $data['materialid'])->get();
		// return array($x,$data);
	}
	public function create_inspection_ref() {

		$refname = Request::input("refname");
		$poid = Request::input("poid");
		$poinspection = PurchaseOrderInspection::where("purchase_order_id", "=", $poid)->where("inspection_ref_no", "=", $refname)->first();

		if($poinspection) {

			return 0;
		} else {

			$singlepoinspection = array("purchase_order_id"=>$poid, "inspection_ref_no"=>$refname);
			PurchaseOrderInspection::create($singlepoinspection);
			return 1;
		}
	}

	public function save_didispatch() {

		$dimaterials = Request::input("dimaterials");
		$dispatch_date = Request::input("dispatch_date");
		$dispatchdocs = Request::input("dispatchdocs");
		$inspectionid = Request::input("inspectionid");
		$remarks = Request::input("remarks");

		$singleinspectiondispatch = array("purchase_order_inspection_id"=>$inspectionid, "dispatch_date"=>$dispatch_date, "remarks"=>$remarks);
		$createinspdispatch = InspectionDispatch::create($singleinspectiondispatch);

		foreach($dimaterials as $dimat) {
			$singledimat = array(
					"inspection_dispatch_id"=>$createinspdispatch->id,
					"inspection_material_id"=>$dimat['inspection_material_id'],
					"dispatch_quantity"=>$dimat['dispatch_quantity'],
					"delivery_address"=>$dimat['deliveryaddress']
				);

			$createsingledimat = InspectionDispatchMaterial::create($singledimat);

			$poinspecmat = PurchaseOrderInspectionMaterial::where("id", "=", $dimat['inspection_material_id'])->first();
			$poinspecmat->dispatch_quantity = $poinspecmat->dispatch_quantity+$dimat['dispatch_quantity'];
			$poinspecmat->save();

			$pomat = PurchaseOrderMaterial::where("id", "=", $poinspecmat->purchase_order_material_id)->first();
			$pomat->dispatch_quantity = $pomat->dispatch_quantity+$dimat['dispatch_quantity'];
			$pomat->save();
		}

		foreach ($dispatchdocs as $doc) {
			
			$singledoc = array("inspection_dispatch_id"=>$createinspdispatch->id, "doc_name"=>$doc['doc_name'], "doc_url"=>$doc['doc_url']);
			$createdidoc = InspectionDispatchDocs::create($singledoc);
		}

		return 1;
	}

	public function get_didispatch(){
		$poinspection_id = Request::input("poinspecrefid");
		return InspectionDispatch::where("purchase_order_inspection_id","=",$poinspection_id)->get();
	}

	public function sendrawemail(SendRawMail $sendraw) {
		$message = file_get_contents("/var/www/html/enquiry_mail_template.html");
		$from = "yogeshk96@gmail.com";
		$resp = $sendraw->sendRawEmail($from, 'tejeshbabu1@gmail.com', 'tejesh@pixelvide.com', 'test', $message);
	}

	public function removesysdocs() {

		$path = Request::input("path");

		unlink("/var/www/html/".$path);
		return 1;
	}

	public function get_quotation_terms() {

		$vendorid = Request::input("vendorid");

		return QuotationDefaultTerms::with(array('terms'=>function($query) use ($vendorid){
	        $query->where('enquiry_vendor_id', '=', $vendorid);
	    }))->get();
	}

	public function get_quotation_default_terms() {

		return QuotationDefaultTerms::where("display", "=", 1)->get();
	}

	public function insert_quotation_default_terms() {

		$terms = Request::input("terms");

		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		for($i=0; $i<count($terms); $i++) {

			if($terms[$i]['id'] == 0) {

				$singleterm = array("created_by"=>$user['users']->id, "termtitle"=>$terms[$i]['termtitle']);
				QuotationDefaultTerms::create($singleterm);
			}
		}

		return QuotationDefaultTerms::get();
	}

	public function get_gtp_drawing() {

		$projectid = Request::input("projectid");
		$vendorid = Request::input("vendorid");
		$materialid = Request::input("materialid");

		return GtpDrawings::where("vendor_id", "=", $vendorid)->where("project_id", "=", $projectid)->whereIn("material_id", $materialid)->get();
	}


	public function insert_gtp_drawing() {

		$docpath = Request::input("docpath");
		$vendorid = Request::input("vendorid");
		$projectid = Request::input("projectid");
		$filename = Request::input("filename");
		$materialid = Request::input("materialid");
		// return $materialid;
		foreach ($materialid as $index => $matid) {
			
			$singlegtp = array("vendor_id"=>$vendorid, "project_id"=>$projectid, "docpath"=>$docpath, "filename"=>$filename, "material_id"=>$matid);
			$gtpnew = GtpDrawings::create($singlegtp);
		}

		return $gtpnew;
	}

	public function insert_quotation_docs() {

		$docpath = Request::input("docpath");
		$vendorid = Request::input("enqvendorid");
		$filename = Request::input("filename");
			
		$singleenqquotation = array("enquiry_vendor_id"=>$vendorid, "doc_url"=>$docpath, "doc_name"=>$filename);
		$enqvendorquotationdocs = EnquiryVendorQuotationDocs::create($singleenqquotation);

		return $enqvendorquotationdocs;
	}

	public function remove_gtp_drawing() {

		$id = Request::input("id");

		$gtp = GtpDrawings::where("id", "=", $id)->first();

		// unlink("/var/www/html".$gtp['docpath']);
		$gtp->delete();
		return 1;

	}

	public function remove_quotation_docs() {

		$id = Request::input("id");

		$gtp = EnquiryVendorQuotationDocs::where("id", "=", $id)->first();

		$gtp->delete();
		return 1;

	}

	public function get_po_list() {

		return PurchaseOrder::orderBy('id', 'DESC')->get();
	}

	public function get_po_total_report() {

		return $podet = PurchaseOrder::with('inspections.inspectiondispatch')->with('pomaterials')->with('users')->orderBy('created_by')->get();


	}

	public function get_vendor_total_report() {

		return Vendor::with('materials')->get();
	}
	
	public function edit_pomat() {

		$data = Request::all();

		$po = PurchaseOrderMaterial::where("purchase_order_id","=",$data['poid'])->where("material_id","=",$data['materialid'])->first();//doubt if this combo is unique
		// return $po;
		$po['quantity'] = $data['pomqty'];
		$po['unit_rate'] = $data['pomunitrate'];
		$po['value_of_goods'] = $data['pomqty']*$data['pomunitrate'];
		$po->save();


	}

	public function generate_cs_ref() {

		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();
		$enqid = Request::input("enqid");
		$vendorlist = Request::input("vendorlist");
		$checkcs = Cs::Where("enquiry_id", "=", $enqid)->first();

		if($checkcs) {

			$csid = $checkcs->id;
		} else {

			$newcs = Cs::create(array("enquiry_id"=>$enqid));	
			$csid = $newcs->id;
		}
		$createnewref = CsRef::where("cs_id", "=", $csid)->with("csrefdet")->first();
		if(!$createnewref) {

			$createnewref = CsRef::create(array("cs_id"=>$csid, "created_by"=>$user['users']['id']));
			$createnewref->refno = "E".$enqid."-CS".$createnewref->id;
			$createnewref->save();
		} else {

			$createoldref = OldCsRef::create(array("cs_ref_id"=>$createnewref->id, "status"=>$createnewref->status, "created_by"=>$createnewref->created_by));
			foreach ($createnewref->csrefdet as $indiref) {
				
				OldCsRefDetails::create(array("old_cs_ref_id"=>$createoldref->id, "enquiry_vendor_id"=>$indiref->enquiry_vendor_id, "old_enquiry_vendor_id"=>$indiref->old_enquiry_vendor_id));
				CsRefDetails::where("id","=", $indiref->id)->delete();
			}
			
		}

		CsRefDetails::where("cs_ref_id","=", $createnewref->id)->delete();
		
		foreach ($vendorlist as $indiven) {
			
			if($indiven['selected'] == true) {
				$enqvenid = $indiven['id'];
				$cretaenewcsrefdet = CsRefDetails::create(array("cs_ref_id"=>$createnewref->id, "enquiry_vendor_id"=> $enqvenid));
			}
		}

		return $createnewref;
	}

	public function get_pomat_details(){

		$ponos = Request::input("ponos");

		return $podetails = PurchaseOrder::whereIn("id", $ponos)->with("pomaterials.storematerial")->with("taxes.taxmaterials")->get();

	}

	public function save_payments() {
		$pomateriallist = Request::input("pomateriallist");

		$payterms = Request::input("payterms");

		$actype = Request::input("actype");
		$bank_name = Request::input("bank_name");
		$bank_branch = Request::input("bank_branch");
		$ifsc_code = Request::input("ifsc_code");
		$account_number = Request::input("account_number");
		$vendoraccid = Request::input("vendoraccid");
		$vendorid = Request::input("vendorid");
		$ponos = Request::input("ponos");
		$indiid = Request::input("indiid");
		$today = date("d-m-Y");

		if($actype == "new") {
			$singleacdet = array(

					"vendor_id"=>$vendorid,
					"bank_name"=>$bank_name,
					"bank_branch"=>$bank_branch,
					"ifsc_code"=>$ifsc_code,
					"account_number"=>$account_number
				);

			$vendoracc = VendorAccountDetails::create($singleacdet);

			$vendoraccid = $vendoracc->id;
		}

		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		if(!isset($payterms['pdc_time_period'])) {

			$payterms['pdc_time_period'] = "";
		}

		if(!isset($payterms['bg_time_period'])) {

			$payterms['bg_time_period'] = "";
		}

		if(!isset($payterms['lc_time_period'])) {

			$payterms['lc_time_period'] = "";
		}
		if(!isset($payterms['lc_interest_percentage'])) {

			$payterms['lc_interest_percentage'] = "";
		}
		if(!isset($payterms['lc_interest_value'])) {

			$payterms['lc_interest_value'] = "";
		}
		if(!isset($payterms['interest_amount_sselac'])) {

			$payterms['interest_amount_sselac'] = 0;
		}
		if(!isset($payterms['interest_amount_vendorac'])) {

			$payterms['interest_amount_vendorac'] = "";
		}
		if(!isset($payterms['lc_interest_days_vendor'])) {

			$payterms['lc_interest_days_vendor'] = "";
		}
		if(!isset($payterms['lc_interest_days_sse'])) {

			$payterms['lc_interest_days_sse'] = "";
		}

		if(!isset($payterms['direct_payment_desc'])) {

			$payterms['direct_payment_desc'] = "";
		}


		$createpayments = Payments::create(array(

			"vendor_id"=>$vendorid,
			"internaldi_id"=>$indiid,
			"vendor_account_id"=>$vendoraccid,
			"pdc_time_period"=>$payterms['pdc_time_period'],
			"bg_time_period"=>$payterms['bg_time_period'],
			"lc_time_period"=>$payterms['lc_time_period'],
			"lc_interest_percentage"=>$payterms['lc_interest_percentage'],
			"lc_interest_value"=>$payterms['lc_interest_value'],
			"interest_amount_sselac"=>$payterms['interest_amount_sselac'],
			"interest_amount_vendorac"=>$payterms['interest_amount_vendorac'],
			"lc_interest_days_vendor"=>$payterms['lc_interest_days_vendor'],
			"lc_interest_days_sse"=>$payterms['lc_interest_days_sse'],
			"direct_payment_desc"=>$payterms['direct_payment_desc'],
			"created_by"=>$user['users']['id']

			));

		$out['uniquemat'] = array();
		$uniquecheck = array();

		$j = 0;

		foreach ($pomateriallist as $inpomat) {
			
			foreach ($inpomat['pomaterials'] as $inmat) {
				if($inmat['currentpaycost'] != 0) {

					$out['uniquemat'][] = $inmat['storematerial']['name'].": ".$inmat['currentpayqty']." ".$inmat['storematerial']['units'];
				
					PurchaseOrderMaterial::where("id", "=", $inmat['id'])->increment('payment_qty', $inmat['currentpayqty']);

					PaymentMaterials::create(array("payments_id"=>$createpayments->id,"purchase_order_material_id"=>$inmat['id'], "quantity"=>$inmat['currentpayqty'], "total_cost"=>$inmat['currentpaycost'], "material_id"=>$inmat['material_id']));

					$indimatdes = InternalDIMaterial::where("internal_di_id", "=", $indiid)->where("di_material_id", "=", $inmat['material_id'])->first();
					if($indimatdes) {

						$indimatdes->total_payment_qty = $indimatdes->total_payment_qty+$inmat['currentpayqty'];
						$indimatdes->save();
					}
				}
			}
		}

		$out['poinfo'] = array();
		$i=0;

		foreach ($ponos as $indipoid) {
			
			PaymentPo::create(array("payments_id"=>$createpayments->id, "po_id"=>$indipoid));

			$poinfo = PurchaseOrder::where("id", "=", $indipoid)->with("project")->first();

			$out['poinfo'][$i]['pono'] = $poinfo->po_no;
			$out['poinfo'][$i]['podate'] = $poinfo->po_date;
			
			$i++;
		}
		$out['userinfo'] = $user['users'];

		if($createpayments) {

			$finyearpre = date("y");
			$todaysmonth = date("m");

			if($todaysmonth < 4) {

				$finyear = ($finyearpre-1)."-".$finyearpre;
			} else {

				$finyear = $finyearpre."-".($finyearpre+1);
			}

			$out['memono'] = "SSEL/".$poinfo->project['client_short']."/".$finyear."/".$createpayments->id;
			$out['date'] = $today;

			$out['pomaterials'] = implode(",", $out['uniquemat']);
			$out['payid'] = $createpayments->id;

			return $out;
		} else {

			return 0;
		}
	}

	public function submit_payments(SendRawMail $sendraw) {

		$attachments = Request::input("file_attachments");
		$payid = Request::input("payid");
		$paymentraisetype = Request::input("paymentraisetype");
		$paymentdate = Request::input("paymentdate");
		$to = Request::input("to");
		$cc = Request::input("cc");
		$subject = Request::input("subject");
		$emailcontent = Request::input("emailcontent");
		$interofmemourl = Request::input("interofmemourl");

		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$payinfo = Payments::where("id", "=", $payid)->first();

		$from = $user['users']['email'];

		$templatecontent = file_get_contents("/var/www/html/ssel/projects/payment_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);

		if($paymentraisetype == "mail") {

			$res = $sendraw->sendRawEmail($from, $to, $cc, $subject, $templatecontent, $attachments);
		}

		if(!isset($paymentdate)) {

			$paymentdate = date("d-m-Y");
		}
		if(!isset($to)) {

			$to = "";
		}
		if(!isset($cc)) {

			$cc = "";
		}
		if(!isset($subject)) {

			$subject = "";
		}
		if(!isset($emailcontent)) {

			$emailcontent = "";
		}

		$payinfo->to = $to;
		$payinfo->cc = $cc;
		$payinfo->payment_raise_date = $paymentdate;
		$payinfo->emailcontent = $emailcontent;
		$payinfo->subject = $subject;
		$payinfo->inter_office_memo_url = $interofmemourl;
		$payinfo->save();

		foreach ($attachments as $indiattach) {
			
			$singlepaydocs = array(

					"payments_id"=>$payid,
					"doc_name"=>$indiattach['doc_name'],
					"doc_url"=>$indiattach['doc_url'],
					"mime_type"=>$indiattach['mime_type']
				);
			PaymentDocs::create($singlepaydocs);
		}

		return 1;
	}

	public function get_poamdlist() {

		$poid = Request::input("poid");

		$out = PurchaseOrder::where("id", "=", $poid)->with("vendor")->with("project")->get()->toArray();
		$out2 = OldPurchaseOrder::where("poid", "=", $poid)->with("vendor")->with("project")->get()->toArray();

		return array_merge($out2, $out);
	}

	public function get_vendor_pending_polist() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$mainarr = array();

		if($vendorid == "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status', '=', 0)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status', '=', 0)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid == "All" && $projectid != "All") {

			$out = PurchaseOrder::where('status', '=', 0)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status', '=', 0)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid != "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status', '=', 0)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status', '=', 0)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('status', '=', 0)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('status', '=', 0)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function changepostatus() {

		$status = Request::input("status");
		$poid = Request::input("poid");

		$poupdate = PurchaseOrder::where("id", "=", $poid)->with("pomaterials")->first();
		if($poupdate) {

			if($status == 2) {

				foreach ($poupdate['pomaterials'] as $inpomat) {
					
					$indentt = Indenttotal::where("material_id", "=", $inpomat['material_id'])->where("project_id", "=", $poupdate['project_id'])->first();
					if($indentt) {

						$indentt->total_po_qty = $indentt->total_po_qty-$inpomat['quantity'];
						$indentt->save();
					}
					
				}
			} 
			if($status == 3) {

				foreach ($poupdate['pomaterials'] as $inpomat) {

					$pendingpoqty = $inpomat['quantity']-$inpomat['internal_di_quantity'];
					
					$indentt = Indenttotal::where("material_id", "=", $inpomat['material_id'])->where("project_id", "=", $poupdate['project_id'])->first();
					if($indentt) {

						$indentt->total_po_qty = $indentt->total_po_qty-$pendingpoqty;
						$indentt->save();
					}
				}
			}
			$poupdate->status = $status;
			$poupdate->save();
			return 1;
		} else {

			return 0;
		}
	}
	public function approverejcs() {

		$status = Request::input("status");
		$csrefid = Request::input("csrefid");
		$vendetails = Request::input("vendetails");
		$cshodremarks = Request::input("cshodremarks");
		if(!isset($cshodremarks)) {

			$cshodremarks = "";
		}

		$csref = CsRef::where("id", "=", $csrefid)->with("csrefdet")->first();
		if($csref) {
			$csref->status = $status;
			$csref->hod_remarks = $cshodremarks;
			$csref->save();
			
			foreach ($vendetails as $indet) {
				
				$enqvendet = EnquiryVendor::where("vendor_id", "=", $indet['vendor_id'])->where("enquiry_id", "=", $indet['enquiry_id'])->first();
				if($enqvendet && isset($indet['selected'])) {

					if($indet['selected'] == true) {
						$csrefdet = CsRefDetails::where("cs_ref_id", "=", $csref->id)->where("enquiry_vendor_id", "=", $enqvendet->id)->first();
						if($csrefdet) {

							$csrefdet->status = 1;
							$csrefdet->save();
						} else {

							$oldenqvendet = OldEnquiryVendor::where("main_enquiry_vendor_id", "=", $enqvendet->id)->where("vendor_id", "=", $indet['vendor_id'])->where("enquiry_id", "=", $indet['enquiry_id'])->orderBy("created_at", "desc")->first();
							CsRefDetails::where("cs_ref_id", "=", $csref->id)->where("old_enquiry_vendor_id", "=", $oldenqvendet->id)->update(array("status"=>1));
						}
					}
				}
			}
			
			return 1;
		} else {

			return 0;
		}
	}

	public function get_project_cs() {

		$projectid = Request::input("projectid");

		return $enqdet = Enquiry::whereHas('projects', function($query) use ($projectid) {

				$query->where('project_id', '=', $projectid);
			})->with(array('cs.csref'=>function($query){
		        $query->where('status', '=', 1)->with('csrefdet.csvendor.vendordetails')->with('csrefdet.csvendor.materials.materialdetails.parent');
		    }))->whereHas('cs.csref', function($query) {

				$query->where('status', '=', 1);
			})->get();
	}

	public function get_vendor_approved_polist() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$mainarr = array();

		if($vendorid == "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status','=', 1)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 1)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid == "All" && $projectid != "All") {

			$out = PurchaseOrder::where('status','=', 1)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 1)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid != "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('status','=', 1)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function get_vendor_closerequested_polist() {

		$vendorid = Request::input('vendorid');

		$projectid = Request::input('projectid');
		$mainarr = array();

		if($vendorid == "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status','=', 4)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 4)->with('project')->with("vendor")->with('pomaterials.storematerial')->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid == "All" && $projectid != "All") {

			$out = PurchaseOrder::where('status','=', 4)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 4)->where('project_id', '=', $projectid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else if($vendorid != "All" && $projectid == "All") {

			$out = PurchaseOrder::where('status','=', 4)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();

			$outsum = PurchaseOrder::where('status','=', 4)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');

		} else {	

			$out = PurchaseOrder::where('status','=', 4)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->get();
			$outsum = PurchaseOrder::where('status','=', 4)->where('vendor_id', '=', $vendorid)->with('pomaterials.storematerial')->where('project_id', '=', $projectid)->with('project')->with("vendor")->orderBy('po_date', 'DESC')->sum('total_cost');
		}

		array_push($mainarr, $out);
		array_push($mainarr, $outsum);
		if($out->count() > 0) {

			return $mainarr;
		} else {

			return 0;
		}
	}

	public function generate_supply_rate_file() {

		$projectid = Request::input("projectid");

		$sch = Schedule::where("project_id", "=", $projectid)->with("subschedules")->get();
		$list = array();
		foreach ($sch as $insch) {
			$list[] = [$insch['id'],$insch['name'],"supply rate", "F&I Rate"];
			
			foreach ($insch->subschedules as $insub) {
				$list[] = [$insub['id'],$insub['no'],$insub['supply_rate'],$insub['fi_rate']];
			}
		}
		$filename = "/var/www/html/api/public/uploads/supplyrates/project".$projectid.".csv";
		$file = fopen($filename,"w");
		foreach ($list as $line)
		  {
		  fputcsv($file,$line);
		  }

		fclose($file);
		return str_ireplace("/var/www/html", "", $filename);
	}

	public function update_supply_file_data() {

		$filename = Request::input("filename");
		$fp=fopen('/var/www/html/api/public/uploads/supplyrates/'.$filename,'r');
		$out = array();
		while($data=fgetcsv($fp)){
			if($data[2] != "supply rate") {
				if($data[2] != "" && $data[2] != '0'){
					
					$subschid = $data[0];
					$subs = SubSchedule::where("id", "=", $subschid)->first();
					$subs->supply_rate = $data[2];
					$subs->fi_rate = $data[3];
					//$subs->save();
					$out[] = $subs;
				}
			}
		}
		return $out;
	}

	public function savesupplyrate() {

		$filename = Request::input("filename");
		$fp=fopen('/var/www/html/api/public/uploads/supplyrates/'.$filename,'r');
		$out = array();
		while($data=fgetcsv($fp)){
			if($data[2] != "supply rate") {
				if($data[2] != "" && $data[2] != '0'){
					
					$subschid = $data[0];
					$subs = SubSchedule::where("id", "=", $subschid)->first();
					$subs->supply_rate = $data[2];
					$subs->fi_rate = $data[3];
					$subs->save();
					$out[] = $subs;
				}
			}
		}
		return $out;
	}
	public function getmatreportdata() {

		$submat = Request::input("submat");
		$submatid = $submat['id'];
		$podet = PurchaseOrder::with(array('pomaterials'=>function($query) use ($submatid){
			        $query->where('material_id', '=', $submatid);
			    }))->with('vendor')->get();
		$out = array();

		foreach ($podet as $inpodet) {
			
			foreach ($inpodet['pomaterials'] as $pomat) {
				$out['monthcal'][] = strtotime($inpodet['po_date'])*1000;
				$out['price'][] = $pomat['unit_rate'];
				$out['podata'][] = $inpodet['po_no'].", ".$inpodet['vendor']['name'].", ".date("d-m-Y", strtotime($inpodet['po_date'])).", Rs.".$pomat['unit_rate'];
				$out['values'][] = [(strtotime($inpodet['po_date'])*1000),round($pomat['unit_rate'])];
			}
		}
		$out['min'] = min($out['monthcal']);
		return $out;
	}

	public function get_mat_wise_po() {

		$matid = Request::input("matid");
		$projectid = Request::input("projectid");
		if($projectid == "All") {

			$pomat = PurchaseOrderMaterial::where("material_id", "=", $matid)->with("purchaseorder.project")->with("purchaseorder.taxes.taxmaterials")->with("purchaseorder.vendor")->get();
		} else {

			$pomat = PurchaseOrderMaterial::where("material_id", "=", $matid)
			->whereHas("purchaseorder", function($query) use ($projectid){

				$query->where("project_id", "=", $projectid);
			})
			->with("purchaseorder.project")->with("purchaseorder.taxes.taxmaterials")->with("purchaseorder.vendor")->get();
		}
		foreach ($pomat as $inpomat) {
				    	
	    	$thisunitrate = $inpomat->unit_rate;
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
	    	
	    }
	    return $pomat;
	}
	public function getpowithoutfreight() {

		$projectid = Request::input("projectid");

		return PurchaseOrder::where("project_id", "=", $projectid)->whereHas('taxes', function($query)
			{
			    $query->where('tax_id', "=", 11)->where("lumpsum", "=", 1);
			})->whereHas('pomaterials', function($query)
			{
			    $query->where('freightinsurance_rate', "=", 0.00);
			})->with("pomaterials.storematerial")->get();
	}

	public function saveunitfreight() {

		$podet = Request::input("podet");

		foreach ($podet['pomaterials'] as $pomat) {
			
			$pomatid = $pomat['id'];
			$pomatdet = PurchaseOrderMaterial::where("id", "=", $pomatid)->update(array("freightinsurance_rate"=>$pomat['freightinsurance_rate']));
		}

		return 1;
	}

	public function getmattrackreport() {

		// added code below
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store')->first();
		$storeid = $userdata['users']['store']['id'];

	// added above

		$projectid = Request::input("projectid");
		$purchasedet = StoreMaterial::where("category_id", "!=", 46)->whereHas('purchaseordermat.purchaseorder', function($query) use ($projectid)
			{
			    $query->where('project_id', '=', $projectid);
			})->with('matuom.stmatuom')->with(array('indenttotal'=>function($query) use ($projectid){
			        $query->where('project_id', '=', $projectid);
			    }))->get();

		foreach ($purchasedet as $indipur) {

			$indipur['totalraised'] = 0;
			$indipur['totalinspected'] = 0;
			$indipur['totalapproved'] = 0;
			$indipur['totaldispatched'] = 0;
			$indipur['totalinternaldi'] = 0;
			$indipur['totalindentqty'] = 0;
			$submatid = $indipur['id'];

			$pdet = PurchaseOrder::where("project_id", "=", $projectid)->with(array('pomaterials'=>function($query) use ($submatid){
			        $query->where('material_id', '=', $submatid);
			    }))->whereHas('pomaterials', function($query) use ($submatid)
			{
			    $query->where('material_id', '=', $submatid);
			})->get();

			    // added below code
			$ststock = StoreStock::where("store_id", "=", $storeid)->where("material_id", "=", $submatid)->first();
			if($ststock) {
				$indipur['total_received'] = $ststock['total_received'];
				$indipur['total_issued'] = $ststock['total_issued'];
				$indipur['total_stock'] = $ststock['quantity'];
			} else {

				$indipur['total_received'] = 0;
				$indipur['total_issued'] = 0;
				$indipur['total_stock'] = 0;
			}   
			// added till here
			foreach ($pdet as $inpdet) {
				
				foreach ($inpdet['pomaterials'] as $innpdet) {
					if($indipur['matuom'][0]['stmatuom']['uom'] == "NOS" || $indipur['matuom'][0]['stmatuom']['uom'] == "SET") {
						$indipur['totalraised'] += round($innpdet['quantity']);
						$indipur['totalinspected'] += round($innpdet['inspected_quantity']);
						$indipur['totalapproved'] += round($innpdet['approved_quantity']);
						$indipur['totaldispatched'] += round($innpdet['dispatch_quantity']);
						$indipur['totalinternaldi'] += round($innpdet['internal_di_quantity']);
					} else {

						$indipur['totalraised'] += $innpdet['quantity'];
						$indipur['totalinspected'] += $innpdet['inspected_quantity'];
						$indipur['totalapproved'] += $innpdet['approved_quantity'];
						$indipur['totaldispatched'] += $innpdet['dispatch_quantity'];
						$indipur['totalinternaldi'] += $innpdet['internal_di_quantity'];
					}
				}
			}
			if(count($indipur['indenttotal']) > 0) {
				if($indipur['matuom'][0]['stmatuom']['uom'] == "NOS" || $indipur['matuom'][0]['stmatuom']['uom'] == "SET") {

					$indipur['totalindentqty'] = round($indipur['indenttotal'][0]['total_indent_qty']);
				} else {

					$indipur['totalindentqty'] = $indipur['indenttotal'][0]['total_indent_qty'];
				}
			}

		}

		return $purchasedet;
	}

	public function getindentreport() {

		$projectid = Request::input("projectid");
		$totindentqtyarr = array();
		$podet = MaterialCategory::with(array("submaterials"=>function($query) use ($projectid){

			$query->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
				})->orWhereHas("indenttotal", function($q2) use ($projectid) {
					$q2->where("project_id", "=", $projectid);
				})
				->with(array("purchaseordermat.purchaseorder"=>function($qin) use ($projectid){

					$qin->where("project_id", "=", $projectid);
				}))->with("matuom.stmatuom")->where("category_id", "!=", 46);
		}))->whereHas("submaterials",function($query) use ($projectid){

			$query->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
			})->orWhereHas("indenttotal", function($q2) use ($projectid) {
				$q2->where("project_id", "=", $projectid);
			})->where("category_id", "!=", 46);
		})->get();
		// $podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($projectid)
		// 	{
		// 	    $query->where('project_id', '=', $projectid);
		// 	})->with("storematerial.matuom.stmatuom")
		// 	->whereHas('storematerial', function($q) {

		// 		$q->where("category_id", "!=", 46); //removing capital assets
		// 	})
		// 	->get();
		$i = 0;
		foreach ($podet as $inpodet) {
			foreach ($inpodet['submaterials'] as $inmat) {

				$posum = PurchaseOrderMaterial::where("material_id", "=", $inmat['id'])->whereHas('purchaseorder', function($query) use ($projectid)
				{
				    $query->where('project_id', '=', $projectid);
				})->sum("quantity");

				$totindentqtyarr[$i]['matname'] = $inmat['name'];
				$totindentqtyarr[$i]['purchased'] = $posum;
				$totindentqtyarr[$i]['uom'] = $inmat['matuom'][0]['stmatuom']['uom'];
				$indiindent = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $inmat['id'])->with('mat')->first();

				if($indiindent) {
					$totindentqtyarr[$i]['totalindent'] = $indiindent['total_indent_qty'];
							
					$totindentqtyarr[$i]['tobepurchased'] = round($indiindent['total_indent_qty']-$posum, 2);
					
					$indentmat = IndentMaterial::where("material_id", "=", $inmat['id'])->
					whereHas('indent', function($query) use ($projectid)
					{
					    $query->where('project_id', '=', $projectid)->where("status", "=", 1);
					})->where("indent_qty", "NOT LIKE", "%-%")
					->orderBy("created_at", "desc")->first();
					if($indentmat) {
						$totindentqtyarr[$i]['latestindent'] = $indentmat->indent_qty;
					}
				} else {

					$totindentqtyarr[$i]['totalindent'] = 0;
							
					$totindentqtyarr[$i]['tobepurchased'] = -$posum;
					$totindentqtyarr[$i]['latestindent'] = 0;
				}
				// if($totindentqtyarr[$i]['tobepurchased'] < 0) {
				// 	$totind = $totindentqtyarr[$i]['totalindent']-($totindentqtyarr[$i]['tobepurchased']);
				// 	$incheck = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $inmat['id'])->first();
				// 	if($incheck) {

				// 		$incheck->total_indent_qty = $totind;
				// 		$incheck->save();
				// 	}
				// }
				$i++;
			}
		}
		
		return $totindentqtyarr;
	}

	public function gettobepurchasedindentreport() {

		$projectid = Request::input("projectid");
		$totindentqtyarr = array();
		
		$podet = MaterialCategory::with(array("submaterials"=>function($query) use ($projectid){

			$query->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
			})->with(array("purchaseordermat.purchaseorder"=>function($qin) use ($projectid){

				$qin->where("project_id", "=", $projectid);
			}))->with("matuom.stmatuom")->where("category_id", "!=", 46);
		}))->whereHas("submaterials",function($query) use ($projectid){

			$query->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
			})->where("category_id", "!=", 46);
		})->get();
		// $podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($projectid)
		// 	{
		// 	    $query->where('project_id', '=', $projectid);
		// 	})->with("storematerial.matuom.stmatuom")
		// 	->whereHas('storematerial', function($q) {

		// 		$q->where("category_id", "!=", 46); //removing capital assets
		// 	})
		// 	->get();
		$i = 0;
		foreach ($podet as $inpodet) {

			foreach ($inpodet['submaterials'] as $inmat) {
				

				$posum = PurchaseOrderMaterial::where("material_id", "=", $inmat['id'])->whereHas('purchaseorder', function($query) use ($projectid)
				{
				    $query->where('project_id', '=', $projectid);
				})->sum("quantity");

				
				$indiindent = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $inmat['id'])->with('mat.matuom.stmatuom')->first();

				if($indiindent) {
						
					if($indiindent['mat']['matuom'][0]['stmatuom']['uom'] == "NOS" || $indiindent['mat']['matuom'][0]['stmatuom']['uom'] == "SET") {
						$tobepurqty = round($indiindent['total_indent_qty']-$posum);
						
					} else {
						$tobepurqty = round($indiindent['total_indent_qty']-$posum, 2);
					}
					if($tobepurqty > 0) {

						$totindentqtyarr[$i]['matname'] = $inmat['name'];
						$totindentqtyarr[$i]['purchased'] = $posum;
						$totindentqtyarr[$i]['uom'] = $inmat['matuom'][0]['stmatuom']['uom'];
						$totindentqtyarr[$i]['totalindent'] = $indiindent['total_indent_qty'];
						$totindentqtyarr[$i]['tobepurchased'] = $tobepurqty;
						$i++;
					}
				}

			}
			
		}
		
		return $totindentqtyarr;
	}

	public function getindentdet() {

		$indentid = Request::input("indentid");
		$storematdet = MaterialCategory::whereHas("submaterials.indentmat", function($query) use ($indentid){

			$query->where("indent_id", '=', $indentid);
		})->with(array("submaterials.indentmat"=>function($que) use ($indentid){

			$que->where("indent_id", '=', $indentid)->with("mat.matuom.stmatuom")->with("indent");
		}))->get();
		// $indentmat = IndentMaterial::where("indent_id", "=", $indentid)->with("mat.matuom.stmatuom")->with("indent")->get();		
		$indentarr = array();
		foreach ($storematdet as $indimat) {
			foreach ($indimat['submaterials'] as $indisubmat) {
				
				foreach ($indisubmat['indentmat'] as $indiindentmat) {
					
					array_push($indentarr, $indiindentmat);
				}
			}
			// $projectid = $indimat['indent']['project_id'];
			// $matid = $indimat['material_id'];
			// $indenttot = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $matid)->first(); 
			// if($indenttot) {

			// 	$indimat['tot_indent'] = $indenttot['total_indent_qty'];
			// } else {

			// 	$indimat['tot_indent'] = 0;
			// }
			
		}
		return $indentarr;
	}

	public function getpendingindentdet() {

		$projectid = Request::input("projectid");

		$indentmat = IndentMaterial::with("mat.matuom.stmatuom")->whereHas("indent", function($q) use ($projectid){
			$q->where("project_id", "=", $projectid)->where("status", "=", 0);
		})->get();	
		$matarr = array();
		$matcheck = array();
		$i = 0;
		foreach ($indentmat as $indimat) {
			$matid = $indimat['material_id'];

			if(!in_array($matid, $matcheck)) {

				$matcheck[] = $matid;
				$matarr[$matid]['matname'] = $indimat['mat']['name'];
				$matarr[$matid]['indentqty'] = $indimat['indent_qty'];
				$indenttot = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $matid)->first(); 
				$matarr[$matid]['uom'] = $indimat['mat']['matuom'][0]['stmatuom']['uom'];
				if($indenttot) {

					$matarr[$matid]['tot_indent'] = $indenttot['total_indent_qty'];
				} else {

					$matarr[$matid]['tot_indent'] = 0;
				}
				
			} else {

				$matarr[$matid]['indentqty'] += $indimat['indent_qty'];
			}
			
			
		}
		// $mainmatarr =  array();
		// foreach ($matarr as $inmat) {
			
		// 	array_push($mainmatarr, $inmat);
		// }
		return $matarr;
	
	}
	
	public function post_maninternal_di_manual() {
		
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();
		$uid = $user['id'];

		$data = Request::input('dat');
		$date = Request::input('date');
		// $name = Request::input('name');

		$dtype = Request::input('dtype');
		$delid = Request::input('deliverylocid');
		$vid = Request::input('vendorid');
		$pid = Request::input('projectid');
		$docs = Request::input('docs');
		$vendordet = Vendor::where("id", "=", $vid)->first();

		if($dtype=='site')
		{
			$stores_id = '';
			$site_areas_id = $delid;
		}
		else if($dtype=='store')
		{
			$stores_id = $delid;
			$site_areas_id = '';
		}
		$q1 = new InternalDI;
		// $q1->di_id = $diid;
		$q1->manual_date = $date;
		$q1->manual_flag = 1;
		// $q1->ref_name = $name;
		$q1->vendor_id = $vid;
		$q1->created_by = $uid;
		$q1->project_id = $pid;
		$q1->save();
		$internal_di_id = $q1->id;
		$name = $vendordet->vendor_code."/IDI/".$internal_di_id;
		$q1->ref_name = $name;
		$q1->save();

		for ($m=0; $m < count($docs); $m++) { 
			# code...
			$q4 = new InternalDIDocs;
			$q4->internal_di_id = $internal_di_id;
			$q4->doc_name = $docs[$m]['doc_name'];
			$q4->doc_url = $docs[$m]['doc_url'];
			$q4->save();
		}

		for ($i=0; $i < count($data); $i++) { 
			# code...
			$q2 = new InternalDIMaterial;
			$q2->internal_di_id = $internal_di_id;
			$q2->di_material_id = $data[$i]['matid'];
			$q2->quantity = $data[$i]['total'];
			$q2->save();
			$intmatid = $q2->id;

			for ($m=0; $m < count($data[$i]['pos']); $m++) { 
				# code...
				$q3 = new InternalDIPo;
				$q3->internal_di_material_id = $intmatid;
				$q3->po_id = $data[$i]['pos'][$m]['poid'];
				$q3->material_id = $data[$i]['matid'];
				$q3->pom_table_id =  $data[$i]['pos'][$m]['pomid'];
				$q3->vendor_id = $vid;
				$q3->quantity = $data[$i]['pos'][$m]['intdiqty'];
				$q3->stores_id = $stores_id;
				$q3->site_areas_id = $site_areas_id;
				$q3->save();
				//add totals
				$q4 = PurchaseOrderMaterial::where('id','=',$data[$i]['pos'][$m]['pomid'])->first();
				$intdqty = $q4->internal_di_quantity;
				$nintqty = floatval($intdqty) + floatval($data[$i]['pos'][$m]['intdiqty']);
				$q4 = PurchaseOrderMaterial::where('id','=',$data[$i]['pos'][$m]['pomid'])->update(array('internal_di_quantity' => $nintqty));

				$q99 = new InternalDiPoIds;
				$q99->internal_di_id = $internal_di_id;
				$q99->po_id = $data[$i]['pos'][$m]['poid'];
				$q99->save();

			}
		}
		

		// $q1 = PurchaseOrder::where('vendor_id','=',$vid)->where('project_id','=',$pid)->with('pomaterials.storematerial')->get();

		return $q1->id;
	}

	public function post_maninternal_di_mail(SendRawMail $sendraw) {
		$tkn=Request::header('JWT-AuthToken');
		$user = Session::where('refreshtoken','=',$tkn)->with('users.company.compdetails')->first();

		$to = trim(Request::input('to'));
		$cc = Request::input('cc');
		$data = Request::input("dat");
		// $name = Request::input('name');
		// $vendorid = Request::input('vendorid');
		$projid = Request::input('projectid');
		
		$dtype = Request::input('dtype');
		$delid = Request::input('deliverylocid');
		$vid = Request::input('vendorid');
		$attachments = Request::input('attachments');
		$subject = Request::input('subject');
		$emailcontent = Request::input('content');
		$attachments = Request::input('attachments');
		$from = $user['users']['email'];
		$userid = $user['id'];
		$vendordet = Vendor::where("id", "=", $vid)->first();

		if($dtype=='site')
		{
			$stores_id = '';
			$site_areas_id = $delid;
			$q9 = SiteAreas::where('id','=',$site_areas_id)->first();
			$deliveryaddress = $q9->address;
		}
		else if($dtype=='store')
		{
			$stores_id = $delid;
			$site_areas_id = '';
			$q9 = Store::where('id','=',$stores_id)->first();
			$deliveryaddress = $q9->location;
		}

		
		$q1 = new InternalDI;
		// $q1->di_id = $diid;
		// $q1->manual_date = $date;
		$q1->manual_flag = 0;
		// $q1->ref_name = $name;
		$q1->to = $to;
		$q1->cc = $cc;
		$q1->subject = $subject;
		$q1->content = $emailcontent;
		$q1->created_by = $userid;
		$q1->vendor_id = $vid;
		$q1->project_id = $projid;
		$q1->save();
		$internal_di_id = $q1->id;
		$name = $vendordet->vendor_code."/IDI/".$internal_di_id;
		$q1->ref_name = $name;
		$q1->save();

		for ($m=0; $m < count($attachments); $m++) { 
			# code...
			$q4 = new InternalDIDocs;
			$q4->internal_di_id = $internal_di_id;
			$q4->doc_name = $attachments[$m]['doc_name'];
			$q4->doc_url = $attachments[$m]['doc_url'];
			$q4->save();
		}

		$tablerow = "";

		for ($i=0; $i < count($data); $i++) { 
			# code...
			$q2 = new InternalDIMaterial;
			$q2->internal_di_id = $internal_di_id;
			$q2->di_material_id = $data[$i]['matid'];
			$q2->quantity = $data[$i]['total'];
			$q2->save();
			$intmatid = $q2->id;

			$storematdet = StoreMaterial::where("id", "=", $data[$i]['matid'])->with('matuom.stmatuom')->first();	
			$tablerow .= "<tr><td style='text-align:center;'>".($i+1)."</td><td>".$storematdet->name."</td><td style='text-align:center;'>".$storematdet['matuom'][0]['stmatuom']['uom']."</td><td style='text-align:center;'>".$data[$i]['total']."</td></tr>";

			for ($m=0; $m < count($data[$i]['pos']); $m++) { 
				# code...
				$q3 = new InternalDIPo;
				$q3->internal_di_material_id = $intmatid;
				$q3->po_id = $data[$i]['pos'][$m]['poid'];
				$q3->material_id = $data[$i]['matid'];
				$q3->pom_table_id =  $data[$i]['pos'][$m]['pomid'];
				$q3->vendor_id = $vid;
				$q3->quantity = $data[$i]['pos'][$m]['intdiqty'];
				$q3->stores_id = $stores_id;
				$q3->site_areas_id = $site_areas_id;
				$q3->save();
				//add totals
				$q4 = PurchaseOrderMaterial::where('id','=',$data[$i]['pos'][$m]['pomid'])->first();
				$intdqty = $q4->internal_di_quantity;
				$nintqty = floatval($intdqty) + floatval($data[$i]['pos'][$m]['intdiqty']);
				$q4 = PurchaseOrderMaterial::where('id','=',$data[$i]['pos'][$m]['pomid'])->update(array('internal_di_quantity' => $nintqty));

				$q99 = new InternalDiPoIds;
				$q99->internal_di_id = $internal_di_id;
				$q99->po_id = $data[$i]['pos'][$m]['poid'];
				$q99->save();

			}
		}


		if(trim($cc) != "") {
			$ccarr = explode(",",$cc);
		} else {

			$ccarr = array();
		}
		$out = array();

		$templatecontent = file_get_contents("/var/www/html/internaldi_mail_template.html");
		$templatecontent = str_ireplace("{{companylogo}}", $user['users']['company']['compdetails']['logo'], $templatecontent);
		$templatecontent = str_ireplace("{{companyname}}", $user['users']['company']['compdetails']['fullname'], $templatecontent);
		$templatecontent = str_ireplace("{{companyaddress}}", $user['users']['company']['compdetails']['address'], $templatecontent);
		$templatecontent = str_ireplace("{{companystate}}", $user['users']['company']['compdetails']['state'], $templatecontent);
		$templatecontent = str_ireplace("{{companycity}}", $user['users']['company']['compdetails']['city'], $templatecontent);
		$templatecontent = str_ireplace("{{companypincode}}", $user['users']['company']['compdetails']['pincode'], $templatecontent);
		$templatecontent = str_ireplace("{{companyph}}", $user['users']['company']['compdetails']['tele_no'], $templatecontent);
		
		$templatecontent = str_ireplace("{{sendername}}", $user['users']['name'], $templatecontent);
		$templatecontent = str_ireplace("{{senderdesg}}", $user['users']['designation'], $templatecontent);
		$templatecontent = str_ireplace("{{senderph}}", $user['users']['phoneno'], $templatecontent);

		$templatecontent = str_ireplace("{{emailcontent}}", $emailcontent, $templatecontent);
		$templatecontent = str_ireplace("{{deliveryaddress}}", $deliveryaddress, $templatecontent);
		$templatecontent = str_ireplace("{{matdata}}", $data, $templatecontent);
		$templatecontent = str_ireplace("{{tablerow}}", $tablerow, $templatecontent);


		$ICRid = $createICR->id;
		$ICRno = 'ICR'+$ICRid;
		$templatecontent = str_ireplace("{{icrno}}", $ICRno, $templatecontent);
		// if(count($attachments)>0){
		// 	for($d=0;$d<count($attachments);$d++){
		// 		$singleCRAttachment = array("inspection_call_raising_id"=>$ICRid, "doc_name"=>$attachments[$d]['doc_name'], "doc_url"=>$attachments[$d]['doc_url']);
		// 		$createICRdoc = InspectionCallRaisingAttachments::create($singleCRAttachment);
		// 	}
		// }
		// InspectionCallRaisingAttachments

		$failedemail = array();
		$res = $sendraw->sendRawEmail($from, $to, $cc, $subject, $templatecontent, $attachments);
		if($res == 0) {

			$failedemail[] = $to;
		}
		
		$out['ICRno'] = $ICRno;
		$out['failedmail'] = $failedemail;
		$out['indiid'] = $q1->id;

		if(count($failedemail)>0)
		{
			$q9 = InternalDI::where('id','=',$internal_di_id)->update(array('successflag' => 0));
		}

		return $out;		
	}

	public function get_pos_vend_link_data() {
		
		$vid = Request::input('vendorid');
		$pid = Request::input('projectid');

		$q1 = PurchaseOrder::where('vendor_id','=',$vid)->where('project_id','=',$pid)->with('pomaterials.storematerial')->get();

		$q2 = InternalDI::where('project_id','=',$pid)->where('vendor_id','=',$vid)->with('intdimat.intdipo.podets')->with('intdimat.matdesonmatid')->with('intdimat.intdipo.storematerial')->with('intdimat.intdipo.storename')->with('intdimat.intdipo.siteareas')->with('intdidocs')->get();

		return array($q1,$q2);
	}

	public function update_idi_items() {

		$data = Request::input('dat');
		$q1 = InternalDIPo::where('id','=',$data['id'])->first();
		$quantity = $q1->quantity;
		$intmatid = $q1->internal_di_material_id;

		$q2 = InternalDIMaterial::where('id','=',$intmatid)->first();
		$nqty = floatval($q2->quantity) - floatval($quantity);
		$nqty = floatval($nqty) + floatval($data['quantity']);
		$q3 = InternalDIMaterial::where('id','=',$intmatid)->update(array('quantity' => $nqty));


		$q4 = PurchaseOrderMaterial::where('id','=',$data['pom_table_id'])->first();
		$pmqty = floatval($q4['internal_di_quantity']) - floatval($quantity);
		$pmqty = floatval($pmqty) + floatval($data['quantity']);
		$q4 = PurchaseOrderMaterial::where('id','=',$data['pom_table_id'])->update(array('internal_di_quantity' =>$pmqty));

		$q11 = InternalDIPo::where('id','=',$data['id'])->update(array('quantity' =>$data['quantity']));

		return 'yes';
	}

	public function get_store_project() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store.project')->first();
		return $userdata['users']['store'];
	}

	public function getfabmattype() {

		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.store.project')->first();
		$storeid = $userdata['users']['store']['id'];
		$projectid = $userdata['users']['store']['project']['id'];

		$matdet = MaterialCategory::orderBy('name')->whereHas('submaterials', function($query)
			{
			    $query->where('type', '=', 3);
			})->with(array('submaterials'=>function($query){
		        $query->where('type', '=', 3)->with('matuom.stmatuom')->with('level1mat.storematerial.matuom.stmatuom')->with('level1mat.msmat');
		    }))->get();

		foreach ($matdet as $mat) {
			
			foreach ($mat['submaterials'] as $submat) {
				
				foreach ($submat['level1mat'] as $inmat) {
					
					$storest = StoreStock::where("store_id", "=", $storeid)->where("material_id", "=", $inmat['store_material_id'])->where("material_level1_id", "=", $inmat['id'])->where("fab_flag", "=", 1)->first();
					if($storest) {
						$inmat['total_received'] = $storest['total_received'];
						$inmat['total_issued'] = $storest['total_issued'];
						$inmat['total_stock'] = $storest['quantity'];
					} else {
						$inmat['total_received'] = 0;
						$inmat['total_issued'] = 0;
						$inmat['total_stock'] = 0;
					}
				}
			}
		}

		return $matdet;

	}

	public function generateinsdistatusreport() {

		$projectid = Request::input("projectid");
		$vendorid = Request::input("vendorid");
		$fromdate = Request::input("fromdate");
		$todate = Request::input("todate");
		if($projectid != "All" && $vendorid != "All") {
			$podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($vendorid, $projectid,$fromdate,$todate)
			{
			    $query->where("vendor_id", "=", $vendorid)->where("project_id", "=", $projectid)->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate);
			})->with("purchaseorder.inspections.inspec.insmat.inseachpomat.storemat")->with("purchaseorder.vendor")->with("purchaseorder.project")->with("storematerial.matuom.stmatuom")->with("purchaseorder.inspections.inspec.inspdis.dimat.dieachpomat.storemat")->with("purchaseorder.inspections.inspec.inspdis.callraise")->with("purchaseorder.inspections.inspec.callraise")->get();
		} else if($projectid == "All" && $vendorid != "All") {

			$podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($vendorid, $projectid,$fromdate,$todate)
			{
			    $query->where("vendor_id", "=", $vendorid)->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate);
			})->with("purchaseorder.inspections.inspec.insmat.inseachpomat.storemat")->with("purchaseorder.vendor")->with("purchaseorder.project")->with("storematerial.matuom.stmatuom")->with("purchaseorder.inspections.inspec.inspdis.dimat.dieachpomat.storemat")->with("purchaseorder.inspections.inspec.inspdis.callraise")->with("purchaseorder.inspections.inspec.callraise")->get();
		} else if($projectid != "All" && $vendorid == "All") {

			$podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($vendorid, $projectid,$fromdate,$todate)
			{
			    $query->where("project_id", "=", $projectid)->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate);
			})->with("purchaseorder.inspections.inspec.insmat.inseachpomat.storemat")->with("purchaseorder.vendor")->with("purchaseorder.project")->with("storematerial.matuom.stmatuom")->with("purchaseorder.inspections.inspec.inspdis.dimat.dieachpomat.storemat")->with("purchaseorder.inspections.inspec.inspdis.callraise")->with("purchaseorder.inspections.inspec.callraise")->get();
		} else {

			$podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($vendorid, $projectid,$fromdate,$todate)
			{
			    $query->where("po_date", ">=", $fromdate)->where("po_date", "<=", $todate);
			})->with("purchaseorder.inspections.inspec.insmat.inseachpomat.storemat")->with("purchaseorder.vendor")->with("purchaseorder.project")->with("storematerial.matuom.stmatuom")->with("purchaseorder.inspections.inspec.inspdis.dimat.dieachpomat.storemat")->with("purchaseorder.inspections.inspec.inspdis.callraise")->with("purchaseorder.inspections.inspec.callraise")->get();
		}
			$disparr = array();
			$x =0 ;
			$inarr = array();
			// return $podet;
		    foreach ($podet as $indipo) {
		    	$matname = $indipo['storematerial']['name'];

		    	foreach ($indipo['purchaseorder']['inspections'] as $ininsp) {
		    		if(count($ininsp['inspec']['insmat']) > 0) {
			    		foreach ($ininsp['inspec']['insmat'] as $insm) {
			    			
			    			foreach ($insm['inseachpomat'] as $inpom) {

			    				if($inpom['inspection_po_id'] == $indipo['purchaseorder']['id']) {

				    				if(count($ininsp['inspec']['inspdis']) > 0) {
				    				
					    				foreach ($ininsp['inspec']['inspdis'] as $insd) {

					    					foreach ($insd['dimat'] as $indim) {
					    						
					    						foreach ($indim['dieachpomat'] as $indipom) {
					    							
					    							if($indipom['po_material_id'] == $inpom['po_material_id'] && $indipom['dispatch_po_id'] == $indipo['purchaseorder']['id']) {

					    								$arel = $indipom['dispatch_po_id'].$indipom['po_material_id'].$indipom['pom_table_id'].$indipom['dispatch_material_id'];
					    								if(!in_array($arel, $inarr)) {
					    									$pomatdet = PurchaseOrderMaterial::where("purchase_order_id", "=", $indipom['dispatch_po_id'])->where("material_id", "=", $indipom['po_material_id'])->first();
						    								$disparr[$x]['inspected_quantity'] = $inpom['inspected_quantity'];
										    				$disparr[$x]['po_no'] = $indipo['purchaseorder']['po_no'];
										    				$disparr[$x]['po_date'] = $indipo['purchaseorder']['po_date'];
										    				$disparr[$x]['quantity'] = $pomatdet['quantity'];
										    				$disparr[$x]['vendorname'] = $indipo['purchaseorder']['vendor']['name'];
										    				$disparr[$x]['matname'] = $indipom['storemat']['name'];
										    				$disparr[$x]['uom'] = $indipo['storematerial']['matuom'][0]['stmatuom']['uom'];
										    				
										    				if($ininsp['inspec']['callraise']['manual_flag'] == 1) {

										    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['manual_date']));
										    				} else {

										    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['created_at']));
										    				}

										    				if($ininsp['inspec']['joint_inspection_flag'] == 1) {

										    					$disparr[$x]['material_readiness_date'] = 0;
										    					$disparr[$x]['inspec_call_site'] = 0;
										    					$disparr[$x]['call_received_supp'] = 0;
										    				} else {

										    					$disparr[$x]['material_readiness_date'] = $ininsp['inspec']['inspection_readiness_date'];
										    					$disparr[$x]['inspec_call_site'] = $callraisedsupp;
										    					$disparr[$x]['call_received_supp'] = $ininsp['inspec']['inspec_call_supplier_date'];
										    				}

										    				if($insd['callraise']['manual_flag'] == 1) {

										    					$dicalldate = date("d-m-Y", strtotime($insd['callraise']['manual_date']));
										    				} else {

										    					$dicalldate = date("d-m-Y", strtotime($insd['callraise']['created_at']));
										    				}
										    				
										    				$disparr[$x]['inspection_memo_no'] = $ininsp['inspec']['inspection_ref_no'];
										    				$disparr[$x]['approved_call_date'] = date("d-m-Y", strtotime($ininsp['inspec']['approved_inspec_date']));
										    				$disparr[$x]['inspection_report_date'] = date("d-m-Y", strtotime($ininsp['inspec']['inspec_report_date']));
										    				$disparr[$x]['dispatch_no'] = $insd['dispatch_no'];
										    				$disparr[$x]['dispatch_date'] = $insd['dispatch_date'];
										    				$disparr[$x]['di_call_date'] = $dicalldate;
										    				$disparr[$x]['dispatch_id'] = $insd['id'];
										    				$disparr[$x]['material_id'] = $indipo['material_id'];
										    				$disparr[$x]['di_qty'] = $indipom['dispatch_quantity'];
										    				$x++;
										    				$inarr[] = $arel;
										    			}
					    							}
					    						}
					    					}
					    				}
					    			} else {

					    				$arel = $inpom['inspection_po_id'].$inpom['po_material_id'].$inpom['pom_table_id'].$inpom['inspection_material_id'];
					    				if(!in_array($arel, $inarr)) {
					    					$pomatdet = PurchaseOrderMaterial::where("purchase_order_id", "=", $inpom['inspection_po_id'])->where("material_id", "=", $inpom['po_material_id'])->first();
						    				$disparr[$x]['inspected_quantity'] = $inpom['inspected_quantity'];
						    				$disparr[$x]['po_no'] = $indipo['purchaseorder']['po_no'];
						    				$disparr[$x]['po_date'] = $indipo['purchaseorder']['po_date'];
						    				$disparr[$x]['quantity'] = $pomatdet['quantity'];
						    				$disparr[$x]['vendorname'] = $indipo['purchaseorder']['vendor']['name'];
						    				$disparr[$x]['matname'] = $inpom['storemat']['name'];
						    				$disparr[$x]['uom'] = $indipo['storematerial']['matuom'][0]['stmatuom']['uom'];
						    				if($ininsp['inspec']['callraise']['manual_flag'] == 1) {

						    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['manual_date']));
						    				} else {

						    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['created_at']));
						    				}
						    				if($ininsp['inspec']['joint_inspection_flag'] == 1) {

						    					$disparr[$x]['material_readiness_date'] = 0;
						    					$disparr[$x]['inspec_call_site'] = 0;
						    					$disparr[$x]['call_received_supp'] = 0;
						    				} else {

						    					$disparr[$x]['material_readiness_date'] = $ininsp['inspec']['inspection_readiness_date'];
						    					$disparr[$x]['inspec_call_site'] = $callraisedsupp;
						    					$disparr[$x]['call_received_supp'] = $ininsp['inspec']['inspec_call_supplier_date'];
						    				}

						    				$disparr[$x]['inspection_memo_no'] = $ininsp['inspec']['inspection_ref_no'];
						    				$disparr[$x]['approved_call_date'] = $ininsp['inspec']['approved_inspec_date'];
						    				$disparr[$x]['inspection_report_date'] = $ininsp['inspec']['inspec_report_date'];
						    				$x++;
						    				$inarr[] = $arel;
						    			}
					    			}
					    		}
			    			}
			    		}
			    	} else {

			    		if($ininsp['inspec']['callraise']['manual_flag'] == 1) {

	    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['manual_date']));
	    				} else {

	    					$callraisedsupp = date("d-m-Y", strtotime($ininsp['inspec']['callraise']['created_at']));
	    				}

	    				if($ininsp['inspec']['joint_inspection_flag'] == 1) {

	    					$disparr[$x]['material_readiness_date'] = 0;
	    					$disparr[$x]['inspec_call_site'] = 0;
	    					$disparr[$x]['call_received_supp'] = 0;
	    				} else {

	    					$disparr[$x]['material_readiness_date'] = $ininsp['inspec']['inspection_readiness_date'];
	    					$disparr[$x]['inspec_call_site'] = $callraisedsupp;
	    					$disparr[$x]['call_received_supp'] = $ininsp['inspec']['inspec_call_supplier_date'];
	    				}

			    		$disparr[$x]['po_no'] = $indipo['purchaseorder']['po_no'];
	    				$disparr[$x]['po_date'] = $indipo['purchaseorder']['po_date'];
	    				$disparr[$x]['quantity'] = $indipo['quantity'];
	    				$disparr[$x]['vendorname'] = $indipo['purchaseorder']['vendor']['name'];
	    				$disparr[$x]['matname'] = $matname;
	    				$disparr[$x]['uom'] = $indipo['storematerial']['matuom'][0]['stmatuom']['uom'];
	    				$disparr[$x]['inspection_memo_no'] = $ininsp['inspec']['inspection_ref_no'];
	    				$disparr[$x]['approved_call_date'] = $ininsp['inspec']['approved_inspec_date'];
	    				$disparr[$x]['inspection_report_date'] = $ininsp['inspec']['inspec_report_date'];
						$x++;
			    	}
		    	}
		    }

		return $disparr;
	}

	public function getpowithoutfabmap() {

		$projectid = Request::input("projectid");
		$fabmatid = 156;
		$podet = PurchaseOrder::where("project_id", "=", $projectid)->with(array("pomaterials"=>function($query) use ($fabmatid, $projectid){

			$query->where("material_id", "=", $fabmatid)->with("fabmat")->with("storematerial")->with(array("level1mat"=>function($qu) use ($projectid){

				$qu->whereHas("storematprojects", function($qq) use($projectid){

					$qq->where("project_id", "=", $projectid);
				})->with("storematerial")->with("msmat");
			}));
		}))->whereHas("pomaterials", function($q) use ($fabmatid){

			$q->where("material_id", "=", $fabmatid);
		})
		->get();
		$poarr = array();
		foreach ($podet as $inpodet) {
			
			foreach ($inpodet['pomaterials'] as $inpomat) {
				
				if(count($inpomat['fabmat']) == 0) {

					array_push($poarr, $inpodet);
				}
			}
		}
		return $poarr;

	}

	public function savefabmat() {

		$podet = Request::input("podet");
		$actgrp = Request::input("actgrp");
		$pomatid = $podet['pomaterials'][0]['id'];

		foreach ($actgrp as $indiact) {

			foreach ($indiact['material'] as $indimat) {
				
				foreach ($indimat['submaterial'] as $indisub) {
					if(isset($indisub['selected'])) {
						if(isset($indisub['storelevel1mat']['thisqty'])) {
							$storematid = $indisub['storelevel1mat']['store_material_id'];
							$level1matid = $indisub['storelevel1mat']['id'];
							$thisqty = $indisub['storelevel1mat']['thisqty'];
							$checkmat = PoFabricationMaterial::where("purchase_order_material_id", "=", $pomatid)->where("store_material_id", "=", $storematid)->where("store_material_level1_id", "=", $level1matid)->first();
							if(!$checkmat) {

								$singlecheckmat = array(
										"purchase_order_material_id"=>$pomatid,
										"store_material_id"=>$storematid,
										"store_material_level1_id"=>$level1matid,
										"qty"=>$thisqty
									);
								PoFabricationMaterial::create($singlecheckmat);
							}
						}
					}
				}
			}

		}			

		return 1;
	}

	public function updateindent() {

		$projectid = 5;
		$totindentqtyarr = array();
		
		$podet = PurchaseOrderMaterial::whereHas('purchaseorder', function($query) use ($projectid)
			{
			    $query->where('project_id', '=', $projectid);
			})->with("storematerial.matuom.stmatuom")
			->whereHas('storematerial', function($q) {

				$q->where("category_id", "!=", 46)->where("category_id", "=", 36);
			})
			->get();
		
		foreach ($podet as $inpodet) {

			$posum = PurchaseOrderMaterial::where("material_id", "=", $inpodet['material_id'])->whereHas('purchaseorder', function($query) use ($projectid)
			{
			    $query->where('project_id', '=', $projectid);
			})->sum("quantity");

			$indiindent = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $inpodet['material_id'])->with('mat')->first();

			if($indiindent) {
						
				$indiindent->total_indent_qty = $posum;
				$indiindent->total_po_qty = $posum;
				$indiindent->save();

			} else {

				Indenttotal::create(array("project_id"=>$projectid, "material_id"=>$inpodet['material_id'], "total_indent_qty"=>$posum, "total_po_qty"=>$posum));
			}

		}
		return 1;
	}

	public function get_fab_indent_mats() {

		$projectid = Request::input("projectid");
		$matid = Request::input("matid");

		$indentlatest = IndentMaterial::where("material_id", "=", $matid)->
		whereHas('indent', function($query) use ($projectid)
		{
		    $query->where('project_id', '=', $projectid)->where("status", "=", 1);
		})
		->with(array("subschprojindent"=>function($que) use ($matid) {

			$que->where("material_id", "=", $matid)->with(array("subschprojqty.subschedulemat"=>function($que2) use ($matid) {

				$que2->where("material_id", "=", $matid)->with("subschmatactgrp.actgrp.material.submaterial.storelevel1mat.storematerial.matuom.stmatuom")->with("subschmatactgrp.actgrp.material.submaterial.storelevel1mat.msmat");
			}));
		}))
		->orderBy("created_at", "desc")->first();

		$fabmatarr = array();
		$fabmatcheck = array();

		foreach ($indentlatest->subschprojindent as $indilatest) {
			
			foreach ($indilatest['subschprojqty']['subschedulemat'] as $indismat) {
				
				foreach ($indismat['subschmatactgrp'] as $indisubactgrp) {
					
					foreach ($indisubactgrp['actgrp']['material'] as $indiactmat) {
						
						foreach ($indiactmat['submaterial'] as $indisubm) {
							if(!in_array($indisubm['material_level1_id'], $fabmatcheck)) {
								array_push($fabmatarr, $indisubm);
								$fabmatcheck[] = $indisubm['material_level1_id'];
							}
							
						}
					}
				}
			}
		}

		return $fabmatarr;

	}

	public function savecsremarks() {

		$csrefid = Request::input("csrefid");
		$csremarks = Request::input("csremarks");
		CsRef::where("id", "=", $csrefid)->update(array("remarks"=>$csremarks));
		return 1;

	}

	public function raisecloseporequest() {

		$poid = Request::input("poid");
		$pomateriallistnew = Request::input("pomateriallistnew");
		$remarks = Request::input("remarks");
		$taxdetails = Request::input("taxdetails");

		foreach ($pomateriallistnew as $pomatnew) {
			
			if($pomatnew['type'] == 3) {
				if(isset($pomatnew['requested_closing_qty'])) {
					// if($pomatnew['requested_closing_qty'] != 0) {
						$closingqty = $pomatnew['requested_closing_qty'];
						$pomatdet = PurchaseOrderMaterial::where("id", "=", $pomatnew['id'])->update(array("requested_closing_qty"=>$closingqty));
					// }
				}
			} else {

				foreach ($pomatnew['materials'] as $inpomat) {
					if(isset($inpomat['requested_closing_qty'])) {
						// if($inpomat['requested_closing_qty'] != 0) {
							$inclosingqty = $inpomat['requested_closing_qty'];
							PurchaseOrderMaterial::where("id", "=", $inpomat['id'])->update(array("requested_closing_qty"=>$inclosingqty));
						// }
					}
				}
			}
		}

		foreach ($taxdetails as $intax) {
			if($intax['lumpsum'] == 1) {
				PurchaseTaxes::where("id", "=", $intax['id'])->update(array("lumpsum_requested_value"=>$intax['taxamount']));
			}
		}
		$tkn=Request::header('JWT-AuthToken');

		$user = Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$userid = $user['users']['id'];

		PurchaseOrder::where("id", "=", $poid)->update(array("status"=>4, "po_closing_requested_by"=>$userid, "close_po_remarks"=>$remarks));
		return 1;
	}

	public function approvecloseporequest() {

		$status = Request::input("status");
		$poid = Request::input("poid");
		$remarks = Request::input("remarks");
		$taxdetails = Request::input("taxdetails");
		$pomateriallistnew = Request::input("pomateriallistnew");
		$totalvalueofgoods = Request::input("totalvalueofgoods");
		$toda = date("Y-m-d");
		if($status == 2) {

			PurchaseOrder::where("id", "=", $poid)->update(array("close_po_hod_remarks"=>$remarks, "status"=>1, "close_po_response_date"=>$toda));
		} else {

			foreach ($pomateriallistnew as $inpomat) {
				
				if($inpomat['type'] == 3) {
					if(isset($inpomat['requested_closing_qty']) && $inpomat['requested_closing_qty'] != "") {
						$pomdetfab = PurchaseOrderMaterial::where("id", "=", $inpomat['id'])->first();
						if($pomdetfab) {
							$pomdetfab->original_qty = $pomdetfab->quantity;
							$pomdetfab->quantity = $inpomat['requested_closing_qty'];
							$pomdetfab->value_of_goods = $inpomat['valueofgoods'];
							$pomdetfab->save();
						}
					}
				} else {

					foreach ($inpomat['materials'] as $inmat) {
						if(isset($inmat['requested_closing_qty']) && $inmat['requested_closing_qty'] != "") {
							$pomdetn = PurchaseOrderMaterial::where("id", "=", $inmat['id'])->first();
							if($pomdetn) {
								$pomdetn->original_qty = $pomdetn->quantity;
								$pomdetn->quantity = $inmat['requested_closing_qty'];
								$pomdetn->value_of_goods = $inmat['valueofgoods'];
								$pomdetn->save();
							}
						}
					}
				}
			}

			foreach ($taxdetails as $intax) {
				
				PurchaseTaxes::where("id", "=", $intax['id'])->update(array("value"=>$intax['taxamount']));
			}
			$podet = PurchaseOrder::where("id", "=", $poid)->with("pomaterials")->first();
			$poqty = 0;
			foreach ($podet['pomaterials'] as $pom) {
				
				$poqty += $pom['quantity'];
			}
			if($podet) {

				$podet->close_po_hod_remarks = $remarks;
				$podet->total_cost = $totalvalueofgoods;
				$podet->total_qty = $poqty;
				$podet->close_po_response_date = $toda;
				$podet->status = 1;
				$podet->save();
			}
		}
		return 1;
	}


	public function testmail(sendMail $sendraw) {

		$tkn=Request::header('JWT-AuthToken');
		$from = Request::input("from");
		$to = Request::input("to");
		$subject = "test mail";
		$templatecontent = "test content";
		$docs = array();
		// $res = $sendraw->sendRawEmail($from, $to, "", $subject, $templatecontent, "");
			
		$res = $sendraw->sendEmail($to, $subject, $templatecontent);
		return $res;
	}

	public function getindentreportfab() {

		$projectid = Request::input("projectid");
		$totindentqtyarr = array();
		$podet = MaterialCategory::with(array("submaterials"=>function($query) use ($projectid){

			$query->where("type", "=", 3)->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
				})->orWhereHas("indenttotal", function($q2) use ($projectid) {
					$q2->where("project_id", "=", $projectid);
				})
				->with(array("purchaseordermat.purchaseorder"=>function($qin) use ($projectid){

					$qin->where("project_id", "=", $projectid);
				}))->with("matuom.stmatuom")->where("category_id", "!=", 46);
		}))->whereHas("submaterials",function($query) use ($projectid){

			$query->where("type", "=", 3)->whereHas("purchaseordermat.purchaseorder", function($q) use ($projectid) {
				$q->where("project_id", "=", $projectid);
			})->orWhereHas("indenttotal", function($q2) use ($projectid) {
				$q2->where("project_id", "=", $projectid);
			})->where("category_id", "!=", 46);
		})->whereHas("submaterials",function($query){
			$query->where("type", "=", 3);
		})->get();
		
		$i = 0;
		$j = 0;
		$count = 1;
		foreach ($podet as $inpodet) {

			$totindentqtyarr[$i]['name'] = $inpodet['name'];
			$totindentqtyarr[$i]['sub'] = array();
			foreach ($inpodet['submaterials'] as $inmat) {
				if($inmat['type'] == 3) {
					$posum = PurchaseOrderMaterial::where("material_id", "=", $inmat['id'])->whereHas('purchaseorder', function($query) use ($projectid)
					{
					    $query->where('project_id', '=', $projectid);
					})->sum("quantity");

					$totindentqtyarr[$i]['sub'][$j]['matname'] = $inmat['name'];
					$totindentqtyarr[$i]['sub'][$j]['purchased'] = $posum;
					$totindentqtyarr[$i]['sub'][$j]['uom'] = $inmat['matuom'][0]['stmatuom']['uom'];
					$indiindent = Indenttotal::where("project_id", "=", $projectid)->where("material_id", "=", $inmat['id'])->with('mat')->first();

					if($indiindent) {
						if($totindentqtyarr[$i]['sub'][$j]['uom'] == "NOS" || $totindentqtyarr[$i]['sub'][$j]['uom'] == "SET") {
							$totindentqtyarr[$i]['sub'][$j]['totalindent'] = ceil($indiindent['total_indent_qty']);
						} else {

							$totindentqtyarr[$i]['sub'][$j]['totalindent'] = $indiindent['total_indent_qty'];
						}

						$totindentqtyarr[$i]['sub'][$j]['tobepurchased'] = round($totindentqtyarr[$i]['sub'][$j]['totalindent']-$posum);
						
						$indentmat = IndentMaterial::where("material_id", "=", $inmat['id'])->
						whereHas('indent', function($query) use ($projectid)
						{
						    $query->where('project_id', '=', $projectid)->where("status", "=", 1);
						})->where("indent_qty", "NOT LIKE", "%-%")
						->orderBy("created_at", "desc")->first();
						if($indentmat) {
							$totindentqtyarr[$i]['sub'][$j]['latestindent'] = $indentmat->indent_qty;
						}
					} else {

						$totindentqtyarr[$i]['sub'][$j]['totalindent'] = 0;
								
						$totindentqtyarr[$i]['sub'][$j]['tobepurchased'] = -$posum;
						$totindentqtyarr[$i]['sub'][$j]['latestindent'] = 0;
					}
					$totindentqtyarr[$i]['sub'][$j]['count'] = $count;
					$totindentqtyarr[$i]['sub'][$j]['type'] = $inmat['type'];
					$thismatid = $inmat['id'];

					$indentdet = Indent::where("project_id", "=", $projectid)->where("status", "=", 1)->whereHas("indentmat", function($query) use ($thismatid){

						$query->where("material_id", "=", $thismatid);
					})->with(array("subschprojindent"=>function($inquery) use ($thismatid){

						$inquery->where("material_id", "=", $thismatid)->with(array("subschprojqty.subschedulemat"=>function($inq) use ($thismatid){
							$inq->where("material_id", "=", $thismatid)->with("subschmatactgrp.actgrp.material.submaterial");
						}))->with("subschprojqty.subschedule.schprojqty");
					}))->get();

					$actgrparr = array();
					$actmainarr = array();
					foreach ($indentdet as $ind) {
						$schcheckarr = array();
						$indid = $ind['id'];
						foreach ($ind['subschprojindent'] as $insubschpin) {

							if(!in_array($insubschpin['subschprojqty']['subschedule']['schedule_id'], $schcheckarr)) {
								$totindentqty = 0;
								foreach ($insubschpin['subschprojqty']['subschedule']['schprojqty'] as $inschprojq) {
									
									$schprojinddet = ScheduleProjectIndent::where("schedule_project_id", "=", $inschprojq['id'])->where("indent_id", "=", $indid)->first();
									$indentqty = $schprojinddet['indent_qty'];
									$totindentqty += $indentqty;
								}
								foreach ($insubschpin['subschprojqty']['subschedulemat'] as $insubschm) {
									
									foreach ($insubschm['subschmatactgrp'] as $insubactgrp) {

										if(!in_array($insubactgrp['activity_group_id'], $actgrparr)) {
											$actmainarr[$insubactgrp['activity_group_id']]['totindentqty'] = $totindentqty*$insubactgrp['qty'];
											$actgrparr[] = $insubactgrp['activity_group_id'];
										} else {

											$actmainarr[$insubactgrp['activity_group_id']]['totindentqty'] += $totindentqty*$insubactgrp['qty'];
										}
									}
								}

								$schcheckarr[] = $insubschpin['subschprojqty']['subschedule']['schedule_id'];
							}
						}
					}
					$fabmatarr = array();
					$submatcheck = array();
					$totalqty = 0;
					$totalwt = 0;
					$totpoqty = 0;
					foreach ($actmainarr as $actgrpid => $actgrpqty) {
						
						$actdet = ActivityGroup::where("id", "=", $actgrpid)->with("material.submaterial.storelevel1mat.storematerial.matuom.stmatuom")->first();
						foreach ($actdet['material'] as $actmat) {
							
							foreach ($actmat['submaterial'] as $insubacm) {
								$stmatid = $insubacm['storelevel1mat']['id'];
								$podett = PurchaseOrder::where("project_id", "=", $projectid)->whereHas("pomaterials.fabmat", function($que) use ($stmatid){
									$que->where("store_material_level1_id", "=", $stmatid);
								})->with(array("pomaterials.fabmat"=>function($q) use ($stmatid){

									$q->where("store_material_level1_id", "=", $stmatid);
								}))->get();

								if(!in_array($insubacm['storelevel1mat']['id'], $submatcheck)) {
									$thisfabqty= 0;
									foreach ($podett as $inpodet) {
										
										foreach ($inpodet['pomaterials'] as $inpomats) {
											
											foreach ($inpomats['fabmat'] as $infmat) {
												
												$thisfabqty += $infmat['qty'];
											}
										}
									}
									$totpoqty += $thisfabqty;
									$fabmatarr[$insubacm['storelevel1mat']['id']]['name'] = $insubacm['storelevel1mat']['storematerial']['name'];
									$fabmatarr[$insubacm['storelevel1mat']['id']]['erecode'] = $insubacm['storelevel1mat']['ere_code'];
									$fabmatarr[$insubacm['storelevel1mat']['id']]['qty'] = round(($insubacm['storelevel1mat']['qty_per_pole']*$actgrpqty['totindentqty']));

									$fabmatarr[$insubacm['storelevel1mat']['id']]['totpoqty'] = $thisfabqty;
									$fabmatarr[$insubacm['storelevel1mat']['id']]['totindentqty'] = round(($insubacm['storelevel1mat']['wt_per_pc']*$insubacm['storelevel1mat']['qty_per_pole']*$actgrpqty['totindentqty']/1000), 2);
									$totalqty += $fabmatarr[$insubacm['storelevel1mat']['id']]['qty'];
									$totalwt += $fabmatarr[$insubacm['storelevel1mat']['id']]['totindentqty'];
									$submatcheck[] = $insubacm['storelevel1mat']['id'];
								} 
								else {
									$fabmatarr[$insubacm['storelevel1mat']['id']]['qty'] += round(($insubacm['storelevel1mat']['qty_per_pole']*$actgrpqty['totindentqty']));
									$fabmatarr[$insubacm['storelevel1mat']['id']]['totindentqty'] += round(($insubacm['storelevel1mat']['wt_per_pc']*$insubacm['storelevel1mat']['qty_per_pole']*$actgrpqty['totindentqty']/1000), 2);
									$totalqty += $fabmatarr[$insubacm['storelevel1mat']['id']]['qty'];
									$totalwt += $fabmatarr[$insubacm['storelevel1mat']['id']]['totindentqty'];
								}
							}
						}
					}
					$totindentqtyarr[$i]['sub'][$j]['actgrp'] = $fabmatarr;
					$totindentqtyarr[$i]['sub'][$j]['indentnos'] = $totalqty;
					$totindentqtyarr[$i]['sub'][$j]['indentkgs'] = $totalwt;
					$totindentqtyarr[$i]['sub'][$j]['totpoqty'] = $totpoqty;
					$count++;
					$j++;
				}
			}
			$i++;
		}
		
		return $totindentqtyarr;
	}

	public function getindiinfo() {

		$indiid = Request::input("indiid");
		$intdi = InternalDI::where("id", "=", $indiid)->with('intdimat.matdes')->with('intdimat.intdipo.podets')->with('intdimat.intdipo.storename')->first();
		$matarr = array();
		$poarr = array();
		foreach($intdi->intdimat as $inmat) {

			if(!in_array($inmat['matdes']['id'], $matarr)) {

				$matarr[] = $inmat['matdes']['id'];
			}

			foreach ($inmat->intdipo as $inpo) {
				
				if(!in_array($inpo['podets']['id'], $poarr)) {

					$poarr[] = $inpo['podets']['id'];
				}
			}
		}
		$podetails = PurchaseOrder::whereIn("id", $poarr)->with(array('pomaterials'=>function($query) use ($matarr){
		        $query->whereIn('material_id',$matarr)->with('storematerial');
		    }))->with("taxes.taxmaterials")->with('csref.csrefdet.csquotations')->with('csref.csrefdet.csvendor')->with("project")->with("vendor")->get();
		foreach ($podetails as $indip) {
			foreach ($indip['pomaterials'] as $inpom) {
				foreach($intdi->intdimat as $inmat) {

					if($inmat['matdes']['id'] ==  $inpom['material_id']) {
						foreach ($inmat->intdipo as $inpo) {
							if($inpo['podets']['id'] ==  $indip['id']) {
								$inpom['currentpayqty'] = $inmat['quantity']-$inmat['total_payment_qty'];
								$inpom['pendingpayqty'] = $inmat['quantity']-$inmat['total_payment_qty'];
							}
						}
					}
				}
			}
		}
		$mainarr = array();
		array_push($mainarr, $podetails);
		array_push($mainarr, $poarr);
		return $mainarr;
	}

}
