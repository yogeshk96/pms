<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenusTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('menus', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('module_id')->unsigned();
			$table->integer('role');
			$table->string('menu',100);
			$table->string('slug',100);
			$table->string('sidebar_itemname',100);
			$table->integer('priority');
			$table->foreign('module_id')->references('id')->on('modules');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('menus');
	}

}
