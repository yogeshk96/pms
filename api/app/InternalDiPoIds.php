<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InternalDiPoIds extends Model {

	protected $table='internal_di_poids';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	
}
