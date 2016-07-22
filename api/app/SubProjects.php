<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubProjects extends Model {

	protected $table='sub_projects';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function multiplier() {

		return $this->hasMany('App\SubProjectActivityMultiplier','sub_project_id','id');
	}
	public function workorders() {

		return $this->hasMany('App\Workorders','subproject_id','id');
	}
	
}
