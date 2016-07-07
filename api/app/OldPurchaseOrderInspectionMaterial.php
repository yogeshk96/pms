<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseOrderInspectionMaterial extends Model {

	protected $table='old_purchase_order_inspection_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function pomaterial() {

		return $this->hasOne('App\PurchaseOrderMaterial','id','purchase_order_material_id');
	}

	
}
