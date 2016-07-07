<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseTaxesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('purchase_taxes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('purchase_id')->unsigned();
			$table->string('name',100);
			$table->string('type', 20);
			$table->string('value',20);
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
		Schema::drop('purchase_taxes');
	}

}
