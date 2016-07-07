<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_addons', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('created_by')->unsigned();
			$table->integer('material_id')->unsigned();
			$table->integer('made_from')->unsigned();
			$table->string('ratio',100);
			$table->foreign('material_id')->references('id')->on('store_materials');
			$table->foreign('made_from')->references('id')->on('store_materials');
			$table->foreign('created_by')->references('id')->on('users');
			$table->index('material_id');
			$table->index('made_from');
			$table->index('created_by');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_addons');
	}

}
