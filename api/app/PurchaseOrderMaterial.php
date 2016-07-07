<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderMaterial extends Model {

	protected $table='purchase_order_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storematerial() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

	public function storeuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}

	public function storemainuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_main_uom_id');
	}

	public function storetransdata() {

		return $this->hasMany('App\StoreTransactionData','pomaterial_id','id');
	}

	public function fabmat() {

		return $this->hasMany('App\PoFabricationMaterial','purchase_order_material_id','id');
	}

	public function indenttotal() {

		return $this->hasMany('App\Indenttotal','material_id','material_id');
	}

	public function purchaseorder() {

		return $this->hasOne('App\PurchaseOrder','id','purchase_order_id');
	}

	public function inspectionmat() {

		return $this->hasOne('App\PurchaseOrderInspectionMaterial','purchase_order_material_id','id');
	}

	public function dispatchmat() {

		return $this->hasOne('App\DispatchPoMaterial','po_material_id','id');
	}

	public function inspecmat() {

		return $this->hasMany('App\InspectionPoMaterial','pom_table_id','id');
	}

	public function level1mat() {

		return $this->hasMany('App\StoreMaterialsLevel1','store_aggregator_id','material_id');
	}

	public function uoms() {

		return $this->hasMany('App\StoreMaterialUom','store_material_id','material_id');
	}

	public function intdipo() {

		return $this->hasMany('App\InternalDIPo','pom_table_id','id');
	}


	


}
