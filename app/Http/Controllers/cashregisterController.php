<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_cashregister;
use App\tm_charge;
use App\tm_creditnote;
use App\tm_cashoutput;
use App\tm_payment;
use App\tm_giftcard;
use App\tm_commanddata;

require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;

class cashregisterController extends Controller
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
        $chargeController = new chargeController;
        $user = auth()->user();
        $cashregister = $chargeController->get_cashregister(date('Y-m-d'),$user);

        if (empty($cashregister['quantitydoc']) && empty($cashregister['returnquantitydoc']) && sizeof($cashregister['giftcard']) === 0) {
            return response()->json(['status'=>'failed','message'=>'No hay documentos.']);
        }

        $tm_cashregister = new tm_cashregister;
        $tm_cashregister->cashregister_ai_user_id = $user['id'];
        $tm_cashregister->tx_cashregister_grosssale = $cashregister['grosssale'];
        $tm_cashregister->tx_cashregister_netsale = $cashregister['netsale'];
        $tm_cashregister->tx_cashregister_realsale = $cashregister['realsale'];
        $tm_cashregister->tx_cashregister_nontaxable = $cashregister['nontaxable'];
        $tm_cashregister->tx_cashregister_returnnontaxable = $cashregister['returnnontaxable'];
        $tm_cashregister->tx_cashregister_taxable = $cashregister['taxable'];
        $tm_cashregister->tx_cashregister_returntaxable = $cashregister['returntaxable'];
        $tm_cashregister->tx_cashregister_tax = $cashregister['tax'];
        $tm_cashregister->tx_cashregister_returntax = $cashregister['returntax'];
        $tm_cashregister->tx_cashregister_discount = $cashregister['discount'];
        $tm_cashregister->tx_cashregister_tip = $cashregister['tip'];
        $tm_cashregister->tx_cashregister_cashback = $cashregister['cashback'];
        $tm_cashregister->tx_cashregister_canceled = $cashregister['canceled'];
        $tm_cashregister->tx_cashregister_cashoutputin = $cashregister['cashoutput']['in'];
        $tm_cashregister->tx_cashregister_cashoutputout = $cashregister['cashoutput']['out'];
        $tm_cashregister->tx_cashregister_cashoutputnull = $cashregister['cashoutput']['nullified'];
        $tm_cashregister->tx_cashregister_quantitydoc = $cashregister['quantitydoc'];
        $tm_cashregister->tx_cashregister_returnquantitydoc = $cashregister['returnquantitydoc'];
        $tm_cashregister->save();
        $cashregister_id = $tm_cashregister->ai_cashregister_id;

        tm_charge::where('charge_ai_user_id',$user['id'])->where('charge_ai_cashregister_id',null)->update(['charge_ai_cashregister_id' => $cashregister_id]);
        tm_creditnote::where('creditnote_ai_user_id',$user['id'])->where('creditnote_ai_cashregister_id',null)->update(['creditnote_ai_cashregister_id' => $cashregister_id]);
        tm_cashoutput::where('cashoutput_ai_user_id',$user['id'])->where('cashoutput_ai_cashregister_id',null)->update(['cashoutput_ai_cashregister_id' => $cashregister_id]);
        tm_giftcard::where('giftcard_ai_user_id',$user['id'])->where('giftcard_ai_cashregister_id',null)->update(['giftcard_ai_cashregister_id' => $cashregister_id]);

        $this->print_rollpaper_cashregister($cashregister_id);
        // ANSWER
        $rs_cashregister = $this->get_by_date(date('Y-m-d'));
        return response()->json(['status'=>'success','message'=>'','data'=>['all'=>$rs_cashregister]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function get_by_date($date)
    {
        $rs_cashregister = tm_cashregister::select('tm_cashregisters.ai_cashregister_id','tm_cashregisters.tx_cashregister_payment','tm_cashregisters.tx_cashregister_paymentnull','tm_cashregisters.tx_cashregister_grosssale','tm_cashregisters.tx_cashregister_netsale','tm_cashregisters.tx_cashregister_realsale',
        'tm_cashregisters.tx_cashregister_cashback','tm_cashregisters.tx_cashregister_discount','tm_cashregisters.tx_cashregister_returntax','tm_cashregisters.tx_cashregister_tax','tm_cashregisters.tx_cashregister_returntaxable','tm_cashregisters.tx_cashregister_taxable','tm_cashregisters.tx_cashregister_returnnontaxable','tm_cashregisters.tx_cashregister_nontaxable',
        'tm_cashregisters.created_at','tm_cashregisters.tx_cashregister_returnquantitydoc','tm_cashregisters.tx_cashregister_quantitydoc','tm_cashregisters.tx_cashregister_cashoutputnull','tm_cashregisters.tx_cashregister_cashoutputout','tm_cashregisters.tx_cashregister_cashoutputin','tm_cashregisters.tx_cashregister_canceled',
        'users.name as user_name')
        ->join('users','users.id','tm_cashregisters.cashregister_ai_user_id')->where('tm_cashregisters.created_at','like','%'.$date.'%')->get();
        return $rs_cashregister;

        



















    }

    public function show($cashregister_id)
    {
        $data = $this->getit($cashregister_id);

        return response()->json(['status'=>'success','message'=>'','data'=>$data]);
    }

    public function getit($cashregister_id)
    {
        $rs_cashregister = tm_cashregister::where('ai_cashregister_id',$cashregister_id)->first();

        $rs_charge = tm_charge::join('tm_payments','tm_payments.payment_ai_charge_id','tm_charges.ai_charge_id')->where('charge_ai_cashregister_id',$cashregister_id)->get();
        $raw_payment = [];
        foreach ($rs_charge as $charge) {
            if ($charge['payment_ai_paymentmethod_id'] === 1) {
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                }else{
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                }
            }else{
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'];
                }else{
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'];
                }
            }
        }

        $rs_creditnote = tm_creditnote::where('creditnote_ai_cashregister_id',$cashregister_id)->get();
        $raw_canceled = [];
        foreach ($rs_creditnote as $creditnote) {
            if ($creditnote['tx_creditnote_nullification'] === 1) {
                $rs_payment = tm_payment::where('payment_ai_charge_id',$creditnote['creditnote_ai_charge_id'])->get();
                foreach ($rs_payment as $payment) {
                    if (empty($raw_canceled[$payment['payment_ai_paymentmethod_id']])) {
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] = $payment['tx_payment_amount'];
                    }else{
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] += $payment['tx_payment_amount'];
                    }
                }
            }
        }

        $rs_giftcard = tm_giftcard::where('giftcard_ai_cashregister_id',$cashregister_id)->get();

        $rs_charge = tm_charge::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_dv','tm_charges.tx_charge_number','tm_charges.tx_charge_nontaxable','tm_charges.tx_charge_taxable','tm_charges.tx_charge_discount','tm_charges.tx_charge_tax','tm_charges.tx_charge_total','tm_charges.tx_charge_change','tm_charges.created_at')->join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('charge_ai_cashregister_id',$cashregister_id)
        ->orderby('tm_charges.created_at')->get();

        return ['cashregister'=>$rs_cashregister, 'payment'=>$raw_payment, 'canceled'=>$raw_canceled, 'giftcard'=>$rs_giftcard, 'charge'=>$rs_charge];
    }
    public function filter($date)
    {
        $rs_cashregister = $this->get_by_date($date);

        return response()->json(['status'=>'success','message'=>'','data'=>['all'=>$rs_cashregister, 'dat' => $date]]);
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

    public function print_rollpaper_cashregister($cashregister_id){

        $cashregisterController = new cashregisterController;
		$rs_cashregister = $cashregisterController->getit($cashregister_id);

		$incomeCash = (empty($rs_cashregister['payment'][1])) 	? 0 : $rs_cashregister['payment'][1];
		$returnCash = (empty($rs_cashregister['canceled'][1])) ? 0 : $rs_cashregister['canceled'][1];

		$incomeCheck = (empty($rs_cashregister['payment'][2])) 	? 0 : $rs_cashregister['payment'][2];
		$returnCheck= (empty($rs_cashregister['canceled'][2])) ? 0 : $rs_cashregister['canceled'][2];

		$incomeDebit = (empty($rs_cashregister['payment'][4])) 	? 0 : $rs_cashregister['payment'][4];
		$returnDebit = (empty($rs_cashregister['canceled'][4])) ? 0 : $rs_cashregister['canceled'][4];

		$incomeCredit = (empty($rs_cashregister['payment'][3])) 	? 0 : $rs_cashregister['payment'][3];
		$returnCredit = (empty($rs_cashregister['canceled'][3])) ? 0 : $rs_cashregister['canceled'][3];

		$incomeYappi = (empty($rs_cashregister['payment'][5])) 	? 0 : $rs_cashregister['payment'][5];
		$returnYappi = (empty($rs_cashregister['canceled'][5])) ? 0 : $rs_cashregister['canceled'][5];

		$incomeNequi = (empty($rs_cashregister['payment'][6])) 	? 0 : $rs_cashregister['payment'][6];
		$returnNequi = (empty($rs_cashregister['canceled'][6])) ? 0 : $rs_cashregister['canceled'][6];

		$incomeAnother = (empty($rs_cashregister['payment'][7])) 	? 0 : $rs_cashregister['payment'][7];
		$returnAnother = (empty($rs_cashregister['canceled'][7])) ? 0 : $rs_cashregister['canceled'][7];

		$incomeGiftcard = (empty($rs_cashregister['payment'][8])) 	? 0 : $rs_cashregister['payment'][8];
		$returnGiftcard = (empty($rs_cashregister['canceled'][8])) ? 0 : $rs_cashregister['canceled'][8];

		$total_giftcard = ['active' => 0, 'inactive' => 0];
		foreach ($rs_cashregister['giftcard'] as $giftcard) {
			$ttl_giftcard = 0;
			$giftcard_payment = json_decode($giftcard['tx_giftcard_payment'],true);
			foreach ($giftcard_payment as $key => $gcp) {
				$ttl_giftcard += $gcp['amount'];
			}
			if ($giftcard['tx_giftcard_status'] === 0) {
				$total_giftcard['inactive'] += $ttl_giftcard;
			}else{
				$total_giftcard['active'] += $ttl_giftcard;
			}
		}
        $optionController = new optionController;
        $rs_option = $optionController->getOption();
        
        $connector = new NetworkPrintConnector("192.168.3.5", 9100);
        $printer = new Printer($connector);
        
        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        // $printer = new Printer($connector);
        
        // PRINT TOP DATE
        $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        $printer -> text(date('d-m-Y', strtotime($rs_cashregister['cashregister']['created_at']))."\n");

        /* Print top logo */
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> bitImage($logo);
        
        /* Name of shop */
        $printer -> text($rs_option['SOCIETY']."\n");
        $printer -> text($rs_option['RUC']." DV ".$rs_option['DV']."\n");
        $printer -> text($rs_option['DIRECCION']."\n");
        $printer -> text("Whatsapp: ".$rs_option['CEL']." Tel. ".$rs_option['TELEFONO']."\n");
        $printer -> feed();
        
        /* Title of receipt */
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer -> setEmphasis(true);
        $printer -> text("CIERRE DE CAJA ".date('d-m-Y h:i s', strtotime($rs_cashregister['cashregister']['created_at']))."\n");
        $printer -> setEmphasis(false);
        $printer -> selectPrintMode();
        $printer -> feed(2);


        /* Items */
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> text("Métodos de Pago.\n");
        $printer -> setJustification(Printer::JUSTIFY_LEFT);

        $printer -> text("Efectivo: B/".number_format($incomeCash - $returnCash, 2)."\n");
        $printer -> text("Cheque: B/".number_format($incomeCheck - $returnCheck, 2)."\n");
        $printer -> text("T. Clave: B/".number_format($incomeDebit - $returnDebit, 2)."\n");
        $printer -> text("T. Credito: B/".number_format($incomeCredit - $returnCredit, 2)."\n");
        $printer -> text("Yappy: B/".number_format($incomeYappi - $returnYappi, 2)."\n");
        $printer -> text("PedidosYa: B/".number_format($incomeNequi - $returnNequi, 2)."\n");
        $printer -> text("Otros: B/".number_format($incomeAnother - $returnAnother, 2)."\n");
        $printer -> text("Cupón: B/".number_format($incomeGiftcard - $returnGiftcard, 2)."\n");
        
        $printer -> feed(1);

        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> text("Venta de Cupones.\n");
        $printer -> setJustification(Printer::JUSTIFY_LEFT);

        $printer -> text("Activos: ".number_format($total_giftcard['active'], 2)."\n");
        $printer -> text("Inactivos: ".number_format($total_giftcard['inactive'], 2)."\n");
        
        $printer -> feed(1);

        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> text("Totales.\n");
        $printer -> setJustification(Printer::JUSTIFY_LEFT);

        $printer -> text("Documentos: ".$rs_cashregister['cashregister']['tx_cashregister_quantitydoc']."\n");
        $printer -> text("Venta Bruta: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_grosssale'],2)."\n");
        $printer -> text("Descuento: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_discount'],2)."\n");
        $printer -> text("Venta Real: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_realsale'],2)."\n");
        $printer -> text("Devolucion: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_returntaxable'] + $rs_cashregister['cashregister']['tx_cashregister_returnnontaxable'],2)."\n");
        $printer -> text("Venta Neta: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_netsale'],2)."\n");
        $printer -> text("Anulado: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_canceled'],2)."\n");
        $printer -> text("Propina: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_tip'],2)."\n");
        
        $printer -> feed(1);

        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> text("Desglose de ITBMS.\n");
        $printer -> setJustification(Printer::JUSTIFY_LEFT);

        $printer -> text("Base No Imponible: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_nontaxable'],2)."\n");
        $printer -> text("Base Imponible: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_taxable'],2)."\n");
        $printer -> text("NC No Imponible: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_returnnontaxable'],2)."\n");
        $printer -> text("NC Imponible: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_returntaxable'],2)."\n");
        $printer -> text("Impuesto: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_tax'],2)."\n");
        $printer -> text("Impuesto NC: B/ ".number_format($rs_cashregister['cashregister']['tx_cashregister_returntax'],2)."\n");

        $printer -> feed(3);

        /* Cut the receipt */
        $printer -> cut();        
        $printer -> close();

        return response()->json(['status'=>'success','message'=>'Reporte Impreso.']);

    }

    public function print_cashregister_commanddata($cashregister_id){

        $cashregisterController = new cashregisterController;
		$rs_cashregister = $cashregisterController->getit($cashregister_id);

        $connector = new NetworkPrintConnector("192.168.3.5", 9100);
        $printer = new Printer($connector);
        
        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        
        // PRINT TOP DATE
        $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        $printer -> text(date('d-m-Y', strtotime($rs_cashregister['cashregister']['created_at']))."\n");

        /* Print top logo */
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> bitImage($logo);
                
        // ########## LISTADO DE ARTICULOS
        
        $rs = tm_commanddata::select('tm_commanddatas.created_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_price','tm_commanddatas.commanddata_ai_article_id','tm_commanddatas.tx_commanddata_description','tm_commanddatas.commanddata_ai_presentation_id','tm_presentations.tx_presentation_value')
        ->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
        ->join('tm_commands','tm_commands.ai_command_id','tm_commanddatas.commanddata_ai_command_id')
        ->join('tm_requests','tm_requests.ai_request_id','tm_commands.command_ai_request_id')
        ->join('tm_charges','tm_charges.ai_charge_id','tm_requests.request_ai_charge_id')
        ->where('tm_charges.charge_ai_cashregister_id', $cashregister_id)->get();
        
        $list = '';
        $raw_report = [];

        foreach ($rs as $commanddata) {
            /* VERIFICA SI el articulo ya fue ingresado al listado */ 
            $already = 0;
            if (count($raw_report) > 0) {
                foreach ($raw_report as $key => $line) {
                    if ($line['article_id'] === $commanddata['commanddata_ai_article_id'] && $line['presentation_id'] === $commanddata['commanddata_ai_presentation_id']) {
                        $already = $key;
                        break;
                    }
                }
            }
            if ($already > 0) {
                $raw_report[$key]['quantity'] += $commanddata['tx_commanddata_quantity'];
            }else{
                array_push($raw_report,[
                    'article_id' => $commanddata['commanddata_ai_article_id'], 
                    'quantity' => $commanddata['tx_commanddata_quantity'], 
                    'article_description' => $commanddata['tx_commanddata_description'], 
                    'presentation_value' => $commanddata['tx_presentation_value'], 
                    'presentation_id' => $commanddata['commanddata_ai_presentation_id'], 
                    'price' => $commanddata['tx_commanddata_price'] 
                ]);
            }
        }
        
        /* Title of receipt */
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer -> setEmphasis(true);
        $printer -> text("CIERRE DE CAJA ".date('d-m-Y h:i s', strtotime($rs_cashregister['cashregister']['created_at']))."\n");
        $printer -> setEmphasis(false);
        $printer -> feed(2);
        $printer -> text("LISTADO DE COMANDAS \n");
        $printer -> selectPrintMode();
        $printer -> feed(2);

        $printer -> setJustification(Printer::JUSTIFY_LEFT);
        foreach ($raw_report as $value) {
            $printer -> text($value['quantity']." - ".$value['article_description']." (".$value['presentation_value'].") B/.".number_format($value['price'],2)."\n");
        }
        
        $printer -> feed(3);

        /* Cut the receipt */
        $printer -> cut();        
        $printer -> close();

        return response()->json(['status'=>'success','message'=>'Reporte Impreso.']);

    }    

}
