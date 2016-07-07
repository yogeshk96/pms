<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldEnquiryMaterial extends Model {

	protected $table='old_enquiry_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function materialdetails() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

	public function taxes() {

		return $this->hasOne('App\OldEnquiryTaxes','enquiry_vendor_id','enquiry_vendor_id');
	}

	public function enqvendor() {

		return $this->hasOne('App\OldEnquiryVendor','id','enquiry_vendor_id');
	}

	public function boqmaterial() {

		return $this->hasOne('App\BoqMaterial','material_id','material_id');
	}

	
}
