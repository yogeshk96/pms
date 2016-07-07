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
	
	function sendEmail($to, $subject, $message)
	{
	    $amazonSes = new AmazonSES(array(
	        'key' => 'AKIAJF22RPHLCLTKZT3A',
	        'secret' => '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'
	    ));
	  //$amazonSes->verify_email_address('dta.pdap@gmail.com');
	   $response = $amazonSes->send_email('dta.pdap@gmail.com',
	        array('ToAddresses' => array($to)),
	        array(
	            'Subject.Data' => $subject,
	            'Body.Html.Data' => $message,
	        )
	    );
	    if (!$response->isOK())
	    {
	        return 0;
	    } else {

	    	return 1;
	    }

	}
}

class sendRawMail {
	
	function sendRawEmail($to, $subject, $messagecontent, $enqdocs)
	{
	    $mail_mime = new Mail_mime(array('eol' => "\n")); 
		$mail_mime->setHTMLBody($messagecontent); 
		for($d=0;$d<count($enqdocs);$d++) {

			$mail_mime->addAttachment("/var/www/html".$enqdocs[$d]['doc_url'], $enqdocs[$d]['doc_type']);
		}
		//Retrieve the complete message body in MIME format, along with the headers:

		$body = $mail_mime->get(); 
		$headers = $mail_mime->txtHeaders(array('From' => 'yogeshk96@gmail.com', 'Subject' => $subject,'To'=>$to));
		//Assemble the message using the headers and the body:

		$message = $headers . "\r\n" . $body;
		//Send the message (which must be base 64 encoded):

		$ses = new AmazonSES(array(
	        'key' => 'AKIAJF22RPHLCLTKZT3A',
	        'secret' => '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'
	    ));
		$r = $ses->send_raw_email(array('Data' => base64_encode($message)), array('Destinations' => $to));
		//Report on status:

		if ($r->isOK()) 
		{ 
			return 1;
		  //print("Mail sent; message id is " . (string) $r->body->SendRawEmailResult->MessageId . "\n"); 
		} 
		else 
		{ 
			return 0;
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

Route::post('/send_pd_mails', 'AdminController@send_generalmail');

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

Route::get('/get_material_vendors', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_vendors']);

Route::post('/sendenquiry', ['middleware'=>'auth','uses'=>'PurchasesController@sendenquiry']);

Route::get('/get_vendor_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_list']);

Route::get('/get_project_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_project_list']);

Route::get('/get_vendor_code', ['middleware'=>'auth','uses'=>'PurchasesController@get_vendor_code']);

Route::get('/get_material_uom', ['middleware'=>'auth','uses'=>'PurchasesController@get_material_uom']);

Route::post('/raiseinspcall', ['middleware'=>'auth','uses'=>'PurchasesController@raiseinspcall']);

Route::post('/generatepo', ['middleware'=>'auth','uses'=>'PurchasesController@generatepo']);

Route::get('/get_work_id_data', ['middleware'=>'auth','uses'=>'AppCtrl@get_work_id_data']);

Route::get('/get_site_info', ['middleware'=>'auth','uses'=>'AppCtrl@get_site_info']);

Route::post('/add_material_types', ['middleware'=>'auth','uses'=>'WarehouseController@add_material_types']);

Route::post('/add_material_subtypes', ['middleware'=>'auth','uses'=>'WarehouseController@add_material_subtypes']);

Route::post('/add_to_inventory', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory']);

Route::get('/get_po_info', ['middleware'=>'auth','uses'=>'WarehouseController@get_po_info']);

Route::get('/get_po_info_inspec', ['middleware'=>'auth','uses'=>'WarehouseController@get_po_info_inspec']);

Route::post('/add_to_inventory_company', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory_company']);

Route::post('/add_to_inventory_anotherstore', ['middleware'=>'auth','uses'=>'WarehouseController@add_to_inventory_anotherstore']);

Route::get('/search_dc_no', ['middleware'=>'auth','uses'=>'WarehouseController@search_dc_no']);

Route::post('/add_thirdparty', ['middleware'=>'auth','uses'=>'WarehouseController@add_thirdparty']);

Route::get('/get_third_parties', ['middleware'=>'auth','uses'=>'WarehouseController@get_third_parties']);

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

Route::get('/get_pomateriallist', ['middleware'=>'auth','uses'=>'PurchasesController@get_pomateriallist']);

Route::get('/get_enquiry_details', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_details']);

Route::get('/get_enquiry_detailsreport', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_detailsreport']);

Route::get('/get_enquiry_list', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_list']);

Route::get('/get_enquiry_list_datewise', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_list_datewise']);

Route::get('/get_enquiry_venmat', ['middleware'=>'auth','uses'=>'PurchasesController@get_enquiry_venmat']);

Route::get('/get_potaxes', ['middleware'=>'auth','uses'=>'PurchasesController@get_potaxes']);

Route::get('/get_pospecialterms', ['middleware'=>'auth','uses'=>'PurchasesController@get_pospecialterms']);

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

Route::post('/get_cs_vendorcosts', ['middleware'=>'auth','uses'=>'PurchasesController@get_cs_vendorcosts']);

Route::post('/get_cs_taxes', ['middleware'=>'auth','uses'=>'PurchasesController@get_cs_taxes']);

Route::post('/save_inspection', ['middleware'=>'auth','uses'=>'PurchasesController@save_inspection']);

Route::post('/sendrawemail', ['middleware'=>'auth','uses'=>'PurchasesController@sendrawemail']);

Route::post('/uploaddocs', ['middleware'=>'auth','uses'=>'LoginCtrl@uploaddocs']);

Route::post('/delete_docs', ['middleware'=>'auth','uses'=>'PurchasesController@delete_docs']);

Route::post('edit_pomat', ['middleware'=>'auth','uses'=>'PurchasesController@edit_pomat']);

Route::get('/check_inspection_ref', ['middleware'=>'auth','uses'=>'PurchasesController@check_inspection_ref']);

Route::post('/create_inspection_ref', ['middleware'=>'auth','uses'=>'PurchasesController@create_inspection_ref']);

Route::post('/save_didispatch', ['middleware'=>'auth','uses'=>'PurchasesController@save_didispatch']);

Route::post('/removesysdocs', ['middleware'=>'auth','uses'=>'PurchasesController@removesysdocs']);

Route::get('/get_quotation_terms', ['middleware'=>'auth','uses'=>'PurchasesController@get_quotation_terms']);

Route::get('/get_quotation_default_terms', ['middleware'=>'auth','uses'=>'PurchasesController@get_quotation_default_terms']);

Route::post('/insert_quotation_default_terms', ['middleware'=>'auth','uses'=>'PurchasesController@insert_quotation_default_terms']);

Route::get('/get_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@get_gtp_drawing']);

Route::post('/insert_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@insert_gtp_drawing']);

Route::post('/remove_gtp_drawing', ['middleware'=>'auth','uses'=>'PurchasesController@remove_gtp_drawing']);

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

Route::post('/add_activity_to_project', ['middleware'=>'auth','uses'=>'AdminController@add_activity_to_project']);

Route::get('/get_activity_mat_data', ['middleware'=>'auth','uses'=>'AdminController@get_activity_mat_data']);

Route::post('/add_aggregator', ['middleware'=>'auth','uses'=>'WarehouseController@add_aggregator']);

Route::get('/get_aggregate_materials', ['middleware'=>'auth','uses'=>'WarehouseController@get_aggregate_materials']);
