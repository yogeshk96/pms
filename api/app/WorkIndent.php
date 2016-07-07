<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkIndent extends Model {

	public function indentmats() {
		return $this->hasMany('App\WorkIndentMats','indent_id','id');
	}

}
