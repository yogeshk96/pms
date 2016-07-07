<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactionsLRDocs extends Model {

	protected $table='store_transactions_lrdocs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function transdata() {

	// 	return $this->hasMany('App\StoreTransactionData','trans_id','id');
	// }
}
