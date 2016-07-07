<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Indent extends Model {

	protected $table='indent';
	protected $guarded = ['id', 'created_at', 'updated_at'];	

	public function indentmat() {

		return $this->hasMany('App\IndentMaterial','indent_id','id');
	}

	public function subschprojindent() {

		return $this->hasMany('App\SubScheduleProjectIndent','indent_id','id');
	}
}