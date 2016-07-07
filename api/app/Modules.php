<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Modules extends Model {

	protected $table='modules';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function menus() {

		return $this->hasMany('App\Menu','module_id','id')->orderBy('menus.priority', 'asc');
	}
}
