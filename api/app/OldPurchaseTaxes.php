<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseTaxes extends Model {

	protected $table='old_purchase_taxes';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
