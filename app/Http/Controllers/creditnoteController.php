<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_charge;
use App\tm_request;
use App\tm_command;
use App\tm_creditnote;
use App\tm_commanddata;
use App\tm_datacreditnote;
use App\tm_payment;

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
    public function getAll()
    {
        $rs_active = tm_creditnote::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_creditnotes.ai_creditnote_id','tm_creditnotes.created_at','tm_creditnotes.tx_creditnote_retentionrate','tm_creditnotes.tx_creditnote_number','tm_creditnotes.tx_creditnote_nontaxable','tm_creditnotes.tx_creditnote_taxable','tm_creditnotes.tx_creditnote_tax','tm_creditnotes.tx_creditnote_reason')->join('tm_requests','tm_requests.request_ai_charge_id','tm_creditnotes.creditnote_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_creditnote_status',1)->orderby('ai_creditnote_id','DESC')->get();
        $rs_inactive = tm_creditnote::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_creditnotes.ai_creditnote_id','tm_creditnotes.created_at','tm_creditnotes.tx_creditnote_retentionrate','tm_creditnotes.tx_creditnote_number','tm_creditnotes.tx_creditnote_nontaxable','tm_creditnotes.tx_creditnote_taxable','tm_creditnotes.tx_creditnote_tax','tm_creditnotes.tx_creditnote_reason')->join('tm_requests','tm_requests.request_ai_charge_id','tm_creditnotes.creditnote_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_creditnote_status',0)->orderby('ai_creditnote_id','DESC')->get();

        return ['active'=>$rs_active, 'inactive'=>$rs_inactive];
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
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

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
        $qry = tm_creditnote::where('ai_creditnote_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La nota de crédito no existe.']);
        }

        $rs_creditnote = $this->show_it($id);

        return response()->json(['status'=>'success','message'=>'','data'=>[ 'info'=>$rs_creditnote['info'], 'article'=>$rs_creditnote['article'] ]]);
    }

    public function show_it($id)
    {
        $rs = tm_creditnote::select('tm_creditnotes.ai_creditnote_id','tm_creditnotes.tx_creditnote_retentionrate','tm_creditnotes.tx_creditnote_nullification','tm_creditnotes.tx_creditnote_number','tm_creditnotes.tx_creditnote_nontaxable','tm_creditnotes.tx_creditnote_taxable','tm_creditnotes.tx_creditnote_tax','tm_creditnotes.tx_creditnote_reason','tm_creditnotes.created_at','tm_clients.tx_client_name')->join('tm_requests','tm_requests.request_ai_charge_id','tm_creditnotes.creditnote_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('ai_creditnote_id',$id)->first();
        $data = tm_datacreditnote::join('tm_commanddatas','tm_commanddatas.ai_commanddata_id','tm_datacreditnotes.datacreditnote_ai_commanddata_id')->where('datacreditnote_ai_creditnote_id',$id)->get();

        return [ 'info'=>$rs, 'article'=>$data ];
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

    public function getByCharge_json($charge_slug)
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

        $rs_payment = tm_payment::where('payment_ai_charge_id',$rs_charge['ai_charge_id'])->get();

        return response()->json(['status'=>'success', 'message'=>'', 'data'=>['charge'=>$rs_charge, 'article'=>$raw_commanddata, 'creditnote'=>$rs_creditnote, 'payment'=>$rs_payment] ]);
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

        return ['charge'=>$rs_charge, 'article'=>$raw_commanddata, 'creditnote'=>$rs_creditnote];
    }

    public function nullify(Request $request, $charge_slug){
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }
        $charge_slug = $request->input('a');
        $qry_charge = tm_charge::where('tx_charge_slug',$charge_slug);
        if ($qry_charge->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'El cobro no existe.']);
        }
        $rs_charge = $qry_charge->first();
        $raw_creditnote = $this->getByCharge($charge_slug);

        $raw_selected = $raw_creditnote['article'];

        $raw_price = [];
        $raw_commanddata = [];
        foreach ($raw_selected as $value) {
            foreach ($value as $selected) {
                if ($selected['tx_commanddata_status'] === 1) {
                    $rs_commanddata = tm_commanddata::where('ai_commanddata_id',$selected['ai_commanddata_id'])->first();
                    array_push($raw_price,[
                        'price'=> $rs_commanddata['tx_commanddata_price'],
                        'discount'=> $rs_commanddata['tx_commanddata_discountrate'],
                        'tax'=> $rs_commanddata['tx_commanddata_taxrate'],
                        'quantity'=>$selected['tx_commanddata_quantity']
                    ]);
                    array_push($raw_commanddata,$rs_commanddata);
                }
            }
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
        $tm_creditnote->tx_creditnote_nullification     = 1;
        $tm_creditnote->tx_creditnote_number            = $number;
        $tm_creditnote->tx_creditnote_nontaxable        = $price_sale['st_notaxable'];
        $tm_creditnote->tx_creditnote_taxable           = $price_sale['subtotal'];
        $tm_creditnote->tx_creditnote_tax               = $price_sale['tax'];
        $tm_creditnote->tx_creditnote_reason            = $request->input('c');
        $tm_creditnote->tx_creditnote_status            = 1;
        $tm_creditnote->save();
        $creditnote_id = $tm_creditnote->ai_creditnote_id;

        $datacreditnoteController = new datacreditnoteController;
        foreach ($raw_commanddata as $commanddata) {
            $datacreditnoteController->save($creditnote_id,$commanddata['ai_commanddata_id'],$commanddata['commanddata_ai_article_id'],$commanddata['tx_commanddata_quantity'],$commanddata['commanddata_ai_presentation_id']);
        }
        $qry_charge->update(['tx_charge_status'=>2]);

        // ANSWER
        $rs_creditnote = tm_creditnote::where('creditnote_ai_charge_id',$rs_charge['ai_charge_id'])->get();
        return response()->json(['status'=>'success','message'=>'Nota de Cr&eacute;dito procesada.','data'=>['creditnote'=>$rs_creditnote]]);

    }
    
    public function report($from, $to){
        $rs = tm_creditnote::where('created_at','>=',date('Y-m-d h:i:s',strtotime($from)))->where('created_at','<=',date('Y-m-d h:i:s',strtotime($to)))->get();

        return [ 'list' => $rs ];
    }

}
