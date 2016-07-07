<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSurveyItemDetailsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('survey_item_details', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('data_id')->unsigned();
			$table->integer('detail_id')->unsigned();
			$table->text('response');
			$table->foreign('data_id')->references('id')->on('survey_datas');
			$table->foreign('detail_id')->references('id')->on('site_item_details');
			$table->index('data_id');
			$table->index('detail_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('survey_item_details');
	}

}
