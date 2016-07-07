<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InternalDI extends Model {

	protected $table='internal_di';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function intdimat() {

		return $this->hasMany('App\InternalDIMaterial','internal_di_id','id');
	}

	public function intdidocs() {

		return $this->hasMany('App\InternalDiDocs','internal_di_id','id');
	}


}