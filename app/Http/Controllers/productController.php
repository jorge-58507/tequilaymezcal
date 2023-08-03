<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_product;
use App\rel_measure_product;
use App\tm_productupdate;
use App\tm_productcount;
use App\tm_articleproduct;
use App\tm_dataproductinput;
use App\tm_datarequisition;

// use App\tm_dataproductoutput;
// use App\tm_dataproductinputdevolution;

class productController extends Controller
{
    public function getAll(){
        $rs = tm_product::orderby('tx_product_value')->get();
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
        $tm_product = new tm_product;

        $check_value = tm_product::where('tx_product_value',$request->input('b'))->where('product_ai_productcategory_id',$request->input('a'))->count();
        if ($check_value > 0) {
            return response()->json(['status'=>'failed','message'=>'Producto duplicado.']);
        }
        $check_code = tm_product::where('tx_product_code',$request->input('d'))->count();
        if ($check_code) {
            return response()->json(['status'=>'failed','message'=>'Este codigo ya existe.']);
        }
        $user = $request->user();;
        $tm_product->product_ai_user_id = $user['id'];
        $tm_product->product_ai_productcategory_id = $request->input('a');
        $tm_product->tx_product_value = $request->input('b');
        $tm_product->tx_product_reference = $request->input('c');
        $tm_product->tx_product_code = $request->input('d');
        $tm_product->tx_product_taxrate = $request->input('e');
        $tm_product->tx_product_minimum = $request->input('f');
        $tm_product->tx_product_maximum = $request->input('g');
        $tm_product->tx_product_discountrate = $request->input('h');
        $tm_product->tx_product_status = $request->input('i');
        $tm_product->tx_product_alarm = $request->input('j');
        $tm_product->tx_product_discountable = $request->input('k');
        $tm_product->tx_product_quantity = 0;
        $tm_product->tx_product_slug = time().str_replace(' ','', $request->input('d'));
        $tm_product->save();

        // GUARDAR MEDIDA
        $measureproductController = new measureproductController;
        $measureproductController->add($tm_product->ai_product_id,$request->input('l'),1);
      
        // ANSWER
        $rs_product = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Creado Correctamente','data'=>['all'=>$rs_product]]);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $rs_product = tm_product::where('tx_product_slug',$slug)->first();
        $rs_measure = tm_product::select('tm_measures.ai_measure_id','tm_products.tx_product_slug','tm_measures.tx_measure_value','rel_measure_products.tx_measure_product_relation','rel_measure_products.ai_measure_product_id')->join('rel_measure_products','rel_measure_products.measure_product_ai_product_id','=','tm_products.ai_product_id')
        ->join('tm_measures','rel_measure_products.measure_product_ai_measure_id','=','tm_measures.ai_measure_id')->where('tx_product_slug',$slug)->where('tx_measure_status',1)->get();
        $rs_dataproductinput = tm_dataproductinput::select('tm_providers.tx_provider_value','tm_dataproductinputs.created_at','tm_dataproductinputs.tx_dataproductinput_price','tm_dataproductinputs.tx_dataproductinput_discountrate','tm_dataproductinputs.tx_dataproductinput_taxrate','tm_dataproductinputs.dataproductinput_ai_measurement_id','tm_productinputs.tx_productinput_date')->join('tm_productinputs','tm_productinputs.ai_productinput_id','tm_dataproductinputs.dataproductinput_ai_productinput_id')->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')->where('dataproductinput_ai_product_id',$rs_product['ai_product_id'])->where('tx_productinput_status',1)->orderby('tm_productinputs.tx_productinput_date', 'DESC')->get();

        return response()->json(['status'=>'success','data'=>['product'=>$rs_product, 'measure_list'=>$rs_measure, 'dataproductinput' => $rs_dataproductinput ]]);
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
        $check_code = tm_product::where('tx_product_code',$request->input('d'))->where('tx_product_slug','!=',$slug); // verificar duplicad de codigo
        if ($check_code->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'Ese c&oacute;digo ya existe.']);
        }
        $qry = tm_product::where('tx_product_slug',$slug);
        if ($qry->count() > 0) {
            $qry->update([
                'product_ai_productcategory_id' => $request->input('a'),
                'tx_product_value' => $request->input('b'),
                'tx_product_reference' => $request->input('c'),
                'tx_product_code' => $request->input('d'),
                'tx_product_taxrate' => $request->input('e'),
                'tx_product_minimum' => $request->input('f'),
                'tx_product_maximum' => $request->input('g'),
                'tx_product_discountrate' => $request->input('h'),
                'tx_product_status' => $request->input('i'),
                'tx_product_alarm' => $request->input('j'),
                'tx_product_discountable' => $request->input('k'),
            ]);
            $user = $request->user();
            $rs_product = $qry->first();
            $tm_productupdate = new tm_productupdate;
            $tm_productupdate->productupdate_ai_user_id = $user['id'];
            $tm_productupdate->productupdate_ai_product_id = $rs_product['ai_product_id'];
            $tm_productupdate->tx_productupdate_data = json_encode([
                'productcategory'=> $request->input('a'),
                'value'=> $request->input('b'),
                'reference'=> $request->input('c'),
                'code'=> $request->input('d'),
                'taxrate'=> $request->input('e'),
                'minimum'=> $request->input('f'),
                'maximum'=> $request->input('g'),
                'discountrate'=> $request->input('h'),
                'status'=> $request->input('i'),
                'alarm'=> $request->input('j'),
                'discountable'=> $request->input('k')
            ]);
            $tm_productupdate->save();
        }
        // ANSWER
        $rs_product = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Informaci&oacute;n Actualizada','data'=>['all'=>$rs_product]]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($product_slug)
    {
        $qry = tm_product::where('tx_product_slug',$product_slug);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $rs_product = $qry->first();
        $denied = 0;

        $check_output = tm_dataproductoutput::where('dataproductoutput_ai_product_id',$rs_product['ai_product_id'])->count();
        if ($check_output > 0) {
        $denied = 1;
        }
        $check_requisition = tm_datarequisition::where('datarequisition_ai_product_id',$rs_product['ai_product_id'])->count();
        if ($check_requisition > 0) {
        $denied = 1;
        }
        $check_input = tm_dataproductinput::where('dataproductinput_ai_product_id',$rs_product['ai_product_id'])->count();
        if ($check_input > 0) {
        $denied = 1;
        }
        // $check_devolution = tm_dataproductinputdevolution::where('dataproductinputdevolution_ai_product_id',$rs_product['ai_product_id'])->count();
        // if ($check_devolution > 0) {
        // $denied = 1;
        // }
        if ($denied === 0) {
            tm_product::where('ai_product_id',$rs_product['ai_product_id'])->delete();
            $message = 'Se elimin&oacute; correctamente.';
        }else{
            tm_product::where('ai_product_id',$rs_product['ai_product_id'])->update(['tx_product_status'=>0]);
            $message = 'Se desactiv&oacute; el producto.';
        }
        
        // ANSWER
        $rs_product = $this->getAll();
        return response()->json(['status'=>'success','message'=>$message,'data'=>['all'=>$rs_product]]);
    }

    public function show_quantity($product_slug){
        $rs_product = tm_product::where('tx_product_slug',$product_slug)->first();
        $rs = tm_productcount::where('productcount_ai_product_id',$rs_product['ai_product_id'])->limit(10)->get();
        return response()->json(['status'=>'success','message'=>'','data'=>['count_list'=>$rs]]);
    }
    public function update_quantity(Request $request, $product_slug){
        $qry = tm_product::where('tx_product_slug',$product_slug);
        $rs_product = $qry->first();
        $qry->update(['tx_product_quantity'=>$request->input('a')]);

        $model = new tm_productcount;
        $user = $request->user();
        $model->productcount_ai_user_id = $user['id'];
        $model->productcount_ai_product_id = $rs_product['ai_product_id'];
        $model->tx_productcount_before = $rs_product['tx_product_quantity'];
        $model->tx_productcount_after = $request->input('a');
        $model->save();

        $rs_product = tm_product::where('tx_product_slug',$product_slug)->first();
        return response()->json(['status'=>'success','message'=>'Conteo Actualizado.','data'=>['product'=>$rs_product]]);

    }
    public function minus_byArticle($article_list){
        foreach ($article_list as $a => $article) {
            foreach ($article['recipe'] as $ingredient) {
                foreach ($ingredient as $reduced) {
                    $raw_explode = explode(",",$reduced);
                    $rs_measureproduct = rel_measure_product::select('tm_products.tx_product_quantity','tm_products.tx_product_discountable','rel_measure_products.tx_measure_product_relation')
                    ->join('tm_products','tm_products.ai_product_id','rel_measure_products.measure_product_ai_product_id')
                    ->where('measure_product_ai_measure_id',$raw_explode[1])->where('measure_product_ai_product_id',$raw_explode[2])->first();
                    
                    if ($rs_measureproduct['tx_product_discountable'] == 1) {
                        $quantity = $rs_measureproduct['tx_product_quantity']-(($raw_explode[0]*$article['quantity'])*$rs_measureproduct['tx_measure_product_relation']);
                        $product = tm_product::where('ai_product_id',$raw_explode[2])->update(['tx_product_quantity' => $quantity]);
                    }
                }

            }
        }
    }
    public function plus_byArticle($article_list){
        foreach ($article_list as $a => $article) {
            $recipe = json_decode($article['recipe'],true);
            foreach ($recipe as $ingredient) {
                foreach ($ingredient as $reduced) {
                    $raw_explode = explode(",",$reduced);
                    $rs_measureproduct = rel_measure_product::select('tm_products.tx_product_quantity','tm_products.tx_product_discountable','rel_measure_products.tx_measure_product_relation')
                    ->join('tm_products','tm_products.ai_product_id','rel_measure_products.measure_product_ai_product_id')
                    ->where('measure_product_ai_measure_id',$raw_explode[1])->where('measure_product_ai_product_id',$raw_explode[2])->first();
                    
                    if ($rs_measureproduct['tx_product_discountable'] == 1) {
                        $quantity = $rs_measureproduct['tx_product_quantity']+(($raw_explode[0]*$article['quantity'])*$rs_measureproduct['tx_measure_product_relation']);
                        $product = tm_product::where('ai_product_id',$raw_explode[2])->update(['tx_product_quantity' => $quantity]);
                    }
                }

            }
        }
    }
    public function minus_byProduct($product_list){
        foreach ($product_list as $a => $product) {
            // $rs_product = tm_product::where('ai_product_id',$product['ai_product_id'])->get();
            if ($product['tx_product_discountable'] == 1) {
                $quantity = $product['tx_product_quantity']-$product['depletion_quantity'];
                tm_product::where('ai_product_id',$product['ai_product_id'])->update(['tx_product_quantity' => $quantity]);
            }
        }
    }
    // public function plus_byProduct($article_list){
        // foreach ($article_list as $a => $article) {
        //     $rs_articleproduct = tm_articleproduct::where('articleproduct_ai_article_id',$article['article_id'])->get();
        //     foreach ($rs_articleproduct as $key => $articleproduct) {
        //         $rs_measureproduct = rel_measure_product::select('tm_products.tx_product_quantity','tm_products.tx_product_discountable','rel_measure_products.tx_measure_product_relation')->join('tm_products','tm_products.ai_product_id','rel_measure_products.measure_product_ai_product_id')->where('measure_product_ai_measure_id',$articleproduct['articleproduct_ai_measure_id'])->where('measure_product_ai_product_id',$articleproduct['articleproduct_ai_product_id'])->first();
        //         if ($rs_measureproduct['tx_product_discountable'] == 1) {
        //             $quantity = $rs_measureproduct['tx_product_quantity']+(($article['quantity']*$articleproduct['tx_articleproduct_quantity'])*$rs_measureproduct['tx_measure_product_relation']);
        //             $product = tm_product::where('ai_product_id',$articleproduct['articleproduct_ai_product_id'])->update(['tx_product_quantity' => $quantity]);
        //         }
        //     }
        // }
    // }


}
