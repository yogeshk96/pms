<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Amendment extends Model {

	protected $table='amendment';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function amenddetails() {

		return $this->hasMany('App\AmendmentDetails','amend_id','id');
	}

}
