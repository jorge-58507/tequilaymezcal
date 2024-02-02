<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_warehouse;
use App\tm_productwarehouse;

class warehouseController extends Controller
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
        $rs_warehouse_active = tm_warehouse::where('tx_warehouse_status',1)->get();
        $rs_warehouse = tm_warehouse::all();

        $rs_productwarehouse = tm_productwarehouse::orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->get();

        return ['active' => $rs_warehouse_active, 'all' => $rs_warehouse, 'productwarehouse' => $rs_productwarehouse];
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
        if (empty($request->input('a')) || empty($request->input('b')) || empty($request->input('c'))) {
            return response()->json(['status'=>'denied','message'=>'Todos los campos son requeridos.']);
        }
        $check_value = tm_warehouse::where('tx_warehouse_value',$request->input('a'))->count();
        if ($check_value > 0) {
            return response()->json(['status'=>'denied','message'=>'Ya existe una bodega con ese nombre.']);
        }
        $check_number = tm_warehouse::where('tx_warehouse_number',$request->input('b'))->count();
        if ($check_value > 0) {
            return response()->json(['status'=>'denied','message'=>'Ya existe una bodega con ese código.']);
        }

        $model = new tm_warehouse;
        $model->tx_warehouse_value      = $request->input('a');
        $model->tx_warehouse_number       = $request->input('b');
        $model->tx_warehouse_location   = $request->input('c');
        $model->save();

        //  ANSWER
        $rs_warehouse = $this->getAll();

        return response()->json(['status'=>'success','data'=>['all'=>$rs_warehouse['all']]]);
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
}
