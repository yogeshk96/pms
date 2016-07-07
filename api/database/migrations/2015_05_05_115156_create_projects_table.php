<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('projects', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('company_id')->unsigned();
			$table->integer('created_by')->unsigned();
			$table->integer('user_id')->unsigned();
			$table->string('name',100);
			$table->text('descr');
			$table->string('cost',100);
			$table->string('projectcode',10);
			$table->string('projecttype',20);
			$table->foreign('company_id')->references('id')->on('companies');
			$table->foreign('created_by')->references('id')->on('users');
			$table->foreign('user_id')->references('id')->on('users');
			$table->index('created_by');
			$table->index('company_id');
			$table->index('user_id');
			$table->integer('activation')->default(1);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('projects');
	}

}
