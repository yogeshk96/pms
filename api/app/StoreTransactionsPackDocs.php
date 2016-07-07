<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactionsPackDocs extends Model {

	protected $table='store_transactions_packdocs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	// public function transdata() {

	// 	return $this->hasMany('App\StoreTransactionData','trans_id','id');
	// }
}
