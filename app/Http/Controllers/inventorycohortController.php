<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\tm_inventory;
use App\tm_warehouse;

class inventorycohortController extends Controller
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
        $rs = tm_inventory::select('tm_inventories.ai_inventory_id','users.name','tm_inventories.created_at','tm_warehouses.tx_warehouse_value')->join('users','users.id','tm_inventories.inventory_ai_user_id')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_inventories.inventory_ai_warehouse_id')->orderby('tm_inventories.created_at','DESC')->get();

        return ['all' => $rs];
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
        $qry_warehouse = tm_warehouse::where('ai_warehouse_id',$request->input('b'));
        if ($qry_warehouse->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Bodega no existe.']);
        }

        $user = $request->user();
        $tm_inventorycohort = new tm_inventory;
        $tm_inventorycohort -> inventory_ai_user_id         = $user['id'];
        $tm_inventorycohort -> inventory_ai_warehouse_id    = $request->input('b');
        $tm_inventorycohort -> save();

        $inventorydataController = new inventorydataController;
        $raw_list = $request->input('a');
        foreach ($raw_list as $key => $product) {

            // SINO EXISTE EN PRODUCTWAREHOUSE AGREGAR
            $inventorydataController->save($tm_inventorycohort->ai_inventory_id,$product['productcode_id'],$product['product_id'],$product['measure_id'],$product['description'],$product['quantity']);
        }

        //ANSWER

        $rs = $this->getAll();
        return response()->json(['status'=>'success','message'=>'', 'data' => ['list' => $rs['all']]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $qry = tm_inventory::select('tm_inventories.ai_inventory_id','users.name','tm_inventories.created_at','tm_warehouses.tx_warehouse_value')->join('users','users.id','tm_inventories.inventory_ai_user_id')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_inventories.inventory_ai_warehouse_id')->orderby('tm_inventories.created_at','DESC')->where('ai_inventory_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Elemento no existe.']);
        }
        $rs = $qry->first();

        $inventorydataController = new inventorydataController;
        $rs_data = $inventorydataController->get_by_inventory($id);

        // $rs_data = tm_inventorydata::select('tm_inventorydatas.tx_inventorydata_description','tm_inventorydatas.tx_inventorydata_quantity','tm_measures.tx_measure_value')->join('tm_measures','tm_measures.ai_measure_id','tm_inventorydatas.inventorydata_ai_measure_id')->where('inventorydata_ai_inventory_id',$id)->get();

        return response()->json(['status'=>'success','message'=>'', 'data' => ['info' => $rs, 'productlist' => $rs_data]]);
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
