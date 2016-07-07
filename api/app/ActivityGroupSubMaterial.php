<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityGroupSubMaterial extends Model {

	protected $table='activity_group_sub_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function storelevel1mat() {

		return $this->hasOne('App\StoreMaterialsLevel1','id','material_level1_id');
	}

}