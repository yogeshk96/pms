<?php
$connection = mysql_connect("localhost","root","casperboom")
	        or die("Could'nt  connect to server");
$db = mysql_select_db("pms",$connection)
	        or die("Couldn't select database");

 //    $fp=fopen('ss.csv','r');
	
	// while($data=fgetcsv($fp)){
	// 	if($data[3]>0) {
	// 		$storeid = $data[0]; 
	// 		$matid = $data[1]; 
	// 		$matlevel1id = $data[2];
	// 		$totalrec = $data[3];
	// 		echo $totalrec."<br>";
	// 		mysql_query("UPDATE store_stocks SET total_received=$totalrec WHERE store_id=$storeid AND material_id=$matid AND material_level1_id=$matlevel1id ") or die(mysql_error());


	// 	}

	// }


$query = mysql_query("SELECT * FROM store_ground_stocks WHERE stock_date='2016-07-14' ");
while($row=mysql_fetch_array($query)){

	$qty = $row['quantity'];
	$stid = $row['stock_id'];
	// mysql_query("UPDATE store_stocks SET quantity=$qty WHERE id=$stid ") or die(mysql_query());
}
			