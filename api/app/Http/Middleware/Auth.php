<?php namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use App\Session;

class Auth {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$date=Carbon::now();
		if(!$request->header('JWT-AuthToken'))
		{
			abort('401','Unauthorized Access');
		}
		else
		{
			$tkn=$request->header('JWT-AuthToken');
			$userdata=Session::where('refreshtoken','=',$tkn)->where('expiry_time','>',$date)->whereHas('users',function($q){
				$q->where('activation','=','1');
			})->count();
			if($userdata>0)
			{
				$user=Session::where('refreshtoken','=',$tkn)->where('expiry_time','>',$date)->orderby('id','desc')->first();
				$user->expiry_time=Carbon::now()->addHours(3);
				$user->save();
			}
			else
			{
				
				abort('402','Session Timed Out');
			}
		}
		return $next($request);
	}

}
