<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleMaterials extends Model {

	protected $table='sub_schedule_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function material() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

	public function budgetrate() {

		return $this->hasMany('App\BoqMaterial','material_id','material_id');
	}

	public function subschmatactgrp() {

		return $this->hasMany('App\SubScheduleMaterialActivityGroup','sub_schedule_material_id','id');
	}

}
