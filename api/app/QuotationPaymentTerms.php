<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class QuotationPaymentTerms extends Model {

	protected $table='quotation_payment_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
