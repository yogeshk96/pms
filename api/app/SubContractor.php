<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Subcontractor extends Model {

	protected $table='subcontractors';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
