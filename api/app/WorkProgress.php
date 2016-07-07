<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkProgress extends Model {

	protected $table='work_progresses';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
