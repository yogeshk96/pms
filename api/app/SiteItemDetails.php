<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteItemDetails extends Model {

	protected $table='site_item_details';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function item_descr(){
		return $this->hasMany('App\SiteItemDescr','itemdata_id','id');
	}
}
