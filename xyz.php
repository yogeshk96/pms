<?php

$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	$resulttype = mysql_query("SELECT sch.id as schid, subsch.id as subschid, subsch.qty as subschqty FROM schedules sch, sub_schedules subsch WHERE sch.id=subsch.schedule_id AND sch.project_id=4 ") or die(mysql_error());

	while($row=mysql_fetch_array($resulttype)) {

		$resultsub = mysql_query("SELECT * FROM sub_schedule_materials WHERE sub_schedule_id='".$row['subschid']."' ");

		while($rowressub=mysql_fetch_array($resultsub)) {

			echo $rowressub['qty']."===".$row['subschqty']."<br>";
			$thisqty = $row['subschqty'];

			//mysql_query("UPDATE sub_schedule_materials SET qty=$thisqty WHERE id='".$rowressub['id']."' ");
		}
	}

