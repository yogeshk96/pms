<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseOrderMaterialsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('purchase_order_materials', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer("purchase_order_id")->unsigned();
			$table->foreign('purchase_order_id')->references('id')->on('purchase_orders');
			$table->integer("material_id")->unsigned();
			$table->foreign('material_id')->references('id')->on('store_materials');
			$table->integer("quantity");
			$table->integer("unit_rate");
			$table->integer("value_of_goods");
			$table->string("remarks");
			$table->text("deliveryaddress");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('purchase_order_materials');
	}

}
