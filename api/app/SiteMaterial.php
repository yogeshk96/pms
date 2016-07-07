<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteMaterial extends Model {

	protected $table='site_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
