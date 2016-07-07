<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkIdsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('work_ids', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('work_id')->unsigned();
			$table->string('code');
			$table->string('name');
			$table->foreign('work_id')->references('id')->on('work_divisions');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('work_ids');
	}

}
