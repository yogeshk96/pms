<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSitesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sites', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('work_id')->unsigned();
			$table->integer('user_id')->unsigned();
			$table->integer('survey_user')->unsigned();
			$table->string('mdtrcode',100);
			$table->string('location',100);
			$table->string('division',100);
			$table->string('subdivision',100);
			$table->string('section',100);
			$table->string('substation',100);
			$table->string('feeder',100);
			$table->string('company',100);
			$table->foreign('work_id')->references('id')->on('work_ids');
			$table->foreign('survey_user')->references('id')->on('users');
			$table->foreign('user_id')->references('id')->on('users');
			$table->index('work_id');
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
		Schema::drop('sites');
	}

}
