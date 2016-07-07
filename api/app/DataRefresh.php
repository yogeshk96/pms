<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class DataRefresh extends Model {

	protected $table='data_refreshes';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
