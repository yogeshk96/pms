<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreDocuments extends Model {

	protected $table='store_documents';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
