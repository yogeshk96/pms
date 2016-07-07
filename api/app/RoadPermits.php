<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class RoadPermits extends Model {

	protected $table='road_permits';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function rpdocs() {

		return $this->hasMany('App\RoadPermitDocs','road_permit_id','id');
	}

	public function invoices() {

		return $this->hasMany('App\RoadPermitInvoices','road_permit_id','id');
	}

	public function material() {

		return $this->hasMany('App\RoadPermitMaterial','road_permit_id','id');
	}
}