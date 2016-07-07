<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseTaxes extends Model {

	protected $table='purchase_taxes';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function taxmaterials() {

		return $this->hasMany('App\PurchaseTaxMaterials','tax_id','id');
	}

}
