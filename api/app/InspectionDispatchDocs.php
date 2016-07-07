<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDispatchDocs extends Model {

	protected $table='inspection_dispatch_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
}
