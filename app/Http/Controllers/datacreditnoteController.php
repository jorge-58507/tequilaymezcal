<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_datacreditnote;

class datacreditnoteController extends Controller
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
        //
    }
    public function save($creditnote_id, $commanddata_id, $article_id, $quantity, $presentation_id)
    {
        $tm_datacreditnote = new tm_datacreditnote;
        $tm_datacreditnote->datacreditnote_ai_creditnote_id = $creditnote_id;
        $tm_datacreditnote->datacreditnote_ai_commanddata_id = $commanddata_id;
        $tm_datacreditnote->datacreditnote_ai_article_id = $article_id;
        $tm_datacreditnote->tx_datacreditnote_quantity = $quantity;
        $tm_datacreditnote->datacreditnote_ai_presentation_id = $presentation_id;
        $tm_datacreditnote->save();
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
        //
    }
}
