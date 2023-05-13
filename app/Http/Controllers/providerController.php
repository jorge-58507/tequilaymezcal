<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_provider;
use App\tm_requisition;

class providerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }

    public function getAll(){
        $rs_active = tm_provider::where('tx_provider_status',1)->get();

        return ['active' => $rs_active];
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
        $check_value = tm_provider::where('tx_provider_value',$request->input('a'))->count();
        $check_ruc = tm_provider::where('tx_provider_ruc',$request->input('b'))->count();

        if ($check_value > 0) {
            return response()->json(['status'=>'failed','message'=>'Verifique, el nombre ya existe.']);
        }
        if ($check_ruc > 0) {
            return response()->json(['status'=>'failed','message'=>'El RUC ya existe.']);
        }

        $user = $request->user();

        $tm_provider = new tm_provider;
        $tm_provider->provider_ai_user_id = $user['id'];
        $tm_provider->tx_provider_value = $request->input('a');
        $tm_provider->tx_provider_ruc = $request->input('b');
        $tm_provider->tx_provider_dv = $request->input('c');
        $tm_provider->tx_provider_telephone = $request->input('e');
        $tm_provider->tx_provider_direction = $request->input('f');
        $tm_provider->tx_provider_observation = $request->input('g');
        $provider_slug = time().str_replace(' ','',$request->input('a'));
        $tm_provider->tx_provider_slug = $provider_slug;
        $tm_provider->tx_provider_status = 1;
        $tm_provider->save();
        // ANSWER
        $providerController = new providerController;
        $rs_provider = $providerController->getAll();

        return response()->json(['status'=>'success','message'=>'Guardado Correctamente.','data'=>['active'=>$rs_provider['active'], 'provider'=>['tx_provider_slug'=>$provider_slug,'tx_provider_value'=>$request->input('a')]]]);
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


    public function get_requisition($provider_slug)
    {
        $qry = tm_provider::where('tx_provider_slug',$provider_slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe.']);
        }
        $rs = $qry->first();

        $rs_requisition = tm_requisition::where('requisition_ai_provider_id',$rs['ai_provider_id'])->get();
        return ['requisition_list' => $rs_requisition];
    }

}
