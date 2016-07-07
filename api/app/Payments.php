<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model {

	protected $table='payments';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
