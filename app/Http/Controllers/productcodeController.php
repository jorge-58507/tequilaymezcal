<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productcode;
use App\tm_requisition;
use App\tm_provider;
use App\tm_product;
use App\tm_measure;

class productcodeController extends Controller
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

        $qry_product = tm_product::where('ai_product_id',$request->input('a'));
        if ($qry_product->count() === 0) {
            return response()->json(['status'=>'success','message'=>'El producto no existe']);
        }
        $qry_measure = tm_measure::where('ai_measure_id',$request->input('b'));
        if ($qry_measure->count() === 0) {
            return response()->json(['status'=>'success','message'=>'La medida no existe']);
        }

        $user = $request->user();

        $model_productcode = new tm_productcode;
        $model_productcode->productcode_ai_user_id      = $user['id'];
        $model_productcode->productcode_ai_product_id   = $request->input('a');
        $model_productcode->productcode_ai_measure_id   = $request->input('b');
        $model_productcode->tx_productcode_value        = $request->input('c');
        $model_productcode->tx_productcode_quantity     = $request->input('d');
        $model_productcode->save();
        // $productcode = 

        // $productoutput_id = $tm_productoutput->ai_productoutput_id;

        $rs_product = $qry_product->first();
        $rs_measure = $qry_measure->first();

        $data = [
            'code' => $request->input('c'),
            'product_id' => $request->input('a'),
            'description' => $rs_product['tx_product_value'],
            'measure_id' =>  $request->input('b'),
            'measure_value' => $rs_measure['tx_measure_value'],
            'quantity' => $request->input('d'),
            'productcode_id' => $model_productcode->ai_productcode_id
        ];
        return response()->json(['status'=>'success','message'=>'', 'data' => ['productcode' => $data]]);
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




    public function show_code($str,$provider_slug)
    {
        $qry_productcode = tm_productcode::join('tm_products','tm_products.ai_product_id','tm_productcodes.productcode_ai_product_id')
        ->join('tm_measures','tm_measures.ai_measure_id','tm_productcodes.productcode_ai_measure_id')
        ->where('tx_productcode_value',$str);
        if ($qry_productcode->count() > 0) {

            $rs_productcode = $qry_productcode->first();
            $rs_product = tm_product::where('ai_product_id',$rs_productcode['productcode_ai_product_id'])->first();
            $rs_measure = tm_measure::where('ai_measure_id',$rs_productcode['productcode_ai_measure_id'])->first();

            $data = [
                'code' => $rs_productcode['tx_productcode_value'],
                'product_id' => $rs_productcode['productcode_ai_product_id'],
                'description' => $rs_product['tx_product_value'],
                'measure_id' =>  $rs_productcode['productcode_ai_measure_id'],
                'measure_value' => $rs_measure['tx_measure_value'],
                'quantity' => $rs_productcode['tx_productcode_quantity'],
                'productcode_id' => $rs_productcode['ai_productcode_id']
            ];
            return response()->json(['status'=>'success','message'=>'', 'data' => ['productcode' => $data]]);

        }else{
            $rs_provider = tm_provider::where('tx_provider_slug',$provider_slug)->first();
            $rs_requisition = tm_requisition::select('tm_requisitions.tx_requisition_number','tm_measures.tx_measure_value','tm_datarequisitions.ai_datarequisition_id','tm_datarequisitions.datarequisition_ai_requisition_id','tm_datarequisitions.datarequisition_ai_product_id','tm_datarequisitions.tx_datarequisition_description','tm_datarequisitions.tx_datarequisition_quantity','tm_datarequisitions.tx_datarequisition_price','tm_datarequisitions.tx_datarequisition_discountrate','tm_datarequisitions.tx_datarequisition_taxrate','tm_datarequisitions.tx_datarequisition_total')
            ->join('tm_datarequisitions','tm_datarequisitions.datarequisition_ai_requisition_id','tm_requisitions.ai_requisition_id')
            ->join('tm_measures','tm_measures.ai_measure_id','tm_datarequisitions.datarequisition_ai_measurement_id')
            ->where('requisition_ai_provider_id',$rs_provider['ai_provider_id'])
            ->where('tx_requisition_status',0)->get();
            return response()->json(['status'=>'failed','message'=>'No existe el código.','data' => ['requisition' => $rs_requisition]]);
        }

    }

}
