<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseOrderInspection extends Model {

	protected $table='old_purchase_order_inspection';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function inspectionmaterials() {

		return $this->hasMany('App\OldPurchaseOrderInspectionMaterial','purchase_order_inspection_id','id');
	}

	public function inspectiondocs() {

		return $this->hasMany('App\OldInspectionDocs','purchase_order_inspection_id','id');
	}

	
}
