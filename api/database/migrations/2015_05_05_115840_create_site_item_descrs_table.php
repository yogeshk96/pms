<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteItemDescrsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_item_descrs', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('itemdata_id')->unsigned();
			$table->text('response');
			$table->foreign('itemdata_id')->references('id')->on('site_item_details');
			$table->index('itemdata_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_item_descrs');
	}

}
