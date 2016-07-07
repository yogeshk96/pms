<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteAttendance extends Model {

	protected $table='site_attendances';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
