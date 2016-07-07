<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class MaterialCategory extends Model {

	protected $table='material_categories';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function submaterials() {

		return $this->hasMany('App\StoreMaterial','category_id','id')->orderBy('name');
	}

	public function boqbommap() {

		return $this->hasMany('App\BoqBomMapping','material_category_id','id');
	}

	
}
