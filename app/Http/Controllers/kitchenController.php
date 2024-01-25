<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_command;

class kitchenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function all(){
        $rs_notready =  tm_command::select('tm_commands.ai_command_id', 'tm_tables.tx_table_value','tm_commands.created_at','tm_commands.updated_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_description','tm_articles.tx_article_kitchen','tm_commanddatas.tx_commanddata_option','tm_commanddatas.tx_commanddata_status','tm_commanddatas.tx_commanddata_delivered','tm_categories.tx_category_value')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')
        ->join('tm_categories','tm_categories.ai_category_id','tm_articles.article_ai_category_id')
        ->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')
        ->join('tm_tables','tm_requests.request_ai_table_id','tm_tables.ai_table_id')
        ->where('tx_command_delivered',0)->orderby('created_at','ASC')->get();

        $date_limit = date('Y-m-d H:i:s',strtotime('-3 days'));
        $rs_ready =     tm_command::select('tm_commands.ai_command_id', 'tm_tables.tx_table_value','tm_commands.created_at','tm_commands.updated_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_description','tm_commanddatas.tx_commanddata_option')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')
        ->join('tm_tables','tm_requests.request_ai_table_id','tm_tables.ai_table_id')
        ->where('tx_command_delivered',1)->where('tm_commands.updated_at','>',$date_limit)->orderby('tm_commands.updated_at','DESC')->get();
        
        $data = [
            'notready' => $rs_notready,
            'ready' => $rs_ready
        ];
        return $data;
    }
    public function index()
    {
        if ( auth()->user()->hasAnyRole(['admin','super','cashier','kitchener']) != true){ 
            return redirect() -> route('request.index');
        }

        $data = $this->all();
        return view('kitchen.index', compact('data'));
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
    public function reload(){
        $raw_command = $this->all();
        return response()->json(['status'=>'success','message'=>'','data'=>['notready'=>$raw_command['notready'], 'ready'=>$raw_command['ready']]]);
    }

}
