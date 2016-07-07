<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectDocumentsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('project_documents', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('doctype')->unsigned();
			$table->string('docpath',100);
			$table->integer('project_id')->unsigned();
			$table->foreign('project_id')->references('id')->on('projects');
			$table->foreign('doctype')->references('id')->on('document_types');
			$table->index('project_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('project_documents');
	}

}
