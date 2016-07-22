<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Store extends Model {

	protected $table='stores';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function stock() {

		return $this->hasMany('App\StoreStock','store_id','id');
	}
	public function project() {

		return $this->hasOne('App\Projects','id','project_id');
	}
	public function subproject() {

		return $this->hasOne('App\SubProjects','id','subproject_id');
	}

	
}
