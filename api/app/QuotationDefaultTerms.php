<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class QuotationDefaultTerms extends Model {

	protected $table='quotation_default_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];


	public function terms() {

		return $this->hasMany('App\QuotationTerms','quotation_default_term_id','id');
	}
	
}
