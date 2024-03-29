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
        $ans_request = $requestController->save($rs_table['ai_table_id'],$rs_client['ai_client_id'],$code,$request->input('d'));
        if ($ans_request['status'] === 'failed') {
            return response()->json(['status'=>'failed','message'=>$ans_request['message'], 'data'=>$ans_request['data']]);
        }

        $request_id = $ans_request['data']['id'];
        $user = $request->user();
        $command_id = $this->save($user['id'],$request_id,'',$request->input('e'),$request->input('f'));

        // INSERTAR LOS ARTICULOS DE LA COMANDA
        $article_list = $request->input('a');
        
        $commanddataController = new commanddataController;
        $commanddataController->store($article_list,$user['id'],$command_id,$rs_client['tx_client_exempt']);

        $productController = new productController;
        $productController->minus_byArticle($article_list,$request->input('e'));

        // ANSWER
        $rs_request = tm_request::where('ai_request_id',$request_id)->first();
        $rs_command = $this->getByRequest($request_id);

        // ACTUALIZAR EL SERVIDOR EXTERNO
        if (!empty($request->input('g'))) {
            $url = 'http://localhost:8000/api/APIrequest/'.$request->input('g').'/confirm';
            $option = [
                'http' => [
                    'header' => "Content-type: application/json\r\nAcept: application/json\r\nAuthorization: Bearer  ".$request->input('h'),
                    'method' => 'POST',
                    'content' => json_encode(['a' => $user['id'], 'b' => ['command_procesed'=>$rs_command,'request'=>$rs_request]]),
                ]
            ];
            $context = stream_context_create($option);
            $result = file_get_contents($url,false,$context);
            if ($result === false) {
                return response()->json(['status'=>'failed','message'=>'No se pudo actualizar.']);   
            };
        }

        $cashier = 0;
        if ( auth()->user()->hasAnyRole(['cashier']) === true){ 
            $cashier = 1;
        }

        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command,'request'=>$rs_request, 'cashier'=>$cashier ]]);
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
        $rs_command = tm_command::where('ai_command_id',$id)->first();
        $rs_request = tm_command::select('tm_commands.ai_command_id','tm_requests.ai_request_id','tm_requests.tx_request_code','tm_requests.tx_request_title','tm_tables.tx_table_value','tm_requests.created_at','tm_requests.ai_request_id','users.name as waiter')
        ->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')
        ->join('tm_tables','tm_requests.request_ai_table_id','tm_tables.ai_table_id')
        ->join('users','users.id','tm_commands.command_ai_user_id')
        ->where('ai_command_id',$id)->first();

        $rs_commanddata = tm_command::select('tm_commands.ai_command_id','tm_commands.created_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_description','tm_commanddatas.ai_commanddata_id','tm_commanddatas.tx_commanddata_option','tm_commanddatas.tx_commanddata_delivered','tm_commanddatas.tx_commanddata_recipe','tm_commanddatas.tx_commanddata_status','tm_presentations.tx_presentation_value','tm_categories.tx_category_value','tm_articles.tx_article_kitchen',)
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')
        ->join('tm_categories','tm_categories.ai_category_id','tm_articles.article_ai_category_id')
        ->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->where('ai_command_id',$id)->get();

        return response()->json(['status'=>'success','message'=>'','data'=>['info'=>$rs_command, 'request_info'=>$rs_request, 'commanddata'=>$rs_commanddata]]);
    }

    public function getByRequest($request_id)
    {
        $rs_command = tm_command::join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->where('command_ai_request_id',$request_id)
        ->orderby('tx_commanddata_status','DESC')->orderby('ai_command_id','ASC')->get();
        return $rs_command;
    }

    public function getByCharge($charge_id)
    {
        $rs_article = tm_charge::join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')
        ->join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->join('users','users.id','tm_commanddatas.commanddata_ai_user_id')
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
    public function discount(Request $request, $request_slug){
        $user = $request->user();
        if( $user->hasAnyRole(['admin','super','cashier']) != true){
            return response()->json(['status'=>'failed','message'=>'Debe ingresar como supervisor.']);
        }else{
            $rs_request = tm_request::where('tx_request_slug',$request_slug)->first();
            $rs_command = $this->getByRequest($rs_request['ai_request_id']);
            foreach ($rs_command as $key => $value) {
                tm_commanddata::where('ai_commanddata_id',$value['ai_commanddata_id'])->update(['tx_commanddata_discountrate' => $request->input('a')]);
            }
            return response()->json(['status'=>'success','message'=>'Descuento aplicado.']);
        }
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
        $productController->minus_byArticle($article_list,$request->input('e'));

        // ANSWER
        $rs_request = tm_request::where('ai_request_id',$rs_request['ai_request_id'])->first();
        $rs_command = $this->getByRequest($rs_request['ai_request_id']);

        // ACTUALIZAR EL SERVIDOR EXTERNO
        if (!empty($request->input('g'))) {
            $url = 'http://localhost:8000/api/APIrequest/'.$request->input('g').'/confirm';
            $option = [
                'http' => [
                    'header' => "Content-type: application/json\r\nAcept: application/json\r\nAuthorization: Bearer  ".$request->input('h'),
                    'method' => 'POST',
                    'content' => json_encode(['a' => $user['id'], 'b' => ['command_procesed'=>$rs_command,'request'=>$rs_request]]),
                ]
            ];
            $context = stream_context_create($option);
            $result = file_get_contents($url,false,$context);
            if ($result === false) {
                return response()->json(['status'=>'failed','message'=>'No se pudo actualizar.']);   
            };
        }

        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command]]);
    }
    public function set_ready(Request $request, $id)
    {
        $rs_commanddata = tm_commanddata::select('tm_commanddatas.ai_commanddata_id')->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')->where('commanddata_ai_command_id',$id)->where('tm_articles.tx_article_kitchen',$request->input('a'))->get();
        $commanddataController = new commanddataController;
        foreach ($rs_commanddata as $key => $value) {
            $commanddataController->set_ready($value['ai_commanddata_id']);
        }

        $kitchenController = new kitchenController;
        $data = $kitchenController->all();
        return response()->json(['status'=>'success','message'=>'Comanda Preparada.','data'=>$data]);
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
