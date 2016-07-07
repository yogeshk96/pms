<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentDocs extends Model {

	protected $table='payment_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
