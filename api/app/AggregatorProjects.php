<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class AggregatorProjects extends Model {

	protected $table='aggregator_projects';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
