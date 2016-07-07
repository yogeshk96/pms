<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InternalDIMaterial extends Model {

	protected $table='internal_di_material';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function intdipo() {

		return $this->hasMany('App\InternalDIPo','internal_di_material_id','id');
	}

	public function matdes() {

		return $this->belongsTo('App\StoreMaterial','di_material_id','id');
	}

	public function intdi() {

		return $this->belongsTo('App\InternalDI','internal_di_id','id');
	}

	public function matdesonmatid() {

		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}

	

}