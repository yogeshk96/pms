<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionPoMaterial extends Model {

	protected $table='inspection_po_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function podets() {

		return $this->belongsTo('App\PurchaseOrder','inspection_po_id','id');
	}

	public function insppo() {

		return $this->belongsTo('App\InspectionPo','inspection_po_id','id');
	}

	public function storemat() {

		return $this->belongsTo('App\StoreMaterial','po_material_id','id');
	}
	
}