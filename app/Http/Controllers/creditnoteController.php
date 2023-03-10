<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_charge;
use App\tm_request;
use App\tm_command;
use App\tm_creditnote;
use App\tm_commanddata;
use App\tm_datacreditnote;

class creditnoteController extends Controller
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
        $charge = tm_charge::where('tx_charge_slug',$request->input('a'));
        if ($charge->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'El cobro no existe.']);
        }
        $rs_charge = $charge->first();


        $raw_selected = $request->input('b');
        $raw_price = [];
        foreach ($raw_selected as $selected) {
            $rs_commanddata = tm_commanddata::where('ai_commanddata_id',$selected['commanddata_id'])->first();
            array_push($raw_price,[
                'price'=> $rs_commanddata['tx_commanddata_price'],
                'discount'=> $rs_commanddata['tx_commanddata_discountrate'],
                'tax'=> $rs_commanddata['tx_commanddata_taxrate'],
                'quantity'=>$selected['quantity']
            ]);
        }
        $chargeController = new chargeController;
        $price_sale = $chargeController->calculate_sale($raw_price);
        
        $tm_creditnote = new tm_creditnote;
        $user = $request->user();
        $count_creditnote = tm_creditnote::count();
        $number = substr('0000000000'.$count_creditnote+55,-10);
        
        $tm_creditnote->creditnote_ai_user_id           = $user['id'];
        $tm_creditnote->creditnote_ai_charge_id         = $rs_charge['ai_charge_id'];
        $tm_creditnote->tx_creditnote_retentionrate     = 0;
        $tm_creditnote->tx_creditnote_nullification     = 0;
        $tm_creditnote->tx_creditnote_number            = $number;
        $tm_creditnote->tx_creditnote_nontaxable        = $price_sale['st_notaxable'];
        $tm_creditnote->tx_creditnote_taxable           = $price_sale['subtotal'];
        $tm_creditnote->tx_creditnote_tax               = $price_sale['tax'];
        $tm_creditnote->tx_creditnote_reason            = $request->input('c');
        $tm_creditnote->tx_creditnote_status            = 1;
        $tm_creditnote->save();
        $creditnote_id = $tm_creditnote->ai_creditnote_id;

        $datacreditnoteController = new datacreditnoteController;
        foreach ($raw_selected as $selected) {
            $rs_commanddata = tm_commanddata::where('ai_commanddata_id',$selected['commanddata_id'])->first();
            $datacreditnoteController->save($creditnote_id,$selected['commanddata_id'],$selected['article_id'],$selected['quantity'],$selected['presentation_id']);
        }
        // ANSWER
        $rs_creditnote = tm_creditnote::where('creditnote_ai_charge_id',$rs_charge['ai_charge_id'])->get();
        return response()->json(['status'=>'success','message'=>'Nota de Cr&eacute;dito procesada.','data'=>['creditnote'=>$rs_creditnote]]);
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

    public function getByCharge($charge_slug)
    {
        $commandController = new commandController;

        $qry_charge = tm_charge::join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_charge_slug',$charge_slug);
        if ($qry_charge->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'El cobro no existe.']);
        }
        $rs_charge = $qry_charge->first();

        //CONSEGUIR NOTAS DE CREDITO ANTERIORES
        $rs_request = tm_request::where('request_ai_charge_id',$rs_charge['ai_charge_id'])->get();
        $raw_commanddata = [];
        foreach ($rs_request as $key => $request) {
            $rs_commanddata = tm_command::join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')->join('tm_articles','tm_articles.ai_article_id','tm_commanddatas.commanddata_ai_article_id')->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')->leftjoin('tm_datacreditnotes','tm_commanddatas.ai_commanddata_id','tm_datacreditnotes.datacreditnote_ai_commanddata_id')->where('command_ai_request_id',$request['ai_request_id'])->orderby('tx_commanddata_status','DESC')->orderby('ai_command_id','ASC')->groupByRaw('tm_commanddatas.ai_commanddata_id')
            ->select('ai_commanddata_id','tx_commanddata_status','ai_article_id','tx_article_code','tx_article_value','commanddata_ai_presentation_id','tx_presentation_value','tx_commanddata_price','tx_commanddata_discountrate','tx_commanddata_taxrate','tx_commanddata_quantity')
            ->selectRaw('sum(tx_datacreditnote_quantity) as sum,ai_commanddata_id')->get();
            array_push($raw_commanddata, $rs_commanddata);
        }
        $rs_creditnote = tm_creditnote::where('creditnote_ai_charge_id',$rs_charge['ai_charge_id'])->get();

        return response()->json(['status'=>'success', 'message'=>'', 'data'=>['charge'=>$rs_charge, 'article'=>$raw_commanddata, 'creditnote'=>$rs_creditnote] ]);
    }
    public function getByCommanddata($commanddata_id){

    }
    
}
