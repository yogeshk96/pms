<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreStocksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_stocks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('store_id')->unsigned();
			$table->integer('material_id')->unsigned();
			$table->integer('opening')->default(0);
			$table->integer('quantity')->default(0);
			$table->integer('physical_qty')->default(0);
			$table->integer('defective')->default(0);
			$table->integer('scrap')->default(0);
			$table->integer('created_by')->unsigned();
			$table->integer('activation')->default(1);
			$table->foreign('store_id')->references('id')->on('stores');
			$table->foreign('material_id')->references('id')->on('store_materials');
			$table->foreign('created_by')->references('id')->on('users');
			$table->index('store_id');
			$table->index('material_id');
			$table->index('created_by');
			$table->string('remarks', 1000);
			$table->string('central_store_remarks', 1000);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_stocks');
	}

}
