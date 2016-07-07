<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactionData extends Model {

	protected $table='store_transaction_datas';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function storestock() {

		return $this->hasOne('App\StoreStock','id','stock_id');
	}

	public function matname(){
		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

	public function transmain(){
		return $this->belongsTo('App\StoreTransactions','trans_id','id');
	}
}
