<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendorMaterialsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('vendor_materials', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('store_material_id')->unsigned();
			$table->foreign('store_material_id')->references('id')->on('store_materials');
			$table->integer('vendor_id')->unsigned();
			$table->foreign('vendor_id')->references('id')->on('vendor_materials');

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('vendor_materials');
	}

}
