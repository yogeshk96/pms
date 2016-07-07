<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model {

	protected $table='enquiries';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function vendors() {

		return $this->hasMany('App\EnquiryVendor','enquiry_id','id')->orderBy('id');
	}

	public function materials() {

		return $this->hasMany('App\EnquiryMaterial','enquiry_id','id');
	}

	public function projects() {

		return $this->hasMany('App\EnquiryProjects','enquiry_id','id');
	}

	public function cs() {

		return $this->hasMany('App\Cs','enquiry_id','id');
	}

	
}
