<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkProgressesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('work_progresses', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('site_id')->unsigned();
			$table->string('photopath',100);
			$table->string('latitude',100);
			$table->string('longitude',100);
			$table->integer('user_id')->unsigned();
			$table->foreign('site_id')->references('id')->on('sites');
			$table->foreign('user_id')->references('id')->on('users');
			$table->index('site_id');
			$table->index('user_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('work_progresses');
	}

}
