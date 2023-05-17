<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_cashregister;
use App\tm_charge;
use App\tm_creditnote;
use App\tm_cashoutput;
use App\tm_payment;
use App\tm_giftcard;

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
            // return response()->json(['status'=>'failed','message'=>'No.', 'lala'=>$cashregister['giftcard']]);

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
        $rs_cashregister = tm_cashregister::where('created_at','like','%'.$date.'%')->get();
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

        return ['cashregister'=>$rs_cashregister, 'payment'=>$raw_payment, 'canceled'=>$raw_canceled, 'giftcard'=>$rs_giftcard];
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
}
