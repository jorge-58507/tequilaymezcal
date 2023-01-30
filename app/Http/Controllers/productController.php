<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_product;

class productController extends Controller
{
    public function getAll(){
        $rs = tm_product::all();
        return $rs;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs_product = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_product]]);
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
//         product_ai_user_id
// product_ai_productcategory_id
// tx_product_value
// tx_product_reference
// tx_product_code
// tx_product_taxrate
// tx_product_minimun
// tx_product_maximun
// tx_product_discountrate
// tx_product_alarm
// tx_product_status
// tx_product_descontable
// tx_product_slug

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
