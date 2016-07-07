<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class EnquiryVendor extends Model {

	protected $table='enquiry_vendors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function vendordetails() {

		return $this->hasOne('App\Vendor','id','vendor_id');
	}
	public function materials() {

		return $this->hasMany('App\EnquiryMaterial','enquiry_vendor_id','id');
	}
	public function taxes() {

		return $this->hasMany('App\EnquiryTaxes','enquiry_vendor_id','id');
	}

	public function quotationterms() {

		return $this->hasMany('App\QuotationTerms','enquiry_vendor_id','id');
	}

	public function quotationdocs() {

		return $this->hasMany('App\EnquiryVendorQuotationDocs','enquiry_vendor_id','id');
	}

	public function quotpayterms() {

		return $this->hasOne('App\QuotationPaymentTerms','enquiry_vendor_id','id');
	}
	
}
