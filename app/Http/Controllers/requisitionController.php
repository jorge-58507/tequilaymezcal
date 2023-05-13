<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_requisition;
use App\tm_datarequisition;
use App\tm_provider;

class requisitionController extends Controller
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
        $rs_notprocesed = tm_requisition::join('tm_providers','tm_providers.ai_provider_id','tm_requisitions.requisition_ai_provider_id')->orderby('ai_requisition_id','DESC')->where('tx_requisition_status',0)->get();
        $rs_procesed    = tm_requisition::join('tm_providers','tm_providers.ai_provider_id','tm_requisitions.requisition_ai_provider_id')->orderby('ai_requisition_id','DESC')->where('tx_requisition_status',1)->get();

        return ['notprocesed'=>$rs_notprocesed, 'procesed'=>$rs_procesed];
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
        $qry_provider = tm_provider::where('tx_provider_slug',$request->input('b'));
        if ($qry_provider->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe.']);
        }
        $rs_provider = $qry_provider->first();
        $user = $request->user();
        $count = tm_requisition::count();
        $raw_product = $request->input('a');
        $raw_total = $request->input('c');
        $number = substr('0000000000'.$count+55,-10);

        $tm_requisition = new tm_requisition;
        $tm_requisition->requisition_ai_user_id    = $user['id'];
        $tm_requisition->requisition_ai_provider_id = $rs_provider['ai_provider_id'];
        $tm_requisition->tx_requisition_number     = $number;
        $tm_requisition->tx_requisition_nontaxable = $raw_total['nontaxable'];
        $tm_requisition->tx_requisition_taxable    = $raw_total['taxable'];
        $tm_requisition->tx_requisition_discount   = $raw_total['discount'];
        $tm_requisition->tx_requisition_tax        = $raw_total['tax'];
        $tm_requisition->tx_requisition_total      = $raw_total['total'];
        $tm_requisition->tx_requisition_slug       = time().str_replace(' ','',$number);
        $tm_requisition->save();
        $requisition_id = $tm_requisition->ai_requisition_id;

        foreach ($raw_product as $product) {
            $this->save_data($user['id'], $requisition_id, $product['id'], $product['description'], $product['quantity'], $product['measure_id'], $product['price'], $product['discountrate'], $product['taxrate'], $product['total']);
        }

        // ANSWER
        $rs_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Orden de compra creada.','data' => ['notprocesed'=>$rs_all['notprocesed'], 'procesed'=>$rs_all['procesed']]]);

    }

    public function save_data($user_id, $requisition_id, $product_id, $description, $quantity, $measure_id, $price, $discountrate, $taxrate, $total)
    {
        $tm_datarequisition = new tm_datarequisition;
        $tm_datarequisition->datarequisition_ai_user_id = $user_id;
        $tm_datarequisition->datarequisition_ai_requisition_id = $requisition_id;
        $tm_datarequisition->datarequisition_ai_product_id = $product_id;
        $tm_datarequisition->tx_datarequisition_description = $description;
        $tm_datarequisition->tx_datarequisition_quantity = $quantity;
        $tm_datarequisition->datarequisition_ai_measurement_id = $measure_id;
        $tm_datarequisition->tx_datarequisition_price = $price;
        $tm_datarequisition->tx_datarequisition_discountrate = $discountrate;
        $tm_datarequisition->tx_datarequisition_taxrate = $taxrate;
        $tm_datarequisition->tx_datarequisition_total = $total;
        $tm_datarequisition->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $qry = tm_requisition::join('tm_providers','tm_providers.ai_provider_id','tm_requisitions.requisition_ai_provider_id')->where('tx_requisition_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La orden de compra no existe.']);
        }
        // $rs_datarequisition = tm_requisition::join('tm_datarequisitions','tm_datarequisitions.datarequisition_ai_requisition_id','tm_requisitions.ai_requisition_id')->where('tx_requisition_slug',$slug)->get();
        $data = $this->showit($slug);
        return response()->json(['status'=>'success','message'=>'', 'data'=>$data]);
    }
    public function showit($slug)
    {
        $qry = tm_requisition::join('tm_providers','tm_providers.ai_provider_id','tm_requisitions.requisition_ai_provider_id')->where('tx_requisition_slug',$slug);
        $rs_datarequisition = tm_requisition::join('tm_datarequisitions','tm_datarequisitions.datarequisition_ai_requisition_id','tm_requisitions.ai_requisition_id')->join('tm_measures','tm_measures.ai_measure_id','tm_datarequisitions.datarequisition_ai_measurement_id')->where('tx_requisition_slug',$slug)->get();

        return ['requisition'=>$qry->first(), 'datarequisition'=>$rs_datarequisition];
    }
    public function get_requisitionByRequisition($slug){
        $qry = tm_requisition::where('tx_requisition_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La orden de compra no existe.']);
        }
        $rs = $qry->first();

        $rs_requisition = tm_requisition::join('tm_providers','tm_providers.ai_provider_id','tm_requisitions.requisition_ai_provider_id')->where('requisition_ai_provider_id',$rs['requisition_ai_provider_id'])->get();
        return response()->json(['status'=>'success','message'=>'', 'data'=>['list'=>$rs_requisition]]);
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
    public function upd_provider(Request $request, $requisition_slug)
    {
        $qry = tm_requisition::where('tx_requisition_slug',$requisition_slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La orden de compra no existe.']);            
        }
        $qry_provider = tm_provider::where('tx_provider_slug',$request->input('a'));
        if ($qry_provider->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe.']);            
        }
        $rs_provider = $qry_provider->first();
        $qry->update(['requisition_ai_provider_id' => $rs_provider['ai_provider_id']]);

        // ANSWER
        $rs_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Proveedor cambiado a '.$rs_provider['tx_provider_value'],'data' => ['notprocesed'=>$rs_all['notprocesed'], 'procesed'=>$rs_all['procesed']]]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        $qry = tm_requisition::where('tx_requisition_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La orden de compra no existe.']);            
        }
        $rs = $qry->first();
        $qry->delete();

        $qry_datarequisition = tm_datarequisition::where('datarequisition_ai_requisition_id',$rs['ai_requisition_id']);
        $qry_datarequisition->delete();

        // ANSWER
        $rs_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Orden de compra eliminada.','data' => ['notprocesed'=>$rs_all['notprocesed'], 'procesed'=>$rs_all['procesed']]]);

    }
}
