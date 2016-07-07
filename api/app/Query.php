<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Query extends Model {

	protected $table='queries';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
