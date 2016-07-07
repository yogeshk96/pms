<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class VendorAccountDetails extends Model {

	protected $table='vendor_accountdetails';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
