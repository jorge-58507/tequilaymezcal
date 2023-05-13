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
    public function get_all()
    {
        $rs_active = tm_giftcard::where('tx_giftcard_status',1)->get();
        $rs_inactive = tm_giftcard::where('tx_giftcard_status',0)->get();

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
        $check = tm_giftcard::where('tx_giftcard_number',$number);
        if($check->count() > 0) {
            $this->random_number();
        }else{
            return $number;
        }
    }
    public function store(Request $request)
    {
        $check_client = tm_client::where('ai_client_id',$request->input('b'))->count();
        if ($check_client === 0) {
            return response()->json(['status'=>'failed','message'=>'Cliente no existe.']);
        }
        $number = $this->random_number();

        $user = $request->user();
        $tm_giftcard = new tm_giftcard;
        $tm_giftcard->giftcard_ai_user_id = $user['id'];
        $tm_giftcard->giftcard_ai_client_id = $request->input('b');
        $tm_giftcard->tx_giftcard_number = $number;
        $tm_giftcard->tx_giftcard_amount = $request->input('a');
        $tm_giftcard->tx_giftcard_status = 1;
        $tm_giftcard->save();

        // CREAR ENTRADA DE DINERO EN ¿EFECTIVO?

        // ANSWER
        $rs_giftcard = $this->get_all();
        return response()->json(['status'=>'success','message'=>'Cupon creado.', 'data' => ['active' => $rs_giftcard['active'], 'inactive' => $rs_giftcard['inactive'] ]]);
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
