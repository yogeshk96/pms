<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CsRef extends Model {

	protected $table='cs_ref';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function csrefdet() {

		return $this->hasMany('App\CsRefDetails','cs_ref_id','id');
	}

}