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

require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;


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
        if ( auth()->user()->hasAnyRole(['admin','super','cashier']) != true){ 
           return response()->json(['status'=>'failed','message'=>'Debe ingresar como supervisor.']);
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

        // IMPRESION
        $rs_creditnote = tm_creditnote::select('tm_creditnotes.tx_creditnote_number','tm_creditnotes.created_at','tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_creditnotes.tx_creditnote_nontaxable','tm_creditnotes.tx_creditnote_taxable','tm_creditnotes.tx_creditnote_tax','tm_creditnotes.tx_creditnote_retentionrate')
        ->join('tm_requests','tm_requests.request_ai_charge_id','tm_creditnotes.creditnote_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('ai_creditnote_id',$creditnote_id)->first();

        $rs_datacreditnote = $datacreditnoteController->getIt($creditnote_id);
        $subtotal = $rs_creditnote['tx_creditnote_nontaxable'] + $rs_creditnote['tx_creditnote_taxable'];
        $total = $subtotal + $rs_creditnote['tx_creditnote_tax'];

        $this->print_creditnote($rs_creditnote['tx_creditnote_number'], $rs_creditnote['created_at'], $rs_creditnote['tx_client_name'], $rs_creditnote['tx_client_cif'], $rs_datacreditnote, $subtotal, $rs_creditnote['tx_creditnote_retentionrate'],$rs_creditnote['tx_creditnote_tax'],$total);
        
        // ANSWER
        $rs_creditnote = tm_creditnote::where('creditnote_ai_charge_id',$rs_charge['ai_charge_id'])->get();
        
        return response()->json(['status'=>'success','message'=>'Nota de Cr&eacute;dito procesada.','data'=>['creditnote'=>$rs_creditnote]]);
    }

    public function print_creditnote($number, $date, $client_name, $client_ruc, $raw_item, $subtotal, $retention, $tax, $total){
        $connector = new NetworkPrintConnector("192.168.3.5", 9100);
        $printer = new Printer($connector);

        /* Information for the receipt */
        
        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        // $printer = new Printer($connector);
        
        // PRINT TOP DATE
        $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        $printer -> text(date('d-m-Y')."\n");

        /* Print top logo */
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> bitImage($logo);
        
        /* Name of shop */
        $printer -> text("Cancino, S.A.\n");
        $printer -> text("155732394-2-2023 DV 25.\n");
        $printer -> text("Boulevard Penonomé, Feria, Local #46\n");
        $printer -> text("Whatsapp: 6890-7358 Tel. 909-7780\n");
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text("DOCUMENTO NO FISCAL\n");
        $printer -> selectPrintMode();
        $printer -> feed();
        
        /* Title of receipt */
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer -> setEmphasis(true);
        $printer -> text("RECIBO DE NOTA DE CRÉDITO #".$number."\n");
        $printer -> setEmphasis(false);

        /* Client Info */
        $printer -> selectPrintMode();
        $printer -> text(date('d-m-Y h:i:s', strtotime($date))."\n");
        $printer -> text("Cliente: ".$client_name."\n");
        $printer -> text("RUC: ".$client_ruc."\n");
        $printer -> feed(2);
        
        /* Items */
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text("DOCUMENTO NO FISCAL\n");
        $printer -> selectPrintMode();
        $printer -> setJustification(Printer::JUSTIFY_LEFT);
        $printer -> text("Articulos Relacionados.\n");

        $content_observation = '';
        $last_observation = '';
        $command_id = 0 ;
        foreach ($raw_item as $item) {
            $printer -> text($item['tx_article_code']." - ".$item['tx_commanddata_description']." (".$item['tx_presentation_value'].")\n");
            $printer -> text($item['tx_commanddata_quantity']." x ".$item['tx_commanddata_price']."\n");
        }

        $printer -> feed(2);
        $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        $printer -> setEmphasis(true);
        $printer -> text("Subtotal. B/ ".number_format($subtotal,2)."\n");
        $printer -> setEmphasis(false);
        
        /* Tax and total */
        $printer -> text("Retención. B/ ".number_format($retention,2)."\n");
        $printer -> text("ITBMS. B/ ".number_format($tax,2)."\n");
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text("TOTAL. B/ ".number_format($total,2)."\n");
        $printer -> selectPrintMode();

        /* Footer */
        $printer -> feed(2);
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text("DOCUMENTO NO FISCAL\n");
        $printer -> selectPrintMode();
        $printer -> text("Gracias por su compra en Tequila & Mezcal\n");
        $printer -> text("Lo esperamos pronto.\n");
        $printer -> feed(2);
        
        /* Cut the receipt and open the cash drawer */
        $printer -> cut();
        $printer -> pulse();
        
        $printer -> close();
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
        // if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
        //     return redirect() -> route('request.index');
        // }
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
        $rs = tm_creditnote::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_dv','tm_creditnotes.tx_creditnote_number','tm_creditnotes.tx_creditnote_nontaxable','tm_creditnotes.tx_creditnote_taxable','tm_creditnotes.tx_creditnote_tax','tm_creditnotes.created_at','users.name as user_name')->join('users','users.id','tm_creditnotes.creditnote_ai_user_id')->join('tm_charges','tm_charges.ai_charge_id','tm_creditnotes.creditnote_ai_charge_id')->join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tm_creditnotes.created_at','>=',date('Y-m-d H:i:s',strtotime($from." 00:00:01")))->where('tm_creditnotes.created_at','<=',date('Y-m-d H:i:s',strtotime($to." 23:59:00")))->get();

        return [ 'list' => $rs ];
    }

}
