<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model {

	protected $table='surveys';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
