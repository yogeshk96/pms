<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");
    $projectid = 5;
    $schid = 5227;


    $schdet= mysql_query("SELECT * FROM schedules_project_qty WHERE schedule_id=$schid");
    while($rowsch = mysql_fetch_array($schdet)){
    	$schprojid = $rowsch['id'];

    	$schprojindent = mysql_query("SELECT * FROM schedule_project_indent WHERE schedule_project_id=$schprojid ");
    }

