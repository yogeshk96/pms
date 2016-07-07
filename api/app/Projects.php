<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Projects extends Model {

	protected $table='projects';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subprojects() {

		return $this->hasMany('App\SubProjects','project_id','id')->orderBy("order");
	}
	public function pendingindents() {

		return $this->hasMany('App\Indent','project_id','id')->where("status", "=", 0);
	}

	public function approvedindents() {

		return $this->hasMany('App\Indent','project_id','id')->where("status", "=", 1);
	}
}
