<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_inventorydata;

class inventorydataController extends Controller
{
    public function save($inventory_id, $productcode_id,$product_id,$measure_id, $product_description, $quantity){
        $tm_inventorydata = new tm_inventorydata;
        $tm_inventorydata->inventorydata_ai_inventory_id       =   $inventory_id;
        $tm_inventorydata->inventorydata_ai_productcode_id     =   $productcode_id;
        $tm_inventorydata->inventorydata_ai_product_id         =   $product_id;
        $tm_inventorydata->inventorydata_ai_measure_id         =   $measure_id;
        $tm_inventorydata->tx_inventorydata_description        =   $product_description;
        $tm_inventorydata->tx_inventorydata_quantity           =   $quantity;
        $tm_inventorydata->save();
    }

    public function get_by_inventory($inventory_id){
        $rs_data = tm_inventorydata::select('tm_inventorydatas.tx_inventorydata_description','tm_inventorydatas.tx_inventorydata_quantity','tm_measures.tx_measure_value')->join('tm_measures','tm_measures.ai_measure_id','tm_inventorydatas.inventorydata_ai_measure_id')->where('inventorydata_ai_inventory_id',$inventory_id)->get();
        return $rs_data;
    }
}
