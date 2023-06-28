<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_ubication;
use App\tm_table;
use App\tm_request;
use App\tm_article;
use App\tm_client;
use App\tm_command;

class requestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs_ubication =       tm_ubication::join('tm_tables','tm_tables.table_ai_ubication_id','tm_ubications.ai_ubication_id')->whereIn('tx_table_type',[1,2])->where('tx_table_active',1)->where('tx_ubication_status',1)->orderby('ai_ubication_id')->orderby('tx_table_type')->get();
        // $rs_openrequest =       tm_request::select('tm_requests.ai_request_id','tm_requests.request_ai_table_id','tm_requests.tx_request_code','tm_requests.tx_request_title','tm_requests.tx_request_status','tm_requests.tx_request_slug','tm_requests.created_at','tm_clients.ai_client_id','tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_slug','tm_clients.tx_client_status','tm_tables.ai_table_id','tm_tables.table_ai_ubication_id','tm_tables.tx_table_code','tm_tables.tx_table_value','tm_tables.tx_table_image','tm_tables.tx_table_active','tm_tables.tx_table_slug')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',0)->get();
        // $rs_closedrequest =     tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',1)->get();
        // $rs_canceledrequest =   tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',2)->get();
        $rs_article =           tm_article::select('tm_articles.ai_article_id','tm_articles.tx_article_thumbnail','tm_articles.tx_article_code', 'tm_articles.tx_article_value', 'tm_articles.tx_article_promotion','tm_articles.tx_article_slug','tm_categories.ai_category_id','tm_categories.tx_category_value')->join('tm_categories','tm_categories.ai_category_id','tm_articles.article_ai_category_id')->where('tx_article_status',1)->orderby('tx_article_promotion','DESC')->orderby('tx_article_value','ASC')->get();
        $rs_client =            tm_client::where('tx_client_status',1)->get();
        $raw_request = $this->getAll();
        $data = [
            'table_list' => $rs_ubication,
            'open_request' => $raw_request['open_request'],
            'closed_request' => $raw_request['closed_request'],
            'canceled_request' => $raw_request['canceled_request'],
            'article_list' => $rs_article,
            'client_list' => $rs_client
        ];
        return view('request.index', compact('data'));
    }
    public function getAll()
    {
    //     $rs_openrequest =       tm_request::select('tm_requests.ai_request_id','tm_requests.request_ai_table_id','tm_requests.tx_request_code','tm_requests.tx_request_title','tm_requests.tx_request_status','tm_requests.tx_request_slug','tm_requests.created_at','tm_clients.ai_client_id','tm_clients.tx_client_name','tm_clients.tx_client_cif','tm_clients.tx_client_slug','tm_clients.tx_client_status','tm_tables.ai_table_id','tm_tables.table_ai_ubication_id','tm_tables.tx_table_code','tm_tables.tx_table_value','tm_tables.tx_table_image','tm_tables.tx_table_active','tm_tables.tx_table_slug')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',0)->get();
    //     $rs_closedrequest =     tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',1)->limit(100)->get();
    //     $rs_canceledrequest =   tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',2)->limit(100)->get();

        return [
            // 'open_request' => $rs_openrequest,
            // 'closed_request' => $rs_closedrequest,
            // 'canceled_request' => $rs_canceledrequest,
            'open_request' => $this->getOpenRequest(),
            'closed_request' => $this->getClosedRequest(),
            'canceled_request' => $this->getCanceledRequest(),
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

    }
    public function save($table_id, $client_id, $code, $title){
        $rs_table = tm_table::where('ai_table_id',$table_id)->first();
        if ($rs_table['tx_table_type'] === 2) {
            $check_table = tm_request::where('tx_request_status',0)->where('request_ai_table_id',$table_id)->count();
            if ($check_table > 0) {
                return response()->json(['status'=>'failed','message'=>'La mesa esta ocupada.']);
            }
        }
        if ($rs_table['tx_table_type'] > 2) {
            return response()->json(['status'=>'failed','message'=>'No es una mesa.']);
        }
        $tm_request = new tm_request;

        $tm_request->request_ai_table_id = $table_id;
        $tm_request->request_ai_client_id = $client_id;
        $tm_request->tx_request_code = $code;
        $tm_request->tx_request_title = $title;
        $tm_request->tx_request_status = 0;
        $tm_request->tx_request_slug = time().$title;
        $tm_request->save();

        return $tm_request->ai_request_id;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $qry_request = tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tx_request_slug',$slug)->where('tx_request_status',0);
        $rs_request = $qry_request->first();
        $commandController = new commandController;
        if ($qry_request->count() > 0) {
            $rs_command = $commandController->getByRequest($rs_request['ai_request_id']);
            $rs_table = tm_table::where('ai_table_id',$rs_request['request_ai_table_id'])->first();
        }else{
            $rs_command = [];
            $rs_table = 'vacio';
        }
        return response()->json(['status'=>'success','message'=>'','data'=>['request'=>$rs_request, 'command_procesed'=>$rs_command, 'table'=>$rs_table]]);
    }
    public function showByTable($table_slug){
        $qry_request = tm_request::join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tm_tables.tx_table_slug',$table_slug)->where('tx_request_status',0);
        $rs_request = $qry_request->first();
        $commandController = new commandController;
        $rs_command = ($qry_request->count() > 0) ? $commandController->getByRequest($rs_request['ai_request_id']) : [];
        
        return response()->json(['status'=>'success','message'=>'','data'=>['request'=>$rs_request,'command_procesed'=>$rs_command]]);
    }
    public function showByBar($table_slug){
        $qry_request = tm_request::join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->where('tm_tables.tx_table_slug',$table_slug)->where('tx_request_status',0);
        $rs_request = $qry_request->get();
        
        return response()->json(['status'=>'success','message'=>'','data'=>['request'=>$rs_request]]);
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
    public function update_rel(Request $request, $slug){
        $qry = tm_request::where('tx_request_slug',$slug);
        if ($qry->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Pedido no existe.']);
        }
        $qry_client = tm_client::where('tx_client_slug',$request->input('a'));
        if ($qry_client->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Cliente no existe.']);
        }
        $rs_table = tm_table::where('ai_table_id',$request->input('b'))->first();
        if ($rs_table['tx_table_type'] === 2) {
            $check_occupied = tm_request::where('request_ai_table_id',$request->input('b'))->where('tx_request_slug','!=',$slug)->where('tx_request_status',0)->count();
            if ($check_occupied > 0) {
                return response()->json(['status'=>'failed','message'=>'La mesa est&aacute; ocupada.']);
            }
        }

        $rs_client = $qry_client->first();
        $qry->update([
            'request_ai_client_id' => $rs_client['ai_client_id'],
            'request_ai_table_id' => $request->input('b')
        ]);
        // ANSWER
        return response()->json(['status'=>'success','message'=>'Cliente y mesa actualizados.']);
    }
    public function close($request_slug){
        $qry = tm_request::where('tx_request_slug',$request_slug)->where('tx_request_status',0);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Pedido erroneo']);
        }
        $user = Auth()->user();
        $qry->update(['tx_request_status'=>1, 'tx_request_closedby'=>$user['id']]);

        // ANSWER
        $rs_openrequest =       $this->getOpenRequest();
        $rs_closedrequest =     $this->getClosedRequest();
        
        return response()->json(['status'=>'success','message'=>'Pedido cerrado.','data'=>['open_request'=>$rs_openrequest, 'closed_request'=>$rs_closedrequest]]);
    }

    public function getOpenRequest(){
        $rs_openrequest = tm_request::join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',0)->orderby('tm_requests.created_at','DESC')->get();
        return $rs_openrequest;
    }
    public function getClosedRequest(){

        $rs_closedrequest = tm_request::select('tm_requests.ai_request_id','tm_requests.tx_request_slug','tm_requests.tx_request_code','tm_clients.tx_client_name','tm_requests.tx_request_title','tm_tables.tx_table_value','tm_requests.created_at')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',1)->orderby('tm_requests.created_at','DESC')->get();
        $commandController = new commandController; //CALCULAR EL TOTAL
        foreach ($rs_closedrequest as $a => $request) {
            $raw_command = $commandController->getByRequest($request['ai_request_id']);
            $raw_price = [];
            foreach ($raw_command as $b => $command) {
                if ($command['tx_commanddata_status'] === 1) {
                    array_push($raw_price,['price'=>$command['tx_commanddata_price'],'discount'=>$command['tx_commanddata_discountrate'],'tax'=>$command['tx_commanddata_taxrate'], 'quantity'=>$command['tx_commanddata_quantity']]);
                }
            }
            $chargeController = new chargeController;
            $raw_pricesale = $chargeController->calculate_sale($raw_price);
            $rs_closedrequest[$a]['total'] = $raw_pricesale['total'];
        }
        return $rs_closedrequest;
    }
    public function getCanceledRequest(){
        $rs_canceledrequest =   tm_request::select('tm_clients.tx_client_name','tm_charges.tx_charge_number','tm_charges.tx_charge_total','tm_charges.tx_charge_slug','tm_requests.tx_request_title','tm_requests.tx_request_code','tm_tables.tx_table_value','tm_charges.created_at')->join('tm_charges','tm_charges.ai_charge_id','tm_requests.request_ai_charge_id')->join('tm_clients','tm_clients.ai_client_id','tm_requests.request_ai_client_id')->join('tm_tables','tm_tables.ai_table_id','tm_requests.request_ai_table_id')->where('tx_request_status',2)->orderby('tm_charges.created_at','DESC')->get();
        return $rs_canceledrequest;
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
    public function reload(){
        $raw_request = $this->getAll();
        return response()->json(['status'=>'success','message'=>'','data'=>['open_request'=>$raw_request['open_request'], 'closed_request'=>$raw_request['closed_request'], 'canceled_request'=>$raw_request['canceled_request']]]);
    }
}
