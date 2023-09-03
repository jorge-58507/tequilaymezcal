<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\user;
use Illuminate\Database\Eloquent\Builder;


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

    public function check_user($email,$password, $raw_role)
    {
        $rs_user = User::select('users.name')->join('role_users','role_users.user_id','users.id')->join('roles','roles.id','role_users.role_id')->wherein('roles.name',$raw_role)->get();
        $raw_user = [];
        foreach ($rs_user as $value) {
            array_push($raw_user,$value['name']);
        }
        if (Auth::once([
            'email' => $email, 
            'password' => $password, 
            'name' => $raw_user
        ])) {
            return ["check" => 1,"user" => json_encode($raw_user)];
        }else{
            return ["check" => 0];
        }
    }
}
