<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyItemDetails extends Model {

	protected $table='survey_item_details';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
