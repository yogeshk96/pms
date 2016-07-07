<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteMaterialsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_materials', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('site_id')->unsigned();
			$table->integer('material_id')->unsigned();
			$table->integer('quantity')->default(0);
			$table->integer('opening')->default(0);
			$table->integer('created_by')->unsigned();
			$table->integer('activation')->default(1);
			$table->foreign('site_id')->references('id')->on('sites');
			$table->foreign('material_id')->references('id')->on('store_materials');
			$table->foreign('created_by')->references('id')->on('users');
			$table->index('site_id');
			$table->index('material_id');
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
		Schema::drop('site_materials');
	}

}
