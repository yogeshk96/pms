<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionPo extends Model {

	protected $table='inspection_po';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function inspec() {

		return $this->hasOne('App\Inspections','id','inspection_id');
	}

	public function insmat() {

		return $this->hasMany('App\InspectionMaterial','inspection_id','inspection_id');
	}	
}