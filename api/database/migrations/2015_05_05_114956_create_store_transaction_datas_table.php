<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTransactionDatasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_transaction_datas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('trans_id')->unsigned();
			$table->integer('stock_id')->unsigned();
			$table->integer('quantity')->default(0);
			$table->foreign('trans_id')->references('id')->on('store_transactions');
			$table->foreign('stock_id')->references('id')->on('store_stocks');
			$table->integer('pomaterial_id');
			$table->integer('material_id')->unsigned();
			$table->foreign('material_id')->references('id')->on('store_materials');
			$table->integer('type')->default(1);
			$table->string('supplier_name', 100);
			$table->integer('trans_data_id')->default(0);
			$table->integer('manager_id')->default(0);
			$table->integer('feeder_id')->default(0);
			$table->integer('vendor_id')->default(0);
			$table->integer('unit_rate')->default(0);
			$table->integer('total_cost')->default(0);
			$table->integer('dc_received_qty')->default(0);
			$table->integer('shortage_qty')->default(0);
			$table->integer('damaged_qty')->default(0);
			$table->integer('accepted_qty')->default(0);
			$table->integer('scrap_qty')->default(0);
			$table->integer('scrap_cost')->default(0);
			$table->integer('defective_qty')->default(0);
			$table->integer('defective_cost')->default(0);
			$table->integer('usable_qty')->default(0);
			$table->integer('usable_cost')->default(0);
			$table->index('trans_id');
			$table->index('stock_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_transaction_datas');
	}

}
