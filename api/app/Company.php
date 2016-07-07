<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model {

	protected $table='companies';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function compdetails() {

		return $this->hasOne('App\CompanyDetail','company_id','id');
	}
}
