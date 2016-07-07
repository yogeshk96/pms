<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkDivisionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('work_divisions', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('work_id')->unsigned();
			$table->integer('assigned_to')->unsigned();
			$table->integer('assigned_by')->unsigned();
			$table->integer('tire')->default(0);
			$table->integer('activation')->default(1);
			$table->string('name');
			$table->string('type');
			$table->integer('backlink')->unsigned()->default(0);
			$table->foreign('work_id')->references('id')->on('works');
			$table->foreign('assigned_to')->references('id')->on('users');
			$table->foreign('assigned_by')->references('id')->on('users');
			$table->index('work_id');
			$table->index('assigned_to');
			$table->index('tire');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('work_divisions');
	}

}
