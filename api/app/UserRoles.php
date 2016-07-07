<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRoles extends Model {

	protected $table='user_roles';
	protected $guarded = ['id', 'created_at', 'updated_at'];
}
