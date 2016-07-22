<?php
$connection = mysql_connect("localhost","root","noobtard123")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");


	        $resulttype = mysql_query("SELECT * FROM purchase_order_materials ") or die(mysql_error());
			$list = array();
			while($rowt = mysql_fetch_array($resulttype)) {

				if(!in_array($rowt['material_id'], $list))
				$list[] = $rowt['material_id'];	
			}
			$matlist = implode("','", $list);
			$matlist = "('".$matlist."')";

			$res = mysql_query("SELECT * FROM store_materials WHERE id NOT IN $matlist");
			echo "<table border='1'>
			<tr>
			<th>S.No</th>
			<th>Name</th>
			</tr>";
			$i=1;
			while($row = mysql_fetch_array($res)) {

				echo "<tr>
				<td>".$i."</td>
				<td>".$row['name']."</td>
				</tr>";
				$i++;
			}

			echo "</table>";

			echo "<h2>Average bought rate</h2>
			<hr>";
			$res = mysql_query("SELECT * FROM store_materials");
			echo "<table border='1'>
			<tr>
			<th>S.No</th>
			<th>Name</th>
			<th>UOM</th>
			<th>AVG Bought rate</th>
			</tr>";
			$i=1;
			while($row = mysql_fetch_array($res)) {
				$matid = $row['id'];
				$avgb = mysql_fetch_array(mysql_query("SELECT AVG(unit_rate) as avgthis FROM purchase_order_materials WHERE material_id='$matid' "));
				echo "<tr>
				<td>".$i."</td>
				<td>".$row['name']."</td>
				<td>".$row['units']."</td>
				<td>".round($avgb['avgthis'])."</td>
				</tr>";
				$i++;
			}

			echo "</table>";