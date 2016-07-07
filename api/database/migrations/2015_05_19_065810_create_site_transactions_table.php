<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteTransactionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_transactions', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('created_by')->unsigned();
			$table->integer('site_id')->unsigned();
			$table->integer('type')->default(1);
			$table->foreign('created_by')->references('id')->on('users');
			$table->foreign('site_id')->references('id')->on('sites');
			$table->index('created_by');
			$table->index('site_id');
			$table->integer('status')->default(0);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_transactions');
	}

}
