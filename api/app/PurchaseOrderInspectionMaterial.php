<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderInspectionMaterial extends Model {

	protected $table='purchase_order_inspection_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function pomaterial() {

		return $this->hasOne('App\PurchaseOrderMaterial','id','purchase_order_material_id');
	}

	
}
