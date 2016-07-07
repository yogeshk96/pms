<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityGroup extends Model {

	protected $table='activity_groups';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function material(){
		return $this->hasMany('App\ActivityGroupMaterial','activity_groups_id','id');
	}
	
}