<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleProjectIndent extends Model {

	protected $table='sub_schedule_project_indent';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function indent() {

		return $this->hasOne('App\Indent','id','indent_id');
	}

	public function subschprojqty() {

		return $this->hasOne('App\SubScheduleProjectQty','id','sub_schedule_project_id');
	}

}