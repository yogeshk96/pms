<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkTypes extends Model {

	protected $table='work_types';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
