<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class GtpDrawings extends Model {

	protected $table='gtp_drawings';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
