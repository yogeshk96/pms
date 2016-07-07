<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubSchedulesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sub_schedules', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('no',50);
			$table->text('descr');
			$table->integer('bom_id')->unsigned();
			$table->integer('qty');
			$table->integer('unit_rate');
			$table->integer('erect_rate');
			$table->integer('total_rate');
			$table->integer('schedule_id')->unsigned();
			$table->foreign('bom_id')->references('id')->on('boq_materials');
			$table->foreign('schedule_id')->references('id')->on('schedules');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('sub_schedules');
	}

}
