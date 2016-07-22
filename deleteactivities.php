<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	    $resulttype = mysql_query("SELECT * FROM schedules where project_id=3 AND name IN ('G', 'H', 'I', 'K', 'L', 'U', 'X', 'Z', 'AA', 'AB', 'AE', 'AK', 'AM', 'AP') ") or die(mysql_error());
		$list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
		// 	echo $schname = $rowt['name']; echo "<br>";

		// 	mysql_query("DELETE FROM schedule_project_qty WHERE schedule_id='$schid' ");
			
		// 	$subschquery = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id='$schid' ");
		// 	while($rowsubsch = mysql_fetch_array($subschquery)) {
		// 		$subschid = $rowsubsch['id'];
		// 		echo $subschname = $rowsubsch['no']; echo "<br>";
		// 		$subschprojq = mysql_query("DELETE FROM sub_schedule_project_qty WHERE sub_schedule_id='$subschid' ");
		// 		$subschprojq = mysql_query("DELETE FROM sub_schedule_materials WHERE sub_schedule_id='$subschid' ");

		// 	}
		// 	mysql_query("DELETE FROM sub_schedules WHERE schedule_id=$schid ") or die(mysql_error());

		// 	mysql_query("DELETE FROM schedules WHERE id=$schid ") or die(mysql_error());

		// }