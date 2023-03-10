<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_commanddata;

class commanddataController extends Controller
{
    public function store ($article_list,$user_id,$command_id,$exempt) {
        foreach ($article_list as $a => $article) {
            $option = (strlen($article['option']) > 1) ? $article['option'] : '';
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
            $tm_commanddata->save();
        }
    }
    public function cancel(Request $request, $commanddata_id){
        $qry = tm_commanddata::where('ai_commanddata_id',$commanddata_id);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'La comanda no existe.']);
        }
        $qry->update(['tx_commanddata_status' => 0]);
        
        if ($request->input('a') === 1) {
            $rs = $qry->first();
            $productController = new productController;
            $productController->plus_byArticle([['article_id'=> $rs['commanddata_ai_article_id'],'quantity'=>$rs['tx_commanddata_quantity']]]);
        }

        // ANSWER
        $rs_request = tm_commanddata::join('tm_commands','tm_commands.ai_command_id','tm_commanddatas.commanddata_ai_command_id')->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')->where('tm_commanddatas.ai_commanddata_id',$commanddata_id)->first();
        $commandController = new commandController;
        $rs_command = $commandController->getByRequest($rs_request['ai_request_id']);
        return response()->json(['status'=>'success','message'=>'','data'=>['command_procesed'=>$rs_command]]);

    }
}
