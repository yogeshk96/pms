<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class RoadPermitMaterial extends Model {

	protected $table='road_permit_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function matdes() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

}