<?php
/* This code will generate PDF file from the HTML file.
 You can also create a PDF file by providing the URL,get content by Curl or file_get_contents function and pass the content to
 WriteHTML function as used in below code.
 Hope this all will help,for more information/help mail to 
 
 scriptarticle(at)gmail(dot)com
 http://www.scriptarticle.com
*/
require("html2fpdf.php");
$pdf=new HTML2FPDF();
$pdf->AddPage();

//
// $postdata = file_get_contents("php://input");
// $request = json_decode($postdata);
// $payid = $request->payid;
// $htmlcontent = $request->htmlcontent;

$htmlcontent = '<div class="modal-body paymentcontent" style="display:inline-block">

	    		<div class="col-sm-12" style="width:800px;">
	    			
	    			<div class="col-sm-6" style="width:400px;float:left;text-align:center;">
	    				{{memono}}
	    			</div>

	    			<div class="col-sm-6" style="width:400px;float:left;text-align:center;">
	    				DATE: {{today}}
	    			</div>
				</div>
				<div class="col-sm-12">
	    			<table class="table table-bordered smallfont paymenttable" border="1" style="width:800px;">
		 				<thead>
		 					<tr class="innerhead">
		 						<th class="col-sm-6 text-center" style="width:400px;">FROM: {{userinfo["designation"]}}</th>
		 						<th class="col-sm-6 text-center" style="width:400px;">TO: AM (F&amp;A)</th>
		 					
		 					</tr>
		 					<tr class="innerhead">
		 						<th class="col-sm-6 text-center" style="width:400px;">DEPARTMENT   :  SCM</th>
		 						<th class="col-sm-6 text-center" style="width:400px;">DEPARTMENT : Finance</th>
		 					
		 					</tr>
		 				</thead>
		 				<tr>
							<td colspan="2" class="text-center"><strong>Through :  President (Projects)</strong></td>
		 				</tr>
		 				<tr>
							<td colspan="2"><strong>Sub:- Payment Request for {{uniqmat}}  thr" <span ng-show="payterms["payment_type"]=="LC"">{{payterms["lc_time_period"]}} days LC</span><span ng-show="payterms["payment_type"]=="BG"">{{payterms["bg_time_period"]}} days Bank Guarantee</span><span ng-show="payterms["payment_type"]=="PDC"">{{payterms["pdc_time_period"]}} days PDC</span><span ng-show="payterms["payment_type"]=="Direct payment"">Direct payment</span> to {{vendor.name}} -  {{project.name}} - Reg. </strong></td>
		 				</tr>
		 				<tr>
							<td colspan="2">
								



							</td>
		 				</tr>
		 			</table>

		 			<p>Dear Sir,</p>

					<p>With reference to aforementioned subject, we request you to arrange payment as per our payment terms i.e., <span ng-show="payterms["payment_type"]=="LC"">{{payterms["lc_time_period"]}} days LC</span><span ng-show="payterms["payment_type"]=="BG"">{{payterms["bg_time_period"]}} days Bank Guarantee</span><span ng-show="payterms["payment_type"]=="PDC"">{{payterms["pdc_time_period"]}} days PDC</span><span ng-show="payterms["payment_type"]=="Direct payment"">Direct payment</span> <span ng-show="payterms["payment_type"]=="LC""> <span ng-show="payterms["lc_interest_days_sse"] != "0"">({{payterms["lc_interest_days_sse"]}} Days Interest to SSEL @ {{payterms["lc_interest_percentage"]}}% PA & </span>{{payterms["lc_interest_days_vendor"]}} days to {{vendor.name}})</span> for amounting to Rs {{totalmatcost}} (Rupees Twenty Seven Lakh Fifty Eight Thousand Nine Hundred Seventy Two only) against PO No: <span ng-repeat="indipo in poinfo">{{indipo.pono}} dt: {{indipo.podate}} <span ng-show="poinfo.length > 1 && poinfo.length != ($index+1)"></span></span> for {{project.client}} ({{project.name}}).</p>

					<p>Thanks and Regards,</p>


					<p>{{userinfo.name}} </p>
					<p>{{userinfo.designation}}  </p>
					<div style="clear:both;"></div>

					<p><strong>Encl:</strong></p>
					<ol>
					<li>PO Acknowledgment</li>
					<li>Proforma Invoice</li>
					</ol>

	    		</div>
	        
	    	</div>';
echo $htmlcontent;
	    //	$htmlcontent = file_get_contents('x.html');
$pdf->WriteHTML($htmlcontent);
$pdf->Output("/var/www/html/api/public/uploads/payments/s.pdf");
echo "<a href='/api/public/uploads/payments/s.pdf'>file</a>";

?>