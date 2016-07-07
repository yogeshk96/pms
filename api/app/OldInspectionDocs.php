<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldInspectionDocs extends Model {

	protected $table='old_inspection_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];
	
}
