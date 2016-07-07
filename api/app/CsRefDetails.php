<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CsRefDetails extends Model {

	protected $table='cs_ref_details';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function csvendor() {

		return $this->hasOne('App\EnquiryVendor','id','enquiry_vendor_id');
	}

}