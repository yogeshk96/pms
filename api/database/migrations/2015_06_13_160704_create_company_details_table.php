<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompanyDetailsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('company_details', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer("company_id")->unsigned();
			$table->foreign('company_id')->references('id')->on('companies');
			$table->string('fullname', 500);
			$table->text('address');
			$table->string('state', 100);
			$table->string('city', 100);
			$table->integer('pincode');
			$table->string('tin', 100);
			$table->string('tele_no', 200);
			$table->string('ecc_no', 100);
			$table->string('emailid', 200);
			$table->string('website', 100);
			$table->string('cst', 100);
			$table->string('logo', 500);

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('company_details');
	}

}
