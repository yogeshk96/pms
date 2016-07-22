<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubcontractorWorkorders extends Model {

	protected $table='subcontractor_workorder';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subcontractor() {

		return $this->hasOne('App\SubContractor','id','subcontractor_id');
	}

	public function workorder() {

		return $this->hasOne('App\Workorders','id','workorder_id');
	}
}
