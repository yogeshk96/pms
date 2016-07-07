<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CompanyDetail extends Model {

	protected $table='company_details';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
