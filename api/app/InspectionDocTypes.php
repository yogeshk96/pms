<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDocTypes extends Model {

	protected $table='inspection_docs_types';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
