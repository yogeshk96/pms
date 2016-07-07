<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkBoq extends Model {

	public function materials() {
		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

	public function boquom(){
		return $this->belongsTo('App\StoreMaterialUom','uom_id','id');
	}

	public function workdetails(){
		return $this->belongsTo('App\WorkOrder','work_id','id');
	}

}
