<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productcategory;
use App\tm_option;
use App\tm_measure;
use App\tm_category;
use App\tm_paymentmethod;

class configurationController extends Controller
{
    public function index(){
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

        $rs_productcategoryList = tm_productcategory::where('tx_productcategory_status',1)->orderby('tx_productcategory_value')->get();
        $rs_categoryList = tm_category::where('tx_category_status',1)->orderby('tx_category_value')->get();
        $rs_option = tm_option::all();
        $raw_option = [];
        foreach ($rs_option as $key => $value) {
            $raw_option[$value['tx_option_title']] = $value['tx_option_value'];
        }
        $rs_measure = tm_measure::where('tx_measure_status',1)->orderby('tx_measure_value')->get();
        $productController = new productController;
        $rs_product = $productController->getAll();
        $articleController = new articleController;
        $rs_article = $articleController->getAll();
        $presentationController = new presentationController;
        $rs_presentation = $presentationController->getAll();
        $rs_paymentmethod = tm_paymentmethod::where('tx_paymentmethod_status',1)->get();
       $data = [
            'productcategory_list' => $rs_productcategoryList,
            'category_list' => $rs_categoryList,
            'raw_option' => $raw_option,
            'measure_list' => $rs_measure,
            'product_list' => $rs_product,
            'article_list' => $rs_article,
            'presentation_list' => $rs_presentation,
            'paymentmethod_list' => $rs_paymentmethod
        ];

        return view('configuration.index', compact('data'));
    }
}

