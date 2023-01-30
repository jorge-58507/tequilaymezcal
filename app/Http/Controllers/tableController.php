<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_table;
use App\tm_ubication;
use App\tm_request;

class tableController extends Controller
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
        $description = trim($request->input('a'));
        $code = trim($request->input('b'));
        $type = $request->input('c');

        $check_code = tm_table::where('tx_table_code',$code)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'El c&oacute;digo ya existe.']);
        }
        $tm_table = new tm_table;
        $tm_table->table_ai_ubication_id = $request->input('d');
        $tm_table->tx_table_value = $description;
        $tm_table->tx_table_code = $code;
        $tm_table->tx_table_type = $type;
        $tm_table->tx_table_slug = time().$description;
        $tm_table->save();

        //ANSWER
        $rs_ubication = tm_ubication::where('ai_ubication_id',$request->input('d'))->first();
        $rs_table = tm_table::where('table_ai_ubication_id',$request->input('d'))->get();

        return response()->json(['status'=>'success','message'=>'Guardado correctamente.', 'data'=>['ubication'=>$rs_ubication, 'table'=>$rs_table]]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $rs_table = tm_table::where('tx_table_slug',$slug)->first();

        return response()->json(['status'=>'success','data'=>['table'=>$rs_table]]);
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
        $tm_table = new tm_table;

        $value = $request->input('a');
        $code = $request->input('b');
        $status = $request->input('c');

        $check_code = tm_table::where('tx_table_code',$code)->where('ai_table_id','!=',$id)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'El c&oacute;digo ya existe.']);
        }

        $qry_table = $tm_table->where('ai_table_id',$id);
        if ($qry_table->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Verifique la información ingresada.']);
        }else{
            $qry_table->update([
                'tx_table_value' => $value,
                'tx_table_code' => $code,
                'tx_table_active' => $status
            ]);
        }

        // ANSWER
        $table = $qry_table->first();
        $rs_ubication = tm_ubication::where('ai_ubication_id',$table['table_ai_ubication_id'])->first();
        $rs_table = tm_table::where('table_ai_ubication_id',$table['table_ai_ubication_id'])->get();

        return response()->json(['status'=>'success','message'=>'Guardado correctamente.', 'data'=>['ubication'=>$rs_ubication, 'table'=>$rs_table]]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $rs_table = tm_table::where('ai_table_id',$id)->first();
        $check_request = tm_request::where('request_ai_table_id',$id)->count();
        if ($check_request < 1) {
            tm_table::where('ai_table_id',$id)->delete();
            $status = 'success';
            $message = 'Mesa eliminada';
        }else{
            $qry_table = tm_table::where('ai_table_id',$id);
            if ($qry_table->count() > 0) {
                $qry_table->update([
                    'tx_table_active'  => 0
                ]);
            }
            $status = 'success';
            $message = 'Mesa desactivada.';
        }
        // ANSWER
        $rs_ubication = tm_ubication::where('ai_ubication_id',$rs_table['table_ai_ubication_id'])->first();
        $rs_table = tm_table::where('table_ai_ubication_id',$rs_table['table_ai_ubication_id'])->get();

        return response()->json(['status'=>$status,'message'=>$message, 'data'=>['ubication'=>$rs_ubication, 'table'=>$rs_table]]);
    }
}
