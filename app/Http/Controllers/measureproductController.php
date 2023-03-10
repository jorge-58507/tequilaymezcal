<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\rel_measure_product;
use App\tm_product;
use App\tm_measure;

class measureproductController extends Controller
{
    public function save(Request $request, $product_slug){
        $rs_product = tm_product::where('tx_product_slug',$product_slug)->first();
        $ans_add = $this->add($rs_product['ai_product_id'],$request->input('a'),$request->input('b'));

        //ANSWER
        $rs_measure = tm_product::select('tm_measures.tx_measure_value','rel_measure_products.tx_measure_product_relation','rel_measure_products.ai_measure_product_id')->join('rel_measure_products','rel_measure_products.measure_product_ai_product_id','=','tm_products.ai_product_id')
        ->join('tm_measures','rel_measure_products.measure_product_ai_measure_id','=','tm_measures.ai_measure_id')->where('tx_product_slug',$product_slug)->where('tx_measure_status',1)->get();

        return response()->json(['status'=>$ans_add['status'],'message'=>$ans_add['message'],'data'=>['measure_list'=>$rs_measure]]);
    }
    public function add($product_id,$measure_id,$relation){
        $check_duplicate = rel_measure_product::where('measure_product_ai_product_id',$product_id)->where('measure_product_ai_measure_id',$measure_id)->count();
        if ($check_duplicate > 0) {
            return ['status'=>'failed','message'=>'Esta medida ya existe'];
        }

        $rel = new rel_measure_product;
        $rel->measure_product_ai_product_id = $product_id;
        $rel->measure_product_ai_measure_id = $measure_id;
        $rel->tx_measure_product_relation = $relation;
        $rel->save();
        return ['status'=>'success','message'=>'Guardado Correctamente','model'=>$rel];
    }
    public function delete($rel_id){
        $qry = rel_measure_product::where('ai_measure_product_id',$rel_id);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'No existe']);
        }
        $rs = $qry->first();
        if ($rs['tx_measure_product_relation'] === 1.00) {
            $check_relation = rel_measure_product::where('measure_product_ai_product_id',$rs['measure_product_ai_product_id'])->where('tx_measure_product_relation',1.00)->count();
            if ($check_relation === 1) {
                return response()->json(['status'=>'failed','message'=>'No se pùede eliminar.']);
            }
        }
        $rs->delete();

                //ANSWER
        $rs_measure = tm_product::select('tm_measures.tx_measure_value','rel_measure_products.tx_measure_product_relation','rel_measure_products.ai_measure_product_id')->join('rel_measure_products','rel_measure_products.measure_product_ai_product_id','=','tm_products.ai_product_id')
        ->join('tm_measures','rel_measure_products.measure_product_ai_measure_id','=','tm_measures.ai_measure_id')->where('ai_product_id',$rs['measure_product_ai_product_id'])->where('tx_measure_status',1)->get();
        return response()->json(['status'=>'success','message'=>'Eliminado.','data'=>['measure_list'=>$rs_measure]]);
    }
}
