<?php
$connection = mysql_connect("localhost","root","casperboom")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

	    // echo $hash = hash("sha256","purchaseshead123456ssepms");

	    $uomq = mysql_query("SELECT * FROM store_material_uom order by store_material_id");

	    $uomarr = array();
	    while($r = mysql_fetch_array($uomq)) {

	    	echo $uommatid = $r['store_material_id']."=".$r['uom_id']; echo "<br>";
	    	if(!in_array($uommatid, $uomarr)){


	    		$uomarr[] = $uommatid;
	    	} else {

	    		echo $uommatid."<br>";
	    	}
	    }
		
		// $resulttype = mysql_query("SELECT * FROM schedules where project_id=2 ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
		// 	$mainqty2 = mysql_query("SELECT * FROM schedule_project_qty WHERE schedule_id='$schid' ");
		// 	while($rowqty = mysql_fetch_array($mainqty2)) {
		// 		$schprojqty = $rowqty['qty'];

		// 		$subprojid = $rowqty['sub_project_id'];
		// 		$subschquery = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id='$schid' ");
		// 		while($rowsubsch = mysql_fetch_array($subschquery)) {
		// 			$unitqty = $rowsubsch['unit_qty'];
		// 			$subschid = $rowsubsch['id'];
		// 			$subschprojqty = $schprojqty*$unitqty;
		// 			mysql_query("UPDATE sub_schedule_project_qty SET qty='$subschprojqty' WHERE sub_schedule_id='$subschid' AND sub_project_id='$subprojid' ");
		// 		}

		// 	}

		// }



		// $resulttype = mysql_query("SELECT * FROM schedules where project_id IN (2) ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
			
		// 	$subschquery = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id='$schid' ");
		// 	while($rowsubsch = mysql_fetch_array($subschquery)) {
		// 		$subschid = $rowsubsch['id'];

		// 		$subschprojq = mysql_query("SELECT * FROM sub_schedule_project_qty WHERE sub_schedule_id='$subschid' ");
		// 		$tot = 0;
		// 		while($rowsubprojq = mysql_fetch_array($subschprojq)) {
		// 			$tot += $rowsubprojq['qty'];
		// 		}

		// 		mysql_query("UPDATE sub_schedules SET qty='$tot' WHERE id='$subschid' ") or die(mysql_error());

		// 	}

		// }

	 //    $resulttype = mysql_query("SELECT * FROM schedules where project_id IN (2) ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
			
		// 	$subschquery = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id='$schid' ");
		// 	while($rowsubsch = mysql_fetch_array($subschquery)) {
		// 		$totqty = $rowsubsch['qty'];
		// 		$totunitqty = $rowsubsch['unit_qty'];
		// 		$subschid = $rowsubsch['id'];
		// 		mysql_query("UPDATE sub_schedule_materials SET qty='$totqty', unit_qty='$totunitqty' WHERE sub_schedule_id='$subschid' ") or die(mysql_error());
		// 	}

		// }

	 //    $resulttype = mysql_query("SELECT * FROM schedules where project_id=2 ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
		// 	$mainqty2 = mysql_query("SELECT * FROM schedule_project_qty WHERE schedule_id='$schid' ");
		// 	$totalqty = 0;
		// 	while($rowqty = mysql_fetch_array($mainqty2)) {
		// 		$schprojqty = $rowqty['qty'];
		// 		$totalqty += $schprojqty;
		// 	}
		// 	mysql_query("UPDATE schedules SET qty='$totalqty' WHERE id='$schid' ") or die(mysql_error());
		// }

	 //    $removepo = mysql_query("SELECT * FROM purchase_orders where created_by=4 ") or die(mysql_error());
		// while($rowpo = mysql_fetch_array($removepo)) {
		// 	$poid = $rowpo['id'];
			
		// 	mysql_query("DELETE FROM purchase_order_materials WHERE purchase_order_id='$poid' ");
		// 	$remotax = mysql_query("SELECT * FROM purchase_taxes WHERE purchase_id='$poid' ");
		// 	while($rowsubsch = mysql_fetch_array($remotax)) {
		// 		$taxid = $rowsubsch['id'];

		// 		mysql_query("DELETE FROM purchase_tax_materials WHERE tax_id='$taxid' ");

		// 	}
		// 	mysql_query("DELETE FROM purchase_taxes WHERE purchase_id='$poid' ");
		// 	mysql_query("DELETE FROM purchase_terms WHERE purchase_id='$poid' ");

		// }

		// mysql_query("DELETE FROM purchase_orders where created_by=4 ") or die(mysql_error());

		// $resulttype = mysql_query("SELECT * FROM boq_materials where project_id=4 ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$matid = $rowt['material_id'];
		// 	$budget_rate = $rowt['budget_rate'];
		// 	mysql_query("UPDATE boq_materials SET budget_rate=$budget_rate WHERE material_id=$matid AND project_id=3 ");

		// }
	 //    $actarr = array();
		// $ac = mysql_query("SELECT * FROM activity_group_sub_materials ");
		// while($row = mysql_fetch_array($ac)) {

		// 	$ele = $row['activity_group_material_id']."-".$row['material_level1_id']."-".$row['qty'];
		// 	if(!in_array($ele, $actarr)) {

		// 		$actarr[] = $ele;
		// 	} else {

		// 		echo $actid = $row['id']; echo "<br>";
		// 		// mysql_query("DELETE FROM activity_group_sub_materials WHERE id=$actid");
		// 	}
		// }

		// $subschedule = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id=5227 ");
		// while($row=mysql_fetch_array($subschedule)){

		// 	$subid = $row['id'];

		// 	$subschmat = mysql_query("SELECT * FROM sub_schedule_materials WHERE sub_schedule_id=$subid ");
		// 	while($submat = mysql_fetch_array($subschmat)) {

		// 		$matid = $submat['material_id'];
		// 	}
		// }
	 //    $uomarr = array();
		// $checkduom = mysql_query("SELECT * from store_material_uom ");
		// while($row=mysql_fetch_array($checkduom)) {

		// 	$checkarr = $row['store_material_id']."=".$row['uom_id'];
		// 	if(!in_array($checkarr, $uomarr)) {

		// 		$uomarr[] = $checkarr;
		// 	} else {

		// 		echo $row['store_material_id']."=".$row['uom_id']."<br>";
		// 		$stuomid = $row['id'];
		// 		// mysql_query("DELETE FROM store_material_uom WHERE id=$stuomid ") or die(mysql_error());
		// 	}
		// }

		// $podet = mysql_query("SELECT * FROM purchase_orders WHERE project_id IN (2,4)");
		// while($row=mysql_fetch_array($podet)){

		// 	$poid = $row['id'];
		// 	$pomat = mysql_query("SELECT * FROM purchase_order_materials WHERE material_id=361 AND purchase_order_id=$poid ");
		// 	if(mysql_num_rows($pomat) > 0) {
		// 		$pores = mysql_fetch_array($pomat);
		// 		echo $pores['id']."<br>";
		// 	}

		// }

	 // //    $resulttype = mysql_query("SELECT * FROM schedules where project_id IN (2) ") or die(mysql_error());
		// $list = array();
		// while($rowt = mysql_fetch_array($resulttype)) {
		// 	$schid = $rowt['id'];
		// 	$schqty = $rowt['qty'];
			
		// 	$subschquery = mysql_query("SELECT * FROM sub_schedules WHERE schedule_id='$schid' ");
		// 	while($rowsubsch = mysql_fetch_array($subschquery)) {
		// 		$totqty = $rowsubsch['qty'];
		// 		$subschid = $rowsubsch['id'];
		// 		$subschmat = mysql_query("SELECT * FROM sub_schedule_materials WHERE sub_schedule_id=$subschid AND (material_id=156 OR material_id=274) ") or die(mysql_error());
		// 		while($rowmat = mysql_fetch_array($subschmat)) {
		// 			$subschmatid = $rowmat['id'];
		// 			$newqty = $rowmat['qty']/1000;
		// 			mysql_query("UPDATE sub_schedule_materials SET qty=$newqty WHERE id=$subschmatid ") or die(mysql_error());
		// 		}
		// 	}

		// }

?>