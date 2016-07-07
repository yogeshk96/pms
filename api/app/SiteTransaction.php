<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteTransaction extends Model {

	protected $table='site_transactions';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
