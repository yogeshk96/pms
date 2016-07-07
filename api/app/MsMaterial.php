<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class MsMaterial extends Model {

	protected $table='ms_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
