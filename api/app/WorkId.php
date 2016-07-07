<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkId extends Model {

	protected $table='work_ids';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function feederdata() {
		return $this->belongsTo('App\WorkDivision','work_id','id');
	}

	public function sitedata() {
		return $this->belongsTo('App\Site','id','work_id');
	}
}
