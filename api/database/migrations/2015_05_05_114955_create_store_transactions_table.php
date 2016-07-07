<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTransactionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_transactions', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('created_by')->unsigned();
			$table->integer('store_id')->unsigned();
			$table->integer('type')->default(1);
			$table->foreign('created_by')->references('id')->on('users');
			$table->foreign('store_id')->references('id')->on('stores');
			$table->index('created_by');
			$table->index('store_id');
			$table->integer('pono')->default(0);
			$table->integer('receipt_type');
			$table->integer('trans_id');
			$table->integer('third_party_id');
			$table->string('authorized_by', 100);
			$table->string('invoice_no', 100);
			$table->date('invoice_date');
			$table->string('dc_no', 100);
			$table->date('dc_date');
			$table->string('vehicle_no', 100);
			$table->integer('total_qty');
			$table->integer('total_cost');
			$table->integer('total_scrap_qty');
			$table->integer('total_defective_qty');
			$table->integer('total_scrap_cost');
			$table->integer('total_defective_cost');
			$table->integer('total_accepted_amount');
			$table->integer('total_invoice_amount');
			$table->integer('tax_amount');
			$table->integer('frieght_charge');
			$table->integer('lr_no');	
			$table->date('lr_date');
			$table->string('way_bill_no', 100);
			$table->text('remarks');
			$table->integer('status')->default(0);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_transactions');
	}

}
