<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_directpurchase;
use App\tm_datadirectpurchase;
use App\tm_provider;
use App\tm_productcode;
use App\rel_measure_product;
use App\tm_product;
use App\tm_productwarehouse;

class directpurchaseController extends Controller
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
        $qry_provider = tm_provider::where('tx_provider_slug',$request->input('b'));
        if ($qry_provider->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'El proveedor ingresado no existe.']);
        }
        $rs_provider = $qry_provider->first();
        $user = $request->user();
        $model_directpurchase = new tm_directpurchase;
        $model_directpurchase->directpurchase_ai_user_id = $user['id'];
        $model_directpurchase->directpurchase_ai_provider_id = $rs_provider['ai_provider_id'];
        $model_directpurchase->tx_directpurchase_status = 0; //0: RECIEN INGRESADA, 1: INCOMPLETA, 2: COMPLETADA
        $model_directpurchase->tx_directpurchase_slug = time().$request->input('b');
        $model_directpurchase->save();

        // GUARDAR DATA
        $raw_list = $request->input('a');
        foreach ($raw_list as $key => $product) {
            $rs_productcode = tm_productcode::where('tx_productcode_value',$product['code'])->first();
            $model_datadirectpurchase = new tm_datadirectpurchase;
            $model_datadirectpurchase->datadirectpurchase_ai_user_id = $user['id'];
            $model_datadirectpurchase->datadirectpurchase_ai_directpurchase_id = $model_directpurchase->ai_directpurchase_id;
            $model_datadirectpurchase->datadirectpurchase_ai_productcode_id = $rs_productcode['ai_productcode_id'];
            $model_datadirectpurchase->datadirectpurchase_ai_product_id = $product['product_id'];
            $model_datadirectpurchase->datadirectpurchase_ai_measure_id =  $product['measure_id'];
            $model_datadirectpurchase->tx_datadirectpurchase_description = $product['description'];
            $model_datadirectpurchase->tx_datadirectpurchase_quantity =  $product['quantity'];
            $model_datadirectpurchase->save();
            
            // SUMAR LAS CANTIDADES
            $rs_measure_product = rel_measure_product::select('tx_measure_product_relation')->where('measure_product_ai_product_id',$product['product_id'])->where('measure_product_ai_measure_id',$product['measure_id'])->first();
            $ttl_quantity = $rs_measure_product['tx_measure_product_relation'] * $product['quantity'];
            $qry_product = tm_product::where('ai_product_id',$product['product_id']);
            $rs_product = $qry_product->first();
            if ($rs_product['tx_product_discountable'] === 1) {
                $qry_productwarehouse = tm_productwarehouse::where('productwarehouse_ai_product_id',$product['product_id'])->where('productwarehouse_ai_warehouse_id',1);
                $rs_productwarehouse = $qry_productwarehouse->first();

                $ttl_quantity += $rs_productwarehouse['tx_productwarehouse_quantity'];
                $qry_productwarehouse->update(['tx_productwarehouse_quantity' => $ttl_quantity]);
            }
        }

        $rs_directpurchase = tm_directpurchase::select('tm_providers.tx_provider_value','tm_directpurchases.created_at','tm_directpurchases.tx_directpurchase_status','tm_directpurchases.tx_directpurchase_slug')->join('tm_providers','tm_providers.ai_provider_id','tm_directpurchases.directpurchase_ai_provider_id')->orderby('tx_directpurchase_status','DESC')->get();
        return response()->json(['status'=>'success','message'=>'Compra ingresada.', 'data' => [ 'list' => $rs_directpurchase ]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $qry = tm_directpurchase::select('tm_directpurchases.ai_directpurchase_id','tm_directpurchases.tx_directpurchase_status','tm_directpurchases.tx_directpurchase_slug','tm_directpurchases.created_at','tm_providers.tx_provider_value')->join('tm_providers','tm_providers.ai_provider_id','tm_directpurchases.directpurchase_ai_provider_id')->where('tx_directpurchase_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $rs = $qry->first();

        $qry_data = tm_datadirectpurchase::select('tm_datadirectpurchases.tx_datadirectpurchase_quantity','tm_datadirectpurchases.tx_datadirectpurchase_description','tm_measures.tx_measure_value','tm_productcodes.tx_productcode_value')
        ->join('tm_measures','tm_measures.ai_measure_id','tm_datadirectpurchases.datadirectpurchase_ai_measure_id')
        ->join('tm_productcodes','tm_productcodes.ai_productcode_id','tm_datadirectpurchases.datadirectpurchase_ai_productcode_id')
        ->where('tm_datadirectpurchases.datadirectpurchase_ai_directpurchase_id',$rs['ai_directpurchase_id']);

        return response()->json(['status'=>'success','message'=>'','data' => ['info' => $rs, 'list' => $qry_data->get()]]);
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
    public function destroy($slug)
    {
        $qry_status = tm_directpurchase::select('tx_directpurchase_status','ai_directpurchase_id')->where('tx_directpurchase_slug',$slug);
        if ($qry_status->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $rs = $qry_status->first();
        if ($rs['tx_directpurchase_status'] > 0) {
            return response()->json(['status'=>'failed','message'=>'No se pudo eliminar.']);
        }

        $rs_data = tm_datadirectpurchase::where('datadirectpurchase_ai_directpurchase_id',$rs['ai_directpurchase_id'])->get();
        foreach ($rs_data as $key => $product) {
            // RESTAR LAS CANTIDADES
            $rs_measure_product = rel_measure_product::select('tx_measure_product_relation')->where('measure_product_ai_product_id',$product['datadirectpurchase_ai_product_id'])->where('measure_product_ai_measure_id',$product['datadirectpurchase_ai_measure_id'])->first();
            $ttl_quantity = $rs_measure_product['tx_measure_product_relation'] * $product['tx_datadirectpurchase_quantity'];
            $qry_product = tm_product::where('ai_product_id',$product['datadirectpurchase_ai_product_id']);
            $rs_product = $qry_product->first();
            if ($rs_product['tx_product_discountable'] === 1) {
                $q = $rs_product['tx_product_quantity'] - $ttl_quantity;
                $qry_product->update(['tx_product_quantity' => $q]);
            }
        }
        $qry_status->delete();

        $rs_directpurchase = tm_directpurchase::select('tm_providers.tx_provider_value','tm_directpurchases.created_at','tm_directpurchases.tx_directpurchase_status','tm_directpurchases.tx_directpurchase_slug')->join('tm_providers','tm_providers.ai_provider_id','tm_directpurchases.directpurchase_ai_provider_id')->orderby('tx_directpurchase_status','DESC')->get();
        return response()->json(['status'=>'success','message'=>'Eliminado correctamente.', 'data' => [ 'list' => $rs_directpurchase ]]);
    }
}
