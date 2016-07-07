<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoresTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('stores', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name',100);
			$table->string('location',1000);
			$table->integer('company_id')->unsigned();
			$table->integer('user_id')->unsigned();
			$table->unique('user_id');
			$table->foreign('user_id')->references('id')->on('users');
			$table->foreign('company_id')->references('id')->on('companies');
			$table->index('company_id');
			$table->integer('created_by')->unsigned();
			$table->foreign('created_by')->references('id')->on('users');
			$table->integer('activation')->unsigned();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('stores');
	}

}
