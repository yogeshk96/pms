<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendorsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('vendors', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name',100);
			$table->string('emailid',100);
			$table->string('alternate_emailid',100);
			$table->string('phoneno',100);
			$table->string('alternate_phoneno',100);
			$table->string('vendor_code',100);
			$table->text('address');
			$table->integer('inhouse');
			$table->integer('created_by')->unsigned();
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
		Schema::drop('vendors');
	}

}
