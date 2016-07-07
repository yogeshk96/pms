<?php namespace App\Http\Controllers;

use Request;
use Response;
use App\User;
use App\Session;
use App\Modules;
use App\Password;
use Carbon\Carbon;
use uploadons3bucket;

class LoginCtrl extends Controller {

	public function get_user_profile(){
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.modules')->first();
		return array('name'=>$userdata->users->name,'designation'=>$userdata->users->designation,'email'=>$userdata->users->email, 'phoneno'=>$userdata->users->phoneno,'address'=>$userdata->users->address);
	}

	public function edit_user_profile(){
		$tkn=Request::header('JWT-AuthToken');
		$sessiondata=Session::where('refreshtoken','=',$tkn)->first();
		$userdata=User::where('id','=',$sessiondata['user_id'])->first();
		$data = Request::all();
		// return $userdata;
		$userdata['name'] = $data['name'];
		$userdata['email'] = $data['email'];
		$userdata['designation'] = $data['designation'];
		$userdata['phoneno'] = $data['phoneno'];
		$userdata['address'] = $data['address'];
		$userdata->save();
		// return array('name'=>$userdata->users->name,'designation'=>$userdata->users->designation,'email'=>$userdata->users->email, 'phoneno'=>$userdata->users->phoneno,'address'=>$userdata->users->address);
	}

	public function uploading(){
		if(Request::hasFile('file'))
		{
			$destination_path="uploads";
			$file = Request::file('file');
			$date = Carbon::now();
			$fileext = $file->getClientOriginalExtension();
			$filesize = $file->getSize();
			$filename = $date->timestamp.'.'.$fileext;
			$up=$file->move($destination_path,$filename);
			if($up)
			{
				$out=array('success',$filename);
			}
			else
			{
				$out=array('error','Error while uploading the file');
			}
		}
		else
		{
			$out=array('error','Please select a file to upload');
		}
		return $out;
	}

	public function change_password(){
		$data=Request::all();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.modules')->first();
		$userid=$userdata->users->id;
		$passwords=Password::where('user_id','=',$userid)->orderby('id')->limit('5')->get();
		if($userdata->users->password!=hash("sha256",$userdata->users->username.$data['old'].'ssepms'))
		{
			return array('Error','Your existing password doesnt match.');
		}
		else
		{
			if($passwords->count()==0)
			{
				$np=new Password;
				$np->user_id=$userid;
				$np->oldpassword=hash("sha256",$userdata->users->username.$data['old'].'ssepms');
				$np->newpassword=hash("sha256",$userdata->users->username.$data['new'].'ssepms');
				$np->save();
				$use=User::where('id','=',$userid)->first();
				$use->password=hash("sha256",$userdata->users->username.$data['new'].'ssepms');
				$use->save();
				return array('Success','Password changed successfully');
			}
			else
			{
				$pass=$passwords->toArray();
				for($i=0;$i<count($pass);$i++)
				{
					if($pass[$i]['oldpassword']==hash("sha256",$userdata->users->username.$data['new'].'ssepms'))
					{
						return array('Error','You cannot have the same password as your last five passwords');
					}
				}
				$np=new Password;
				$np->user_id=$userid;
				$np->oldpassword=hash("sha256",$userdata->users->username.$data['old'].'ssepms');
				$np->newpassword=hash("sha256",$userdata->users->username.$data['new'].'ssepms');
				$np->save();
				$use=User::where('id','=',$userid)->first();
				$use->password=hash("sha256",$userdata->users->username.$data['new'].'ssepms');
				$use->save();
				return array('Success','Password changed successfully');
			}
		}
	}


	public function uploadpodoc(){
		if(Request::hasFile('file'))
		{
			$destination_path="uploads/podocs";
			$file = Request::file('file');
			$date = Carbon::now();
			$fileext = $file->getClientOriginalExtension();
			$filesize = $file->getSize();
			$filename = $date->timestamp.'.'.$fileext;
			$up=$file->move($destination_path,$filename);
			if($up)
			{
				$out=array('success',$filename);
			}
			else
			{
				$out=array('error','Error while uploading the file');
			}
		}
		else
		{
			$out=array('error','Please select a file to upload');
		}
		return $out;
	}

	public function uploaddocs(){

		if(Request::hasFile('file'))
		{
			$destination_path=Request::header('filepath');;
			$file = Request::file('file');
			$date = Carbon::now();
			$originalfilename = $file->getClientOriginalName();
			$fileext = $file->getClientOriginalExtension();
			$originalfilename = str_ireplace(".".$fileext, "", $originalfilename);
			$filesize = $file->getSize();
			$filename = $date->timestamp.'.'.$fileext;
			$up=$file->move($destination_path,$filename);
			if($up)
			{
				$out=array('success',$filename, $originalfilename, $file, $fileext);
			}
			else
			{
				$out=array('error','Error while uploading the file');
			}
		}
		else
		{
			$out=array('error','Please select a file to upload');
		}
		return $out;
	}

	public function login(){
		$date=Carbon::now();
		$userdata=Request::all();
		$usercount=User::where('username','=',$userdata['username'])->where('password','=',hash("sha256",$userdata['username'].$userdata['password'].'ssepms'))->where('activation','=','1')->count();
		if($usercount==1)
		{
			$user=User::where('username','=',$userdata['username'])->where('password','=',hash("sha256",$userdata['username'].$userdata['password'].'ssepms'))->where('activation','=','1')->first();
			$refreshtoken=hash("sha256",$userdata['username'].microtime().'ipsumlorem');
			$login=new Session;
			$login->user_id=$user->id;
			$login->login_time=$date;
			$login->refreshtoken=$refreshtoken;
			$login->expiry_time=Carbon::now()->addHours(3);
			$login->save();
			return array('statusCode'=>'202','message'=>$refreshtoken,'userrole'=>$user->role);
		}
		else
		{
			$userdat=User::where('username','=',$userdata['username'])->count();
			if($userdat==1)
			{
				return array('statusCode'=>'401','message'=>'Please enter correct Password.');
			}
			else
			{
				return array('statusCode'=>'401','message'=>'Please enter valid Username.');
			}
		}
	}

	public function checkuser(){
		$date=Carbon::now();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users.modules')->first();
		return array('username'=>$userdata->users->username,'designation'=>$userdata->users->designation,'role'=>$userdata->users->role, 'modules'=>$userdata->users->modules);
	}

	public function getuserinfo(){
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		return array('userid'=>$userdata->users->id,'username'=>$userdata->users->username,'designation'=>$userdata->users->designation,'role'=>$userdata->users->role,'name'=>$userdata->users->name, 'email'=>$userdata->users->email);
	}

	public function getsidebar(){
		$tkn=Request::header('JWT-AuthToken');
		$slug = Request::input('slug');
		$userdata=Session::where('refreshtoken','=',$tkn)->with('users')->first();

		$userrole = $userdata->users->role;

		$menuitems = Modules::where('role', '=', $userrole)->where('slug', '=', $slug)->with(array('menus'=>function($query){
	        $query->where('live', '=', 1);
	    }))->first();

		return array('menuitems'=>$menuitems);
	}

	public function logout(){
		$date=Carbon::now();
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->orderby('id','desc')->first();
		$userdata->expiry_time=$date;
		$userdata->save();
		return 'Logged Out.';
	}
}
