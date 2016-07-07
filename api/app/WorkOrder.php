<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model {

	public function boqs() {
		return $this->hasMany('App\WorkBoq','work_id','id');
	}

	public function indents() {
		return $this->hasMany('App\WorkIndent','work_id','id');
	}

}
