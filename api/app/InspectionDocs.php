<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDocs extends Model {

	protected $table='inspection_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
	public function doctype(){
		return $this->belongsTo('App\InspectionDocTypes','doc_type','id');
	}

}
