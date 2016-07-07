<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubContractors extends Model {

	protected $table='sub_contractors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function stock() {

	// 	return $this->hasMany('App\StoreStock','store_id','id');
	// }

	
}
