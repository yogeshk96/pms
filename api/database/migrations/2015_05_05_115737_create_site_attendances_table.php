<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteAttendancesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_attendances', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('site_id')->unsigned();
			$table->integer('attendance');
			$table->foreign('site_id')->references('id')->on('sites');
			$table->index('site_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_attendances');
	}

}
