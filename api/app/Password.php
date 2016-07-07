<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Password extends Model {

	protected $table='passwords';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
