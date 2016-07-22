<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	      //echo $hash = hash("sha256","planning123456ssepms");

		
		$resulttype = mysql_query("SELECT * FROM store_materials ") or die(mysql_error());

		while($rowt = mysql_fetch_array($resulttype)) {

			$units = $rowt['units'];
			$matid = $rowt['id'];

			$mainqty2 = mysql_query("SELECT * FROM uoms WHERE uom='$units' ");
			while($rowqty = mysql_fetch_array($mainqty2)) {

				$uomid = $rowqty['id'];
				// $storematuom = mysql_query("INSERT INTO store_material_uom (store_material_id, uom_id) VALUES ('$matid', '$uomid') ") or die(mysql_error());
				// $last_id = mysql_insert_id();

				// mysql_query("UPDATE purchase_order_materials SET store_material_uom_id=$last_id WHERE material_id='$matid' ") or die(mysql_error());
				// mysql_query("UPDATE old_purchase_order_materials SET store_material_uom_id=$last_id WHERE material_id='$matid' ") or die(mysql_error());
				echo $last_id."<br>";
			}

		}
			


	

?>