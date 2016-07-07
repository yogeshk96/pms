<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class IndentMaterial extends Model {

	protected $table='indent_materials';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	public function mat(){
		return $this->belongsTo('App\StoreMaterial','material_id','id');
	}
	public function indent(){
		return $this->hasOne('App\Indent','id','indent_id');
	}

	public function subschprojindent(){
		return $this->hasMany('App\SubScheduleProjectIndent','indent_id','indent_id');
	}
	
}