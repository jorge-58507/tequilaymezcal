<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_cashoutput;

class cashoutputController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cashoutputlist = $this->get(date('Y-m-d'));

        return response()->json(['status'=>'success','message'=>'','data'=>['cashoutputlist'=>$cashoutputlist]]);
    }
    public function get($date){
        $rs_cashoutput = tm_cashoutput::where('created_at','like','%'.$date.'%')->get();
        return $rs_cashoutput;
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
    public function save($user_id,$type,$reason,$amount){
        $tm_cashoutput = new tm_cashoutput;
        $tm_cashoutput->cashoutput_ai_user_id = $user_id;
        $tm_cashoutput->cashoutput_ai_paydesk_id = 0;
        $tm_cashoutput->tx_cashoutput_type = $type;
        $tm_cashoutput->tx_cashoutput_reason = $reason;
        $tm_cashoutput->tx_cashoutput_amount = $amount;
        $tm_cashoutput->tx_cashoutput_status = 1;
        $tm_cashoutput->save();
    }

    public function store(Request $request)
    {
        $check_duplicate = tm_cashoutput::where('tx_cashoutput_reason',$request->input('c'))->where('tx_cashoutput_type',$request->input('a'))->where('tx_cashoutput_amount',$request->input('b'))->where('created_at',date('Y-m-d h:i:s'));
        if ($check_duplicate->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'Movimiento duplicado.']);
        }
        $user = $request->user();
        $this->save($user['id'],$request->input('a'),$request->input('c'),$request->input('b'));

        // ANSWER
        $cashoutputlist = $this->get(date('Y-m-d'));

        return response()->json(['status'=>'success','message'=>'Guardado correctamente.','data'=>['outputlist'=>$cashoutputlist]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($date)
    {
        $date = date('Y-m-d',strtotime($date));
        $cashoutputlist = $this->get($date);

        return response()->json(['status'=>'success','message'=>'','data'=>['cashoutputlist'=>$cashoutputlist]]);

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
