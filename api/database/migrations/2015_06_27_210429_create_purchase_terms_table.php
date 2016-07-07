<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseTermsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('purchase_terms', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('purchase_id')->unsigned();
			$table->text('name');
			$table->text('condition');
			$table->foreign('purchase_id')->references('id')->on('purchase_orders');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('purchase_terms');
	}

}
