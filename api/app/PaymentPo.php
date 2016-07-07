<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentPo extends Model {

	protected $table='payment_pos';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
}
