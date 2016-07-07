<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ThirdParty extends Model {

	protected $table='third_parties';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
