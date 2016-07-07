<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldEnquiryVendor extends Model {

	protected $table='old_enquiry_vendors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function vendordetails() {

		return $this->hasOne('App\Vendor','id','vendor_id');
	}
	public function materials() {

		return $this->hasMany('App\OldEnquiryMaterial','enquiry_vendor_id','id');
	}
	public function taxes() {

		return $this->hasMany('App\OldEnquiryTaxes','enquiry_vendor_id','id');
	}

	public function quotationterms() {

		return $this->hasMany('App\OldQuotationTerms','enquiry_vendor_id','id');
	}

	public function quotationdocs() {

		return $this->hasMany('App\OldEnquiryVendorQuotationDocs','enquiry_vendor_id','id');
	}

	public function quotpayterms() {

		return $this->hasOne('App\OldQuotationPaymentTerms','enquiry_vendor_id','id');
	}

}
