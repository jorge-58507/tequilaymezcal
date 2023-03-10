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
Route::get('paydesk/{param}/creditnote', 'creditnoteController@getByCharge')->middleware('auth');


Route::post('product/{slug}/measure', 'measureproductController@save')->middleware('auth');
Route::post('article/product', 'measureproductController@save')->middleware('auth');
Route::post('product/{param}/count', 'productController@update_quantity')->middleware('auth');


Route::delete('product/{param}/measure', 'measureproductController@delete')->middleware('auth');


Route::put('request/{param}/client/table', 'requestController@update_rel')->middleware('auth');
Route::put('request/{param}/close', 'requestController@close')->middleware('auth');
Route::put('command/{param}/cancel', 'commanddataController@cancel')->middleware('auth');


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



// Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');

// Route::get('/home', 'HomeController@index')->name('home');
Auth::routes();

// Route::get('/login', function (Request $request) {      return redirect('/');   });
// Route::get('/gin', function (Request $request) {      return redirect('/');   });


