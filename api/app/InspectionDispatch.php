<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDispatch extends Model {

	protected $table='inspection_dispatch';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
	public function callraise(){
		return $this->hasOne('App\DispatchCallRaising','dispatch_id','id');
	}

	public function didocs() {

		return $this->hasMany('App\InspectionDispatchDocs','inspection_dispatch_id','id');
	}

	public function dimat() {

		return $this->hasMany('App\DispatchMaterial','dispatch_id','id');
	}

	public function intdi() {

		return $this->hasMany('App\InternalDI','di_id','id');
	}

	
	
}
