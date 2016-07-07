<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDispatchMaterial extends Model {

	protected $table='inspection_dispatch_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
}
