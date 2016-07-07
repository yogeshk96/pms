<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteItems extends Model {

	protected $table='site_items';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function site_items(){
		return $this->hasMany('App\SiteItemDetails','item_id','id');
	}
}
