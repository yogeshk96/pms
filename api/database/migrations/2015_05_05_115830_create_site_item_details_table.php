<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteItemDetailsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_item_details', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('item_id')->unsigned();
			$table->integer('schedule_id')->unsigned();
			$table->text('data');
			$table->decimal('datatype',2,0);
			$table->decimal('type',2,0);
			$table->foreign('item_id')->references('id')->on('site_items');
			$table->foreign('schedule_id')->references('id')->on('sub_schedules');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_item_details');
	}

}
