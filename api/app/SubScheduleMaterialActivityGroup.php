<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleMaterialActivityGroup extends Model {

	protected $table='sub_schedule_material_activity_groups';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function actgrp() {

		return $this->belongsTo('App\ActivityGroup','activity_group_id','id');
	}

}