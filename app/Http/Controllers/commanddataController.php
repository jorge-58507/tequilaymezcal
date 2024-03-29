<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\tm_commanddata;
use App\tm_measure;
use App\tm_product;
use App\tm_request;
use App\tm_command;

class commanddataController extends Controller
{
    public function store ($article_list,$user_id,$command_id,$exempt) {
        foreach ($article_list as $a => $article) {
            $option = (strlen($article['option']) > 1) ? $article['option'] : '';
            $recipe = json_encode($article['recipe']);
            $tax_rate = ($exempt == 1) ? 0 : $article['tax_rate'];
            $tm_commanddata = new tm_commanddata;
            $tm_commanddata->commanddata_ai_user_id         = $user_id;
            $tm_commanddata->commanddata_ai_command_id      = $command_id;
            $tm_commanddata->commanddata_ai_presentation_id = $article['presentation_id'];
            $tm_commanddata->commanddata_ai_article_id      = $article['article_id'];
            $tm_commanddata->tx_commanddata_quantity        = $article['quantity'];
            $tm_commanddata->tx_commanddata_price           = $article['price'];
            $tm_commanddata->tx_commanddata_taxrate         = $tax_rate;
            $tm_commanddata->tx_commanddata_discountrate    = $article['discount_rate'];
            $tm_commanddata->tx_commanddata_description     = $article['article_description'];
            $tm_commanddata->tx_commanddata_modified        = 0;
            $tm_commanddata->tx_commanddata_option          = $option;
            $tm_commanddata->tx_commanddata_recipe          = $recipe;
            $tm_commanddata->save();
        }
    }
    public function cancel(Request $request, $commanddata_id){
        $qry = tm_commanddata::where('ai_commanddata_id',$commanddata_id);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'La comanda no existe.']);
        }
        $qry->update(['tx_commanddata_status' => 0]);
        
        $rs_command = tm_command::select('tm_commands.tx_command_consumption','tm_commands.ai_command_id')->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')->where('ai_commanddata_id',$commanddata_id)->first();
        if ($request->input('a') === 1) {
            $rs = $qry->first();
            $article_list = [
                [
                    "article_id"=> $rs['commanddata_ai_article_id'],
                    "quantity"  => $rs['tx_commanddata_quantity'],
                    "recipe"    => $rs['tx_commanddata_recipe']
                ]
            ];
            $productController = new productController;
            $productController->plus_byArticle($article_list,$rs_command['tx_command_consumption']);
        }

        // Desactivar COMMAND
        $rs_request = tm_request::join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->where('ai_commanddata_id',$commanddata_id)
        ->first();

        $check_command = tm_request::join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->where('tx_commanddata_status',1)
        ->where('ai_request_id',$rs_request['ai_request_id'])
        ->count();

        if ($check_command === 0) {
            tm_request::where('ai_request_id',$rs_request['ai_request_id'])->update(['tx_request_status' => 3]);
        }
        // ANSWER
        $rs_request = tm_commanddata::join('tm_commands','tm_commands.ai_command_id','tm_commanddatas.commanddata_ai_command_id')->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')->where('tm_commanddatas.ai_commanddata_id',$commanddata_id)->first();
        $commandController = new commandController;
        $rs_command = $commandController->getByRequest($rs_request['ai_request_id']);
        $rs_request = tm_request::where('ai_request_id',$rs_request['ai_request_id'])->first();

        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command, 'request_info'=>$rs_request]]);

    }
    public function reportAnnulled($from, $to){
        $rs = tm_commanddata::select('tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_description','tm_presentations.tx_presentation_value','tm_commanddatas.created_at')->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')->where('tm_commanddatas.tx_commanddata_status',0)->where('tm_commanddatas.created_at','>=',date('Y-m-d H:i:s',strtotime($from." 00:00:01")))->where('tm_commanddatas.created_at','<=',date('Y-m-d H:i:s',strtotime($to." 23:59:00")))->orderby('tm_commanddatas.created_at','DESC')->get();

        return [ 'annulled' => $rs ];
    }
    public function report($from, $to){
        $c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
        $c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));
        $rs = tm_commanddata::select('tm_commanddatas.created_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_price','tm_commanddatas.commanddata_ai_article_id','tm_commanddatas.tx_commanddata_description','tm_commanddatas.commanddata_ai_presentation_id','tm_presentations.tx_presentation_value')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->where('tm_commanddatas.created_at','>=',$c_from)
        ->where('tm_commanddatas.created_at','<=',$c_to)->get();
        // ->groupby('tm_commanddatas.tx_commanddata_description','tm_presentations.tx_presentation_value')->get();

        return [ 'list' => $rs ];
    }
    public function report_product($from, $to){
        $c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
        $c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));
        $rs = tm_commanddata::select('tm_commanddatas.tx_commanddata_recipe', 'tm_commanddatas.tx_commanddata_status', 'tm_commands.tx_command_consumption')
        ->join('tm_commands','tm_commands.ai_command_id','tm_commanddatas.commanddata_ai_command_id')
        ->where('tm_commanddatas.created_at','>=',$c_from)
        ->where('tm_commanddatas.created_at','<=',$c_to)->get();

        $raw_product = [];
        foreach ($rs as $commanddata) {
            if ($commanddata['tx_commanddata_status'] === 1) {
                $raw_recipe = json_decode($commanddata['tx_commanddata_recipe'],true);
                foreach ($raw_recipe as $key => $recipe) {

                    foreach ($recipe as $ingredient) {
                        $split = explode(",",$ingredient);

                        if ($commanddata['tx_command_consumption'] === 'Local') {
                            if (!empty($split[4])) {
                                if ($split[4] != 'togo') {
                                    $rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
                                    $rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
                                    array_push($raw_product, [
                                        'quantity' => $split[0],
                                        'measure_id' => $split[1],
                                        'measure_value' => $rs_measure['tx_measure_value'],
                                        'product_id' => $split[2],
                                        'product_value' => $rs_product['tx_product_value']
                                    ]);
                                }
                            }else{
                                $rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
                                $rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
                                array_push($raw_product, [
                                    'quantity' => $split[0],
                                    'measure_id' => $split[1],
                                    'measure_value' => $rs_measure['tx_measure_value'],
                                    'product_id' => $split[2],
                                    'product_value' => $rs_product['tx_product_value']
                                ]);
                            }
                        }else{
                            $rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
                            $rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
                            array_push($raw_product, [
                                'quantity' => $split[0],
                                'measure_id' => $split[1],
                                'measure_value' => $rs_measure['tx_measure_value'],
                                'product_id' => $split[2],
                                'product_value' => $rs_product['tx_product_value']
                            ]);
                        }
                    }
                }
            }
        }
        return [ 'product_list' => $raw_product ];
    }

    public function checklogin_cancel(Request $request){
        $userController = new userController;
        $login = $userController->check_user($request->input('a'),$request->input('b'), ['admin','super']);
        if($login['check'] === 1){
            return response()->json(['status'=>'success']);
        }else{
            return response()->json(['status'=>'failed','message'=>'Los datos no coinciden.']);
        }
    }

    public function add_tolastrequest (Request $request){
        $qry_request = tm_request::select('tm_requests.ai_request_id','tm_commands.ai_command_id','tm_commands.tx_command_consumption','tm_clients.tx_client_exempt')->join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_request_slug',$request->input('a'))->orderby('ai_command_id','DESC');
        if ($qry_request->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe']);
        }
        $rs_request = $qry_request->first();
        $user = $request->user();
        $article_list = $request->input('b');
        $this->store($article_list,$user['id'],$rs_request['ai_command_id'],$rs_request['tx_client_exempt']);

        $productController = new productController;
        $productController->minus_byArticle($article_list,$rs_request['tx_command_consumption']);

        // ANSWER
        $rs_request = tm_request::where('tx_request_slug',$request->input('a'))->first();
        $commandController = new commandController;
        $rs_command = $commandController->getByRequest($rs_request['ai_request_id']);
        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command, 'request_info'=>$rs_request ]]);
    }
    public function set_ready($id)
    {
        $qry = tm_commanddata::where('ai_commanddata_id',$id);
        $qry->update(['tx_commanddata_delivered' => 1]);
        $rs = $qry->first();

        $check_commanddata = tm_commanddata::where('commanddata_ai_command_id',$rs['commanddata_ai_command_id'])->where('tx_commanddata_delivered',0)->count();
        if ($check_commanddata === 0) {
            tm_command::where('ai_command_id',$rs['commanddata_ai_command_id'])->update(['tx_command_delivered' => 1]);
        }


        $kitchenController = new kitchenController;
        $data = $kitchenController->all();
        return response()->json(['status'=>'success','message'=>'Comanda Preparada.','data'=>$data]);
    }
    
    public function discount (Request $request, $commanddata_id){
        $user = $request->user();
        //if( $user->hasAnyRole(['admin','super','cashier']) != true){
        //    return response()->json(['status'=>'failed','message'=>'Debe ingresar como supervisor.']);
        //}else{
            $qry = tm_commanddata::where('ai_commanddata_id', $commanddata_id);
            if ($qry->count() === 0) {
                return response()->json(['status'=>'failed','message'=>'La comanda no existe.']);
            }
            $qry->update(['tx_commanddata_discountrate' => $request->input('a')]);

            $rs = $qry->first();

            $rs_request = tm_request::select('tm_requests.tx_request_slug')->join('tm_commands','tm_requests.ai_request_id','tm_commands.command_ai_request_id')->where('tm_commands.ai_command_id',$rs['commanddata_ai_command_id'])->first();
            return response()->json(['status'=>'success','message'=>'Descuento aplicado.', 'data' => ['request' => $rs_request]]);
        //}

    }
}
