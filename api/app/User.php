<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model {

	protected $table='users';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function modules() {

		return $this->hasMany('App\Modules','role','role')->orderBy('modules.priority', 'asc');
	}
	public function store() {

		return $this->hasOne('App\Store','user_id','id');
	}
	public function company() {

		return $this->hasOne('App\Company','id','company_id');
	}
}
