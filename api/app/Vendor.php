<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model {

	protected $table='vendors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function materials() {

		return $this->hasMany('App\VendorMaterials','vendor_id','id');
	}

	public function accountdetails() {

		return $this->hasMany('App\VendorAccountDetails','vendor_id','id');
	}
	
}
