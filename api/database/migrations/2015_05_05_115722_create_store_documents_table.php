<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreDocumentsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_documents', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('doctype');
			$table->string('docpath',100);
			$table->integer('data_id')->unsigned();
			$table->foreign('data_id')->references('id')->on('store_datas');
			$table->index('data_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_documents');
	}

}
