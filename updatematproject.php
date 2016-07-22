<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");
$projectid = 4;
$qu = mysql_query("SELECT * FROM store_materials_level1 WHERE store_aggregator_id = 156 ");
while($row = mysql_fetch_array($qu)) {

	$matid = $row['store_material_id'];
	$checkmat = mysql_query("SELECT * FROM store_material_projects WHERE store_material_id=$matid AND project_id=$projectid") or die(mysql_error());
	if(mysql_num_rows($checkmat) == 0) {

		// mysql_query("INSERT INTO store_material_projects (store_material_id, project_id) VALUES ($matid, $projectid) ") or die(mysql_error());
	}

}