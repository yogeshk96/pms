<?php
	
?>
<!DOCTYPE html>
<html lang="en" ng-app="RptApp" ng-controller="MainCtrl">
<head>
	<meta charset="UTF-8">
	<title>Survey Report</title>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>
	<script type="text/javascript" src="scripts/angular.js"></script>
	<script type="text/javascript" src="scripts/mapmarker.js"></script>
	<style>
		html, #map-canvas {
			height: 100%;
			margin: 0px;
			padding: 0px;
		}
		body{
			height: 100%;
			margin: 0px;
			padding: 0px;
			font-family: Arial;
			font-size:11px;
		}
		table{
			border-collapse: collapse;
			float:left;
			margin:20px;
		}
		.headings{
			font-size: 14px;
			float:left;
			margin:0px 20px;
		}
		.labels { color: black; background-color: #FF8075; font-family: Arial; font-size: 11px; font-weight: bold; text-align: center; width: 11px;height:12px; }
	</style>
	<script>
		var sid="<?php echo $_GET['sid']?>";
		function initialize(data) {
			var myLatlng = new google.maps.LatLng(parseFloat(data[0]['latitude']),parseFloat(data[0]['longitude']));
			var mapOptions = {
				zoom: 17,
				center: myLatlng
			}
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			for(var i=0;i<data.length;i++)
			{
				if(data[i]['latitude'])
				{
					var marker = new MarkerWithLabel({
						position: new google.maps.LatLng(parseFloat(data[i]['latitude']),parseFloat(data[i]['longitude'])),
						map: map,
						title: data[i]['name'],
						labelContent:data[i]['sno'],
						labelAnchor: new google.maps.Point(6, 33),
						labelClass: "labels", // the CSS class for the label
						labelInBackground: false
					});

					if(data[i]['backlink']!=0)
					{
						var lpath=[new google.maps.LatLng(parseFloat(data[i]['latitude']),parseFloat(data[i]['longitude'])),new google.maps.LatLng(parseFloat(data[i]['backlinkdata']['latitude']),parseFloat(data[i]['backlinkdata']['longitude']))];
						var pline=new google.maps.Polyline({
							path:lpath,
							geodesic:true,
							strokeColor: '#FF0000',
							strokeOpacity: 1.0,
							strokeWeight: 2
						});
						pline.setMap(map);
					}
				}
			}
		}
		var app=angular.module("RptApp",[]);
		app.controller('MainCtrl', ['$scope','$http', function ($scope,$http) {
			$scope.requesturl="/api/public";
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_survey_data',
				params:{survey:sid}
			})
			.success(function(result){
				$scope.survey=result[0];
				$scope.items=result[1];
				initialize(result[1]);
			});

			$scope.get_dist=function(i){
				if(i['backlink']==0)
				{
					return '-';
				}
				if(i['latitude'])
				{
					var from=new google.maps.LatLng(parseFloat(i['latitude']), parseFloat(i['longitude']));
					var to=new google.maps.LatLng(parseFloat(i['backlinkdata']['latitude']), parseFloat(i['backlinkdata']['longitude']));
					return Math.round((google.maps.geometry.spherical.computeDistanceBetween (from, to))*100)/100;
				}
				else
				{
					return 'Unreachable';
				}
			}
		}]);
	</script>
</head>
<body>
	<div id="map-canvas"></div>
	<p>
		<div class='headings'><b>Survery Name:</b> {{survey.surveyname}}</div>
		<div class='headings'><b>MDTR Code:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
		<div class='headings'><b>Division:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
		<div class='headings'><b>Sub-Division:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
		<div class='headings'><b>Section:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
		<div class='headings'><b>Company:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
	</p>
	<table cellpadding="5" border="1">
		<tr>
			<th>Sno</th>
			<th>Name</th>
			<th>Back Link</th>
			<th>Distance</th>
			<th>Horizontal X Arms</th>
			<th>Angle X Arms</th>
			<th>Top Cleats</th>
			<th>11KV Pin Insulators</th>
			<th>11KV Disc Insulators</th>
			<th>Tapping Channels</th>
			<th>Conversion of LT to HT</th>
			<th>Dismantle of LT Cross Arm</th>
			<th>Dismantle of LT Pin Insulators</th>
			<th>MS Stay Sets</th>
			<th>8m 200Kg Poles</th>
			<th>34 sqmm Cond</th>
			<th>9.1m 280Kg Poles</th>
			<th>CI Earth Pipes</th>
			<th>Supporting Angles</th>
			<th>50 sqmm AL Lugs</th>
			<th>11KV HG Fuse Set</th>
			<th>3-Phase 16KVA DTR</th>
			<th>3-Phase 25KVA DTR</th>
			<th>LT HG Fuse Set</th>
			<th>50 sqmm PVC Cable</th>
			<th>PVC Cable Cleats</th>
			<th>Concreting of Pole</th>
			<th>LT AB Cable</th>
			<th>LT Metering</th>
			<th>Suspension Clamps</th>
			<th>Dead end Clamps</th>
			<th>DTR removed and hand over at store</th>
			<th>11KVA AB Switch</th>
			<th>Special Clamps</th>
			<th>Dismantle of Old Conductor</th>
			<th>Dismantle of AB Cable</th>
			<th>Photos</th>
		</tr>
		<tr ng-repeat="x in items">
			<th>{{x.sno}}</th>
			<th>{{x.name}}</th>
			<th ng-if="x.backlink!=0">{{x.backlinkdata.sno}}</th>
			<th ng-if="x.backlink==0">-</th>
			<th>{{get_dist(x)}}</th>
			<th>{{x.surveydata.hxarms}}</th>
			<th>{{x.surveydata.anglearms}}</th>
			<th>{{x.surveydata.topcleats}}</th>
			<th>{{x.surveydata.htpinins}}</th>
			<th>{{x.surveydata.htdiscins}}</th>
			<th>{{x.surveydata.tappingchnnls}}</th>
			<th>{{x.surveydata.lthtconv}}</th>
			<th>{{x.surveydata.ltdismantle}}</th>
			<th>{{x.surveydata.ltpindismantle}}</th>
			<th>{{x.surveydata.staysets}}</th>
			<th>{{x.surveydata.pole8}}</th>
			<th>{{x.surveydata.cond34}}</th>
			<th>{{x.surveydata.pole91}}</th>
			<th>{{x.surveydata.earthpipe}}</th>
			<th>{{x.surveydata.supportangles}}</th>
			<th>{{x.surveydata.allugs}}</th>
			<th>{{x.surveydata.hgfuseset}}</th>
			<th>{{x.surveydata.trans16}}</th>
			<th>{{x.surveydata.trans25}}</th>
			<th>{{x.surveydata.ltfuseset}}</th>
			<th>{{x.surveydata.cond50}}</th>
			<th>{{x.surveydata.pvccleats}}</th>
			<th>{{x.surveydata.poleconcr}}</th>
			<th>{{x.surveydata.abcable}}</th>
			<th>{{x.surveydata.ltmeter}}</th>
			<th>{{x.surveydata.suspensionclamps}}</th>
			<th>{{x.surveydata.deadendclamps}}</th>
			<th>{{x.surveydata.dtrremoved}}</th>
			<th>{{x.surveydata.abswitch}}</th>
			<th>{{x.surveydata.specialclamps}}</th>
			<th>{{x.surveydata.oldcond}}</th>
			<th>{{x.surveydata.oldabcable}}</th>
			<th>Photos</th>
		</tr>
	</table>
</body>
</html>