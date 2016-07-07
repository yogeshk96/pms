<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Indenttotal extends Model {

	protected $table='indenttotal';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function mat(){
		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}
}