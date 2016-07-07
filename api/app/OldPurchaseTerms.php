<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class OldPurchaseTerms extends Model {

	protected $table='old_purchase_terms';
	protected $guarded = ['id', 'created_at', 'updated_at'];

}
