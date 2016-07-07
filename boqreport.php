<!doctype html>
<head>
	<meta charset="UTF-8">
	<link rel="shortcut icon" type="image/x-icon" href="/images/logo.png">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<script type="text/javascript" src="scripts/jquery.js"></script>
	<script type="text/javascript" src="scripts/jquery_ui.js"></script>
	
	<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="styles/common.css">
	<link rel="stylesheet" href="fontawesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="styles/sweet-alert.css">
	<link rel='stylesheet' href='chosen/chosen.css'>
	<script type="text/javascript" src='bootstrap/js/bootstrap.min.js'></script>
	<script type="text/javascript" src='scripts/sweet-alert.min.js'></script>
	<title>BOQ Report</title>
</head>
<body>
<div class="container">
	

	<div class="row">
		
		<div class="col-sm-12">
			
			<table class="table table-striped table-responsive smallfont">
 				<thead>
 					<tr class="innerhead">
 						<th>LOA Sl No</th>
 						<th>Description of Items</th>
 						<th>Units</th>
 						<th>Rohtas LOA Quantity</th>
 						<th>Gaya LOA Quantity</th>
 						<th>Total Quantity</th>
 						<th>Unit Ex-Works Price</th>
 						<th>Unit Price F&I</th>
 						<th>Total Price</th>
 					</tr>
 				</thead>
 				

					<?php

					$fp=fopen('cleannew.csv','r');
						$i=0;
						$partydata=array();

						while($data=fgetcsv($fp)){
							
							echo "<tr>";
							if($data[0] == $data[1]) {
								 echo "<th>".$data[0]."</th>
								 <th>".$data[2]."</th>
								 <th>".$data[3]."</th>
								 <th>".$data[4]."</th>
								 <th>".$data[5]."</th>
								 <th>".$data[6]."</th>
								 <th>".$data[7]."</th>
								 <th>".$data[8]."</th>
								 <th>".$data[9]."</th>
								 ";
							} else {

								echo "<td>".$data[0].$data[1]."</td>
								 <td>".$data[2]."</td>
								 <td>".$data[3]."</td>
								 <td>".$data[4]."</td>
								 <td>".$data[5]."</td>
								 <td>".$data[6]."</td>
								 <td>".$data[7]."</td>
								 <td>".$data[8]."</td>
								 <td>".($data[8]+$data[9])."</td>
								 ";
							}
							echo "</tr>";
							
						}

					?>
				</table>
		</div>
	</div>
</div>