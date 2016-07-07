<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleIndents extends Model {

	protected $table='sub_schedule_indents';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function indent() {

		return $this->hasOne('App\Indent','id','indent_id');
	}
}
