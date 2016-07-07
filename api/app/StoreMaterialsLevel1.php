<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialsLevel1 extends Model {

	protected $table='store_materials_level1';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storematerial() {

		return $this->hasOne('App\StoreMaterial','id','store_material_id');
	}

	public function storeuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}

	public function indent() {

		return $this->hasMany('App\BoqMaterial', 'material_id', 'store_material_id');	
	}
	public function indenttotal() {

		return $this->hasMany('App\Indenttotal', 'material_id', 'store_material_id');	
	}
	public function msmat() {

		return $this->hasOne('App\MsMaterial', 'id', 'ms_material_id');	
	}

	public function stocks() {

		return $this->hasMany('App\StoreStock','material_id','store_material_id')->where("old_flag", "=", 0);
	}

	public function storematprojects() {

		return $this->hasMany('App\StoreMaterialProjects','store_material_level1_id','id');
	}

	public function budgetrate() {

		return $this->hasMany('App\BoqMaterial','material_id','store_material_id');
	}


}
