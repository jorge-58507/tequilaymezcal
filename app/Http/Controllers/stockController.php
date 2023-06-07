<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\tm_provider;
use App\tm_requisition;
use App\tm_productoutput;
use App\tm_productinput;
use App\tm_paymentmethod;
use App\tm_product;
use App\tm_productcategory;

class stockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

        $data = $this->all();
        return view('stock.index', compact('data'));
    }
    public function all()
    {
        $providerController = new providercontroller;
        $rs_provider = $providerController->getAll();
        $requisitionController = new requisitionController;
        $rs_requisition = $requisitionController->getAll();
        $productoutputController = new productoutputController;
        $rs_productoutput = $productoutputController->getAll();
        $paymentproviderController = new paymentproviderController;        
        $rs_paymentprovider = $paymentproviderController->getAll();

        $rs_productinput = tm_productinput::join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->wherein('tx_productinput_status',[1,2])->get();
        $rs_paymentmethod = tm_paymentmethod::where('tx_paymentmethod_status',1)->get();
        $rs_product = tm_product::join('tm_productcategories','tm_productcategories.ai_productcategory_id','tm_products.product_ai_productcategory_id')->where('tx_product_status',1)->get();
        $rs_productcategory = tm_productcategory::where('tx_productcategory_status',1)->get();
        return [
            'provider_list' => $rs_provider['all'],
            'processed_requisition' => $rs_requisition['all'],
            'productlist' => $rs_product,
            'productoutput_list' => $rs_productoutput['all'],
            'paymentmethod'     => $rs_paymentmethod,
            'productcategory' => $rs_productcategory,
            'processed_productinput' => $rs_productinput,
            'paymentprovider_list' => $rs_paymentprovider['all']
        ];
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
        //
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
