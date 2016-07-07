<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSurveyDatasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('survey_datas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('survey_id')->unsigned();
			$table->integer('user_id')->unsigned();
			$table->integer('item_id')->unsigned();
			$table->integer('backlink')->unsigned()->default(0);
			$table->string('photopath',100);
			$table->string('name',100);
			$table->text('descr');
			$table->string('latitude',100);
			$table->string('longitude',100);
			$table->foreign('survey_id')->references('id')->on('surveys');
			$table->foreign('user_id')->references('id')->on('users');
			$table->foreign('item_id')->references('id')->on('site_items');
			$table->index('survey_id');
			$table->index('user_id');
			$table->index('item_id');
			$table->index('backlink');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('survey_datas');
	}

}
