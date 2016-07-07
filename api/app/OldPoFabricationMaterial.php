<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPoFabricationMaterial extends Model {

	protected $table='old_po_fabrication_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storemainuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}

}
