<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class EnquiryTaxes extends Model {

	protected $table='enquiry_taxes';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function materialdetails() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

	public function vendordetails() {

		return $this->hasOne('App\Vendor','id','vendor_id');
	}

	public function taxdetails() {

		return $this->hasOne('App\Taxes','id','tax_id');
	}

	public function taxmaterials() {

		return $this->hasMany('App\EnquiryTaxMaterials','tax_id','id');
	}
	
}
