<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldEnquiryTaxMaterials extends Model {

	protected $table='old_enquiry_tax_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function enqtaxdetails() {

		return $this->hasOne('App\OldEnquiryTaxes','id','enquiry_tax_id');
	}

	public function enqtaxmat() {

		return $this->hasOne('App\OldEnquiryMaterial','id','enquiry_material_id');
	}
	
}
