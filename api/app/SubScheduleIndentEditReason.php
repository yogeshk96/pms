<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubScheduleIndentEditReason extends Model {
	protected $table='sub_schedule_indent_edit_reasons';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
