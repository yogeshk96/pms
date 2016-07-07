<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class BoqBomMapping extends Model {

	protected $table='boq_bom_mapping';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storemat() {

		return $this->hasOne('App\StoreMaterial','id','store_material_id');
	}

}
