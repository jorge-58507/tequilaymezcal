<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_charge;
use App\tm_request;
use App\tm_paymentmethod;
use App\tm_payment;
use App\tm_creditnote;
use App\tm_cashoutput;
use App\tm_cashregister;
use App\tm_client;
use App\tm_giftcard;

class chargeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if ( auth()->user()->hasAnyRole(['admin','super','cashier']) != true){ 
            return redirect() -> route('request.index');
        }
        $requestController = new requestController;
        $clientController = new clientController;
        $creditnoteController = new creditnoteController;
        
        $rs_openrequest =       $requestController->getOpenRequest();
        $rs_closedrequest =     $requestController->getClosedRequest();
        $rs_canceledrequest =   $requestController->getCanceledRequest();
        $rs_paymentmethod =     tm_paymentmethod::where('tx_paymentmethod_status',1)->get();
        $rs_client =            $clientController->getAll();
        $rs_creditnote =        $creditnoteController->getAll();

        $data = [
            'closed_request'    => $rs_closedrequest,
            'open_request'      => $rs_openrequest,
            'canceled_request'  => $rs_canceledrequest,
            'paymentmethod'     => $rs_paymentmethod,
            'client_list'       => $rs_client,
            'creditnote_list'   => $rs_creditnote
        ];
        return view('charge.index', compact('data'));
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
            return redirect() -> route('request.index');
        }

        $request_slug = $request->input('a');
        $raw_payment = $request->input('b');
        $raw_giftcard = $request->input('c');

        $qry_request = tm_request::where('tx_request_slug',$request_slug);
        if ($qry_request->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Pedido no existe.']);
        }
        $rs_request = $qry_request->first();
        $commandController = new commandController;
        $raw_commanddata = $commandController->getByRequest($rs_request['ai_request_id']);
        $raw_price = []; //[{PRICE,discount,tax, quantity}]
        foreach ($raw_commanddata as $key => $value) {
            if ($value['tx_commanddata_status'] === 1) {
                array_push($raw_price,[
                    'price' => $value['tx_commanddata_price'],
                    'discount' =>  $value['tx_commanddata_discountrate'],
                    'tax' =>  $value['tx_commanddata_taxrate'],
                    'quantity' =>  $value['tx_commanddata_quantity']
                ]);
            }
        }
        
        $price_sale = $this->calculate_sale($raw_price);
        $received = 0;
        foreach ($raw_payment as $key => $payment) {
            $received += $payment['amount'];
        }
        foreach ($raw_giftcard as $key => $payment) {
            $received += $payment['amount'];
        }
        if ($price_sale['total'] > $received) {
            return response()->json(['status'=>'failed','message'=>'Faltan pagos.']);
        }

        $change = ($price_sale['total'] === $received) ? 0.00 : $received - $price_sale['total'];

        $number = tm_charge::count() + 55;
        $user = $request->user();
        $tm_charge = new tm_charge;
        $tm_charge->charge_ai_user_id       = $user['id'];
        $tm_charge->charge_ai_paydesk_id    = 0;
        $tm_charge->tx_charge_number        = substr('0000000000'.$number,-10);
        $tm_charge->tx_charge_nontaxable    = $price_sale['st_notaxable'];
        $tm_charge->tx_charge_taxable       = $price_sale['subtotal'];
        $tm_charge->tx_charge_discount      = $price_sale['discount'];
        $tm_charge->tx_charge_tax           = $price_sale['tax'];
        $tm_charge->tx_charge_total         = $price_sale['total'];
        $tm_charge->tx_charge_change        = $change;
        $tm_charge->tx_charge_status        = 1;
        $tm_charge->tx_charge_slug          = time().str_replace('.','',$price_sale['total']);
        $tm_charge->save();
        $charge_id = $tm_charge->ai_charge_id;

        $paymentController = new paymentController;
        $paymentController->save($raw_payment, $charge_id, $user['id']);
        $paymentController->save_giftcard($raw_giftcard, $charge_id, $user['id']);

        $qry_request->update(['tx_request_status'=>2, 'request_ai_charge_id'=>$charge_id]);
        foreach ($raw_giftcard as $key => $payment) {
            $qry_giftcard = tm_giftcard::where('ai_giftcard_id',$payment['giftcard_id']);
            $rs_giftcard = $qry_giftcard->first();
            $qry_giftcard->update(['tx_giftcard_amount' => ($rs_giftcard['tx_giftcard_amount'] - $payment['amount'])]);
        }

        return response()->json(['status'=>'success','message'=>'Pedido cobrado satisfactoriamente.']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        if ( auth()->user()->hasAnyRole(['admin','super','cashier']) != true){ 
            return redirect() -> route('request.index');
        }
        $qry = tm_charge::join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_charge_slug',$slug);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Factura no existe.']);
        }
        $rs = $this->showIt($slug);
        return response()->json(['status'=>'success','message'=>'','data'=>['charge'=>$rs['charge'], 'payment'=>$rs['payment'], 'article'=>$rs['article']]]);
    }
    public function showIt($slug){
        $qry = tm_charge::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_dv','tm_clients.tx_client_direction','tm_clients.tx_client_telephone','tm_clients.tx_client_email',
        'tm_tables.tx_table_value',
        'users.name as user_name',
        'tm_charges.ai_charge_id','tm_charges.charge_ai_user_id','tm_charges.charge_ai_cashregister_id','tm_charges.charge_ai_paydesk_id','tm_charges.tx_charge_number','tm_charges.tx_charge_nontaxable',
        'tm_charges.tx_charge_taxable','tm_charges.tx_charge_discount','tm_charges.tx_charge_tax','tm_charges.tx_charge_total','tm_charges.tx_charge_change',
        'tm_charges.tx_charge_status','tm_charges.tx_charge_ticket','tm_charges.tx_charge_note','tm_charges.tx_charge_slug','tm_charges.created_at')
        ->join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')
        ->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')
        ->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')
        ->join('users','users.id','tm_charges.charge_ai_user_id')->where('tx_charge_slug',$slug);
        $rs = $qry->first();

        $rs_payment = tm_payment::join('tm_paymentmethods','tm_paymentmethods.ai_paymentmethod_id','tm_payments.payment_ai_paymentmethod_id')->where('payment_ai_charge_id',$rs['ai_charge_id'])->get();
        $commandController = new commandController;

        $rs_article = $commandController->getByCharge($rs['ai_charge_id']);

        return ['charge'=>$rs, 'payment'=>$rs_payment, 'article'=>$rs_article];
    }
    public function show_cashregister($date){
        $user = auth()->user();
        $cashregister = $this->get_cashregister($date,$user);
        return response()->json(['status'=>'success','message'=>'','data'=>['cashregister'=>$cashregister]]);
    }

    public function get_cashregister($date,$user){
        // gross_sale la suma de la totalidad de las ventas sin descuentos, 
        // Venta real: gross_sale - descuento
        // net_sale: gross_sale - descuento -  devolucion - anulado, 
        $rs_charge = tm_charge::join('tm_payments','tm_payments.payment_ai_charge_id','tm_charges.ai_charge_id')->where('charge_ai_user_id',$user['id'])->where('charge_ai_cashregister_id',null)->get();
        $raw_payment = [];
        $gross_sale = 0;
        $nontaxable = 0;
        $taxable = 0;
        $tax = 0;
        $ttl_discount=0; 
        $i=0;
        $raw_ffid = [];
        foreach ($rs_charge as $charge) {
            if ($charge['payment_ai_paymentmethod_id'] === 1) {
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                }else{
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                }
                $gross_sale += $charge['tx_payment_amount'] - $charge['tx_charge_change'];
            }else{
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'];
                }else{
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'];
                }
                $gross_sale += $charge['tx_payment_amount'];
            }
            if (!in_array($charge['ai_charge_id'],$raw_ffid)) {
                $ttl_discount += $charge['tx_charge_discount'];
                $nontaxable += $charge['tx_charge_nontaxable'];
                $taxable += $charge['tx_charge_taxable'];
                $tax += $charge['tx_charge_tax'];
                array_push($raw_ffid,$charge['ai_charge_id']);
                $i++;
            }
        }
        $gross_sale = $gross_sale+$ttl_discount;

        $rs_creditnote = tm_creditnote::where('creditnote_ai_user_id',$user['id'])->where('creditnote_ai_cashregister_id',null)->get();
        $nc_nontaxable=0; 
        $nc_taxable=0; 
        $nc_tax=0;
        $cashback=0; 
        $canceled=0;
        $raw_canceled = [];
        $raw_creditnote = [];
        $ite=0;
        foreach ($rs_creditnote as $creditnote) {
            array_push($raw_creditnote,$creditnote['ai_creditnote_id']);
            $ite++;

            if ($creditnote['tx_creditnote_nullification'] === 1) {
                $canceled += $creditnote['tx_creditnote_taxable']+$creditnote['tx_creditnote_nontaxable']+$creditnote['tx_creditnote_tax'];
                $rs_payment = tm_payment::where('payment_ai_charge_id',$creditnote['creditnote_ai_charge_id'])->get();
                foreach ($rs_payment as $payment) {
                    if (empty($raw_canceled[$payment['payment_ai_paymentmethod_id']])) {
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] = $payment['tx_payment_amount'];
                    }else{
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] += $payment['tx_payment_amount'];
                    }
                }
            }else{
                $cashback += $creditnote['tx_creditnote_nontaxable']+$creditnote['tx_creditnote_taxable']+$creditnote['tx_creditnote_tax'];
                $nc_nontaxable += $creditnote['tx_creditnote_nontaxable'];
                $nc_taxable += $creditnote['tx_creditnote_taxable'];
   		        $nc_tax+=$creditnote['tx_creditnote_tax'];
            }
        }

        $rs_cashoutput = tm_cashoutput::where('cashoutput_ai_user_id',$user['id'])->where('cashoutput_ai_cashregister_id',null)->get();
        $income_cashoutput = 0;
        $outcome_cashoutput = 0;
        $nullified_cashoutput = 0;
        foreach ($rs_cashoutput as $cashoutput) {
            if ($cashoutput['tx_cashoutput_status'] === 0) {
                $nullified_cashoutput += $cashoutput['tx_cashoutput_amount'];
            } else {
                if ($cashoutput['tx_cashoutput_type'] === 1) {
                    $outcome_cashoutput += $cashoutput['tx_cashoutput_amount'];
                }else{
                    $income_cashoutput  += $cashoutput['tx_cashoutput_amount'];
                }
            }
        }

        $cashregisterController = new cashregisterController;
        $rs_cashregister = $cashregisterController->get_by_date(date('Y-m-d'));
        $rs_giftcard = tm_giftcard::where('giftcard_ai_user_id',$user['id'])->where('giftcard_ai_cashregister_id',null)->get();
        return [
            'payment' => $raw_payment, //array
            'returnpayment' => $raw_canceled, //array
            'grosssale'=> $gross_sale,
            'netsale' => round($gross_sale - $ttl_discount - $cashback - $canceled,2),
            'realsale' => $gross_sale - $ttl_discount,
            'nontaxable' => $nontaxable,
            'returnnontaxable' => $nc_nontaxable,
            'taxable' => $taxable,
            'returntaxable' => $nc_taxable,
            'tax' => $tax,
            'returntax' => $nc_tax,
            'discount' => $ttl_discount,
            'quantitydoc' => $i,
            'returnquantitydoc' => $ite,
            'cashback' => $cashback,
            'canceled' => $canceled,
            'cashoutput' => ['in' => $income_cashoutput, 'out' => $outcome_cashoutput, 'nullified' => $nullified_cashoutput],
            'cashregister_list' => $rs_cashregister,
            'giftcard' => $rs_giftcard
        ];
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
    public function calculate_sale($raw_price){ //[{price,discount,tax, quantity}]
        $ttl_gross = 0;
        $ttl_discount = 0;
        $ttl_tax = 0;
        $subtotal = 0;
        $st_notaxable = 0;
        $total = 0;

        foreach ($raw_price as $key => $article) {
            $discount = ($article['price'] * $article['discount'])/100;
            $discount = round($discount,2);
            $price_discount = $article['price'] - $discount;
            $tax = ($price_discount*$article['tax'])/100;
            $tax = round($tax,2);
            $price_tax = $price_discount+$tax;

            if ($article['tax'] != 0) {
                $subtotal += $article['quantity']*$price_discount;
            }else{
                $st_notaxable += $article['quantity']*$price_discount;
            }
            $ttl_gross += $article['quantity']*$article['price'];
            $total += $article['quantity']*$price_tax;
            $ttl_discount += $article['quantity']*$discount;
            $ttl_tax += $article['quantity']*$tax;
        }
        return [
            'gross_total' =>  round($ttl_gross,2),
            'subtotal'=>  round($subtotal,2), 
            'st_notaxable'=>  round($st_notaxable,2), 
            'total' =>  round($total,2),
            'discount' =>  round($ttl_discount,2), 
            'tax' =>  round($ttl_tax,2)
        ];
    }

    public function report ($from,$to){
        $rs = tm_charge::select('tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_dv','tm_charges.tx_charge_number','tm_charges.tx_charge_nontaxable','tm_charges.tx_charge_taxable','tm_charges.tx_charge_discount','tm_charges.tx_charge_tax','tm_charges.tx_charge_total','tm_charges.tx_charge_change','tm_charges.created_at')->join('tm_requests','tm_requests.request_ai_charge_id','tm_charges.ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tm_charges.created_at','>=',date('Y-m-d h:i:s',strtotime($from)))->where('tm_charges.created_at','<=',date('Y-m-d h:i:s',strtotime($to)))->get();
        $rs_paymentmethod = tm_charge::select('tm_payments.payment_ai_paymentmethod_id','tm_payments.tx_payment_amount','tm_payments.tx_payment_number','tm_charges.created_at')->join('tm_payments','tm_payments.payment_ai_charge_id','tm_charges.ai_charge_id')->where('tm_charges.created_at','>=',date('Y-m-d h:i:s',strtotime($from)))->where('tm_charges.created_at','<=',date('Y-m-d h:i:s',strtotime($to)))->get();

        return [ 'list' => $rs, 'paymentmethod' => $rs_paymentmethod ];
        








    }
}
