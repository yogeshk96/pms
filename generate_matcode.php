<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	    $stmat = mysql_query("SELECT * FROM store_materials");
	    while($row = mysql_fetch_array($stmat)) {
	    	$materialname = $row['name'];
			$explodename = explode(" ", $materialname);

			$material_code = $row['category_id'];

			// foreach ($explodename as $value) {
				
				$material_code.=strtoupper(substr($explodename[0], 0,3));
			// }

			$material_code = substr($material_code, 0, 5);
			$material_code.=$row['id'];
			$material_code = substr($material_code, 0, 8);

			$material_code = str_pad($material_code,8,"0");
			$matid = $row['id'];

			echo $material_code."=".$row['name']."<br>";
			// mysql_query("UPDATE store_materials SET material_code='$material_code' WHERE id=$matid ");

		}