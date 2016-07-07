<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldQuotationPaymentTerms extends Model {

	protected $table='old_quotation_payment_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
