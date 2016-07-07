<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InternalDIPo extends Model {

	protected $table='internal_di_po';
	protected $guarded = ['id', 'created_at', 'updated_at'];


	public function podets() {

		return $this->belongsTo('App\PurchaseOrder','po_id','id');
	}

	public function storename() {

		return $this->belongsTo('App\Store','stores_id','id');
	}

	public function siteareas() {

		return $this->belongsTo('App\SiteAreas','site_areas_id','id');
	}

	public function storematerial() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}
	public function intdimat() {

		return $this->hasOne('App\InternalDIMaterial','id','internal_di_material_id');
	}

}