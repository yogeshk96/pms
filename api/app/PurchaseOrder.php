<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model {

	protected $table='purchase_orders';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function pomaterials() {

		return $this->hasMany('App\PurchaseOrderMaterial','purchase_order_id','id');
	}
	public function project() {

		return $this->hasOne('App\Projects','id','project_id');
	}

	public function vendor() {

		return $this->hasOne('App\Vendor','id','vendor_id');
	}
	public function users() {

		return $this->hasOne('App\User','id','created_by');
	}
	public function csref() {

		return $this->hasOne('App\CsRef','id','csref_id');
	}
	public function taxes() {

		return $this->hasMany('App\PurchaseTaxes','purchase_id','id');
	}
	public function specialterms() {

		return $this->hasMany('App\PurchaseTerms','purchase_id','id');
	}
	public function inspections() {

		return $this->hasMany('App\InspectionPo','po_id','id');
	}

}
