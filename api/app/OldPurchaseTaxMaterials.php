<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseTaxMaterials extends Model {

	protected $table='old_purchase_tax_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function tax() {

		return $this->hasMany('App\OldPurchaseTaxes','id','purchase_taxes_id');
	}

}
