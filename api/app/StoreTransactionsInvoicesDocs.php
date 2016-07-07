<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactionsInvoicesDocs extends Model {

	protected $table='store_transactions_invoice_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function transdata() {

	// 	return $this->hasMany('App\StoreTransactionData','trans_id','id');
	// }
}
