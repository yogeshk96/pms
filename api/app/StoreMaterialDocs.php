<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialDocs extends Model {

	protected $table='store_material_docs';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
