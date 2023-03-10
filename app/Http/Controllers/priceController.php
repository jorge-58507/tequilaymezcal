<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_price;
use App\tm_article;

class priceController extends Controller
{
    public function getAll()
    {
        $rs = tm_price::all();
        return $rs;
    }
    public function byArticle($article_slug)
    {
        $rs_article = tm_article::where('tx_article_slug',$article_slug)->first();
        $rs = tm_price::join('tm_presentations','tm_presentations.ai_presentation_id','=','tm_prices.price_ai_presentation_id')->where('price_ai_article_id',$rs_article['ai_article_id'])->orderby('tx_price_status','DESC')->orderby('tx_price_date')->get();
        return $rs;
    }
    public function showByArticle($article_slug)
    {
        $rs = $this->byArticle($article_slug);
        return response()->json(['status'=>'success','data'=>['price'=>$rs]]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $pOne = $request->input('a');
        $pTwo = $request->input('b');
        $pThree = $request->input('c');
        $article_slug = $request->input('e');
        $presentation_id = $request->input('f');
        $rs_article = tm_article::where('tx_article_slug',$article_slug)->first();
        $check_dup = tm_price::where('tx_price_one',$pOne)->where('tx_price_two',$pTwo)->where('tx_price_three',$pThree)->where('price_ai_article_id',$rs_article['ai_article_id'])
        ->where('price_ai_presentation_id',$presentation_id)->where('tx_price_status',1)->count();
        if ($check_dup > 0) {
            return response()->json(['status'=>'failed','message'=>'Estos precios ya existen.']);
        }
        if ($pOne < 0.01 && $pTwo < 0.01 && $pThree < 0.01) {
            return response()->json(['status'=>'failed','message'=>'Los precios estan vacios.']);
        }
        // DESACTIVAR LOS PRECIOS ANTERIORES
        tm_price::where('price_ai_presentation_id',$presentation_id)->where('price_ai_article_id',$rs_article['ai_article_id'])->update(['tx_price_status' => 0]);

        $user = $request->user();
        $tm_price = new tm_price;
        $tm_price->price_ai_user_id = $user['id'];
        $tm_price->price_ai_article_id = $rs_article['ai_article_id'];
        $tm_price->price_ai_presentation_id = $presentation_id;
        $tm_price->tx_price_one = $pOne;
        $tm_price->tx_price_two = $pTwo;
        $tm_price->tx_price_three = $pThree;
        $tm_price->tx_price_status = 1;
        $tm_price->tx_price_date = date('Y-m-d');
        $tm_price->save();

        // ANSWER
        $rs_price = $this->byArticle($article_slug);
        return response()->json(['status'=>'success','message'=>'Precios agregados.','data'=>['price'=>$rs_price]]);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $qry = tm_price::where('ai_price_id',$id);

        $rs_price = $qry->first();

        $check = tm_price::where('price_ai_article_id',$rs_price['price_ai_article_id'])->where('tx_price_status',1)->count();
        if ($check === 1) {
            return response()->json(['status'=>'failed','message'=>'No puede desactivar todos los precios.']);
        }
        $qry->update(['tx_price_status'=>0]);

        // ANSWER
        $rs_article = tm_article::where('ai_article_id',$rs_price['price_ai_article_id'])->first();
        $rs_price = $this->byArticle($rs_article['tx_article_slug']);
        return response()->json(['status'=>'success','message'=>'Precios desactivado.','data'=>['price'=>$rs_price, 'article'=> $rs_article]]);

    }
}
