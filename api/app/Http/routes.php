<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include "/var/www/html/Mail_Mime/Mail/mime.php";
include "/var/www/html/AWSSDKforPHP/sdk.class.php";


class sendMail { 
//This class is used by PD. Do not alter this for SSEL
	
	function sendEmail($to, $subject, $message)
	{
	    // $amazonSes = new AmazonSES(array(
	    //     'key' => 'AKIAJF22RPHLCLTKZT3A',
	    //     'secret' => '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'
	    // ));

	     $amazonSes = new AmazonSES(array(
	        'key' => 'AKIAJI3JMWEJP2RFMWNQ',
	        'secret' => '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'
	    ));
	  //$amazonSes->verify_email_address('dta.pdap@gmail.com');
	   $response = $amazonSes->send_email('narasimha@pixelvide.com',
	        array('ToAddresses' => array($to)),
	        array(
	            'Subject.Data' => $subject,
	            'Body.Html.Data' => $message,
	        )
	    );
	    if (!$response->isOK())
	    {
	        return $response->body->Error->Message;;
	    } else {

	    	return 1;
	    }

	}
}

class sendRawMail {
	
	function sendRawEmail($from, $to, $cc='',$subject, $messagecontent, $enqdocs)
	{
	    $mail_mime = new Mail_mime(array('eol' => "\n")); 
		$mail_mime->setHTMLBody($messagecontent); 
		for($d=0;$d<count($enqdocs);$d++) {

			$mail_mime->addAttachment("/var/www/html".$enqdocs[$d]['doc_url'], $enqdocs[$d]['mime_type']);
		}
		//Retrieve the complete message body in MIME format, along with the headers:

		$body = $mail_mime->get(); 

		$mailHeaders = array('From' => $from, 'Subject' => $subject,'To'=>$to);
		if($cc!=''){
			$mailHeaders['CC'] = $cc;
		}

		$headers = $mail_mime->txtHeaders($mailHeaders);
		//Assemble the message using the headers and the body:

		$message = $headers . "\r\n" . $body;
		//Send the message (which must be base 64 encoded):

		$ses = new AmazonSES(array(
	        'key' => 'AKIAJI3JMWEJP2RFMWNQ',
	        'secret' => '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'
	    ));
	    // $ses->verify_email_address('hanuman@ssel.in');
	    // $ses->verify_email_address('vydehi@ssel.in');
	    // $ses->verify_email_address('latha@ssel.in');
		// $r = $ses->send_raw_email(array('Data' => base64_encode($message)), array('Destinations' => $to));
		$r = $ses->send_raw_email(array('Data' => base64_encode($message)) );
		//Report on status:
		// return (string) $r->body->Error->Message;
		if ($r->isOK()) 
		{ 
			return 1;
		  //print("Mail sent; message id is " . (string) $r->body->SendRawEmailResult->MessageId . "\n"); 
		} 
		else 
		{ 
			return $r->body->Error->Message;
		  //print("Mail not sent; error is " . (string) $r->body->Error->Message . "\n"); 
		}

	}
}


include '/var/www/html/api/public/S3.php';
class uploadons3bucket
{

    function uploadOnS3($path, $bucket, $actual_image_name) {
        
        //instantiate the class
        $s3 = new S3('#', '#');

        $s3->putBucket($bucket, S3::ACL_PUBLIC_READ);

        if($s3->putObjectFile($path, $bucket , $actual_image_name, S3::ACL_PUBLIC_READ) )
        {
            $msg = "S3 Upload Successful."; 
            $s3file='http://'.$bucket.'.s3.amazonaws.com/'.$actual_image_name;

            //removing temp file from our server after uploading it to s3
            // unlink($path);

             $result = 1;

       }
       else{

             $msg = "S3 Upload Fail.";
             $result = null;
             $s3file = null;

       }

       return $s3file;

    }

    function deletefroms3($bucket, $path) {
        
        //instantiate the class
        $s3 = new S3('#', '#');

        if($s3->deleteObject($bucket, $path)){
        $out = 1;

        } else {

          $out = 0;
        }

      return $out;

    }
    
}


Route::get('/', function()
{
    return phpinfo();
});

Route::get('/hello', function()
{
    return 'Hello World Hello';
});

Route::get('/send_pd_mails', 'AdminController@send_generalmail');

Route::post('/login', 'LoginCtrl@login');

Route::get('/logout',['middleware'=>'auth','uses'=>'LoginCtrl@logout']);

Route::get('/update', 'AppCtrl@update');

Route::get('/sitedata','AppCtrl@sitedata');

// Route::get('/get_work_id_data','AppCtrl@get_work_id_data');

Route::get('/checkuser', 'LoginCtrl@checkuser');

Route::post('/uploading', ['middleware'=>'auth','uses'=>'LoginCtrl@uploading']);

Route::post('/uploadpodoc', ['middleware'=>'auth','uses'=>'LoginCtrl@uploadpodoc']);

Route::get('/getuserinfo', ['middleware'=>'auth','uses'=>'LoginCtrl@getuserinfo']);

Route::get('/get_user_profile', ['middleware'=>'auth','uses'=>'LoginCtrl@get_user_profile']);

Route::post('/edit_user_profile', ['middleware'=>'auth','uses'=>'LoginCtrl@edit_user_profile']);

Route::post('/change_password', ['middleware'=>'auth','uses'=>'LoginCtrl@change_password']);

Route::get('/getsidebar', ['middleware'=>'auth','uses'=>'LoginCtrl@getsidebar']);

Route::get('/getinventorydata', ['middleware'=>'auth','uses'=>'WarehouseController@getinventorydata']);

Route::get('/get_sub_contractors', ['middleware'=>'auth','uses'=>'WarehouseController@get_sub_contractors']);

Route::post('/accpt_matret', ['middleware'=>'auth','uses'=>'WarehouseController@accpt_matret']);

Route::get('/get_idis_data', ['middleware'=>'auth','uses'=>'WarehouseController@get_idis_data']);

Route::get('/get_user_roles', ['middleware'=>'auth','uses'=>'AdminController@get_user_roles']);

Route::post('/create_user', ['middleware'=>'auth','uses'=>'AdminController@create_user']);

Route::post('/create_project', ['middleware'=>'auth','uses'=>'AdminController@create_project']);

Route::get('/get_doc_types', ['middleware'=>'auth','uses'=>'AdminController@get_doc_types']);

Route::get('/get_project_heads', ['middleware'=>'auth','uses'=>'AdminController@get_project_heads']);

Route::get('/get_project_info', ['middleware'=>'auth','uses'=>'AdminController@get_project_info']);

Route::get('/get_boq_mats', ['middleware'=>'auth','uses'=>'AdminController@get_boq_mats']);

Route::post('/add_ss_feeder', ['middleware'=>'auth','uses'=>'AdminController@add_ss_feeder']);

Route::post('/add_sch', ['middleware'=>'auth','uses'=>'AdminController@add_sch']);

Route::get('/get_project_list', ['middleware'=>'auth','uses'=>'AdminController@get_project_list']);

Route::get('/get_project_managers_list', ['middleware'=>'auth','uses'=>'AdminController@get_project_managers_list']);

Route::get('/get_feeder_list', ['middleware'=>'auth','uses'=>'AdminController@get_feeder_list']);

Route::get('/get_workid_list', ['middleware'=>'auth','uses'=>'AdminController@get_workid_list']);

Route::post('/save_workids', ['middleware'=>'auth','uses'=>'AdminController@save_workids']);

Route::get('/get_material_types', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_types']);

Route::get('/get_material_subtypes', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_subtypes']);

Route::post('/put_vendor_info', ['middleware'=>'auth','uses'=>'PurchasesController@put_vendor_info']);

Route::post('/get_material_vendors', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_vendors']);

Route::post('/sendenquiry', ['middleware'=>'auth','uses'=>'PurchasesController@sendenquiry']);

Route::post('/resendenquiry', ['middleware'=>'auth','uses'=>'PurchasesController@resendenquiry']);

Route::get('/get_project_enquiry_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_project_enquiry_list']);

Route::get('/get_vendor_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_list']);

Route::post('/get_pos_inspections', ['middleware'=>'auth','uses'=>'PurchasesController@get_pos_inspections']);

Route::get('/get_project_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_project_list']);

Route::get('/get_vendor_code', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_code']);

Route::get('/get_material_uom', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_uom']);

Route::post('/raiseinspcall', ['middleware'=>'auth','uses'=>'PurchasesController@raiseinspcall']);

Route::post('/dispatchinfomailer', ['middleware'=>'auth','uses'=>'PurchasesController@dispatchinfomailer']);

Route::post('/savedi_data_final', ['middleware'=>'auth','uses'=>'PurchasesController@savedi_data_final']);

Route::post('/generatepo', ['middleware'=>'auth','uses'=>'PurchasesController@generatepo']);

Route::get('/get_work_id_data', ['middleware'=>'auth','uses'=>'AppCtrl@get_work_id_data']);

Route::get('/get_site_info', ['middleware'=>'auth','uses'=>'AppCtrl@get_site_info']);

Route::post('/add_material_types', ['middleware'=>'auth','uses'=>'WarehouseController@add_material_types']);

Route::post('/accept_warehouse_qtys', ['middleware'=>'auth','uses'=>'WarehouseController@accept_warehouse_qtys']);

Route::post('/add_material_subtypes', ['middleware'=>'auth','uses'=>'WarehouseController@add_material_subtypes']);

Route::post('/add_to_inventory', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory']);

Route::get('/get_po_info', ['middleware'=>'auth','uses'=>'WarehouseController@get_po_info']);

Route::get('/get_po_info_inspec', ['middleware'=>'auth','uses'=>'WarehouseController@get_po_info_inspec']);

Route::post('/add_to_inventory_company', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory_company']);

Route::post('/add_to_inventory_anotherstore', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory_anotherstore']);

Route::get('/search_dc_no', ['middleware'=>'auth','uses'=>'WarehouseController@search_dc_no']);

Route::post('/add_thirdparty', ['middleware'=>'auth','uses'=>'WarehouseController@add_thirdparty']);

Route::post('/issuematerial', ['middleware'=>'auth','uses'=>'WarehouseController@issuematerial']);

Route::post('/add_subcontractor', ['middleware'=>'auth','uses'=>'WarehouseController@add_subcontractor']);

Route::get('/get_third_parties', ['middleware'=>'auth','uses'=>'WarehouseController@get_third_parties']);

Route::get('/get_storelist', ['middleware'=>'auth','uses'=>'WarehouseController@get_storelist']);
//same function for all reports
Route::get('/get_storelist_all', ['middleware'=>'auth','uses'=>'WarehouseController@get_storelist_all']);


Route::get('/get_subcontractors', ['middleware'=>'auth','uses'=>'WarehouseController@get_subcontractors']);

Route::get('/get_storemats', ['middleware'=>'auth','uses'=>'WarehouseController@get_storemats']);

Route::get('/get_manager_feeders', ['middleware'=>'auth','uses'=>'WarehouseController@get_manager_feeders']);

Route::post('/add_materialreturn_to_inventory', ['middleware'=>'auth','uses'=>'WarehouseController@add_materialreturn_to_inventory']);

Route::get('/get_inhouse_vendor', ['middleware'=>'auth','uses'=>'WarehouseController@get_inhouse_vendor']);

Route::post('/add_inhousematerial_to_inventory', ['middleware'=>'auth','uses'=>'WarehouseController@add_inhousematerial_to_inventory']);

Route::post('/add_thirdpartymaterial_to_inventory', ['middleware'=>'auth','uses'=>'WarehouseController@add_thirdpartymaterial_to_inventory']);

Route::get('/getstoredata', ['middleware'=>'auth','uses'=>'WarehouseController@getstoredata']);

Route::post('/inventoryrevision', ['middleware'=>'auth','uses'=>'WarehouseController@inventoryrevision']);

Route::get('/get_all_store', ['middleware'=>'auth','uses'=>'WarehouseController@get_all_store']);

Route::get('/get_stock_inv__report', ['middleware'=>'auth','uses'=>'WarehouseController@get_stock_inv__report']);

Route::get('/get_stock_rev__report', ['middleware'=>'auth','uses'=>'WarehouseController@get_stock_rev__report']);

Route::post('/shiftphysicaltoquantity', ['middleware'=>'auth','uses'=>'WarehouseController@shiftphysicaltoquantity']);

Route::get('/get_vendor_polist', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_polist']);

Route::get('/get_vendor_polistdatewise', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_polistdatewise']);

Route::get('/get_vendor_polist_inspections', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_polist_inspections']);

Route::get('/get_datewise_polist', ['middleware'=>'auth','uses'=>'PurchasesController@get_datewise_polist']);

Route::post('/edit_materials', ['middleware'=>'auth','uses'=>'PurchasesController@edit_materials']);

Route::post('/delete_materials', ['middleware'=>'auth','uses'=>'PurchasesController@delete_materials']);

Route::post('/delete_vendor_materials', ['middleware'=>'auth','uses'=>'PurchasesController@delete_vendor_materials']);

Route::get('/get_uoms', ['middleware'=>'auth','uses'=>'WarehouseController@get_uoms']);

Route::get('/get_vendor_materials', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_materials']);

Route::post('/insert_po_docs', ['middleware'=>'auth','uses'=>'PurchasesController@insert_po_docs']);

Route::post('/delete_po_docs', ['middleware'=>'auth','uses'=>'PurchasesController@delete_po_docs']);

Route::get('/get_special_terms', ['middleware'=>'auth','uses'=>'PurchasesController@get_special_terms']);

Route::post('/insert_special_terms', ['middleware'=>'auth','uses'=>'PurchasesController@insert_special_terms']);

Route::post('/add_vendor_materials', ['middleware'=>'auth','uses'=>'PurchasesController@add_vendor_materials']);

Route::get('/get_vendor_info', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_info']);

Route::get('/get_pomain_info', ['middleware'=>'auth','uses'=>'PurchasesController@get_pomain_info']);

Route::post('/post_internal_di_manual', ['middleware'=>'auth','uses'=>'PurchasesController@post_internal_di_manual']);

Route::get('/get_pomateriallist', ['middleware'=>'auth','uses'=>'PurchasesController@get_pomateriallist']);

Route::get('/get_enquiry_details', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_details']);

Route::get('/get_enquiry_details_id', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_details_id']);

Route::get('/get_enquiry_details_id_enq', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_details_id_enq']);

Route::get('/get_enquiry_detailsreport', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_detailsreport']);

Route::post('/get_roadpermits_data', ['middleware'=>'auth','uses'=>'PurchasesController@get_roadpermits_data']);

Route::get('/get_stores_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_stores_list']);

Route::get('/get_site_areas_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_site_areas_list']);

Route::get('/get_enquiry_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_list']);

Route::get('/get_enquiry_list_datewise', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_list_datewise']);

Route::get('/get_enquiry_venmat', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_venmat']);

Route::post('/raise_road_permit', ['middleware'=>'auth','uses'=>'PurchasesController@raise_road_permit']);

Route::get('/get_potaxes', ['middleware'=>'auth','uses'=>'PurchasesController@get_potaxes']);

Route::get('/get_pospecialterms', ['middleware'=>'auth','uses'=>'PurchasesController@get_pospecialterms']);

Route::post('/del_dimat_totals', ['middleware'=>'auth','uses'=>'PurchasesController@del_dimat_totals']);

Route::post('/post_internal_di_mail', ['middleware'=>'auth','uses'=>'PurchasesController@post_internal_di_mail']);

Route::post('/savepo', ['middleware'=>'auth','uses'=>'PurchasesController@savepo']);

Route::post('/editpo', ['middleware'=>'auth','uses'=>'PurchasesController@editpo']);

Route::post('/save_quotations', ['middleware'=>'auth','uses'=>'PurchasesController@save_quotations']);

Route::post('/add_tax', ['middleware'=>'auth','uses'=>'AdminController@add_tax']);

Route::post('/edit_tax', ['middleware'=>'auth','uses'=>'AdminController@edit_tax']);

Route::get('/get_tax_list', ['middleware'=>'auth','uses'=>'AdminController@get_tax_list']);

Route::post('/add_uom', ['middleware'=>'auth','uses'=>'AdminController@add_uom']);

Route::post('/edit_uom', ['middleware'=>'auth','uses'=>'AdminController@edit_uom']);

Route::get('/get_uom_list', ['middleware'=>'auth','uses'=>'AdminController@get_uom_list']);

Route::post('/create_store', ['middleware'=>'auth','uses'=>'AdminController@create_store']);

Route::get('/get_store_managers', ['middleware'=>'auth','uses'=>'AdminController@get_store_managers']);

Route::post('/get_cs_details', ['middleware'=>'auth','uses'=>'PurchasesController@get_cs_details']);

Route::post('/get_vendor_inspection_ref', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_inspection_ref']);

Route::post('/get_cs_vendorcosts', ['middleware'=>'auth','uses'=>'PurchasesController@get_cs_vendorcosts']);

Route::post('/get_cs_taxes', ['middleware'=>'auth','uses'=>'PurchasesController@get_cs_taxes']);

Route::post('/save_inspection', ['middleware'=>'auth','uses'=>'PurchasesController@save_inspection']);

Route::get('/get_material_vend_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_vend_list']);

Route::get('/get_material_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_list']);

Route::post('/sendrawemail', ['middleware'=>'auth','uses'=>'PurchasesController@sendrawemail']);

Route::get('/get_dispatches_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_dispatches_list']);

Route::post('/create_new_insp_ref', ['middleware'=>'auth','uses'=>'PurchasesController@create_new_insp_ref']);

Route::post('/uploaddocs', ['middleware'=>'auth','uses'=>'LoginCtrl@uploaddocs']);

Route::post('/delete_docs', ['middleware'=>'auth','uses'=>'PurchasesController@delete_docs']);

Route::post('/saveinspection_details_total', ['middleware'=>'auth','uses'=>'PurchasesController@saveinspection_details_total']);

Route::get('/get_poslinked_toins', ['middleware'=>'auth','uses'=>'PurchasesController@get_poslinked_toins']);

Route::post('edit_pomat', ['middleware'=>'auth','uses'=>'PurchasesController@edit_pomat']);

Route::get('/check_inspection_ref', ['middleware'=>'auth','uses'=>'PurchasesController@check_inspection_ref']);

Route::post('/create_inspection_ref', ['middleware'=>'auth','uses'=>'PurchasesController@create_inspection_ref']);

Route::post('/save_didispatch', ['middleware'=>'auth','uses'=>'PurchasesController@save_didispatch']);

Route::get('/get_didispatch', ['middleware'=>'auth','uses'=>'PurchasesController@get_didispatch']);

Route::post('/removesysdocs', ['middleware'=>'auth','uses'=>'PurchasesController@removesysdocs']);

Route::get('/get_quotation_terms', ['middleware'=>'auth','uses'=>'PurchasesController@get_quotation_terms']);

Route::get('/get_quotation_default_terms', ['middleware'=>'auth','uses'=>'PurchasesController@get_quotation_default_terms']);

Route::post('/insert_quotation_default_terms', ['middleware'=>'auth','uses'=>'PurchasesController@insert_quotation_default_terms']);

Route::post('/get_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@get_gtp_drawing']);

Route::post('/insert_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@insert_gtp_drawing']);

Route::post('/insert_quotation_docs', ['middleware'=>'auth','uses'=>'PurchasesController@insert_quotation_docs']);

Route::post('/remove_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@remove_gtp_drawing']);

Route::post('/remove_quotation_docs', ['middleware'=>'auth','uses'=>'PurchasesController@remove_quotation_docs']);

Route::post('/raiseinspcallmanual', ['middleware'=>'auth','uses'=>'PurchasesController@raiseinspcallmanual']);

Route::post('/raisedispcallmanual', ['middleware'=>'auth','uses'=>'PurchasesController@raisedispcallmanual']);

Route::post('/raisedicall', ['middleware'=>'auth','uses'=>'PurchasesController@raisedicall']);

Route::post('/edit_user', ['middleware'=>'auth','uses'=>'AdminController@edit_user']);

Route::post('/create_office', ['middleware'=>'auth','uses'=>'AdminController@create_office']);

Route::get('/get_offices', ['middleware'=>'auth','uses'=>'AdminController@get_offices']);

Route::get('/get_user_list', ['middleware'=>'auth','uses'=>'AdminController@get_user_list']);

Route::post('/create_survey_items', ['middleware'=>'auth','uses'=>'AdminController@create_survey_items']);

Route::get('/get_project_schedules', ['middleware'=>'auth','uses'=>'AdminController@get_project_schedules']);

Route::get('/get_po_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_po_list']);

Route::get('/get_po_total_report', ['middleware'=>'auth','uses'=>'PurchasesController@get_po_total_report']);

Route::get('/get_vendor_total_report', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_total_report']);

Route::get('/get_boq_file_data', ['middleware'=>'auth','uses'=>'AdminController@get_boq_file_data']);

Route::get('/get_boq_edit_data', ['middleware'=>'auth','uses'=>'AdminController@get_boq_edit_data']);

Route::post('/add_activity_to_project', ['middleware'=>'auth','uses'=>'AdminController@add_activity_to_project']);

Route::post('/custom_activity_to_project', ['middleware'=>'auth','uses'=>'AdminController@custom_activity_to_project']);

Route::post('/edit_activity_to_project', ['middleware'=>'auth','uses'=>'AdminController@edit_activity_to_project']);

Route::get('/get_activity_mat_data', ['middleware'=>'auth','uses'=>'AdminController@get_activity_mat_data']);

Route::post('/add_aggregator', ['middleware'=>'auth','uses'=>'WarehouseController@add_aggregator']);

Route::post('/add_fabrication', ['middleware'=>'auth','uses'=>'WarehouseController@add_fabrication']);

Route::get('/get_aggregate_materials', ['middleware'=>'auth','uses'=>'WarehouseController@get_aggregate_materials']);

Route::get('/get_fabrication_materials', ['middleware'=>'auth','uses'=>'WarehouseController@get_fabrication_materials']);

Route::post('/save_budget_rate', ['middleware'=>'auth','uses'=>'AdminController@save_budget_rate']);

Route::get('/get_sub_projects', ['middleware'=>'auth','uses'=>'AdminController@get_sub_projects']);

Route::get('/get_boq_mat_data', ['middleware'=>'auth','uses'=>'AdminController@get_boq_mat_data']);

Route::post('/insert_indent', ['middleware'=>'auth','uses'=>'AdminController@insert_indent']);

Route::get('/copyactivity', ['middleware'=>'auth','uses'=>'AdminController@copyactivity']);

Route::post('/calculateactivityvar', ['middleware'=>'auth','uses'=>'AdminController@calculateactivityvar']);

Route::post('/generatesmapleboq', ['middleware'=>'auth','uses'=>'AdminController@generatesmapleboq']);

Route::post('/generate_cs_ref', ['middleware'=>'auth','uses'=>'PurchasesController@generate_cs_ref']);

Route::get('/get_enquiry_ref_details', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_ref_details']);

Route::post('/get_pomat_details', ['middleware'=>'auth','uses'=>'PurchasesController@get_pomat_details']);

Route::post('/save_payments', ['middleware'=>'auth','uses'=>'PurchasesController@save_payments']);

Route::post('/submit_payments', ['middleware'=>'auth','uses'=>'PurchasesController@submit_payments']);

Route::get('/get_poamdlist', ['middleware'=>'auth','uses'=>'PurchasesController@get_poamdlist']);

Route::get('/get_ms_materials', ['middleware'=>'auth','uses'=>'WarehouseController@get_ms_materials']);

Route::post('/add_ms_material', ['middleware'=>'auth','uses'=>'WarehouseController@add_ms_material']);

Route::post('/create_workorder', ['middleware'=>'auth','uses'=>'AdminController@create_workorder']);

Route::get('/get_workorders', ['middleware'=>'auth','uses'=>'AdminController@get_workorders']);

Route::get('/get_workorder_data', ['middleware'=>'auth','uses'=>'AdminController@get_workorder_data']);

Route::post('/get_workorder_details', ['middleware'=>'auth','uses'=>'AdminController@get_workorder_details']);

Route::get('/get_workorders_withmats', ['middleware'=>'auth','uses'=>'AdminController@get_workorders_withmats']);

Route::post('/save_work_boq', ['middleware'=>'auth','uses'=>'AdminController@save_work_boq']);

Route::post('/save_work_indent', ['middleware'=>'auth','uses'=>'AdminController@save_work_indent']);

Route::get('/get_workorder_indents', ['middleware'=>'auth','uses'=>'AdminController@get_workorder_indents']);

Route::get('/get_workorder_indent_details', ['middleware'=>'auth','uses'=>'AdminController@get_workorder_indent_details']);

Route::post('/get_recon_data', 'WarehouseController@get_recon_data');

Route::post('/get_recon_data_indi', 'WarehouseController@get_recon_data_indi');

Route::post('/get_issue_rpt', 'WarehouseController@get_issue_rpt');

Route::post('/get_receipt_rpt', 'WarehouseController@get_receipt_rpt');

Route::get('/get_store_list_all',['middleware'=>'auth','uses'=>'WarehouseController@get_store_list_all']);

Route::post('/get_issue_report_store',['middleware'=>'auth','uses'=>'WarehouseController@get_issue_report_store']);

Route::post('/get_receipt_report_store',['middleware'=>'auth','uses'=>'WarehouseController@get_receipt_report_store']);

Route::post('/get_recon_report_store',['middleware'=>'auth','uses'=>'WarehouseController@get_recon_report_store']);

Route::post('/get_recon_report_indi',['middleware'=>'auth','uses'=>'WarehouseController@get_recon_report_indi']);

Route::get('/getinventorydata_store', ['middleware'=>'auth','uses'=>'WarehouseController@getinventorydata_store']);

Route::get('/get_all_mats', ['middleware'=>'auth','uses'=>'WarehouseController@get_all_mats']);

Route::get('/get_mat_store_data', ['middleware'=>'auth','uses'=>'WarehouseController@get_mat_store_data']);

Route::get('/get_vendor_pending_polist', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_pending_polist']);

Route::post('/changepostatus', ['middleware'=>'auth','uses'=>'PurchasesController@changepostatus']);

Route::post('/approverejcs', ['middleware'=>'auth','uses'=>'PurchasesController@approverejcs']);

Route::post('/get_activity_edit_data', ['middleware'=>'auth','uses'=>'AdminController@get_activity_edit_data']);

Route::post('/saveactivitymat', ['middleware'=>'auth','uses'=>'AdminController@saveactivitymat']);

Route::post('/saveindent', ['middleware'=>'auth','uses'=>'AdminController@saveindent']);

Route::get('/get_project_cs', ['middleware'=>'auth','uses'=>'PurchasesController@get_project_cs']);

Route::get('/get_vendor_approved_polist', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_approved_polist']);

Route::get('/generate_supply_rate_file', ['middleware'=>'auth','uses'=>'PurchasesController@generate_supply_rate_file']);

Route::get('/update_supply_file_data', ['middleware'=>'auth','uses'=>'PurchasesController@update_supply_file_data']);

Route::post('/savesupplyrate', ['middleware'=>'auth','uses'=>'PurchasesController@savesupplyrate']);

Route::post('/getmatreportdata', ['middleware'=>'auth','uses'=>'PurchasesController@getmatreportdata']);

Route::post('/edit_subschedule_mat', ['middleware'=>'auth','uses'=>'AdminController@edit_subschedule_mat']);

Route::post('/get_indent_file_data', ['middleware'=>'auth','uses'=>'AdminController@get_indent_file_data']);

Route::post('/calculateactivityvarall', ['middleware'=>'auth','uses'=>'AdminController@calculateactivityvarall']);

Route::post('/getsubprojboq', ['middleware'=>'auth','uses'=>'AdminController@getsubprojboq']);

Route::get('/get_aggregator_mat', ['middleware'=>'auth','uses'=>'WarehouseController@get_aggregator_mat']);

Route::get('/get_mat_wise_po', ['middleware'=>'auth','uses'=>'PurchasesController@get_mat_wise_po']);

Route::get('/getpowithoutfreight', ['middleware'=>'auth','uses'=>'PurchasesController@getpowithoutfreight']);

Route::post('/saveunitfreight', ['middleware'=>'auth','uses'=>'PurchasesController@saveunitfreight']);

Route::get('/getmattrackreport', ['middleware'=>'auth','uses'=>'PurchasesController@getmattrackreport']);

Route::get('/getindentreport', ['middleware'=>'auth','uses'=>'PurchasesController@getindentreport']);

Route::get('/getindentdet', ['middleware'=>'auth','uses'=>'PurchasesController@getindentdet']);

Route::get('/getpendingindentdet', ['middleware'=>'auth','uses'=>'PurchasesController@getpendingindentdet']);

Route::post('/approveindent', ['middleware'=>'auth','uses'=>'AdminController@approveindent']);

Route::post('/rejectindent', ['middleware'=>'auth','uses'=>'AdminController@rejectindent']);

Route::post('/saveactivitygroup', ['middleware'=>'auth','uses'=>'AdminController@saveactivitygroup']);

Route::get('/get_activity_group_list', ['middleware'=>'auth','uses'=>'AdminController@get_activity_group_list']);

Route::get('/get_activity_group_list_unique', ['middleware'=>'auth','uses'=>'AdminController@get_activity_group_list_unique']);

Route::get('/get_material_activities', ['middleware'=>'auth','uses'=>'BillingController@get_material_activities']);

Route::get('/get_billing_taxes', ['middleware'=>'auth','uses'=>'BillingController@get_billing_taxes']);

Route::get('/get_companydetails', ['middleware'=>'auth','uses'=>'BillingController@get_companydetails']);

Route::get('/getindiinfo', ['middleware'=>'auth','uses'=>'PurchasesController@getindiinfo']);

Route::post('/addstocks', ['middleware'=>'auth','uses'=>'WarehouseController@addstocks']);

Route::post('/addfabstocks', ['middleware'=>'auth','uses'=>'WarehouseController@addfabstocks']);

Route::post('/calculateactivityvarqty', ['middleware'=>'auth','uses'=>'AdminController@calculateactivityvarqty']);

Route::post('/post_maninternal_di_manual', ['middleware'=>'auth','uses'=>'PurchasesController@post_maninternal_di_manual']);

Route::post('/post_maninternal_di_mail', ['middleware'=>'auth','uses'=>'PurchasesController@post_maninternal_di_mail']);

Route::get('/get_pos_vend_link_data', ['middleware'=>'auth','uses'=>'PurchasesController@get_pos_vend_link_data']);

Route::post('/update_idi_items', ['middleware'=>'auth','uses'=>'PurchasesController@update_idi_items']);

Route::get('/get_store_project', ['middleware'=>'auth','uses'=>'PurchasesController@get_store_project']);

Route::get('/getfabmattype', ['middleware'=>'auth','uses'=>'PurchasesController@getfabmattype']);

Route::get('/generateinsdistatusreport', ['middleware'=>'auth','uses'=>'PurchasesController@generateinsdistatusreport']);

Route::get('/getmatindentinfo', ['middleware'=>'auth','uses'=>'AdminController@getmatindentinfo']);

Route::get('/getpowithoutfabmap', ['middleware'=>'auth','uses'=>'PurchasesController@getpowithoutfabmap']);

Route::post('/savefabmat', ['middleware'=>'auth','uses'=>'PurchasesController@savefabmat']);

Route::get('/updateindent', ['middleware'=>'auth','uses'=>'PurchasesController@updateindent']);

Route::get('/gettobepurchasedindentreport', ['middleware'=>'auth','uses'=>'PurchasesController@gettobepurchasedindentreport']);

Route::get('/copyactmaterial', ['middleware'=>'auth','uses'=>'AdminController@copyactmaterial']);

Route::get('/get_fab_indent_mats', ['middleware'=>'auth','uses'=>'PurchasesController@get_fab_indent_mats']);

Route::post('/savecsremarks', ['middleware'=>'auth','uses'=>'PurchasesController@savecsremarks']);

Route::get('/get_material_indent', ['middleware'=>'auth','uses'=>'AdminController@get_material_indent']);

Route::post('/savenonbillindent', ['middleware'=>'auth','uses'=>'AdminController@savenonbillindent']);

Route::post('/raisecloseporequest', ['middleware'=>'auth','uses'=>'PurchasesController@raisecloseporequest']);

Route::get('/get_vendor_closerequested_polist', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_closerequested_polist']);

Route::post('/approvecloseporequest', ['middleware'=>'auth','uses'=>'PurchasesController@approvecloseporequest']);

Route::get('/testmail', ['middleware'=>'auth','uses'=>'PurchasesController@testmail']);

Route::get('/getindentreportfab', ['middleware'=>'auth','uses'=>'PurchasesController@getindentreportfab']);