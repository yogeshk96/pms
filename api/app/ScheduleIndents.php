<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ScheduleIndents extends Model {

	protected $table='schedule_indents';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function indent() {

		return $this->hasOne('App\Indent','id','indent_id');
	}
}
