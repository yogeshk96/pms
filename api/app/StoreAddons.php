<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreAddons extends Model {

	protected $table='store_addons';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
