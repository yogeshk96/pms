<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('works', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('project_id')->unsigned();
			$table->string('tires');
			$table->string('code');
			$table->integer('type')->unsigned();
			$table->integer('created_by')->unsigned();
			$table->integer('assigned_to')->unsigned();
			$table->foreign('project_id')->references('id')->on('projects');
			$table->foreign('created_by')->references('id')->on('users');
			$table->foreign('assigned_to')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('works');
	}

}
