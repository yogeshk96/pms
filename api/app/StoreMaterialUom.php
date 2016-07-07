<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialUom extends Model {

	protected $table='store_material_uom';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function stmatuom() {

		return $this->hasOne('App\Uom','id','uom_id');
	}

}
