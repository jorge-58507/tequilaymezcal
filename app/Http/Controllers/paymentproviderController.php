<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productinput;
use App\tm_paymentprovider;
use App\tm_datapaymentprovider;
use App\rel_paymentprovider_productinput;

class paymentproviderController extends Controller
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
        $rs = tm_paymentprovider::select('tm_paymentproviders.ai_paymentprovider_id','tm_providers.tx_provider_value','tm_paymentproviders.tx_paymentprovider_total','tm_paymentproviders.tx_paymentprovider_number','tm_paymentproviders.created_at')->join('tm_providers','tm_providers.ai_provider_id','tm_paymentproviders.paymentprovider_ai_provider_id')->orderby('tm_paymentproviders.created_at','DESC')->get();

        return ['all' => $rs];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

        $raw_selected = $request->input('a');
        $productinputController = new productinputController;
        $total = 0;
        $due = 0;
        $raw_selectedinfo = [];

        foreach ($raw_selected as $selected) {
            $info = $productinputController->showit($selected);
            $total += $info['info']['tx_productinput_total'];
            $due += $info['info']['tx_productinput_due'];
            $raw_selectedinfo[] = $info;
        }
        return response()->json(['status'=>'success','message'=>'', 'data'=>['total'=>$total, 'due'=>$due, 'data_selected'=>$raw_selectedinfo ]]);
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
        $data_selected = $request->input('a');
        $raw_payment = $request->input('b');
        $received = 0;
        foreach ($raw_payment as $key => $payment) { //SUMA LOS PAGOS RECIBIDOS
            $received += $payment['amount'];
        }

        $count = tm_paymentprovider::count();
        $number = substr('000000000'.($count+55),-8);
        $user = $request->user();

        $tm_paymentprovider = new tm_paymentprovider;
        $tm_paymentprovider->paymentprovider_ai_user_id = $user['id'];
        $tm_paymentprovider->paymentprovider_ai_provider_id = $data_selected[0]['info']['ai_provider_id'];
        $tm_paymentprovider->tx_paymentprovider_number = $number;
        $tm_paymentprovider->tx_paymentprovider_total = $received;
        $tm_paymentprovider->save();
        $paymentprovider_id = $tm_paymentprovider->ai_paymentprovider_id;

        foreach ($raw_payment as $key => $payment) { 
            $tm_datapaymentprovider = new tm_datapaymentprovider;
            $tm_datapaymentprovider->datapaymentprovider_ai_user_id = $user['id'];
            $tm_datapaymentprovider->datapaymentprovider_ai_paymentprovider_id = $paymentprovider_id;
            $tm_datapaymentprovider->datapaymentprovider_ai_paymentmethod_id = $payment['method_id'];
            $tm_datapaymentprovider->tx_datapaymentprovider_amount = $payment['amount'];
            $tm_datapaymentprovider->tx_datapaymentprovider_number = $payment['number'];
            $tm_datapaymentprovider->tx_datapaymentprovider_observation = '';
            $tm_datapaymentprovider->save();
        }

        $raw_productinput = [];
        foreach ($data_selected as $selected) { //VERIFICA LA ASIGNACION DE PAGOS A CADA FACTURA
            $old_productinput[] = $selected['info'];
            if ($received >= $selected['info']['tx_productinput_due']) {
                $received = $received - $selected['info']['tx_productinput_due'];
                $selected['info']['payment'] = $selected['info']['tx_productinput_due'];
                $selected['info']['tx_productinput_due'] = 0;
                $selected['info']['tx_productinput_status'] = 2;
            }else{
                if ($received > 0) {
                    $due = $selected['info']['tx_productinput_due'];
                    $selected['info']['tx_productinput_due'] -= $received;
                    $received = $received - $due;
                    $selected['info']['payment'] = $received;
                }
            }
            $raw_productinput[] = $selected['info'];
        }

        foreach ($raw_productinput as $key => $value) { //ACTUALIZA LA DEUDA DE CADA FACTURA
            tm_productinput::where('ai_productinput_id',$value['ai_productinput_id'])->update([
                'tx_productinput_due' => $value['tx_productinput_due'],
                'tx_productinput_status' => $value['tx_productinput_status']
            ]);

            $rel_paymentprovider_productinput = new rel_paymentprovider_productinput;
            $rel_paymentprovider_productinput->paymentprovider_productinput_ai_paymentprovider_id = $paymentprovider_id;
            $rel_paymentprovider_productinput->paymentprovider_productinput_ai_productinput_id = $value['ai_productinput_id'];
            $rel_paymentprovider_productinput->tx_paymentprovider_productinput_payment = $value['payment'];
            $rel_paymentprovider_productinput->save();
        }

        // ANSWER
        $rs_paymentprovider = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Pago guardado satisfactoriamente.', 'data' => ['all' => $rs_paymentprovider]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $check = tm_paymentprovider::where('ai_paymentprovider_id',$id)->count();
        if ($check === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe el registro']);
        }
        $raw = $this->showIt($id);
        return response()->json(['status'=>'success','message'=>'','data'=>$raw]);
    }
    public function showIt($id)
    {
        $rs = tm_paymentprovider::join('tm_providers','tm_providers.ai_provider_id','tm_paymentproviders.paymentprovider_ai_provider_id')->where('ai_paymentprovider_id',$id)->first();
        $rs_datapaymentprovider = tm_datapaymentprovider::join('tm_paymentmethods','tm_paymentmethods.ai_paymentmethod_id','tm_datapaymentproviders.datapaymentprovider_ai_paymentmethod_id')->where('datapaymentprovider_ai_paymentprovider_id',$rs['ai_paymentprovider_id'])->get();
        $rs_related = $this->getRelated($id);

        return ['info' => $rs, 'data_paymentprovider' => $rs_datapaymentprovider, 'data_productinput' => $rs_related];
    }
    public function getRelated($id){
        $rs_dataproductinput = tm_paymentprovider::select('tm_paymentproviders.ai_paymentprovider_id','tm_paymentproviders.paymentprovider_ai_user_id','tm_paymentproviders.tx_paymentprovider_number','tm_paymentproviders.tx_paymentprovider_total','tm_paymentproviders.created_at  as paymentprovider_date',
        'tm_productinputs.tx_productinput_number','tm_productinputs.tx_productinput_total','tm_productinputs.tx_productinput_due','tm_productinputs.tx_productinput_date','tm_productinputs.tx_productinput_slug','tm_productinputs.created_at as productinput_date', 'rel_paymentprovider_productinputs.tx_paymentprovider_productinput_payment',
        'tm_requisitions.tx_requisition_slug','tm_requisitions.tx_requisition_number','tm_requisitions.tx_requisition_total','tm_requisitions.created_at as requisition_date')
        ->join('rel_paymentprovider_productinputs','rel_paymentprovider_productinputs.paymentprovider_productinput_ai_paymentprovider_id','tm_paymentproviders.ai_paymentprovider_id')
        ->join('tm_productinputs','tm_productinputs.ai_productinput_id','rel_paymentprovider_productinputs.paymentprovider_productinput_ai_productinput_id')
        ->join('rel_requisition_productinputs','rel_requisition_productinputs.requisition_productinput_ai_productinput_id','tm_productinputs.ai_productinput_id')
        ->join('tm_requisitions','rel_requisition_productinputs.requisition_productinput_ai_requisition_id','tm_requisitions.ai_requisition_id')->where('tm_paymentproviders.ai_paymentprovider_id',$id)->get();

        return $rs_dataproductinput;
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
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

        $qry = tm_paymentprovider::where('ai_paymentprovider_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe el registro']);
        }
        $rs = $qry->first();
        $rs_rel = rel_paymentprovider_productinput::where('paymentprovider_productinput_ai_paymentprovider_id',$rs['ai_paymentprovider_id'])->get();
        foreach ($rs_rel as $value) {
            $qry_productinput = tm_productinput::where('ai_productinput_id',$value['paymentprovider_productinput_ai_productinput_id']);
            $rs_productinput = $qry_productinput->first();
            $qry_productinput->update(['tx_productinput_due'=>$value['tx_paymentprovider_productinput_payment']+$rs_productinput['tx_productinput_due']]);
        }
        $qry->delete();

        // ANSWER
        $rs_paymentprovider = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Pago eliminado satisfactoriamente.', 'data' => ['all' => $rs_paymentprovider['all']]]);
    }
}
