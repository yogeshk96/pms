<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubSchedule extends Model {

	protected $table='sub_schedules';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function mainschedule(){
		return $this->belongsTo('App\Schedule','schedule_id','id');
	}

	public function subschmaterials() {

		return $this->hasMany('App\SubScheduleMaterials','sub_schedule_id','id');
	}

	public function subschprojqty() {

		return $this->hasMany('App\SubScheduleProjectQty','sub_schedule_id','id');
	}

	public function schprojqty() {

		return $this->hasMany('App\ScheduleProjectQty','schedule_id','schedule_id');
	}
}
