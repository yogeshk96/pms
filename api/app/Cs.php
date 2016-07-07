<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Cs extends Model {

	protected $table='cs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function csref() {

		return $this->hasMany('App\CsRef','cs_id','id');
	}

}