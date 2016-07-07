<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreDatasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_datas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('trans_id')->unsigned();
			$table->string('name',100);
			$table->string('phoneno',100);
			$table->integer('user_id')->unsigned()->default(0);
			$table->foreign('trans_id')->references('id')->on('store_transactions');
			$table->index('trans_id');
			$table->index('user_id');
			$table->integer('sendtostore')->default(0);
			$table->integer('sendtosite')->default(0);
			$table->integer('receivefromstore')->default(0);
			$table->integer('receivefromsite')->default(0);
			$table->integer('status')->default(1);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('store_datas');
	}

}
