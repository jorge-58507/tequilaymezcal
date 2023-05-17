<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_giftcard;
use App\tm_client;

class giftcardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }
    public function get_all_by_client($client_id)
    {
        $rs_active = tm_giftcard::where('tx_giftcard_status',1)->where('giftcard_ai_client_id',$client_id)->get();
        $rs_inactive = tm_giftcard::where('tx_giftcard_status',0)->where('giftcard_ai_client_id',$client_id)->get();

        return ['active'=>$rs_active, 'inactive'=>$rs_inactive];
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
    
    public function generate_number(){
        return rand(100001,999999);
    }
    public function random_number(){
        $number = $this->generate_number();
        $check = tm_giftcard::where('tx_giftcard_number',$number)->where('tx_giftcard_status',1);
        if($check->count() > 0) {
            $this->random_number();
        }else{
            return $number;
        }
    }
    public function store(Request $request)
    {
        $qry_client = tm_client::where('tx_client_slug',$request->input('a'));
        if ($qry_client->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Cliente no existe.']);
        }
        $rs_client = $qry_client->first();

        $raw_payment = $request->input('b');
        $received = 0;
        foreach ($raw_payment as $value) {
            $received += $value['amount'];
        }
        $number = $this->random_number();

        $user = $request->user();
        $tm_giftcard = new tm_giftcard;
        $tm_giftcard->giftcard_ai_user_id = $user['id'];
        $tm_giftcard->giftcard_ai_client_id = $rs_client['ai_client_id'];
        $tm_giftcard->tx_giftcard_payment = json_encode($request->input('b'));
        $tm_giftcard->tx_giftcard_number = $number;
        $tm_giftcard->tx_giftcard_amount = $received;
        $tm_giftcard->tx_giftcard_status = 1;
        $tm_giftcard->save();        

        // ANSWER
        $rs_giftcard = $this->get_all_by_client($rs_client['ai_client_id']);
        return response()->json(['status'=>'success','message'=>'Cupon creado.', 'data' => ['active' => $rs_giftcard['active'], 'inactive' => $rs_giftcard['inactive'] ]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($number)
    {
        $number = str_replace(" ","",$number);
        $qry = tm_giftcard::where('tx_giftcard_status',1)->where('tx_giftcard_number',$number);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'Cupón Inexistente.']);
        }
        $rs = $qry->first();

        return response()->json(['status'=>'success','message'=>'', 'data' => ['info' => $rs]]);
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
        $qry = tm_giftcard::where('ai_giftcard_id',$id);
        if($qry->count() === 0){
            return response()->json(['status'=>'failed','message'=>'Cupón Inexistente.']);
        }
        $qry->update(['tx_giftcard_status'=>0]);
        
        // ANSWER
        $rs = $qry->first();
        $rs_giftcard = $this->get_all_by_client($rs['giftcard_ai_client_id']);
        return response()->json(['status'=>'success','message'=>'Cupon desactivado.', 'data' => ['active' => $rs_giftcard['active'], 'inactive' => $rs_giftcard['inactive'] ]]);
    }
}
