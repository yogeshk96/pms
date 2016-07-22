<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

 //    $resulttype = mysql_query("SELECT * FROM indent where project_id IN (2,4) ") or die(mysql_error());
	// $list = array();
	// while($rowt = mysql_fetch_array($resulttype)) {
	// 	$projectid = $rowt['project_id'];
	// 	$indentid = $rowt['id'];
	// 	mysql_query("DELETE FROM indent_materials WHERE indent_id=$indentid ")  or die(mysql_error());
	// 	mysql_query("DELETE FROM schedule_indents WHERE indent_id=$indentid ")  or die(mysql_error());
	// 	mysql_query("DELETE FROM schedule_project_indent WHERE indent_id=$indentid ")  or die(mysql_error());
	// 	mysql_query("DELETE FROM sub_schedule_indents WHERE indent_id=$indentid ")  or die(mysql_error());
	// 	mysql_query("DELETE FROM sub_schedule_project_indent WHERE indent_id=$indentid ")  or die(mysql_error());

	// 	$schdet = mysql_query("SELECT * FROM schedules WHERE project_id=$projectid") or die(mysql_error());;
	// 	while($rows = mysql_fetch_array($schdet)) {
	// 		$schid = $rows['id'];
	// 		mysql_query("UPDATE schedule_project_qty SET total_indent_qty=0 WHERE schedule_id=$schid ") or die(mysql_error());
	// 		$schpr = mysql_query("SELECT * FROM schedule_project_qty WHERE schedule_id=$schid ") or die(mysql_error());
	// 		while($rowss = mysql_fetch_array($schpr)) {

	// 			$scprid = $rowss['id'];
	// 			mysql_query("DELETE FROM schedule_project_indent WHERE schedule_project_id=$scprid") or die(mysql_error());
	// 		}
	// 		$schsdet = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id=$schid") or die(mysql_error());
	// 		while($rowss = mysql_fetch_array($schsdet)) {
	// 			$subschid = $rowss['id'];
	// 			mysql_query("UPDATE sub_schedule_project_qty SET total_indent_qty=0 WHERE sub_schedule_id=$subschid ") or die(mysql_error());
	// 			$subschprin = mysql_query("SELECT * FROM sub_schedule_project_qty WHERE sub_schedule_id=$subschid ") or die(mysql_error());
	// 			while($rows = mysql_fetch_array($subschprin)) {
	
	// 				$subprid = $rows['id'];
	// 				mysql_query("DELETE FROM sub_schedule_project_indent WHERE sub_schedule_project_id=$subprid ") or die(mysql_error());
	// 				mysql_query("UPDATE sub_schedule_project_material_qty SET total_indent_qty=0 WHERE sub_schedule_project_id=$subprid ") or die(mysql_error());
	// 			}
	// 		}
	// 	}

		
	// }
	// mysql_query("DELETE FROM indent WHERE project_id IN (2,4) ") or die(mysql_error());

	// mysql_query("DELETE FROM indenttotal WHERE project_id IN (2,4) ") or die(mysql_error());