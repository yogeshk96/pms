<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SpecialTerm extends Model {

	protected $table='special_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	
}
