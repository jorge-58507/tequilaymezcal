<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productwarehouse;
use App\tm_product;
use App\tm_productcount;

class productwarehouseController extends Controller
{
    public function add_product(Request $request)
    {
        $user = $request->user();
        $qry_product = tm_product::where('ai_product_id', $request->input('c'));
        if ($qry_product->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Producto no existe.'],400);
        }
        $rs_product = $qry_product->first();

        $qry = tm_productwarehouse::where('productwarehouse_ai_product_id',$request->input('c'))->where('productwarehouse_ai_warehouse_id',$request->input('b'));
        if ($qry->count() === 0) {
            $tm_productwarehouse = new tm_productwarehouse;
            $tm_productwarehouse->productwarehouse_ai_user_id       = $user->id;
            $tm_productwarehouse->productwarehouse_ai_product_id    = $request->input('c');
            $tm_productwarehouse->productwarehouse_ai_warehouse_id  = $request->input('b');
            $tm_productwarehouse->tx_productwarehouse_description   = $rs_product['tx_product_value'];
            $tm_productwarehouse->tx_productwarehouse_quantity      = $request->input('a');
            $tm_productwarehouse->tx_productwarehouse_minimun       = $request->input('d');
            $tm_productwarehouse->tx_productwarehouse_maximun       = $request->input('e');
            $tm_productwarehouse->save();

            //ANSWER
            $rs_productwarehouse = tm_productwarehouse::select('tm_productwarehouses.ai_productwarehouse_id','tm_productwarehouses.tx_productwarehouse_description','tm_productwarehouses.tx_productwarehouse_quantity','tm_productwarehouses.tx_productwarehouse_minimun','tm_productwarehouses.tx_productwarehouse_maximun','tm_products.tx_product_code','tm_warehouses.tx_warehouse_value')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_productwarehouses.productwarehouse_ai_warehouse_id')->join('tm_products','tm_products.ai_product_id', 'tm_productwarehouses.productwarehouse_ai_product_id')->orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->get();
            return response()->json(['status'=>'success','message'=>'Agregado correctamente.', 'data' => ['all' => $rs_productwarehouse]]);
        }else{
            $rs = $qry->first();
            $quantity = $rs['tx_productwarehouse_quantity'] + $request->input('a');
            $qry->update(['tx_productwarehouse_quantity' => $quantity, 'tx_productwarehouse_minimun' => $request->input('d'), 'tx_productwarehouse_maximun' => $request->input('e')]);

            //ANSWER
            $rs_productwarehouse = tm_productwarehouse::select('tm_productwarehouses.ai_productwarehouse_id','tm_productwarehouses.tx_productwarehouse_description','tm_productwarehouses.tx_productwarehouse_quantity','tm_productwarehouses.tx_productwarehouse_minimun','tm_productwarehouses.tx_productwarehouse_maximun','tm_products.tx_product_code','tm_warehouses.tx_warehouse_value')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_productwarehouses.productwarehouse_ai_warehouse_id')->join('tm_products','tm_products.ai_product_id', 'tm_productwarehouses.productwarehouse_ai_product_id')->orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->get();
            return response()->json(['status'=>'success','message'=>'El producto ya existe, se actualizó la cantidad.', 'data' => ['all' => $rs_productwarehouse]]);
        }
        

    }

    public function show($id){
        $qry = tm_productwarehouse::select('tm_productwarehouses.ai_productwarehouse_id','tm_productwarehouses.tx_productwarehouse_description','tm_productwarehouses.tx_productwarehouse_quantity','tm_productwarehouses.tx_productwarehouse_minimun','tm_productwarehouses.tx_productwarehouse_maximun','tm_products.tx_product_code','tm_warehouses.tx_warehouse_value')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_productwarehouses.productwarehouse_ai_warehouse_id')->join('tm_products','tm_products.ai_product_id', 'tm_productwarehouses.productwarehouse_ai_product_id')->orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->where('tm_productwarehouses.ai_productwarehouse_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Producto no existe.'],400);
        }

        return response()->json(['status'=>'success','message'=>'El producto ya existe, se actualizó la cantidad.', 'data' => ['info' => $qry->first()]]);
    }

    public function show_quantity($id){
        $rs = tm_productcount::where('productcount_ai_product_id',$id)->limit(10)->get();
        return response()->json(['status'=>'success','message'=>'','data'=>['count_list'=>$rs]]);
    }

    public function update(Request $request){
        $qry = tm_productwarehouse::where('ai_productwarehouse_id',$request->input('a'));
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Producto no existe.'],400);
        }
        if (empty($request->input('a')) || empty($request->input('c')) || empty($request->input('d'))) {
            return response()->json(['status'=>'failed','message'=>'Falta información.'],400);
        }
        $qry->update(['tx_productwarehouse_minimun' => $request->input('c'), 'tx_productwarehouse_maximun' => $request->input('d')]);

        $rs_productwarehouse = tm_productwarehouse::select('tm_productwarehouses.ai_productwarehouse_id','tm_productwarehouses.tx_productwarehouse_description','tm_productwarehouses.tx_productwarehouse_quantity','tm_productwarehouses.tx_productwarehouse_minimun','tm_productwarehouses.tx_productwarehouse_maximun','tm_products.tx_product_code','tm_warehouses.tx_warehouse_value')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_productwarehouses.productwarehouse_ai_warehouse_id')->join('tm_products','tm_products.ai_product_id', 'tm_productwarehouses.productwarehouse_ai_product_id')->orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->get();
        return response()->json(['status'=>'success','message'=>'Producto Actualizado.', 'data' => ['all' => $rs_productwarehouse]]);

    }

    public function update_quantity(Request $request, $id){
        $qry = tm_productwarehouse::where('ai_productwarehouse_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Producto no existe.'],400);
        }
        $rs_product = $qry->first();
        $qry->update(['tx_productwarehouse_quantity'=>$request->input('a')]);

        $model = new tm_productcount;
        $user = $request->user();
        $model->productcount_ai_user_id = $user['id'];
        $model->productcount_ai_product_id = $id;
        $model->tx_productcount_before = $rs_product['tx_productwarehouse_quantity'];
        $model->tx_productcount_after = $request->input('a');
        $model->save();

        $rs_product = tm_productwarehouse::where('ai_productwarehouse_id',$id)->first();
        return response()->json(['status'=>'success','message'=>'Conteo Actualizado.','data'=>['info'=>$rs_product]]);

    }

    public function delete($id){
        $qry = tm_productwarehouse::where('ai_productwarehouse_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Producto no existe.'],400);
        }
        $qry->delete();

        $rs_productwarehouse = tm_productwarehouse::select('tm_productwarehouses.ai_productwarehouse_id','tm_productwarehouses.tx_productwarehouse_description','tm_productwarehouses.tx_productwarehouse_quantity','tm_productwarehouses.tx_productwarehouse_minimun','tm_productwarehouses.tx_productwarehouse_maximun','tm_products.tx_product_code','tm_warehouses.tx_warehouse_value')->join('tm_warehouses','tm_warehouses.ai_warehouse_id','tm_productwarehouses.productwarehouse_ai_warehouse_id')->join('tm_products','tm_products.ai_product_id', 'tm_productwarehouses.productwarehouse_ai_product_id')->orderby('productwarehouse_ai_warehouse_id')->orderby('tx_productwarehouse_description')->get();
        return response()->json(['status'=>'success','message'=>'Producto eliminado.', 'data' => ['all' => $rs_productwarehouse]]);
    }

}