<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_depletion;
use App\tm_product;
use App\tm_article;
use App\tm_articleproduct;
use App\rel_measure_product;

class depletionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = [
            'product_list'    => tm_product::where('tx_product_status',1)->get(),
            'article_list'      => tm_article::select('article_ai_user_id','article_ai_category_id','tx_article_code','tx_article_value','tx_article_promotion','tx_article_status','tx_article_slug','tx_article_taxrate','tx_article_discountrate','created_at','updated_at')->where('tx_article_status',1)->get(),
            'depletion_list'    => $this->getAll()
        ];
        return view('depletion.index', compact('data'));
    }
    public function getAll(){
        $depletion = tm_depletion::select('tm_depletions.created_at','tm_depletions.ai_depletion_id','tm_products.tx_product_value','tm_depletions.tx_depletion_quantity','tm_depletions.tx_depletion_status')->join('tm_products','tm_products.ai_product_id','tm_depletions.depletion_ai_product_id')->orderby('tm_depletions.ai_depletion_id','DESC')->get();
        $depletion_order_status = tm_depletion::select('tm_depletions.created_at','tm_depletions.ai_depletion_id','tm_products.tx_product_value','tm_depletions.tx_depletion_quantity','tm_depletions.tx_depletion_status')->join('tm_products','tm_products.ai_product_id','tm_depletions.depletion_ai_product_id')->orderby('tx_depletion_status')->orderby('tm_depletions.ai_depletion_id','DESC')->get();

        return ['all'=>$depletion,'order_status'=>$depletion_order_status];
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
        $user = $request->user();

        if( auth()->user()->hasAnyRole(['admin','super']) != true){
            $status = 0;
            $message = 'Merma registrada.';
        }else{
            $status = 1;
            $message = 'Merma registrada y aprobada.';

        }

        $raw_tominus = [];
        foreach ($raw_product as $key => $product) {
            $tm_depletion = new tm_depletion;
            $tm_depletion->depletion_ai_user_id = $user['id'];
            $tm_depletion->depletion_ai_product_id = $product['articleproduct_ai_product_id'];
            $tm_depletion->tx_depletion_quantity = $product['tx_articleproduct_quantity'];
            $tm_depletion->tx_depletion_status = $status;
            $tm_depletion->save();
            if ($status === 1) {
                $rs_product = tm_product::where('ai_product_id',$product['articleproduct_ai_product_id'])->first();
                $rs_product['depletion_quantity'] = $product['tx_articleproduct_quantity'];
                array_push($raw_tominus,$rs_product);
            }
        }
        $productController = new productController;
        $productController->minus_byProduct($raw_tominus);
        // ANSWER
        $depletion = $this->getAll();
        return response()->json(['status'=>'success','message'=>$message,'data'=>['depletion'=>$depletion]]);   
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
    public function destroy($id) //desactivate
    {
        $qry_depletion = tm_depletion::where('ai_depletion_id',$id);
        if ($qry_depletion->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Merma no existe.']);
        }
        if( auth()->user()->hasAnyRole(['admin','super']) === true){
            $qry_depletion->update(['tx_depletion_status'=>2]);
        }else{
            return response()->json(['status'=>'failed','message'=>'Función reservada para el administrador.']);
        }
        // ANSWER
        $depletion = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Anulado','data'=>['depletion'=>$depletion]]);
    }

    public function getByArticle(Request $request, $article_slug)
    {
        $qry_article = tm_article::where('tx_article_slug',$article_slug);
        if ($qry_article->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Art&iacute;culo no existe.']);
        }
        $rs_article = $qry_article->first();

        $rs_articleproduct = tm_articleproduct::where('articleproduct_ai_article_id',$rs_article['ai_article_id'])->get();
        foreach ($rs_articleproduct as $key => $articleproduct) {
            $rs_productmeasure = rel_measure_product::select('tx_measure_product_relation')->where('measure_product_ai_measure_id',$articleproduct['articleproduct_ai_measure_id'])->where('measure_product_ai_product_id',$articleproduct['articleproduct_ai_product_id'])->first();
            $quantity = $rs_productmeasure['tx_measure_product_relation']*$articleproduct['tx_articleproduct_quantity'];
            $rs_articleproduct[$key]['tx_articleproduct_quantity'] = $quantity;
        }
        return response()->json(['status'=>'success','message'=>'','data'=>['product_list'=>$rs_articleproduct]]);   
    }

    public function aprove($id)
    {
        $qry_depletion = tm_depletion::where('ai_depletion_id',$id);
        if ($qry_depletion->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Merma no existe.']);
        }
        if( auth()->user()->hasAnyRole(['admin','super']) === true){
            $rs_depletion = $qry_depletion->first();
            $qry_depletion->update(['tx_depletion_status'=>1]);

            $rs_product = tm_product::where('ai_product_id',$rs_depletion['depletion_ai_product_id'])->first();
            $rs_product['depletion_quantity'] = $rs_depletion['tx_depletion_quantity'];


            $productController = new productController;
            $productController->minus_byProduct([$rs_product]);

        }else{
            return response()->json(['status'=>'failed','message'=>'Función reservada para el administrador.']);
        }
        // ANSWER
        $depletion = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Aprobado','data'=>['depletion'=>$depletion]]);
    }

    public function approve_all()
    {
        if( auth()->user()->hasAnyRole(['admin','super']) === true){
            $qry_depletion = tm_depletion::where('tx_depletion_status',0);
            $rs_depletion = $qry_depletion->get();
            $qry_depletion->update(['tx_depletion_status'=>1]);

            $raw_tominus = [];
            foreach ($rs_depletion as $key => $depletion) {
                $rs_product = tm_product::where('ai_product_id',$depletion['depletion_ai_product_id'])->first();
                $rs_product['depletion_quantity'] = $depletion['tx_depletion_quantity'];
                array_push($raw_tominus,$rs_product);
            }
            $productController = new productController;
            $productController->minus_byProduct($raw_tominus);
        }else{
            return response()->json(['status'=>'failed','message'=>'Función reservada para el administrador.']);
        }

        // ANSWER
        $depletion = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Aprobado','data'=>['depletion'=>$depletion]]);
    }

    public function report ($from,$to){
        $rs = tm_depletion::select('tm_products.tx_product_value','tm_depletions.tx_depletion_quantity','tm_depletions.tx_depletion_status','tm_depletions.created_at')->join('tm_products','tm_products.ai_product_id','tm_depletions.depletion_ai_product_id')->where('tm_depletions.created_at','>=',date('Y-m-d H:i:s',strtotime($from." 00:00:01")))->where('tm_depletions.created_at','<=',date('Y-m-d H:i:s',strtotime($to." 23:59:00")))->orderby('created_at','DESC')->get();

        return [ 'list' => $rs ];
    }

    public function recipe (Request $request){
        $raw_id = $request->input('a');
        $rs_product = [];
        foreach ($raw_id as $id) {
            $rs_product[] = tm_product::where('ai_product_id',$id)->first();
        }

        return response()->json(['status'=>'success','message'=>'','data'=>['product_list'=>$rs_product]]);
    }

}
