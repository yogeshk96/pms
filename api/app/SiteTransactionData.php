<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteTransactionData extends Model {

	protected $table='site_transaction_datas';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
