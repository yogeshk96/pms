<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

use App\Company;
use App\UserRoles;
use App\User;
use App\WorkTypes;
use App\StoreMaterial;
use App\SiteItems;
use App\SiteItemDetails;
use App\DocumentTypes;
use App\Subscription;
use App\SiteItemDescr;
use App\MaterialCategory;
use App\BoqMaterial;
use App\Modules;
use App\Menu;
use App\ReceiptTypeStatus;
use App\CompanyDetail;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		$this->call('CompanyTableSeeder');
		$this->call('CompanyDetailTableSeeder');
		$this->call('UserRolesTableSeeder');
		$this->call('UserTableSeeder');
		$this->call('WorkTypesTableSeeder');
		$this->call('MaterialCategoryTableSeeder');
		$this->call('StoreMaterialTableSeeder');
		$this->call('SiteItemsTableSeeder');
		$this->call('SiteItemDetailsTableSeeder');
		$this->call('DocumentTypesTableSeeder');
		$this->call('SubscriptionTableSeeder');
		$this->call('SiteItemDescrTableSeeder');
		$this->call('BoqMaterialTableSeeder');
		$this->call('ModulesTableSeeder');
		$this->call('MenuTableSeeder');
		$this->call('ReceiptTypeStatusTableSeeder');
		
	}
}

class CompanyDetailTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('company_details')->delete();
		CompanyDetail::create(['company_id'=>1,'fullname'=>'Shirdi Sai Electrical','address'=>'Industrial Estate Kadapa','state'=>'Andhra Pradesh','city'=>'Kadapa','pincode'=>'500038','tin'=>'AWAPC9112D','tele_no'=>'040-23554749','ecc_no'=>'UTIBRN76642K','emailid'=>'emails@ssel.in','website'=>'www.ssel.in']);
		CompanyDetail::create(['company_id'=>2,'fullname'=>'Shirdi Sai Electrical','address'=>'Industrial Estate Kadapa','state'=>'Andhra Pradesh','city'=>'Kadapa','pincode'=>'500038','tin'=>'AWAPC9112D','tele_no'=>'040-23554749','ecc_no'=>'UTIBRN76642K','emailid'=>'emails@ssel.in','website'=>'www.ssel.in']);
	}

}

class MenuTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('menus')->delete();
		Menu::create(['module_id'=>1,'role'=>1,'menu'=>'Create User','slug'=>'createuser','sidebar_itemname'=>'createuser','priority'=>1]);
		Menu::create(['module_id'=>1,'role'=>1,'menu'=>'Edit Users','slug'=>'editusers','sidebar_itemname'=>'editusers','priority'=>2]);
		Menu::create(['module_id'=>1,'role'=>1,'menu'=>'Create Project','slug'=>'createproject.create','sidebar_itemname'=>'createproject','priority'=>3]);
		Menu::create(['module_id'=>1,'role'=>1,'menu'=>'Assign Work IDs','slug'=>'assignworkids.hvds','sidebar_itemname'=>'assignworkids','priority'=>4]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Inventory Management','slug'=>'inventorymanagement.stockinventory','sidebar_itemname'=>'inventorymanagement','priority'=>1]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Reports','slug'=>'reports.reconciliation','sidebar_itemname'=>'reports','priority'=>2]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Add a Material Type','slug'=>'addmaterialtype','sidebar_itemname'=>'addmaterialtype','priority'=>3]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Add Third Party','slug'=>'addthirdparty','sidebar_itemname'=>'addthirdparty','priority'=>6]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'BOQ, BOM Mapping','slug'=>'boqbommapping','sidebar_itemname'=>'boqbommapping','priority'=>5]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Add Inhouse Vendor','slug'=>'addinhousevendor','sidebar_itemname'=>'addinhousevendor','priority'=>7]);
		Menu::create(['module_id'=>3,'role'=>6,'menu'=>'Vendor Registration','slug'=>'vendorregistration','sidebar_itemname'=>'vendorregistration','priority'=>1]);
		Menu::create(['module_id'=>3,'role'=>6,'menu'=>'Send Enquiry','slug'=>'sendenquiry','sidebar_itemname'=>'sendenquiry','priority'=>2]);
		Menu::create(['module_id'=>3,'role'=>6,'menu'=>'Raise Purchase Order','slug'=>'raisepurchaseorder','sidebar_itemname'=>'raisepurchaseorder','priority'=>3]);
		Menu::create(['module_id'=>4,'role'=>7,'menu'=>'Client Billing','slug'=>'clientbilling','sidebar_itemname'=>'clientbilling','priority'=>1]);
		Menu::create(['module_id'=>4,'role'=>7,'menu'=>'Sub Contractor Billing','slug'=>'subcontractorbilling','sidebar_itemname'=>'subcontractorbilling','priority'=>2]);
		Menu::create(['module_id'=>4,'role'=>7,'menu'=>'Recovery','slug'=>'recovery','sidebar_itemname'=>'recovery','priority'=>3]);
		Menu::create(['module_id'=>2,'role'=>5,'menu'=>'Add a Material','slug'=>'addmaterials','sidebar_itemname'=>'addmaterials','priority'=>4]);
		Menu::create(['module_id'=>3,'role'=>6,'menu'=>'Reports','slug'=>'reports.poreport','sidebar_itemname'=>'reports','priority'=>4]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Add a Material','slug'=>'addmaterials','sidebar_itemname'=>'addmaterials','priority'=>2]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Add a Material Type','slug'=>'addmaterialtype','sidebar_itemname'=>'addmaterialtype','priority'=>1]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Edit Material','slug'=>'editmaterial','sidebar_itemname'=>'editmaterial','priority'=>3]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Add/Delete Vendor Materials','slug'=>'editvendormaterials','sidebar_itemname'=>'editvendormaterials','priority'=>4]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Upload PO Documents','slug'=>'uploadpodocuments','sidebar_itemname'=>'uploadpodocuments','priority'=>5]);
		Menu::create(['module_id'=>5,'role'=>6,'menu'=>'Add default terms','slug'=>'adddefaultterms','sidebar_itemname'=>'adddefaultterms','priority'=>6]);

	}

}

class ModulesTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('modules')->delete();
		Modules::create(['role'=>1,'module'=>'Admin','color'=>'#9b59b6','icon'=>'fa fa-user-plus','slug'=>'admin','priority'=>1]);
		Modules::create(['role'=>5,'module'=>'Warehouse','color'=>'#e67e22','icon'=>'fa fa-home','slug'=>'warehouse','priority'=>2]);
		Modules::create(['role'=>6,'module'=>'Purchases','color'=>'#e67e22','icon'=>'fa fa-home','slug'=>'purchases','priority'=>3]);
		Modules::create(['role'=>6,'module'=>'Admin','color'=>'#a40004','icon'=>'fa fa-user-plus','slug'=>'admin','priority'=>3]);
		Modules::create(['role'=>7,'module'=>'Billing','color'=>'#e67e22','icon'=>'fa fa-home','slug'=>'billing','priority'=>4]);
	}

}

class BoqMaterialTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('boq_materials')->delete();
		BoqMaterial::create(['name'=>'Transformer','units'=>'NOS','created_by'=>1]);
		BoqMaterial::create(['name'=>'Poles','units'=>'NOS','created_by'=>1]);
	}

}

class MaterialCategoryTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('material_categories')->delete();
		MaterialCategory::create(['name'=>'Transformer']);
		MaterialCategory::create(['name'=>'Poles']);
	}

}

class DocumentTypesTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('document_types')->delete();
		DocumentTypes::create(['doctype'=>1,'name'=>'Delivery Challan']);
		DocumentTypes::create(['doctype'=>2,'name'=>'Contract Agreement']);
	}

}

class SiteItemDescrTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('site_item_descrs')->delete();
		SiteItemDescr::create(['itemdata_id'=>3,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>3,'response'=>'No']);
		SiteItemDescr::create(['itemdata_id'=>4,'response'=>'Pole']);
		SiteItemDescr::create(['itemdata_id'=>4,'response'=>'Plinth']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>5,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>6,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>7,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>8,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>8,'response'=>'No']);
		SiteItemDescr::create(['itemdata_id'=>9,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>9,'response'=>'No']);
		SiteItemDescr::create(['itemdata_id'=>11,'response'=>'Iron']);
		SiteItemDescr::create(['itemdata_id'=>11,'response'=>'Pscc']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>12,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>13,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>14,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>15,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>16,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>17,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'0']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'1']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'2']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'3']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'4']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'5']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'6']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'7']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'9']);
		SiteItemDescr::create(['itemdata_id'=>20,'response'=>'10']);
		SiteItemDescr::create(['itemdata_id'=>18,'response'=>'8']);
		SiteItemDescr::create(['itemdata_id'=>18,'response'=>'9.1']);
		SiteItemDescr::create(['itemdata_id'=>19,'response'=>'Good']);
		SiteItemDescr::create(['itemdata_id'=>19,'response'=>'Bad']);
		SiteItemDescr::create(['itemdata_id'=>21,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>21,'response'=>'No']);
		SiteItemDescr::create(['itemdata_id'=>22,'response'=>'LT Line']);
		SiteItemDescr::create(['itemdata_id'=>22,'response'=>'AB Cable']);
		SiteItemDescr::create(['itemdata_id'=>23,'response'=>'Good']);
		SiteItemDescr::create(['itemdata_id'=>23,'response'=>'Bad']);
		SiteItemDescr::create(['itemdata_id'=>24,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>24,'response'=>'No']);
		SiteItemDescr::create(['itemdata_id'=>28,'response'=>'Yes']);
		SiteItemDescr::create(['itemdata_id'=>28,'response'=>'No']);
	}

}

class CompanyTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('companies')->delete();
		Company::create(['name'=>'Admin']);
		Company::create(['name'=>'SSE']);
	}
}

class SubscriptionTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('subscriptions')->delete();
		Subscription::create(['company_id'=>2,'wms'=>1,'survey'=>1,'accounting'=>1,'purchases'=>1]);
	}
}

class StoreMaterialTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('store_materials')->delete();
		StoreMaterial::create(['name'=>'16KVA 3-Phase Transformer','units'=>'NOS','category_id'=>1,'created_by'=>1]);
		StoreMaterial::create(['name'=>'25KVA 3-Phase Transformer','units'=>'NOS','category_id'=>1,'created_by'=>1]);
		StoreMaterial::create(['name'=>'8m PSSC Pole','units'=>'NOS','category_id'=>2,'created_by'=>1]);
		StoreMaterial::create(['name'=>'10m PSSC Pole','units'=>'NOS','category_id'=>2,'created_by'=>1]);
	}

}


class SiteItemDetailsTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('site_item_details')->delete();
		SiteItemDetails::create(['item_id'=>1,'data'=>'Make','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Capacity','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'AB Switch','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Mount','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Cross Arm','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Shakles','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Pin Insulators','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'HG Fuse Set','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'LT Fuse Set','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>1,'data'=>'Other','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Pole Type','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'LT Cross Arm','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Top Cleat','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'LT Pin Insulators','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'LT Shakles','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'LT Staysets','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'No of Wires','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Pole Height','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Pole Condition','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Guy Insulators','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'LT/HT','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Conductor Type','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Conductor Condition','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'HT Crossing','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>2,'data'=>'Other','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>3,'data'=>'Service No','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>3,'data'=>'Load','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>3,'data'=>'Authorisation','datatype'=>'2']);
		SiteItemDetails::create(['item_id'=>3,'data'=>'Service Holder','datatype'=>'1']);
		SiteItemDetails::create(['item_id'=>3,'data'=>'Other','datatype'=>'1']);
	}

}

class SiteItemsTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('site_items')->delete();
		SiteItems::create(['name'=>'MDTR','itemtype'=>1]);
		SiteItems::create(['name'=>'LT POLE','itemtype'=>1]);
		SiteItems::create(['name'=>'SERVICE','itemtype'=>1]);
	}

}

class WorkTypesTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('work_types')->delete();
		WorkTypes::create(['type'=>'HVDS','code'=>'HVDS']);
		WorkTypes::create(['type'=>'Sub Station Construction','code'=>'SSC']);
	}

}

class UserRolesTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('user_roles')->delete();
		UserRoles::create(['role'=>'0','name'=>'Main Admin']);
		UserRoles::create(['role'=>'1','name'=>'Admin']);
		UserRoles::create(['role'=>'2','name'=>'Projects Head']);
		UserRoles::create(['role'=>'3','name'=>'Project Manager']);
		UserRoles::create(['role'=>'4','name'=>'Supervisor']);
		UserRoles::create(['role'=>'5','name'=>'Store Manager']);
		UserRoles::create(['role'=>'6','name'=>'Purchases']);
		UserRoles::create(['role'=>'7','name'=>'Billing']);
	}

}


class UserTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('users')->delete();
		User::create(['username'=>'mainadmin','email'=>'pradyumna@pixelvide.com','password'=>'6b1bebf39a6c17d8f2423f478ff40cd096fbcc38949152d893a2057955594570','designation'=>'Main Admin','name'=>'Pradyumna','phoneno'=>'9705856878','address'=>'Pixelvide, Hyderabad','role'=>0,'company_id'=>1]);
		User::create(['username'=>'admin','email'=>'admin@ssel.in','password'=>'f902f060476029043a6ae6cddf12bbbabb4bfc29531c018dde4439729541d165','designation'=>'Admin','name'=>'Admin','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>1,'company_id'=>2]);
		User::create(['username'=>'manager','email'=>'manager@ssel.in','password'=>'075cfdc5bee29b943a4f2d00bb3520d03615279115c03f26f9481becd3d9eafe','designation'=>'Store Manager','name'=>'Admin','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>5,'company_id'=>2]);
		User::create(['username'=>'purchases','email'=>'manager@ssel.in','password'=>'46a71d3305a5f9d04cf8771fdac0cdd6fb04988500a68d9d00110f89db0ede5c','designation'=>'Purchases','name'=>'Purchases','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>6,'company_id'=>2]);
		User::create(['username'=>'billing','email'=>'manager@ssel.in','password'=>'11ed593a9eb24c2719ca0294d2865f73419fbd748a51f4100da1f5278345f11b','designation'=>'Billing','name'=>'Billing','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>7,'company_id'=>2]);
		User::create(['username'=>'projecthead','email'=>'projecthead@ssel.in','password'=>'1945bc9305474d18008693122b9ef3c7ab0ae4b970f0666bf9c8221c42e7fd59','designation'=>'Project Head','name'=>'Project Head','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>2,'company_id'=>2]);
		User::create(['username'=>'projectmanager','email'=>'projectmanager@ssel.in','password'=>'ed86c8f9c8c16b7d27c04e9249d65e956ebaa11d494d1c6e5d3cb59d2d562dc0','designation'=>'Project Manager','name'=>'Project Manager','phoneno'=>'9705856878','address'=>'SSE, Kadapa','role'=>3,'company_id'=>2]);
	}

}

class ReceiptTypeStatusTableSeeder extends seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		DB::table('receipt_type_statuses')->delete();
		ReceiptTypeStatus::create(['name'=>'Local purchase']);
		ReceiptTypeStatus::create(['name'=>'Company purchase']);
		ReceiptTypeStatus::create(['name'=>'Received from another store']);
		ReceiptTypeStatus::create(['name'=>'In house production']);
		ReceiptTypeStatus::create(['name'=>'Material return scrap']);
		ReceiptTypeStatus::create(['name'=>'Material return from sub contractor']);
		ReceiptTypeStatus::create(['name'=>'Received from third party']);		
	}
}