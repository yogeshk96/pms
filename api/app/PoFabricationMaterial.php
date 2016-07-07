<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PoFabricationMaterial extends Model {

	protected $table='po_fabrication_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storemainuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}

	public function storemat() {

		return $this->hasOne('App\StoreMaterial','id','store_material_id');
	}

}
