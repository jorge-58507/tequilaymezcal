<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\tm_productoutput;
use App\tm_dataproductoutput;

class productoutputController extends Controller
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
        $rs = tm_productoutput::orderby('created_at','DESC')->get();
        $rs_productoutput = tm_productoutput::join('tm_dataproductoutputs','tm_dataproductoutputs.dataproductoutput_ai_productoutput_id','tm_productoutputs.ai_productoutput_id')->orderby('tm_productoutputs.created_at','DESC')->get();
        return ['all'=>$rs, 'data_productoutput'=>$rs_productoutput];
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
        $raw_product = $request->input('a');
        $raw_total = $request->input('b');
        $reason = $request->input('c');

        $user = $request->user();
        $tm_productoutput = new tm_productoutput;
        $tm_productoutput->productoutput_ai_user_id = $user['id'];
        $tm_productoutput->tx_productoutput_reason = $reason;
        $tm_productoutput->tx_productoutput_total = $raw_total['total'];
        $tm_productoutput->save();
        $productoutput_id = $tm_productoutput->ai_productoutput_id;

        foreach ($raw_product as $product) {
            $this->save_data($productoutput_id, $product['id'], $product['quantity'], $product['measure_id']);
        }

        // ANSWER
        $rs_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Registro guardado.','data' => ['all'=>$rs_all['all'], 'data_productoutput'=>$rs_all['data_productoutput']]]);
    }
    public function save_data($productoutput_id, $product_id, $quantity, $measure_id)
    {
        $tm_dataproductoutput = new tm_dataproductoutput;
        $tm_dataproductoutput->dataproductoutput_ai_productoutput_id = $productoutput_id;
        $tm_dataproductoutput->dataproductoutput_ai_product_id = $product_id;
        $tm_dataproductoutput->tx_dataproductoutput_quantity = $quantity;
        $tm_dataproductoutput->dataproductoutput_ai_measure_id = $measure_id;
        $tm_dataproductoutput->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $qry = tm_productoutput::where('ai_productoutput_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Registro no existe.']);
        }
        $rs = $this->showit($id);
        return response()->json(['status'=>'success','message'=>'','data'=>['info'=>$rs['info'], 'dataproductoutput'=>$rs['dataproductoutput']]]);

    }
    public function showit($id)
    {
        $qry = tm_productoutput::where('ai_productoutput_id',$id);
        $rs_dataproductoutput = tm_dataproductoutput::select('tm_products.tx_product_value','tm_dataproductoutputs.tx_dataproductoutput_quantity', 'tm_measures.tx_measure_value')->join('tm_products','tm_products.ai_product_id','tm_dataproductoutputs.dataproductoutput_ai_product_id')->join('tm_measures', 'tm_measures.ai_measure_id', 'tm_dataproductoutputs.dataproductoutput_ai_measure_id')->where('dataproductoutput_ai_productoutput_id',$id)->get();

        return ['info'=>$qry->first(), 'dataproductoutput'=>$rs_dataproductoutput];
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
        $qry = tm_productoutput::where('ai_productoutput_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Registro no existe.']);
        }
        $qry->delete();

        // ANSWER
        $rs_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Eliminado correctamente.','data' => ['all'=>$rs_all['all'], 'data_productoutput'=>$rs_all['data_productoutput']]]);

    }
}
