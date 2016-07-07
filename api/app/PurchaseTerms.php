<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseTerms extends Model {

	protected $table='purchase_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
