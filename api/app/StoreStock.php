<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreStock extends Model {

	protected $table='store_stocks';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function material() {

		return $this->hasOne('App\StoreMaterial','id','material_id');
	}

	public function store() {

		return $this->belongsTo('App\Store','store_id','id');
	}

	public function trans(){
		return $this->hasMany('App\StoreTransactionData','stock_id','id');
	}

	public function level1mat(){
		return $this->hasOne('App\StoreMaterialsLevel1','id','material_level1_id');
	}
}
