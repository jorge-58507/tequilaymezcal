<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_client;

class clientController extends Controller
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
    public function getAll(){
        $rs = tm_client::all();
        return $rs;
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
        $check_cif = tm_client::where('tx_client_cif',$request->input('b'))->count();
        if ($check_cif > 0) {
            return response()->json(['status'=>'failed','message'=>'La C&eacute;dula/Pasaporte ya existe.']);
        }
        if ($request->input('a') === 'Contado') {
            return response()->json(['status'=>'failed','message'=>'Nombre erroneo.']);
        }

        $taxpayer = substr($request->input('h'),0,1);
        $type = substr($request->input('h'),1,2);

        $user = $request->user();
        $tm_client = new tm_client;
        $tm_client->client_ai_user_id = $user['id'];
        $tm_client->tx_client_name = trim($request->input('a'));
        $tm_client->tx_client_cif = trim($request->input('b'));
        $tm_client->tx_client_dv = trim($request->input('c'));
        $tm_client->tx_client_direction = $request->input('f');
        $tm_client->tx_client_telephone = $request->input('d');
        $tm_client->tx_client_exempt = $request->input('g');
        $tm_client->tx_client_taxpayer = $taxpayer;
        $tm_client->tx_client_type = $type;
        $tm_client->tx_client_email = $request->input('e');
        $tm_client->tx_client_slug = time().str_replace($request->input('a'),' ','');
        $tm_client->tx_client_status = $request->input('i');
        $tm_client->save();
        $client_id = $tm_client->ai_client_id;

        // ANSWER
        $rs_client = tm_client::where('ai_client_id',$client_id)->first();
        $rs_clientlist = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Guardado Correctamente.','data'=>['client_list'=>$rs_clientlist, 'client'=>$rs_client]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $qry = tm_client::where('tx_client_slug',$slug);
        if ($qry->count() > 0) {
            return response()->json(['status'=>'success','message'=>'','data'=>['client'=>$qry->first()]]);
        }else{
            return response()->json(['status'=>'failed','message'=>'No existe.']);

        }
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
        if ($slug === "001") {
            return response()->json(['status'=>'failed','message'=>'No modificable.']);
        }
        if ($request->input('a') === 'Contado') {
            return response()->json(['status'=>'failed','message'=>'Nombre erroneo.']);
        }
        $check = tm_client::where('tx_client_slug',$slug);
        if ($check->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
        $check_cif = tm_client::where('tx_client_cif',$request->input('b'))->where('tx_client_slug','!=',$slug)->count();
        if ($check_cif > 0) {
            return response()->json(['status'=>'failed','message'=>'La C&eacute;dula/Pasaporte ya existe.']);
        }
        $taxpayer = substr($request->input('h'),0,1);
        $type = substr($request->input('h'),1,2);

        $qry = tm_client::where('tx_client_slug',$slug)->update([
            'tx_client_name' => trim($request->input('a')),
            'tx_client_cif' => trim($request->input('b')),
            'tx_client_dv' => trim($request->input('c')),
            'tx_client_direction' => $request->input('f'),
            'tx_client_telephone' => $request->input('d'),
            'tx_client_exempt' => $request->input('g'),
            'tx_client_taxpayer' => $taxpayer,
            'tx_client_type' => $type,
            'tx_client_email' => $request->input('e'),
            'tx_client_status' => $request->input('i')
        ]);

        // ANSWER
        $rs_client = $check->first();
        $rs_clientlist = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Guardado Correctamente.','data'=>['client_list'=>$rs_clientlist, 'client'=>$rs_client]]);
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
