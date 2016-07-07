<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseOrderMaterial extends Model {

	protected $table='old_purchase_order_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storematerial() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

}
