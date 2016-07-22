<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Workorders extends Model {

	protected $table='workorders';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subcontractor() {

		return $this->hasOne('App\SubcontractorWorkorders','workorder_id','id');
	}

	public function subproject() {

		return $this->belongsTo('App\SubProjects','id','subproject_id');
	}
}
