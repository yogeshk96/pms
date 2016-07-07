<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class BoqMaterial extends Model {

	protected $table='boq_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function material() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

}