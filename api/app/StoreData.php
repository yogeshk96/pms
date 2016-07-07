<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreData extends Model {

	protected $table='store_datas';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
