<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderInspection extends Model {

	protected $table='purchase_order_inspection';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function inspectionmaterials() {

		return $this->hasMany('App\PurchaseOrderInspectionMaterial','purchase_order_inspection_id','id');
	}

	public function inspectiondocs() {

		return $this->hasMany('App\InspectionDocs','purchase_order_inspection_id','id');
	}

	public function inspectioncallraises() {

		return $this->hasOne('App\InspectionCallRaising','po_inspid','id');
	}

	public function inspectiondispatch() {

		return $this->hasMany('App\InspectionDispatch','inspection_id','id');
	}

	
}
