<?php
// $connection = mysql_connect("localhost","root","noobtard123")
// 	        or die("Could'nt  connect to server");
// $db = mysql_select_db("pms",$connection)
// 	        or die("Couldn't select database");
//     $projectid = 5;

// 	$schdet = mysql_query("SELECT * FROM schedules WHERE project_id=$projectid");
// 	while($rows = mysql_fetch_array($schdet)) {
// 		$schid = $rows['id'];
// 		$schpr = mysql_query("DELETE FROM schedule_project_qty WHERE schedule_id=$schid AND qty=0 ") or die(mysql_error());
// 		mysql_query("UPDATE schedule_project_qty SET sub_project_id=4 WHERE schedule_id=$schid AND qty>0 ") or die(mysql_error());
		
// 		$subsch = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id=$schid") or die(mysql_error());
// 		while($rowsub = mysql_fetch_array($subsch)) {

// 			echo $subid = $rowsub['id']; echo "<br>";
// 			mysql_query("DELETE FROM sub_schedule_project_qty WHERE sub_schedule_id=$subid AND qty=0 ") or die(mysql_error());
// 			mysql_query("UPDATE sub_schedule_project_qty SET sub_project_id=4 WHERE sub_schedule_id=$subid AND qty>0 ") or die(mysql_error());
// 		}
		
// 	}