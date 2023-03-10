<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\rel_article_presentation;
use App\tm_presentation;
use App\tm_article;

class articlepresentationController extends Controller
{
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
        // $rs_article = tm_article::where('tx_article_slug',$request->input('b'))->first();
        // $check_dup = rel_article_presentation::where('article_presentation_ai_presentation_id',$request->input('a'))->where('article_presentation_ai_article_id',$rs_article['ai_article_id'])->count();
        // if ($check_dup > 0) {
        //     return response()->json(['status'=>'failed','message'=>'Ya existe.']);
        // }
        // $this->save($request->input('a'),$rs_article['ai_article_id']);
        // // ANSWER
        // $rs = $this->getByArticle($request->input('b'));
        // return response()->json(['status'=>'success','data'=>['presentation'=>$rs]]);
    }
    public function save($presentation_id, $article_id){
        // $user = $request->user();
        // $rel_article_presentation = new rel_article_presentation;
        // $rel_article_presentation->article_presentation_ai_user_id          = $user['id'];
        // $rel_article_presentation->article_presentation_ai_presentation_id  = $presentation_id;
        // $rel_article_presentation->article_presentation_ai_article_id       = $article_id;
        // $rel_article_presentation->save();
        // return $rel_article_presentation;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($article_slug)
    {
        // $rs = $this->getByArticle($article_slug);
        // return response()->json(['status'=>'success','data'=>['presentation'=>$rs]]);
    }
    public function getByArticle($article_slug){
        // $rs_article = tm_article::where('tx_article_slug',$article_slug)->first();
        // $rs = tm_presentation::join('rel_article_presentations','tm_presentations.ai_presentation_id','=','rel_article_presentations.article_presentation_ai_presentation_id')
        // ->join('tm_articles','tm_articles.ai_article_id','=','rel_article_presentations.article_presentation_ai_article_id')
        // ->where('tm_articles.ai_article_id',$rs_article['ai_article_id'])->orderby('tx_presentation_value','ASC')->get();
        // return $rs;
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
        // $check_price = tm_price::where('price_ai_article')
        // si hay un precio registrado pedir confirmacion
        // si es la ultima rel no se puede borrar
        // $qry = rel_article_presentation::where('ai_article_presentation_id',$id);
        // $rs_rel = $qry->first();
        
        // $qry->delete();
        // // ANSWER
        // $rs_article = tm_article::where('ai_article_id',$rs_rel['article_presentation_ai_article_id'])->first();
        // $rs = $this->getByArticle($rs_article['tx_article_slug']);
        // return response()->json(['status'=>'success','data'=>['presentation'=>$rs]]);

    }
}
