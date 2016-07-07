<?php namespace App\Http\Controllers;

use Request;
use Response;
use Carbon\Carbon;
use App\User;
use App\Session;
use App\DataRefresh;
use App\SiteItems;
use App\SiteItemDetails;
use App\SiteItemDescr;
use App\Site;
use App\WorkId;
use App\WorkDivision;
use App\Work;
use App\Projects;
use App\SiteInfo;

class AppCtrl extends Controller {

	public function update(){
		return DataRefresh::select('changed')->orderby('changed','desc')->first();
	}

	public function sitedata(){
		return SiteItems::with('site_items')->with('site_items.item_descr')->get();
	}

	public function upload_attendance(){
		$att=Request::input('dat');
		$tkn=Request::header('JWT-AuthToken');
		$userdata=Session::where('refreshtoken','=',$tkn)->first();
		for($i=0;$i<count($dat);$i++)
		{
			$a=new SiteAttendance;
			$a->site_id=$dat[$i]['site_id'];
			$a->user_id=$userdata->user_id;
			$a->attendance=$dat[$i]['attendance'];
			$a->save();
		}
	}

	public function get_work_id_data(){
		$tkn=Request::header('JWT-AuthToken');
		$user=Session::where('refreshtoken','=',$tkn)->with('users')->first();
		return $sites=Site::where('user_id','=',$user->users->id)->with('siteinfo')->with('workids')->with('workids.feederdata')->with('workids.feederdata.workdata')->with('workids.feederdata.workdata.projects')->get();
	}

	public function get_site_info(){
		$site=Request::input('site');
		return $sites=SiteInfo::where('site_id','=',$site)->get();
	}


}
