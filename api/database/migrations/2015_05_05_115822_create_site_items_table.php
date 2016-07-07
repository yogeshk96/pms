<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSiteItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_items', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name',100);
			$table->string('itemtype',2);
			$table->string('icon',100);
			$table->string('badicon',100);
			$table->decimal('activation',2,0)->default(1);
			$table->unique('name');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site_items');
	}

}
