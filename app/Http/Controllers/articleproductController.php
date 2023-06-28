<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_article;
use App\tm_articleproduct;

class articleproductController extends Controller
{
    public function save(Request $request){
        $product_id = $request->input('a');
        $article_id = $request->input('b');
        $quantity = $request->input('c');
        $measure_id = $request->input('d');

        $check_duplicate = tm_articleproduct::where('articleproduct_ai_article_id',$article_id)->where('articleproduct_ai_product_id',$product_id)->count();
        if ($check_duplicate > 0) {
            return ['status' => 'failed', 'message' => 'Ese producto ya fu&eacute; agregado.'];
        }

        $user = Auth()->user();
        $tm_articleproduct = new tm_articleproduct;
        $tm_articleproduct->articleproduct_ai_user_id       = $user['id'];
        $tm_articleproduct->articleproduct_ai_product_id    = $product_id;
        $tm_articleproduct->articleproduct_ai_article_id    = $article_id;
        $tm_articleproduct->tx_articleproduct_quantity      = $quantity;
        $tm_articleproduct->articleproduct_ai_measure_id    = $measure_id;
        $tm_articleproduct->save();

        // Answer
        $rs_articleproduct = tm_articleproduct::select('tm_articleproducts.articleproduct_ai_product_id','tm_articleproducts.articleproduct_ai_article_id','tm_articleproducts.tx_articleproduct_quantity','tm_articleproducts.articleproduct_ai_measure_id','tm_products.tx_product_value','tm_measures.tx_measure_value')->join('tm_products','tm_products.ai_product_id','tm_articleproducts.articleproduct_ai_product_id')->join('tm_measures','tm_measures.ai_measure_id','tm_articleproducts.articleproduct_ai_measure_id')->where('articleproduct_ai_article_id',$article_id)->get();

        return ['status' => 'success', 'message' => 'Producto Agregado.', 'data' => ['articleproduct'=>$rs_articleproduct]];
    }
    public function delete(Request $request){
        $product_id = $request->input('a');
        $article_id = $request->input('b');

        $qry = tm_articleproduct::where('articleproduct_ai_article_id',$article_id)->where('articleproduct_ai_product_id',$product_id);
        if ($qry->count() > 0) {
            $qry->delete();
        }else{
            return ['status' => 'failed', 'message' => 'Producto no existe.'];
        }

        // Answer
        $rs_articleproduct = tm_articleproduct::select('tm_articleproducts.articleproduct_ai_product_id','tm_articleproducts.articleproduct_ai_article_id','tm_articleproducts.tx_articleproduct_quantity','tm_articleproducts.articleproduct_ai_measure_id','tm_products.tx_product_value','tm_measures.tx_measure_value')->join('tm_products','tm_products.ai_product_id','tm_articleproducts.articleproduct_ai_product_id')->join('tm_measures','tm_measures.ai_measure_id','tm_articleproducts.articleproduct_ai_measure_id')->where('articleproduct_ai_article_id',$article_id)->get();
        return ['status' => 'success', 'message' => 'Producto Eliminado.', 'data' => ['articleproduct'=>$rs_articleproduct]];
    }
}
