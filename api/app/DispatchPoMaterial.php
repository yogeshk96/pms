<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class DispatchPoMaterial extends Model {

	protected $table='dispatch_po_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];


	public function podets() {

		return $this->belongsTo('App\PurchaseOrder','dispatch_po_id','id');
	}
	public function storemat() {

		return $this->belongsTo('App\StoreMaterial','po_material_id','id');
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