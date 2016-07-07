<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class AmendmentDetails extends Model {

	protected $table='amendment_details';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function pomaterials() {

		return $this->hasOne('App\PurchaseOrderMaterial','id','po_material_id');
	}

	public function oldpomaterials() {

		return $this->hasOne('App\OldPurchaseOrderMaterial','id','old_po_material_id');
	}

	public function potaxes() {

		return $this->hasOne('App\PurchaseTaxes','id','po_tax_id');
	}

	public function oldpotaxes() {

		return $this->hasOne('App\OldPurchaseTaxes','id','old_po_tax_id');
	}

	public function poterms() {

		return $this->hasOne('App\PurchaseTerms','id','po_term_id');
	}

	public function oldpoterms() {

		return $this->hasOne('App\OldPurchaseTerms','id','old_po_term_id');
	}
}
