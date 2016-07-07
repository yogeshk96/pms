<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterial extends Model {

	protected $table='store_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function stocks() {

		return $this->hasMany('App\StoreStock','material_id','id');
	}
	public function category() {

		return $this->hasOne('App\MaterialCategory','id','category_id');
	}

	public function vendormaterial() {

		return $this->hasMany('App\VendorMaterials', 'store_material_id', 'id');	
	}

	public function enqmaterials() {

		return $this->hasMany('App\EnquiryMaterial', 'material_id', 'id');	
	}

	public function level1mat() {

		return $this->hasMany('App\StoreMaterialsLevel1', 'store_aggregator_id', 'id');	
	}

	public function trans(){
		return $this->hasMany('App\StoreTransactionData','material_id','id');
	}
	
	public function matuom() {

		return $this->hasMany('App\StoreMaterialUom', 'store_material_id', 'id')->where("type", "=", 0);	
	}

	public function allmatuom() {

		return $this->hasMany('App\StoreMaterialUom', 'store_material_id', 'id');	
	}

	public function inversestore() {

		return $this->hasOne('App\StoreMaterial', 'id', 'parent_id');	
	}
	public function indent() {

		return $this->hasMany('App\BoqMaterial', 'material_id', 'id');	
	}
	public function indenttotal() {

		return $this->hasMany('App\Indenttotal', 'material_id', 'id');	
	}
	public function indentmat() {

		return $this->hasMany('App\IndentMaterial', 'material_id', 'id');	
	}
	public function projects() {

		return $this->hasMany('App\StoreMaterialProjects', 'store_material_id', 'id');	
	}
	public function parent() {

		return $this->hasOne('App\StoreMaterial', 'id', 'parent_id');	
	}
	public function purchaseordermat() {

		return $this->hasMany('App\PurchaseOrderMaterial', 'material_id', 'id');	
	}
	public function level1matindi() {

		return $this->hasMany('App\StoreMaterialsLevel1', 'store_material_id', 'id');	
	}

}
