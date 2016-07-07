<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class InspectionDispatchMailer extends Model {

	protected $table='inspection_dispatch_mailer';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function attachments() {

		return $this->hasMany('App\InspectionDispatchMailerAttachments','inspection_dispatch_id','id');
	}

	public function sender() {

		return $this->hasOne('App\User','id','sent_by');
	}

	
}
