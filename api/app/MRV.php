<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class MRV extends Model {

	protected $table='mrvs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function storematerial() {

	// 	return $this->hasOne('App\StoreMaterial','id','material_id');
	// }

	


}
