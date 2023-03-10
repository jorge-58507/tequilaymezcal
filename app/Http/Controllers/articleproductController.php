<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_article;
use App\tm_articleproduct;

class articleproductController extends Controller
{
    public function save($raw_articleproduct){
        tm_articleproduct::where('articleproduct_ai_article_id',$raw_articleproduct[0]['article'])->delete();

        $user = Auth()->user();
        foreach ($raw_articleproduct as $key => $product) {
            $tm_articleproduct = new tm_articleproduct;
            $tm_articleproduct->articleproduct_ai_user_id       = $user['id'];
            $tm_articleproduct->articleproduct_ai_product_id    = $product['product_id'];
            $tm_articleproduct->articleproduct_ai_article_id    = $product['article'];
            $tm_articleproduct->tx_articleproduct_quantity      = $product['quantity'];
            $tm_articleproduct->articleproduct_ai_measure_id    = $product['measure_id'];
            $tm_articleproduct->save();
        }
        // Answer
        $rs_articleproduct = tm_articleproduct::where('articleproduct_ai_article_id',$raw_articleproduct[0]['article'])->get();

        return ['status' => 'success', 'data' => ['articleproduct'=>$rs_articleproduct]];
    }
    
}
