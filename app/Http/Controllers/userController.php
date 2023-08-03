<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\user;


class userController extends Controller
{
    public function getAll(){
        $rs = user::orderby('name')->get();
        return $rs;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs_user = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_user]]);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $qry = user::where('id',$id);

        if ($qry->count() === 0 ) {
            return response()->json(['status'=>'failed', 'message' => 'El usuario no existe.']);
        }
        $rs_user = $qry->first();
        $role_list = user::join('role_users','role_users.user_id','users.id')->join('roles','roles.id','role_users.role_id')->where('users.id',$id)->get();

        return response()->json(['status'=>'success','data'=>['info'=>['data' => $rs_user, 'role' => $role_list]]]);
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