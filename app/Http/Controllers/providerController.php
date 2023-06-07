<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_provider;
use App\tm_requisition;
use App\tm_productinput;

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
        $rs_all = tm_provider::orderby('tx_provider_value','ASC')->get();
        $rs_active = tm_provider::where('tx_provider_status',1)->orderby('tx_provider_value','ASC')->get();

        return ['active' => $rs_active, 'all' => $rs_all];
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
        $rs_provider = $this->getAll();

        return response()->json(['status'=>'success','message'=>'Guardado Correctamente.','data'=>['all'=>$rs_provider['all'], 'active'=>$rs_provider['active'], 'provider'=>['tx_provider_slug'=>$provider_slug,'tx_provider_value'=>$request->input('a')]]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($provider_slug)
    {
        $check = tm_provider::where('tx_provider_slug',$provider_slug)->count();
        if($check === 0){
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe']);
        }
        $rs = $this->showIt($provider_slug);

        return response()->json(['status'=>'success','message'=>'', 'data' => ['info' => $rs['info'], 'productinput_unpaid' => $rs['unpaid'], 'productinput_paidup' => $rs['paidup'] ]]);
    }
    public function showIt($provider_slug)
    {
        $rs_info = tm_provider::where('tx_provider_slug',$provider_slug)->first();
        $rs_unpaid = tm_productinput::where('productinput_ai_provider_id',$rs_info['ai_provider_id'])->where('tx_productinput_status',1)->get();
        $rs_paidup = tm_productinput::where('productinput_ai_provider_id',$rs_info['ai_provider_id'])->where('tx_productinput_status',2)->get();

        return ['info' => $rs_info, 'unpaid' => $rs_unpaid, 'paidup' => $rs_paidup ];
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
        $qry = tm_provider::where('tx_provider_slug',$slug);
        if($qry->count() === 0){
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe.']);
        }
        $check_ruc = tm_provider::where('tx_provider_ruc',$request->input('b'))->where('tx_provider_slug','!=',$slug)->count();
        if($check_ruc > 0) {
            return response()->json(['status'=>'failed','message'=>'El RUC ingresado ya existe.']);
        }

        $qry->update([
            'tx_provider_value' => $request->input('a'),
            'tx_provider_ruc' => $request->input('b'),
            'tx_provider_dv' => $request->input('c'),
            'tx_provider_telephone' => $request->input('e'),
            'tx_provider_direction' => $request->input('f'),
            'tx_provider_observation' => $request->input('g'),
            'tx_provider_status' => $request->input('h')
        ]);
        
        // ANSWER
        $rs_provider = $this->getAll();

        return response()->json(['status'=>'success','message'=>'Guardado Correctamente.','data'=>['all'=>$rs_provider['all'], 'active'=>$rs_provider['active'] ]]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        $qry = tm_provider::where("tx_provider_slug",$slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'El proveedor no existe.']);
        }
        $rs = $qry->first();

        $check_productinput = tm_productinput::where('productinput_ai_provider_id',$rs['ai_provider_id'])->count();
        $check_requisition  = tm_requisition::where('requisition_ai_provider_id',$rs['ai_provider_id'])->count();
        $check_paymentprovider  = tm_paymentprovider::where('paymentprovider_ai_provider_id',$rs['ai_provider_id'])->count();

        if ($check_productinput > 0 || $check_requisition > 0 || $check_paymentprovider > 0) {
            $qry->update(['tx_provider_status'=>0]);
            $message = 'Se desactivó el proveedor.';
        }else{
            $qry->delete();
            $message = 'Proveedor eliminado.';
        }

        // ANSWER
        $rs_provider = $this->getAll();

        return response()->json(['status'=>'success','message'=>$message,'data'=>['all'=>$rs_provider['all'], 'active'=>$rs_provider['active'] ]]);
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
