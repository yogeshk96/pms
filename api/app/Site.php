<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Site extends Model {

	protected $table='sites';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function workids(){
		return $this->belongsTo('App\WorkId','work_id','id');
	}

	public function siteinfo(){
		return $this->hasMany('App\SiteInfo','site_id','id');
	}
}
