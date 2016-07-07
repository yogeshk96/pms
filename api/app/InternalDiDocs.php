<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InternalDiDocs extends Model {

	protected $table='internal_di_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}