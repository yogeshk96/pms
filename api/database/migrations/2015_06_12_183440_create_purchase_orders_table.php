<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseOrdersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('purchase_orders', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('po_no', 200);
			$table->integer('vendor_id')->unsigned();
			$table->foreign('vendor_id')->references('id')->on('vendors');
			$table->integer('project_id')->unsigned();
			$table->foreign('project_id')->references('id')->on('projects');
			$table->text("billingaddress");
			$table->string("transporttype", 100);
			$table->string("deliverylocation", 100);
			$table->string("reference", 500);
			$table->integer("total_qty");
			$table->integer("total_cost");
			$table->text("termsnconditions");
			$table->string("company_approved_po", 1000);
			$table->string("vendor_approved_po", 1000);
			$table->integer("created_by")->unsigned();
			$table->foreign('created_by')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('purchase_orders');
	}

}
