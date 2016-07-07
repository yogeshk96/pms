<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class DispatchCallRaising extends Model {

	protected $table='dispatch_call_raising';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function attachments() {

		return $this->hasMany('App\DispatchCallRaisingAttachments','dispatch_call_raising_id','id');
	}

	public function sender() {

		return $this->hasOne('App\User','id','sent_by');
	}

	
}
