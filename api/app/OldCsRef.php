<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldCsRef extends Model {

	protected $table='old_cs_ref';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function csrefdet() {

		return $this->hasMany('App\OldCsRefDetails','old_cs_ref_id','id');
	}

}