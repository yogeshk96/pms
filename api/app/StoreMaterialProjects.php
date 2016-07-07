<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialProjects extends Model {

	protected $table='store_material_projects';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
