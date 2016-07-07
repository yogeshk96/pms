<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('username',100);
			$table->string('email',100);
			$table->string('password',100);
			$table->string('designation');
			$table->string('name',100);
			$table->string('phoneno',100);
			$table->text('address');
			$table->integer('role')->default(0);
			$table->integer('company_id')->unsigned();
			$table->integer('activation')->default(1);
			$table->unique('username');
			$table->foreign('company_id')->references('id')->on('companies');
			$table->index('email');
			$table->index('password');
			$table->index('phoneno');
			$table->index('role');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
	}

}
