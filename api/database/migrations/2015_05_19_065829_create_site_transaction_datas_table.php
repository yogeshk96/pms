<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteTransactionDatasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_transaction_datas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('trans_id')->unsigned();
			$table->integer('material_id')->unsigned();
			$table->integer('quantity')->default(0);
			$table->foreign('trans_id')->references('id')->on('site_transactions');
			$table->foreign('material_id')->references('id')->on('site_materials');
			$table->integer('type')->default(1);
			$table->index('trans_id');
			$table->index('material_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_transaction_datas');
	}

}
