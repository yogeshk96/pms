<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Inspections extends Model {

	protected $table='inspections';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function insdocs() {

		return $this->hasMany('App\InspectionDocs','purchase_order_inspection_id','id');
	}

	public function insmat() {

		return $this->hasMany('App\InspectionMaterial','inspection_id','id');
	}

	// public function insmat() {

	// 	return $this->hasMany('App\InspectionMaterial','inspection_id','id');
	// }

	public function callraise(){
		return $this->hasOne('App\InspectionCallRaising','po_inspid','id');
	}

	public function inspdis(){
		return $this->hasMany('App\InspectionDispatch','inspection_id','id');
	}
}