<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionMaterial extends Model {

	protected $table='inspection_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function inseachpomat() {

		return $this->hasMany('App\InspectionPoMaterial','inspection_material_id','id');
	}

	public function matdes() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

}