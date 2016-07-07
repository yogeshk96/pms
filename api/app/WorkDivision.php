<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkDivision extends Model {

	protected $table='work_divisions';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function ssdata() {
		return $this->belongsTo('App\WorkDivision','backlink','id');
	}

	public function workdata() {
		return $this->belongsTo('App\Work','work_id','id');
	}
}
