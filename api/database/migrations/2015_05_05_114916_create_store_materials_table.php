<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreMaterialsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_materials', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->text('name');
			$table->string('units',100);
			$table->string('material_code',100);
			$table->integer('created_by')->unsigned();
			$table->foreign('created_by')->references('id')->on('users');
			$table->integer('type')->default(1);
			$table->integer('category_id')->unsigned();
			$table->foreign('category_id')->references('id')->on('material_categories');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_materials');
	}

}
