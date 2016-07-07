<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class DispatchMaterial extends Model {

	protected $table='dispatch_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function dieachpomat() {

		return $this->hasMany('App\DispatchPoMaterial','dispatch_material_id','id');
	}

	public function matdes() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

	// public function insdocs() {

	// 	return $this->hasMany('App\InspectionDocs','purchase_order_inspection_id','id');
	// }

	// public function insmat() {

	// 	return $this->hasMany('App\InspectionMaterial','inspection_id','id');
	// }

	// // public function insmat() {

	// // 	return $this->hasMany('App\InspectionMaterial','inspection_id','id');
	// // }

	// public function callraise(){
	// 	return $this->hasOne('App\InspectionCallRaising','po_inspid','id');
	// }
}