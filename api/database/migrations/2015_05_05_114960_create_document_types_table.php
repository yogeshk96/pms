<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocumentTypesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('document_types', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('doctype')->default(0);
			$table->integer('type')->default(0);
			$table->string('name',100);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('document_types');
	}

}
