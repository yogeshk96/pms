<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class VendorMaterials extends Model {

	protected $table='vendor_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function materials() {

		return $this->belongsTo('App\StoreMaterial','store_material_id','id');
	}

}
