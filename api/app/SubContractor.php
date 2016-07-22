<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubContractor extends Model {

	protected $table='subcontractors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function stock() {

	// 	return $this->hasMany('App\StoreStock','store_id','id');
	// }

	public function accountdetails() {

		return $this->hasMany('App\SubcontractorAccountDetails','subcontractor_id','id');
	}

	public function workorders() {

		return $this->hasMany('App\SubcontractorWorkorders','subcontractor_id','id');
	}
}
