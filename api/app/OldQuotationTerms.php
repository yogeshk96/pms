<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldQuotationTerms extends Model {

	protected $table='old_quotation_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

	public function quotationdefault() {

		return $this->hasOne('App\QuotationDefaultTerms','id','quotation_default_term_id');
	}
	
}
