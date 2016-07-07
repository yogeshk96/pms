<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectDocuments extends Model {

	protected $table='project_documents';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
