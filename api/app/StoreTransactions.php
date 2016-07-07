<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactions extends Model {

	protected $table='store_transactions';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function transdata() {

		return $this->hasMany('App\StoreTransactionData','trans_id','id');
	}

	public function storename() {

		return $this->belongsTo('App\Store','end_store_id','id');
	}

	public function tptname() {

		return $this->belongsTo('App\ThirdParty','third_party_id','id');
	}

	public function subconname() {

		return $this->belongsTo('App\SubContractor','subcon_id','id');
	}

	public function userdata(){
		return $this->belongsTo('App\User','created_by','id');
	}

	public function mrndata(){
		return $this->hasOne('App\MRN','store_transaction_id','id');
	}

	public function mrvdata(){
		return $this->hasOne('App\MRV','store_transactions_id','id');
	}

	public function dcdata(){
		return $this->hasOne('App\StoreTransactions','trans_id','id');
	}
}
