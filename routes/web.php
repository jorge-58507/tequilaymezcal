<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\User;

Route::get('/', function () {
    $rs_user = User::select('name','email')->get();
    $data = ['user_list'=>$rs_user];
    return view('welcome', compact('data'));
})->name('welcome');
Route::get('/request', function () {
    return view('request.index');
})->name('request')->middleware('auth');
Route::get('/report', function () {
    return view('report.index');
})->middleware('auth');

// Route::get('test', 'configurationController@test')->middleware('auth');


Route::get('configuration', 'configurationController@index')->middleware('auth');
Route::get('product/{param}/count', 'productController@show_quantity')->middleware('auth');
Route::get('prefix/{prefix}', 'ubicationController@getPrefix');
Route::get('price/{param}/article', 'priceController@showByArticle')->middleware('auth');
Route::get('request/{param}/table', 'requestController@showByTable')->middleware('auth');
Route::get('request/{param}/bar', 'requestController@showByBar')->middleware('auth');
Route::get('request/reload', 'requestController@reload');
Route::get('command/{param}/byrequest', 'commandController@getByRequest_json')->middleware('auth');
Route::get('paydesk/{param}/creditnote', 'creditnoteController@getByCharge_json')->middleware('auth');
Route::get('depletion/{param}/article', 'depletionController@getByArticle')->middleware('auth');
Route::get('charge/{param}/cashregister', 'chargeController@show_cashregister')->middleware('auth');
Route::get('cashregister/{param}/filter', 'cashregisterController@filter')->middleware('auth');
Route::get('dataproductinput/{param}', 'productinputController@show_data')->middleware('auth');
Route::get('provider/{param}/requisition', 'requisitionController@get_requisitionByRequisition')->middleware('auth');
Route::get('userlog/{param}', 'articleController@get_user');
Route::get('kitchen/reload', 'kitchenController@reload');

Route::post('product/{slug}/measure', 'measureproductController@save')->middleware('auth');
// Route::post('article/product', 'measureproductController@save')->middleware('auth');
Route::post('product/{param}/count', 'productController@update_quantity')->middleware('auth');
Route::post('creditnote/{param}/nullify', 'creditnoteController@nullify')->middleware('auth');
Route::post('depletion/{param}/article', 'depletionController@depletionByArticle')->middleware('auth');
Route::post('/table_upd/', 'tableController@renovate')->middleware('auth');
Route::post('/article_upd/', 'articleController@renovate')->middleware('auth');
Route::post('/paymentprovider/productinput', 'paymentproviderController@create')->middleware('auth');
Route::post('/report/show', 'reportController@show');
Route::post('/article/product', 'articleproductController@save');

Route::delete('product/{param}/measure', 'measureproductController@delete')->middleware('auth');
Route::delete('purchase/{param}/return', 'productinputController@return')->middleware('auth');
Route::delete('dataproductinput/{param}', 'productinputController@delete_data')->middleware('auth');
Route::delete('/article/product', 'articleproductController@delete');

Route::put('request/{param}/client/table', 'requestController@update_rel')->middleware('auth');
Route::put('request/{param}/close', 'requestController@close')->middleware('auth');
Route::put('command/{param}/cancel', 'commanddataController@cancel')->middleware('auth');
Route::put('depletion/{param}/aprove', 'depletionController@aprove')->middleware('auth');
Route::put('depletion/approve_all', 'depletionController@approve_all')->middleware('auth');
Route::put('command/{param}/setready', 'commandController@set_ready')->middleware('auth');
Route::put('requisition/{param}/provider', 'requisitionController@upd_provider')->middleware('auth');
Route::put('dataproductinput/{param}', 'productinputController@update_data')->middleware('auth');



// Route::resource('article/presentation', 'articlepresentationController')->middleware('auth');
Route::resource('ubication', 'ubicationController')->middleware('auth');
Route::resource('table',   'tableController')->middleware('auth');
Route::resource('product', 'productController')->middleware('auth');
Route::resource('article', 'articleController')->middleware('auth');
Route::resource('price', 'priceController')->middleware('auth');
Route::resource('request', 'requestController')->middleware('auth');
Route::resource('client', 'clientController')->middleware('auth');
Route::resource('command', 'commandController')->middleware('auth');
Route::resource('paydesk', 'chargeController')->middleware('auth');
Route::resource('creditnote', 'creditnoteController')->middleware('auth');
Route::resource('cashoutput', 'cashoutputController')->middleware('auth');
Route::resource('depletion', 'depletionController')->middleware('auth');
Route::resource('cashregister', 'cashregisterController')->middleware('auth');
Route::resource('kitchen', 'kitchenController')->middleware('auth');
Route::resource('purchase', 'productinputController')->middleware('auth');
Route::resource('provider', 'providerController')->middleware('auth');
Route::resource('requisition', 'requisitionController')->middleware('auth');
Route::resource('giftcard', 'giftcardController')->middleware('auth');
Route::resource('stock', 'stockController')->middleware('auth');
Route::resource('paymentprovider', 'paymentproviderController')->middleware('auth');
Route::resource('datapaymentprovider', 'datapaymentproviderController')->middleware('auth');
Route::resource('productoutput', 'productoutputController')->middleware('auth');

// PRINT
Route::get('print_cashregister/{param}', 'printController@print_cashregister');
Route::get('print_requisition/{param}', 'printController@print_requisition');
Route::get('print_productoutput/{param}', 'printController@print_productoutput');
Route::get('print_paymentprovider/{param}', 'printController@print_paymentprovider');
Route::get('print_charge/{param}', 'printController@print_charge');



// Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');

// Route::get('/home', 'HomeController@index')->name('home');
Auth::routes();

// Route::get('/login', function (Request $request) {      return redirect('/');   });
// Route::get('/gin', function (Request $request) {      return redirect('/');   });


