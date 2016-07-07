<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentTypes extends Model {

	protected $table='document_types';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
