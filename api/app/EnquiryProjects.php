<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class EnquiryProjects extends Model {

	protected $table='enquiry_projects';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function subprojects() {
		return $this->hasMany('App\SubProjects','project_id','project_id');
	}

	public function projectdetails() {
		return $this->hasOne('App\Projects','id','project_id');
	}

	public function enquirydetails(){
		return $this->hasOne('App\Enquiry','id','enquiry_id');
	}

}
