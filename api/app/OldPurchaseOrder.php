<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseOrder extends Model {

	protected $table='old_purchase_orders';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function pomaterials() {

		return $this->hasMany('App\OldPurchaseOrderMaterial','purchase_order_id','id');
	}
	
	public function taxes() {

		return $this->hasMany('App\OldPurchaseTaxes','purchase_id','id');
	}
	public function specialterms() {

		return $this->hasMany('App\OldPurchaseTerms','purchase_id','id');
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
	public function amds() {

		return $this->hasOne('App\Amendment','amd_no','amd_no');
	}

}
