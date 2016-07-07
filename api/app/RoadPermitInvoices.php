<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class RoadPermitInvoices extends Model {

	protected $table='road_permit_invoices';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function docs() {

		return $this->hasMany('App\RoadPermitInvoiceDocs','road_permit_invoice_id','id');
	}
}