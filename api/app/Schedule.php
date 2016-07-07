<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model {

	protected $table='schedules';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subschedules() {

		return $this->hasMany('App\SubSchedule','schedule_id','id');
	}

	public function schproj() {

		return $this->hasMany('App\ScheduleProjectQty','schedule_id','id');
	}

}
