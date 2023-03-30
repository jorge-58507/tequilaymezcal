<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_article;
use App\tm_articleproduct;
// use App\tm_commanddata;
use App\tm_price;

class articleController extends Controller
{
    public function getAll(){
        // $rs = tm_article::all();
        $rs = tm_article::select('article_ai_user_id','article_ai_category_id','tx_article_code','tx_article_value','tx_article_promotion','tx_article_status','tx_article_slug','tx_article_taxrate','tx_article_discountrate','created_at','updated_at')->get();
        return $rs;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs_article = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_article]]);
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
        $description = $request->input('a');
        $code = $request->input('b');
        $category = $request->input('c');
        $promotion = $request->input('d');
        $option = $request->input('e');

        $check_description = tm_article::where('tx_article_value',$description)->where('article_ai_category_id',$category)->count();
        if ($check_description > 0) {
            return response()->json(['status'=>'failed','message'=>'Art&iacute;culo duplicado.']);
        }
        $check_code = tm_article::where('tx_article_code',$code)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'C&oacute;digo ya existe.']);
        }

        $user = $request->user();
        $article = new tm_article;
        $article->article_ai_category_id = $category;
        $article->article_ai_user_id = $user['id'];
        $article->tx_article_value = $description;
        $article->tx_article_code = $code;
        $article->tx_article_promotion = $promotion;
        $article->tx_article_taxrate = $request->input('h');
        $article->tx_article_discountrate = $request->input('i');
        $article->tx_article_option = json_encode($option); // opcion tiene que ser un json [{titulo: ['opcion1','opcion2','opcion3']}]
        $article->tx_article_slug = time().$code;
        $article->save();
        // status se guarda en cero, 
        
        $articlepresentationController = new articlepresentationController;
        $articlepresentationController->save(1,$article->ai_article_id);

        // ANSWER
        $rs_article = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_article]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($article_slug)
    {
        $qry = tm_article::where('tx_article_slug',$article_slug);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Articulo no existe.']);
        }
        $rs = $qry->first();

        $articleproduct = tm_articleproduct::join('tm_products','tm_products.ai_product_id','tm_articleproducts.articleproduct_ai_product_id')
        ->join('tm_measures','tm_measures.ai_measure_id','tm_articleproducts.articleproduct_ai_measure_id')
        ->where('articleproduct_ai_article_id',$rs['ai_article_id'])->get();
        $rs_price = tm_price::select('tm_presentations.tx_presentation_value','tm_presentations.ai_presentation_id','tm_prices.ai_price_id','tm_prices.tx_price_one','tm_prices.tx_price_two','tm_prices.tx_price_three','tm_prices.tx_price_date')->join('tm_presentations','tm_prices.price_ai_presentation_id','tm_presentations.ai_presentation_id')->where('price_ai_article_id',$rs['ai_article_id'])->where('tx_price_status',1)->orderby('tx_price_date','DESC')->get();
        return response()->json(['status'=>'success','data'=>['article'=>$rs, 'price' => $rs_price, 'articleproduct'=>$articleproduct]]);
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
    public function update(Request $request, $article_id)
    {
        $category = $request->input('c');
        $description = $request->input('a');
        $code = $request->input('b');
        $promotion = $request->input('d');
        $option = $request->input('e');
        $status = $request->input('f');

        $product = $request->input('g');

        $check_description = tm_article::where('tx_article_value',$description)->where('article_ai_category_id',$category)->where('ai_article_id','!=',$article_id)->count();
        if ($check_description > 0) {
            return response()->json(['status'=>'failed','message'=>'Art&iacute;culo duplicado.']);
        }
        $check_code = tm_article::where('tx_article_code',$code)->where('ai_article_id','!=',$article_id)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'C&oacute;digo ya existe.']);
        }

        // revisa si el articulo tiene precio, sino mantenerse desactivado
        $check_price = tm_price::where('price_ai_article_id',$article_id)->where('tx_price_status',1)->count();
        if ($check_price === 0) {
            $status = 0;
        }

        $article = new tm_article;
        $qry = tm_article::where('ai_article_id',$article_id);
        if ($qry->count() > 0) {
            $qry->update([
                'article_ai_category_id' => $category,
                'tx_article_value' => $description,
                'tx_article_code' => $code,
                'tx_article_promotion' => $promotion,
                'tx_article_option' => json_encode($option), // opcion tiene que ser un json [{titulo: ['opcion1','opcion2','opcion3']}]
                'tx_article_status' => $status,
                'tx_article_taxrate' => $request->input('h'),
                'tx_article_discountrate' => $request->input('i')
            ]);
        }
        if (sizeOf($product) > 0) {
            $articlepoductController = new articleproductController;
            $ans = $articlepoductController->save($product);
        }
        
        // ANSWER
        $rs_article = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_article]]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($article_slug)
    {
        $qry = tm_article::where('tx_article_slug',$article_slug);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $rs = $qry->first();
        $denied = 0;
        // VERIFICAR QUE NO TENGA commanddata_ai_article_id
        // $check_creditnote = tm_commanddata::where('commanddata_ai_article_id',$rs['ai_article_id'])->count(); <----------ESTO ES LO QUE HAY QUE ACTIVAR
        // if ($check_creditnote > 0) {
        //     $denied = 1;
        // }


        if ($denied === 0) {
            // tm_article::where('ai_article_id',$rs['ai_article_id'])->delete();
            // tm_price::where('price_ai_article_id',$rs['ai_article_id'])->delete();
            // tm_articleproduct::where('articleproduct_ai_article_id',$rs['ai_article_id'])->delete();
            // rel_article_presentation::where('article_presentation_ai_article_id',$rs['ai_article_id'])->delete();
            $message = 'Se elimin&oacute; correctamente.';
        }else{
            tm_article::where('ai_article_id',$rs['ai_article_id'])->update(['tx_article_status'=>0]);
            $message = 'Se desactiv&oacute; el art&iacute;culo.';
        }
        
        // ANSWER
        $rs_product = $this->getAll();
        return response()->json(['status'=>'success','message'=>$message,'data'=>['all'=>$rs_product]]);
    }
}
