<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_article;
use App\tm_articleproduct;
use App\tm_price;

class articleproductController extends Controller
{
    public function store(Request $request){
        $raw_recipe = $request->input('a');
        $presentation_id = $request->input('c');

        $rs_article = tm_article::where('tx_article_slug',$request->input('b'))->first();

        tm_articleproduct::where('articleproduct_ai_article_id',$rs_article['ai_article_id'])->where('articleproduct_ai_presentation_id',$presentation_id)->delete();
        $articleproductController = new articleproductController;
        foreach ($raw_recipe as $recipe) {
            $articleproductController->save($rs_article['ai_article_id'],$presentation_id,$recipe);
        }

        // Answer
        $rs = tm_articleproduct::select('tm_presentations.tx_presentation_value','tm_articleproducts.created_at','tm_articleproducts.articleproduct_ai_presentation_id','tm_articleproducts.articleproduct_ai_article_id','tm_articleproducts.tx_articleproduct_ingredient','tm_articles.tx_article_slug')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','=','tm_articleproducts.articleproduct_ai_presentation_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_articleproducts.articleproduct_ai_article_id')
        ->where('articleproduct_ai_article_id',$rs_article['ai_article_id'])
        ->orderby('articleproduct_ai_presentation_id','DESC')->get();

        return ['status' => 'success', 'message' => 'Producto Agregado.', 'data' => ['articleproduct'=>$rs]];

    }
    public function save($article_id,$presentation_id,$recipe){
        // BORRAR LAS RECETAS QUE COINCIDAN CON ARTICULO-PRESENTACIÓN

        $user = Auth()->user();
        $tm_articleproduct = new tm_articleproduct;
        $tm_articleproduct->articleproduct_ai_user_id       = $user['id'];
        $tm_articleproduct->articleproduct_ai_article_id    = $article_id;
        $tm_articleproduct->articleproduct_ai_presentation_id      = $presentation_id;
        $tm_articleproduct->tx_articleproduct_ingredient    = json_encode($recipe);
        $tm_articleproduct->save();

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

    public function showByArticle ($article_slug){
        $rs_article = tm_article::where('tx_article_slug',$article_slug)->first();
        $rs = tm_articleproduct::select('tm_presentations.tx_presentation_value','tm_articleproducts.created_at','tm_articleproducts.articleproduct_ai_presentation_id','tm_articleproducts.articleproduct_ai_article_id','tm_articleproducts.tx_articleproduct_ingredient','tm_articles.tx_article_slug')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','=','tm_articleproducts.articleproduct_ai_presentation_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_articleproducts.articleproduct_ai_article_id')
        ->where('articleproduct_ai_article_id',$rs_article['ai_article_id'])
        ->orderby('articleproduct_ai_presentation_id','DESC')->get();
		
        $rs_presentation = tm_price::join('tm_presentations','tm_presentations.ai_presentation_id','=','tm_prices.price_ai_presentation_id')
		->where('price_ai_article_id',$rs_article['ai_article_id'])
		->where('tm_prices.tx_price_status',1)
		->orderby('tx_price_status','DESC')
		->orderby('tx_price_date')
		->groupby('price_ai_presentation_id')->get();

        return response()->json(['status'=>'success','data'=>['articleproduct'=>$rs, 'presentation'=>$rs_presentation]]);
    }

    public function showRecipe ($presentation_id, $article_slug){
        $rs_article = tm_article::where('tx_article_slug',$article_slug)->first();
        $rs = tm_articleproduct::select('tm_presentations.tx_presentation_value','tm_articleproducts.created_at','tm_articleproducts.articleproduct_ai_presentation_id','tm_articleproducts.tx_articleproduct_ingredient')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','=','tm_articleproducts.articleproduct_ai_presentation_id')
        ->where('articleproduct_ai_article_id',$rs_article['ai_article_id'])
        ->where('articleproduct_ai_presentation_id',$presentation_id)
        ->orderby('articleproduct_ai_presentation_id','DESC')->get();

        return response()->json(['status'=>'success','data'=>['recipe'=>$rs]]);
    }
}
