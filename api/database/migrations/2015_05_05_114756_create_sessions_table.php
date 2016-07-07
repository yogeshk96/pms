<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSessionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sessions', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->timestamp('login_time');
			$table->timestamp('expiry_time');
			$table->string('refreshtoken',100);
			$table->foreign('user_id')->references('id')->on('users');
			$table->index('user_id');
			$table->index('expiry_time');
			$table->unique('refreshtoken');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('sessions');
	}

}
