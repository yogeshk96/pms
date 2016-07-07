<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CompanyTransaction extends Model {

	protected $table='company_transactions';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
