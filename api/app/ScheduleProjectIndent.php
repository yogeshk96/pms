<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ScheduleProjectIndent extends Model {

	protected $table='schedule_project_indent';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function indent() {

		return $this->hasOne('App\Indent','id','indent_id');
	}

	public function subschproj() {

		return $this->belongsTo('App\SubScheduleProjectQty','id','sub_schedule_project_id');
	}

}