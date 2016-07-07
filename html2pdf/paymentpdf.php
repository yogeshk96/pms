<?php
/* This code will generate PDF file from the HTML file.
 You can also create a PDF file by providing the URL,get content by Curl or file_get_contents function and pass the content to
 WriteHTML function as used in below code.
 Hope this all will help,for more information/help mail to 
 
 scriptarticle(at)gmail(dot)com
 http://www.scriptarticle.com
*/
require('html2fpdf.php');
$pdf=new HTML2FPDF();
$pdf->AddPage();

//
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$payid = $request->payid;
$htmlcontent = $request->htmlcontent;

$pdf->WriteHTML($htmlcontent);
$pdf->Output("/var/www/html/api/public/uploads/payments/".$payid.".pdf");
echo "/api/public/uploads/payments/".$payid.".pdf";

?>