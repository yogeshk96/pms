<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreGroundStock extends Model {

	protected $table='store_ground_stocks';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
