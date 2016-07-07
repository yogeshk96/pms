<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteItemDescr extends Model {

	protected $table='site_item_descrs';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
