<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\role;
use App\role_user;

class roleController extends Controller
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

    public function getAll()
    {
        return [
            'all' => role::get(), 
            'active' => role::where('status',1)->get(), 
            'inactive' => role::where('status',0)->get()
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
        $description = $request->input('a');
        $raw_name = str_split($description,5);

        if (empty($description)) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar la información.']); 
        }
        if (preg_match("/^[a-zA-Z]+$/i",$description) === 0) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar solo letras.']); 
        }
        // CHECK DUP NAME
        if (role::where('name',$raw_name[0])->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'Debe cambiar la estructura de la descripción.']); 
        }

        $role = new role();
        $role->name = strtolower($raw_name[0]);
        $role->description = ucfirst($description);
        $role->save();

        // ANSWER
        $rs_role = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Rol Creado.','data' => ['list' => $rs_role]]); 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $qry = role::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }

        return response()->json(['status'=>'success','message'=>'','data' => ['info' => $qry->first()]]);
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
        $qry = role::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }
        $description = $request->input('a');
        $raw_name = str_split($description,5);

        if (empty($description)) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar la información.']); 
        }
        if (preg_match("/^[a-zA-Z]+$/i",$description) === 0) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar solo letras.']); 
        }
        // CHECK DUP NAME
        if (role::where('name',$raw_name[0])->where('id','!=',$id)->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'Debe cambiar la estructura de la descripción.']); 
        }

        $qry->update(['description' => ucfirst($description), 'name' => strtolower($raw_name[0])]);

        // ANSWER
        $rs_role = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Rol Modificado.','data' => ['list' => $rs_role]]); 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $qry = role::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }

        if (role_user::where('role_id',$id)->count() > 0) {
            $qry->update(['status' => 0]);
            $message = "Rol Desactivado";
        }else{
            $qry->delete();
            $message = "Rol Eliminado.";
        }

        // ANSWER
        $rs_role = $this->getAll();
        return response()->json(['status'=>'success','message'=>$message,'data' => ['list' => $rs_role]]); 
    }
}
