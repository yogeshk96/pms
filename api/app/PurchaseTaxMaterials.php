<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseTaxMaterials extends Model {

	protected $table='purchase_tax_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function tax() {

		return $this->hasOne('App\PurchaseTaxes','id','purchase_taxes_id');
	}
	public function mat() {

		return $this->hasOne('App\PurchaseOrderMaterial','id','material_id');
	}

}
