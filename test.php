<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	      echo $hash = hash("sha256","planning123456ssepms");
$fp=fopen('RA -2.csv','r');
	$i=0;
	$partydata=array();
	while($data=fgetcsv($fp)){

			
		echo "<pre>";
		print_r(json_encode($data));
		echo "</pre>";
			
	}


	// echo "<pre>";
	// print_r($partydata);
	// echo "</pre>";
		
		// $resulttype = mysql_query("SELECT * FROM schedules ") or die(mysql_error());

		// while($rowt = mysql_fetch_array($resulttype)) {

		// 	$schid = $rowt['id'];

		// 	$thissum = 0;

		// 	$mainqty2 = mysql_query("SELECT * FROM schedule_project_qty WHERE schedule_id='$schid' ");
		// 	while($rowqty = mysql_fetch_array($mainqty2)) {

		// 		$thissum = $thissum+$rowqty['qty'];
		// 	}

			
		// 	//mysql_query("UPDATE schedules SET qty=$thissum WHERE id=$schid") or die(mysql_error());

		// }
			


	

?>