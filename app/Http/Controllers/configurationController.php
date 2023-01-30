<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productcategory;

class configurationController extends Controller
{
    public function index(){
        $rs_productcategory = tm_productcategory::where('tx_productcategory_status',1)->orderby('tx_productcategory_value')->get();

        $data = [
            'productcategory_list' => $rs_productcategory
        ];

        return view('configuration.index', compact('data'));
    }
}
