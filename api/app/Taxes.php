<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Taxes extends Model {

	protected $table='taxes';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function enqtaxes() {

		return $this->hasMany('App\EnquiryTaxes','tax_id','id');
	}

}
