<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SubcontractorAccountDetails extends Model {

	protected $table='subcontractor_accountdetails';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subcontractor() {

		return $this->belongsTo('App\SubContractor','id','subcontractor_id');
	}

}
