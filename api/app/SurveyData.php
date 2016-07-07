<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyData extends Model {

	protected $table='survey_datas';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
