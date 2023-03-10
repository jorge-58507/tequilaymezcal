<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_request;
use App\tm_command;
use App\tm_commanddata;
use App\tm_table;
use App\tm_client;
use App\tm_charge;

class commandController extends Controller
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
        $count = tm_request::count();
        $code = substr('000000000000'.$count,-10);
        $rs_table = tm_table::where('tx_table_slug',$request->input('b'))->first();

        $qry_client = tm_client::where('tx_client_slug',$request->input('c'));
        if ($qry_client->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'El cliente no existe.']);
        }
        $rs_client = $qry_client->first();

        $requestController = new requestController;
        $request_id = $requestController->save($rs_table['ai_table_id'],$rs_client['ai_client_id'],$code,$request->input('d'));

        $user = $request->user();
        $command_id = $this->save($user['id'],$request_id,'',$request->input('e'),$request->input('f'));

        // INSERTAR LOS ARTICULOS DE LA COMANDA
        $article_list = $request->input('a');
        $commanddataController = new commanddataController;
        $commanddataController->store($article_list,$user['id'],$command_id,$rs_client['tx_client_exempt']);
        $productController = new productController;
        $productController->minus_byArticle($article_list);

        // ANSWER
        $rs_request = tm_request::where('ai_request_id',$request_id)->first();
        $rs_command = $this->getByRequest($request_id);
        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command,'request'=>$rs_request]]);
    }
    public function save($user_id,$request_id,$time,$consumption,$observation){
        $tm_command =new tm_command;
        $tm_command->command_ai_user_id = $user_id;
        $tm_command->command_ai_request_id = $request_id;
        $tm_command->tx_command_time = '';
        $tm_command->tx_command_consumption = $consumption;
        $tm_command->tx_command_observation =  $observation;
        $tm_command->tx_command_delivered = 0;
        $tm_command->tx_command_status = 1;
        $tm_command->save();

        return $command_id = $tm_command->ai_command_id;
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
    public function getByRequest($request_id)
    {
        $rs_command = tm_command::join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')->where('command_ai_request_id',$request_id)->orderby('tx_commanddata_status','DESC')->orderby('ai_command_id','ASC')->get();
        return $rs_command;
    }
    public function getByCharge($charge_id)
    {
        $rs_article = tm_charge::join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')
        ->join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->where('ai_charge_id',$charge_id)
        ->orderby('tx_commanddata_status','DESC')->orderby('ai_command_id','ASC')->get();

        return $rs_article;
    }

    public function getByRequest_json($request_slug)
    {
        $rs_request = tm_request::where('tx_request_slug',$request_slug)->first();
        $rs_command = $this->getByRequest($rs_request['ai_request_id']);
        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command, 'request_info'=>$rs_request]]);
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
    public function update(Request $request, $request_slug)
    {
        $qry = tm_request::where('tx_request_slug',$request_slug)->where('tx_request_status',0);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'El pedido no existe o esta cerrado.']);
        }
        $rs_request = tm_request::where('tx_request_slug',$request_slug)->first();
        $user = $request->user();
        $command_id = $this->save($user['id'],$rs_request['ai_request_id'],'',$request->input('e'),$request->input('f'));

        $rs_client = tm_request::select('tx_client_exempt')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->first();
        $article_list = $request->input('a');
        $commanddataController = new commanddataController;
        $commanddataController->store($article_list,$user['id'],$command_id,$rs_client['tx_client_exempt']);
        
        $productController = new productController;
        $productController->minus_byArticle($article_list);

        // ANSWER
        $rs_command = $this->getByRequest($rs_request['ai_request_id']);
        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command]]);
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
