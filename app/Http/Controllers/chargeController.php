<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_charge;
use App\tm_request;
use App\tm_paymentmethod;
use App\tm_payment;

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
        
        $rs_openrequest =       $requestController->getOpenRequest();
        $rs_closedrequest =     $requestController->getClosedRequest();
        $rs_canceledrequest =   $requestController->getCanceledRequest();
        // $rs_openrequest =       tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',0)->get();
        // $rs_closedrequest =     tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',1)->get();
        // $rs_canceledrequest =   tm_request::select('tm_clients.tx_client_name','tm_charges.tx_charge_number','tm_charges.tx_charge_total','tm_charges.tx_charge_slug','tm_requests.tx_request_title','tm_tables.tx_table_value','tm_charges.created_at')->join('tm_charges','tm_charges.ai_charge_id','tm_requests.request_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',2)->orderby('tm_requests.created_at','ASC')->get();
        $rs_paymentmethod =     tm_paymentmethod::where('tx_paymentmethod_status',1)->get();

        $data = [
            // 'table_list' => $rs_ubication,
            'closed_request'    => $rs_closedrequest,
            'open_request'      => $rs_openrequest,
            'canceled_request'  => $rs_canceledrequest,
            'paymentmethod'     => $rs_paymentmethod
            // 'article_list' => $rs_article,
            // 'client_list' => $rs_client
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
                array_push($raw_price,['price' => $value['tx_commanddata_price'],'discount' =>  $value['tx_commanddata_discountrate'],'tax' =>  $value['tx_commanddata_taxrate'],'quantity' =>  $value['tx_commanddata_quantity']]);
            }
        }
        $price_sale = $this->calculate_sale($raw_price);
        $received = 0;
        foreach ($raw_payment as $key => $payment) {
            $received += $payment['amount'];
        }
        if ($price_sale['total'] > $received) {
            return response()->json(['status'=>'failed','message'=>'Faltan pagos.'.$price_sale['total'].' pp '.$received]);
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

        $qry_request->update(['tx_request_status'=>2, 'request_ai_charge_id'=>$charge_id]);
                
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
        $rs = $qry->first();

        $rs_payment = tm_payment::join('tm_paymentmethods','tm_paymentmethods.ai_paymentmethod_id','tm_payments.payment_ai_paymentmethod_id')->where('payment_ai_charge_id',$rs['ai_charge_id'])->get();
        $commandController = new commandController;

        $rs_article = $commandController->getByCharge($rs['ai_charge_id']);

        return response()->json(['status'=>'success','message'=>'','data'=>['charge'=>$rs, 'payment'=>$rs_payment, 'article'=>$rs_article]]);
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
}
