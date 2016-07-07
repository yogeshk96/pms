<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Work extends Model {

	protected $table='works';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function feeders() {
		return $this->hasMany('App\WorkDivision','work_id','id')->where('tire','=',4);
	}

	public function projects(){
		return $this->belongsTo('App\Projects','project_id','id');
	}
}
