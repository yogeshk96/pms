<?php

$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

    $fp=fopen('substation133-17.csv','r');
	$i=0;
	$uomid = 7;
	$category_id = 49;
	$projectid = 4;
	$fabmatid = 156;
	// mysql_query("UPDATE store_materials SET parent_id=$fabmatid WHERE id=$fabmatid") or die(mysql_error());
	// while($data=fgetcsv($fp)){

	// 	if($i == 0) {

	// 		$actname = trim($data[1]);
	// 		$dwgno = trim($data[2]);
	// 	}
	// 	else if($i > 1) {
			
	// 		$erecode = trim($data[0]);
	// 		$matname = trim($data[1]);
	// 		$msmatname = trim($data[3]);
	// 		$lenperdwg = trim($data[4]);
	// 		$qtyperpole = trim($data[7]);
	// 		$wtperpc = trim($data[5]);
	// 		$wtpermtr = trim($data[6]);
			
	// 		$checkmat = mysql_query("SELECT * FROM store_materials WHERE name='$matname'");

	// 		if(mysql_num_rows($checkmat) > 0) {

	// 			$chmatres = mysql_fetch_array($checkmat);
	// 			$lastid = $chmatres['id'];
	// 		} else {

	// 			mysql_query("INSERT INTO store_materials (name, type, fab_type, parent_id, category_id, created_by) VALUES ('$matname', 1, 0, $fabmatid, $category_id, 4)") or die("1-".mysql_error());

	// 			$lastid = mysql_insert_id();
	// 		}

	// 		$checkuom = mysql_query("SELECT * FROM store_material_uom WHERE store_material_id=$lastid");
	// 		if(mysql_num_rows($checkuom) > 0) {

	// 			$resuom = mysql_fetch_array($checkuom);
	// 			$lastuomid = $resuom['id'];
	// 		} else {

	// 			mysql_query("INSERT INTO store_material_uom (store_material_id, uom_id) VALUES ($lastid, $uomid) ") or die("2-".mysql_error());
	// 			$lastuomid = mysql_insert_id();
	// 		}
			

	// 			$checkmsmat = mysql_query("SELECT * FROM ms_materials WHERE name='$msmatname' ") or die("3-".mysql_error());
	// 			if(mysql_num_rows($checkmsmat) > 0) {

	// 				$res = mysql_fetch_array($checkmsmat);
	// 				$msmatid = $res['id'];
	// 			} else {

	// 				mysql_query("INSERT INTO ms_materials (name, wt_per_mtr) VALUES ('$msmatname', '$wtpermtr') ") or die("4-".mysql_error());
	// 				$msmatid = mysql_insert_id();
	// 			}
	// 			// $wtperpc = floatval($lenperdwg)*floatval($wtpermtr);
	// 			$wtperpole = $wtperpc*floatval($qtyperpole);

	// 			$checklevel1 = mysql_query("SELECT * FROM store_materials_level1 WHERE store_aggregator_id=$fabmatid AND store_material_id=$lastid AND ere_code='$erecode' ");
	// 			if(mysql_num_rows($checklevel1) > 0) {

	// 				$reslevel1 = mysql_fetch_array($checklevel1);
	// 				$matlevel1id = $reslevel1['id'];
					
						
	// 			}  else {
	// 				mysql_query("INSERT INTO store_materials_level1 (store_aggregator_id,store_material_id,dwg_code,ere_code, ms_material_id, length_asper_dwg, wt_per_pc, qty_per_pole, wt_per_pole, gi_nutbolt, store_material_uom_id) VALUES ($fabmatid, $lastid, '$dwgno', '$erecode', $msmatid, '$lenperdwg', $wtperpc, '$qtyperpole', $wtperpole, 1, $lastuomid) ");

	// 				$matlevel1id = mysql_insert_id();
	// 			}

	// 			$projcheck = mysql_query("SELECT * FROM store_material_projects WHERE project_id=$projectid AND store_material_id=$lastid AND store_material_level1_id=$matlevel1id ");
	// 			if(mysql_num_rows($projcheck) == 0) {

	// 				mysql_query("INSERT INTO store_material_projects (store_material_level1_id, project_id, store_material_id) VALUES ($matlevel1id, $projectid, $lastid) ") or die("5-".mysql_error());
	// 			}

	// 			$checkactgrp = mysql_query("SELECT * FROM activity_groups WHERE name='$actname' AND project_id=$projectid") or die("6-".mysql_error());

	// 			if(mysql_num_rows($checkactgrp) > 0 ) {
	// 				$actres = mysql_fetch_array($checkactgrp);
	// 				$actid = $actres['id'];
	// 				echo $dwgno."<br>";
	// 				mysql_query("UPDATE activity_groups SET dwg_code='$dwgno' WHERE id=$actid") or die("7-".mysql_error());
	// 			} else {

	// 				mysql_query("INSERT INTO activity_groups (name, project_id) VALUES ('$actname', $projectid) ") or die("8-".mysql_error());
	// 				$actid = mysql_insert_id();
	// 			}

	// 			$checkactmat = mysql_query("SELECT * FROM activity_group_materials WHERE material_id=$fabmatid AND activity_groups_id=$actid") or die("9-".mysql_error());
	// 			if(mysql_num_rows($checkactmat) > 0) {
	// 				$actmatres = mysql_fetch_array($checkactmat);
	// 				$actmatid = $actmatres['id'];
	// 			} else {

	// 				mysql_query("INSERT INTO activity_group_materials (activity_groups_id, material_id, qty) VALUES ($actid, $fabmatid, 0) ") or die("10-".mysql_error());
	// 				$actmatid = mysql_insert_id();
	// 			}

	// 			mysql_query("INSERT INTO activity_group_sub_materials (activity_group_material_id, material_level1_id, qty) VALUES ($actmatid, $matlevel1id, 0) ") or die("11-".mysql_error());

	// 	}
	// 	$i++;
	// }
		
