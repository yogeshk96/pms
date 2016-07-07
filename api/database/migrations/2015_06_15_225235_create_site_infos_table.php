<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteInfosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_infos', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('site_id')->unsigned();
			$table->text('descr');
			$table->foreign('site_id')->references('id')->on('sites');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_infos');
	}

}
