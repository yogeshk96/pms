<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleProjectQty extends Model {

	protected $table='sub_schedule_project_qty';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function subscheduleindent() {

		return $this->hasMany('App\SubScheduleIndents','sub_schedule_project_id','id');
	}

	public function subscheduleprojindent() {

		return $this->hasMany('App\SubScheduleProjectIndent','sub_schedule_project_id','id');
	}

	public function subscheduleprojmatqty() {

		return $this->hasMany('App\SubScheduleProjectMaterialQty','sub_schedule_project_id','id');
	}

	public function subprojmultiplier() {

		return $this->hasOne('App\SubProjectActivityMultiplier','id','sub_project_id');
	}

	public function subschedule() {

		return $this->hasOne('App\SubSchedule','id','sub_schedule_id');
	}

	public function subschedulemat() {

		return $this->hasMany('App\SubScheduleMaterials','sub_schedule_id','sub_schedule_id');
	}

	public function subschprojmatbilled() {

		return $this->hasMany('App\SubScheduleProjMaterialBilled','sub_schedule_project_id','id');
	}


}
