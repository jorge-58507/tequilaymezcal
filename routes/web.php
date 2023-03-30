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

Route::get('/', function () {
    return view('welcome');
})->name('welcome');
Route::get('/request', function () {
    return view('request.index');
})->name('request')->middleware('auth');

Route::get('configuration', 'configurationController@index')->middleware('auth');
Route::get('product/{param}/count', 'productController@show_quantity')->middleware('auth');
Route::get('prefix/{prefix}', 'ubicationController@getPrefix');
Route::get('price/{param}/article', 'priceController@showByArticle')->middleware('auth');
Route::get('request/{param}/table', 'requestController@showByTable')->middleware('auth');
Route::get('request/{param}/bar', 'requestController@showByBar')->middleware('auth');
Route::get('command/{param}/byrequest', 'commandController@getByRequest_json')->middleware('auth');
Route::get('paydesk/{param}/creditnote', 'creditnoteController@getByCharge_json')->middleware('auth');
Route::get('depletion/{param}/article', 'depletionController@getByArticle')->middleware('auth');
Route::get('charge/{param}/cashregister', 'chargeController@show_cashregister')->middleware('auth');

Route::post('product/{slug}/measure', 'measureproductController@save')->middleware('auth');
// Route::post('article/product', 'measureproductController@save')->middleware('auth');
Route::post('product/{param}/count', 'productController@update_quantity')->middleware('auth');
Route::post('creditnote/{param}/nullify', 'creditnoteController@nullify')->middleware('auth');
Route::post('depletion/{param}/article', 'depletionController@depletionByArticle')->middleware('auth');
Route::post('/table_upd/', 'tableController@renovate')->middleware('auth');

Route::delete('product/{param}/measure', 'measureproductController@delete')->middleware('auth');

Route::put('request/{param}/client/table', 'requestController@update_rel')->middleware('auth');
Route::put('request/{param}/close', 'requestController@close')->middleware('auth');
Route::put('command/{param}/cancel', 'commanddataController@cancel')->middleware('auth');
Route::put('depletion/{param}/aprove', 'depletionController@aprove')->middleware('auth');
Route::put('depletion/approve_all', 'depletionController@approve_all')->middleware('auth');


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



// Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');

// Route::get('/home', 'HomeController@index')->name('home');
Auth::routes();

// Route::get('/login', function (Request $request) {      return redirect('/');   });
// Route::get('/gin', function (Request $request) {      return redirect('/');   });


