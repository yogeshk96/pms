<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class RoadPermitInvoiceDocs extends Model {

	protected $table='road_permit_invoice_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function insdocs() {

	// 	return $this->hasMany('App\RoadPermitDocs','road_permit_id','id');
	// }
}