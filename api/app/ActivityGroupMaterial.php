<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityGroupMaterial extends Model {

	protected $table='activity_group_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function submaterial(){
		return $this->hasMany('App\ActivityGroupSubMaterial','activity_group_material_id','id');
	}
	
}