<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\tm_provider;
use App\tm_productinput;
use App\tm_product;
use App\tm_requisition;
use App\tm_dataproductinput;
use App\tm_productcategory;
use App\rel_requisition_productinput;
use App\tm_measure;
use App\tm_datarequisition;
use App\rel_measure_product;
use App\tm_paymentprovider;

class productinputController extends Controller
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

        $providerController = new providerController;
        $rs_provider = $providerController->getAll();
        
        $requisitionController = new requisitionController;
        $rs_requisition = $requisitionController->getAll();

        $rs_productinput = $this->getAll();
        $rs_product = tm_product::join('tm_productcategories','tm_productcategories.ai_productcategory_id','tm_products.product_ai_productcategory_id')->where('tx_product_status',1)->get();
        $rs_productcategory = tm_productcategory::where('tx_productcategory_status',1)->get();
        $chk_low_inventory = tm_product::where('tx_product_status',1)->where('tx_product_quantity','<','tx_product_minimum')->where('tx_product_alarm',1)->count();
        $data = [
            'providerlist' => $rs_provider['active'],
            'notprocesed' => $rs_productinput['notprocesed'],
            'procesed' => $rs_productinput['procesed'],
            'productlist' => $rs_product,
            'requisition_procesed' => $rs_requisition['procesed'],
            'requisition_notprocesed' => $rs_requisition['notprocesed'],
            'productcategory' => $rs_productcategory,
            'low_inventory' => $chk_low_inventory
        ];
        return view('purchase.index', compact('data'));
    }
    public function getAll()
    {
        $rs_notprocesed = tm_productinput::select('tm_productinputs.ai_productinput_id',
        'tm_productinputs.tx_productinput_number', 'tm_productinputs.tx_productinput_nontaxable', 'tm_productinputs.tx_productinput_taxable','tm_productinputs.tx_productinput_discount',
        'tm_productinputs.tx_productinput_tax', 'tm_productinputs.tx_productinput_total', 'tm_productinputs.tx_productinput_due', 'tm_productinputs.tx_productinput_due', 'tm_productinputs.tx_productinput_status',
        'tm_productinputs.tx_productinput_slug', 'tm_productinputs.created_at', 'tm_providers.tx_provider_value')->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->where('tx_productinput_status',0)->get();
        $rs_procesed    = tm_productinput::select('tm_productinputs.ai_productinput_id',
        'tm_productinputs.tx_productinput_number', 'tm_productinputs.tx_productinput_nontaxable', 'tm_productinputs.tx_productinput_taxable','tm_productinputs.tx_productinput_discount',
        'tm_productinputs.tx_productinput_tax', 'tm_productinputs.tx_productinput_total', 'tm_productinputs.tx_productinput_due', 'tm_productinputs.tx_productinput_due', 'tm_productinputs.tx_productinput_status',
        'tm_productinputs.tx_productinput_slug', 'tm_productinputs.created_at', 'tm_providers.tx_provider_value')->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->where('tx_productinput_status',1)->get();

        return ['notprocesed'=>$rs_notprocesed, 'procesed'=>$rs_procesed];
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
        $requisition_selected = $request->input('a');

        $rs_datarequisition = tm_datarequisition::wherein('datarequisition_ai_requisition_id',$requisition_selected)->get();
        $qry_requisition = tm_requisition::wherein('ai_requisition_id',$requisition_selected);

        if ($qry_requisition->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'La orden de compra no existe.']);
        }
        $qry_requisition->update(['tx_requisition_status'=>1]);
        $rs_requisition = $qry_requisition->get();

        $nontaxable = 0;
        $taxable = 0;
        $discount = 0;
        $tax = 0;
        $total = 0;
        foreach ($rs_requisition as $requisition) {
            $provider_id = $requisition['requisition_ai_provider_id'];
            $nontaxable += $requisition['tx_requisition_nontaxable'];
            $taxable    += $requisition['tx_requisition_taxable'];
            $discount   += $requisition['tx_requisition_discount'];
            $tax        += $requisition['tx_requisition_tax'];
            $total      += $requisition['tx_requisition_total'];
        }

        $user = $request->user();
        $count = tm_productinput::count();
        $number = substr('0000000000'.$count+55,-10);

        $tm_productinput = new tm_productinput;
        $tm_productinput->productinput_ai_user_id    = $user['id'];
        $tm_productinput->productinput_ai_provider_id = $provider_id;
        $tm_productinput->tx_productinput_number     = $number;
        $tm_productinput->tx_productinput_nontaxable = $nontaxable;
        $tm_productinput->tx_productinput_taxable    = $taxable;
        $tm_productinput->tx_productinput_discount   = $discount;
        $tm_productinput->tx_productinput_tax        = $tax;
        $tm_productinput->tx_productinput_total      = $total;
        $tm_productinput->tx_productinput_due        = $total;
        $tm_productinput->tx_productinput_date       = date('Y-m-d');
        $productinput_slug = time().str_replace(' ','',$number);
        $tm_productinput->tx_productinput_slug       = $productinput_slug;
        $tm_productinput->save();
        $productinput_id = $tm_productinput->ai_productinput_id;

        foreach ($rs_datarequisition as $product) {
            $this->save_data($user['id'], $productinput_id, $product['datarequisition_ai_product_id'], $product['tx_datarequisition_description'], $product['tx_datarequisition_quantity'], $product['datarequisition_ai_measurement_id'], $product['tx_datarequisition_price'], $product['tx_datarequisition_discountrate'], $product['tx_datarequisition_taxrate'], $product['tx_datarequisition_total'],null);
        }

        foreach ($rs_requisition as $requisition) {
            $rel_requisition_productinput = new rel_requisition_productinput;
            $rel_requisition_productinput->requisition_productinput_ai_requisition_id   = $requisition['ai_requisition_id'];
            $rel_requisition_productinput->requisition_productinput_ai_productinput_id  = $productinput_id;
            $rel_requisition_productinput->save();
        }


        // ANSWER
        $requisitionController = new requisitionController;
        $requisition_all = $requisitionController->getAll();
        $productinput_all = $this->getAll();
        $rs_productinput = $this->showit($productinput_slug);
        return response()->json(['status'=>'success','message'=>'La orden de compra se ingresó.', 
        'data'=>
        ['requisition'=>[
            'notprocesed'=>$requisition_all['notprocesed'], 
            'procesed'=> $requisition_all['procesed']
        ],'productinput'=>[
            'notprocesed'=> $productinput_all['notprocesed'],
            'opened'=>['info' => $rs_productinput['info'], 'dataproductinput'=>$rs_productinput['dataproductinput'] ]
        ] ]]);
    }

    public function save_data($user_id, $productinput_id, $product_id, $description, $quantity, $measure_id, $price, $discountrate, $taxrate, $total, $duedate)
    {
        $tm_dataproductinput = new tm_dataproductinput;
        $tm_dataproductinput->dataproductinput_ai_user_id = $user_id;
        $tm_dataproductinput->dataproductinput_ai_productinput_id = $productinput_id;
        $tm_dataproductinput->dataproductinput_ai_product_id = $product_id;
        $tm_dataproductinput->tx_dataproductinput_description = $description;
        $tm_dataproductinput->tx_dataproductinput_quantity = $quantity;
        $tm_dataproductinput->dataproductinput_ai_measurement_id = $measure_id;
        $tm_dataproductinput->tx_dataproductinput_price = $price;
        $tm_dataproductinput->tx_dataproductinput_discountrate = $discountrate;
        $tm_dataproductinput->tx_dataproductinput_taxrate = $taxrate;
        $tm_dataproductinput->tx_dataproductinput_total = $total;
        $tm_dataproductinput->tx_dataproductinput_duedate = $duedate;
        $tm_dataproductinput->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($productinput_slug)
    {
        $productinput_all = $this->getAll();
        $rs_productinput = $this->showit($productinput_slug);
        $rs_dataproductinput = tm_paymentprovider::select('tm_paymentproviders.ai_paymentprovider_id','tm_paymentproviders.paymentprovider_ai_user_id','tm_paymentproviders.tx_paymentprovider_number','tm_paymentproviders.tx_paymentprovider_total','tm_paymentproviders.created_at  as paymentprovider_date',
        'tm_productinputs.tx_productinput_number','tm_productinputs.tx_productinput_total','tm_productinputs.tx_productinput_due','tm_productinputs.tx_productinput_date','tm_productinputs.tx_productinput_slug','tm_productinputs.created_at as productinput_date', 'rel_paymentprovider_productinputs.tx_paymentprovider_productinput_payment',
        'tm_requisitions.tx_requisition_slug','tm_requisitions.tx_requisition_number','tm_requisitions.tx_requisition_total','tm_requisitions.created_at as requisition_date')
        ->join('rel_paymentprovider_productinputs','rel_paymentprovider_productinputs.paymentprovider_productinput_ai_paymentprovider_id','tm_paymentproviders.ai_paymentprovider_id')
        ->join('tm_productinputs','tm_productinputs.ai_productinput_id','rel_paymentprovider_productinputs.paymentprovider_productinput_ai_productinput_id')
        ->join('rel_requisition_productinputs','rel_requisition_productinputs.requisition_productinput_ai_productinput_id','tm_productinputs.ai_productinput_id')
        ->join('tm_requisitions','rel_requisition_productinputs.requisition_productinput_ai_requisition_id','tm_requisitions.ai_requisition_id')->where('tm_productinputs.tx_productinput_slug',$productinput_slug)->get();

        return response()->json(['status'=>'success','message'=>'', 
        'data'=>
            ['productinput'=>[
                    'notprocesed'=> $productinput_all['notprocesed'],
                    'opened'=>['info' => $rs_productinput['info'], 'dataproductinput'=>$rs_productinput['dataproductinput'], 'data_related' => $rs_dataproductinput ]
                ] 
            ]
        ]);
    }
    public function showit($slug)
    {
        $rs = tm_productinput::join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->where('tx_productinput_slug',$slug)->first();
        $rs_data = tm_dataproductinput::join('tm_measures','tm_measures.ai_measure_id','tm_dataproductinputs.dataproductinput_ai_measurement_id')->where('dataproductinput_ai_productinput_id',$rs['ai_productinput_id'])->get();

        return ['info'=>$rs, 'dataproductinput'=>$rs_data];
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
    public function update(Request $request, $slug)
    {
        $qry = tm_productinput::where('tx_productinput_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Compra no existe.']); 
        }

        $rs = $qry->first();

        $qry->update(['tx_productinput_status'=>1]);
        // VERIFICAR QUE NO FALTE ALGUN ITEM DE LA OC EN LA FACTURA SI ES EL CASO ACTUALIZAR A 0 EL STATUS DE LA OC
        // ESTO NO POR EL MOMENTO

        // SUMAR LAS CANTIDADES A LA EXISTENCIA DE LOS PRODUCTOS
        $rs_data = tm_dataproductinput::where('dataproductinput_ai_productinput_id',$rs['ai_productinput_id'])->get();
        foreach ($rs_data as $key => $data) {
            $qry_product = tm_product::where('ai_product_id',$data['dataproductinput_ai_product_id']);
            $rs_product = $qry_product->first();
            
            if ($rs_product['tx_product_discountable'] === 1) {
                $rs_relation = rel_measure_product::where('measure_product_ai_measure_id',$data['dataproductinput_ai_measurement_id'])->where('measure_product_ai_product_id',$data['dataproductinput_ai_product_id'])->first();
                $q = $rs_product['tx_product_quantity']+($data['tx_dataproductinput_quantity']*$rs_relation['tx_measure_product_relation']);
                $qry_product->update(['tx_product_quantity' => $q]);
            }
        }
        

        // ANSWER
        $requisitionController = new requisitionController;
        $requisition_all = $requisitionController->getAll();
        $productinput_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'La orden de compra se ingresó.', 
        'data'=>
        ['productinput'=>[
            'notprocesed'=> $productinput_all['notprocesed'],
            'procesed'=> $productinput_all['procesed']
        ] ]]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        $qry = tm_productinput::where('tx_productinput_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Compra no existe.']); 
        }
        $rs = $qry->first();

        // ACTUALIZAR LAS ORDENES
        $qry_requisition = tm_requisition::join('rel_requisition_productinputs','rel_requisition_productinputs.requisition_productinput_ai_requisition_id','tm_requisitions.ai_requisition_id')
        ->where('rel_requisition_productinputs.requisition_productinput_ai_productinput_id',$rs['ai_productinput_id'])
        ->update(['tx_requisition_status'=>0]);

        // borrar los dataproductinput
        tm_dataproductinput::where('dataproductinput_ai_productinput_id',$rs['ai_productinput_id'])->delete();

        // BORRAR EL PRODUCTINPUT
        $qry->delete();

        // ANSWER
        $requisitionController = new requisitionController;
        $requisition_all = $requisitionController->getAll();
        $productinput_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Factura anulada.', 
        'data'=>
        ['requisition'=>[
            'notprocesed'=>$requisition_all['notprocesed'], 
            'procesed'=> $requisition_all['procesed']
        ],'productinput'=>[
            'notprocesed'=> $productinput_all['notprocesed'],
            'procesed'=> $productinput_all['procesed']
        ] ]]);
    }

    public function return($slug)
    {
        $qry = tm_productinput::where('tx_productinput_slug',$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Compra no existe.']); 
        }
        $rs = $qry->first();

        // ACTUALIZAR LAS ORDENES
        // $qry_requisition = tm_requisition::join('rel_requisition_productinputs','rel_requisition_productinputs.requisition_productinput_ai_requisition_id','tm_requisitions.ai_requisition_id')
        // ->where('rel_requisition_productinputs.requisition_productinput_ai_productinput_id',$rs['ai_productinput_id'])
        // ->update(['tx_requisition_status'=>0]);
        $qry->update(['tx_productinput_status'=>0]);

        // RESTA LAS CANTIDADES A LOS PRODUCTOS
        $rs_data = tm_dataproductinput::where('dataproductinput_ai_productinput_id',$rs['ai_productinput_id'])->get();
        foreach ($rs_data as $key => $data) {
            $qry_product = tm_product::where('ai_product_id',$data['dataproductinput_ai_product_id']);
            $rs_product = $qry_product->first();
            
            if ($rs_product['tx_product_discountable'] === 1) {
                $rs_relation = rel_measure_product::where('measure_product_ai_measure_id',$data['dataproductinput_ai_measurement_id'])->where('measure_product_ai_product_id',$data['dataproductinput_ai_product_id'])->first();
                $q = $rs_product['tx_product_quantity']-($data['tx_dataproductinput_quantity']*$rs_relation['tx_measure_product_relation']);
                $qry_product->update(['tx_product_quantity' => $q]);
            }
        }

        // borrar los dataproductinput
        // tm_dataproductinput::where('dataproductinput_ai_productinput_id',$rs['ai_productinput_id'])->delete();

        // BORRAR EL PRODUCTINPUT
        // $qry->delete();

        // ANSWER
        $requisitionController = new requisitionController;
        $requisition_all = $requisitionController->getAll();
        $productinput_all = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Factura devuelta.', 
        'data'=>
        ['requisition'=>[
            'notprocesed'=>$requisition_all['notprocesed'], 
            'procesed'=> $requisition_all['procesed']
        ],'productinput'=>[
            'notprocesed'=> $productinput_all['notprocesed'],
            'procesed'=> $productinput_all['procesed']
        ] ]]);
    }

    public function show_data($dataproductinput_id)
    {
        $check = tm_dataproductinput::where('ai_dataproductinput_id',$dataproductinput_id);
        if ($check->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }

        $rs_data = tm_dataproductinput::join('tm_measures','tm_measures.ai_measure_id','tm_dataproductinputs.dataproductinput_ai_measurement_id')->where('ai_dataproductinput_id',$dataproductinput_id)->first();
        
        $rs_measure = tm_measure::join('rel_measure_products','tm_measures.ai_measure_id','rel_measure_products.measure_product_ai_measure_id')->where('rel_measure_products.measure_product_ai_product_id',$rs_data['dataproductinput_ai_product_id'])->get();

        return response()->json(['status'=>'success','message'=>'','data'=>['info'=>$rs_data, 'measure'=>$rs_measure]]);
    }

    public function update_data(Request $request, $dataproductinput_id)
    {
        $qry = tm_dataproductinput::where('ai_dataproductinput_id',$dataproductinput_id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $duedate = (strlen($request->input('g')) > 0) ? date('Y-m-d', strtotime($request->input('g'))) : null;
        $raw_total = $request->input('f');
        $qry->update([
            'tx_dataproductinput_quantity' => $request->input('a'),
            'dataproductinput_ai_measurement_id' => $request->input('b'),
            'tx_dataproductinput_price' => $request->input('c'),
            'tx_dataproductinput_discountrate' => $request->input('d'),
            'tx_dataproductinput_taxrate' => $request->input('e'),
            'tx_dataproductinput_total' => $raw_total['total'],
            'tx_dataproductinput_duedate' => $duedate
        ]);
        $rs = $qry->first();
        $total_productinput = $request->input('h');
        tm_productinput::where('ai_productinput_id',$rs['dataproductinput_ai_productinput_id'])->update([
            'tx_productinput_nontaxable' => $total_productinput['nontaxable'],
            'tx_productinput_taxable' => $total_productinput['taxable'],
            'tx_productinput_discount' => $total_productinput['discount'],
            'tx_productinput_tax' => $total_productinput['tax'],
            'tx_productinput_total' => $total_productinput['total']
        ]);
        // ANSWER
        $rs = tm_productinput::join('tm_dataproductinputs','tm_dataproductinputs.dataproductinput_ai_productinput_id','tm_productinputs.ai_productinput_id')->where('ai_dataproductinput_id',$dataproductinput_id)->first();
        $rs_productinput = $this->showit($rs['tx_productinput_slug']);

        return response()->json(['status'=>'success','message'=>'Actualizado correctamente.','data'=>['opened'=>['info'=>$rs_productinput['info'], 'dataproductinput'=>$rs_productinput['dataproductinput']]]]);
    }

    public function delete_data(Request $request, $dataproductinput_id)
    {
        $qry = tm_dataproductinput::where('ai_dataproductinput_id',$dataproductinput_id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $rs = tm_productinput::join('tm_dataproductinputs','tm_dataproductinputs.dataproductinput_ai_productinput_id','tm_productinputs.ai_productinput_id')->where('ai_dataproductinput_id',$dataproductinput_id)->first();
        $qry->delete();

        // ANSWER
        $rs_productinput = $this->showit($rs['tx_productinput_slug']);

        return response()->json(['status'=>'success','message'=>'Eliminado correctamente.','data'=>['opened'=>['info'=>$rs_productinput['info'], 'dataproductinput'=>$rs_productinput['dataproductinput']]]]);
    }


    public function report($from, $to){
        $rs = tm_productinput::select('tm_productinputs.tx_productinput_number','tm_productinputs.tx_productinput_nontaxable','tm_productinputs.tx_productinput_taxable',
        'tm_productinputs.tx_productinput_discount','tm_productinputs.tx_productinput_tax','tm_productinputs.tx_productinput_total','tm_productinputs.tx_productinput_due',
        'tm_productinputs.tx_productinput_date','tm_providers.tx_provider_value','tm_providers.tx_provider_ruc','tm_providers.tx_provider_dv')->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->where('tm_productinputs.created_at','>=',date('Y-m-d h:i:s',strtotime($from)))->where('tm_productinputs.created_at','<=',date('Y-m-d h:i:s',strtotime($to)))->get();

        return [ 'list' => $rs ];
    }
    public function report_by_provider($from, $to){
        $rs = DB::table('tm_productinputs')
                ->select(DB::raw('SUM(tm_productinputs.tx_productinput_taxable) as total_taxable'),DB::raw('SUM(tm_productinputs.tx_productinput_tax) as total_tax'), DB::raw('SUM(tm_productinputs.tx_productinput_nontaxable) as total_nontaxable'),'tm_providers.tx_provider_value','tm_providers.tx_provider_ruc','tm_providers.tx_provider_dv','tm_providers.tx_provider_status')
                ->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')
                ->where('tm_productinputs.created_at','>=',date('Y-m-d h:i:s',strtotime($from)))
                ->where('tm_productinputs.created_at','<=',date('Y-m-d h:i:s',strtotime($to)))
                ->groupby('tm_productinputs.productinput_ai_provider_id')
                ->get();

        return [ 'list' => $rs ];
    }

}

    

