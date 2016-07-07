<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class EnquiryTaxMaterials extends Model {

	protected $table='enquiry_tax_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function enqtaxdetails() {

		return $this->hasOne('App\EnquiryTaxes','id','enquiry_tax_id');
	}

	public function enqtaxmat() {

		return $this->hasOne('App\EnquiryMaterial','id','enquiry_material_id');
	}
	
}
