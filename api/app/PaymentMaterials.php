<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentMaterials extends Model {

	protected $table='payment_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
