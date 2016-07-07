<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionCallRaising extends Model {

	protected $table='inspection_call_raising';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function attachments() {

		return $this->hasMany('App\InspectionCallRaisingAttachments','inspection_call_raising_id','id');
	}

	public function sender() {

		return $this->hasOne('App\User','id','sent_by');
	}

	
}
