<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model {

	protected $table='sessions';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function users()
	{	
		return $this->belongsTo('App\User','user_id','id');
	}
}
