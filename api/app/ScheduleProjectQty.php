<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ScheduleProjectQty extends Model {

	protected $table='schedule_project_qty';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function scheduleindent() {

		return $this->hasMany('App\ScheduleIndents','schedule_project_id','id');
	}

	public function schprojindent() {

		return $this->hasMany('App\ScheduleProjectIndent','schedule_project_id','id');
	}

}
