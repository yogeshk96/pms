<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQueriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('queries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned();
			$table->integer('resolved_by')->unsigned();
			$table->text('query');
			$table->text('answer');
			$table->string('phoneno',20);
			$table->string('email',100);
			$table->integer('status')->default(0);
			$table->foreign('user_id')->references('id')->on('users');
			$table->foreign('resolved_by')->references('id')->on('users');
			$table->index('user_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('queries');
	}

}
