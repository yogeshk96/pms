<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class EnquiryMaterial extends Model {

	protected $table='enquiry_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function materialdetails() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}
	public function taxes() {

		return $this->hasOne('App\EnquiryTaxes','enquiry_vendor_id','enquiry_vendor_id');
	}
	public function enqvendor() {

		return $this->hasOne('App\EnquiryVendor','id','enquiry_vendor_id');
	}
	public function boqmaterial() {

		return $this->hasOne('App\BoqMaterial','material_id','material_id');
	}
	public function uomdet() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}	
	public function storematuom() {

		return $this->hasOne('App\StoreMaterialUom','id','store_material_uom_id');
	}
}
