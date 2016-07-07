<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteInfoDatasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_info_datas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->text('data');
			$table->integer('siteinfo_id')->unsigned();
			$table->foreign('siteinfo_id')->references('id')->on('site_infos');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_info_datas');
	}

}
