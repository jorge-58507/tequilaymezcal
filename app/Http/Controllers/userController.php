<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\user;
use App\role;
use App\role_user;

use Illuminate\Database\Eloquent\Builder;


class userController extends Controller
{
    public function getAll(){
        $rs = user::orderby('name')->get();
        return [
            'all' => $rs,
            'active' => user::where('status',1)->orderby('name')->get(),
            'inactive' => user::where('status',0)->orderby('name')->get()
        ];
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs_user = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs_user['all']] ]);
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
        if ( auth()->user()->hasAnyRole(['admin']) != true){ 
            return response()->json(['status'=>'failed', 'message' => 'No puede crear usuarios.']);
        }

        $name = $request->input('a');
        $email = $request->input('b');
        $pass = $request->input('c');
        $role_id = $request->input('d');

        if(user::where('email',$email)->count() > 0){
            return response()->json(['status'=>'failed', 'message' => 'El E-mail ya existe.']);
        }

        $role = role::where('id',$role_id)->first();

        $user = new User();
        $user->name = ucfirst($name);
        $user->email = $email;
        $user->password = bcrypt($pass);
        $user->save();
        $user->roles()->attach($role);

        $rs = $this->getAll();
        return response()->json(['status'=>'success', 'message' => 'Usuario creado satisfactoriamente.', 'data' => ['all' => $rs['all']]]);
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
        $qry = user::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }
        $name = $request->input('a');
        $email = $request->input('b');
        $status = $request->input('c');

        if (empty($name) || empty($email)) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar la información.']); 
        }
        // CHECK DUP NAME
        if (user::where('email',$email)->where('id','!=',$id)->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'El correo ya existe.']); 
        }

        $qry->update(['name' => ucfirst($name), 'email' => $email, 'status' => $status]);

        // ANSWER
        $rs = $this->getAll();
        return response()->json(['status'=>'success','message'=>'Usuario Modificado.','data' => ['all' => $rs['all'] ]]); 
    }

    public function upd_password(Request $request, $id)
    {
        $qry = user::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }
        $pass = $request->input('a');

        if (empty($pass)) {
            return response()->json(['status'=>'failed','message'=>'Debe ingresar la información.']); 
        }

        $qry->update(['password' => bcrypt($pass)]);

        // ANSWER
        return response()->json(['status'=>'success','message'=>'Contrase&ntilde;a Cambiada.']); 
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $qry = user::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }

        $qry->update(['status' => 0]);
        $message = "Usuario Desactivado";


        // ANSWER
        return response()->json(['status'=>'success','message'=>$message]); 
    }

    public function add_role(Request $request, $id)
    {
        $role_id = $request->input('a');

        $qry = user::where('id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }

        if (role_user::where('user_id',$id)->where('role_id',$role_id)->count() > 0) {
            return response()->json(['status'=>'failed','message'=>'Rol ya existe.']); 
        }

        $role_user = new role_user;
        $role_user -> user_id = $id;
        $role_user -> role_id = $role_id;
        $role_user->save();

        // ANSWER
        $rs_user = $qry->first();
        $role_list = user::join('role_users','role_users.user_id','users.id')->join('roles','roles.id','role_users.role_id')->where('users.id',$id)->get();

        return response()->json(['status'=>'success','data'=>['info'=>['data' => $rs_user, 'role' => $role_list]]]);
    }

    public function delete_role(Request $request, $id)
    {
        $role_id = $request->input('a');

        $qry = role_user::where('user_id',$id)->where('role_id',$role_id);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']); 
        }
        if (role_user::where('user_id',$id)->count() === 1) {
            return response()->json(['status'=>'failed','message'=>'No se puede eliminar el ultimo rol.']); 
        }

        $qry->delete();
        
        // ANSWER
        $rs_user = $qry->first();
        $role_list = user::join('role_users','role_users.user_id','users.id')->join('roles','roles.id','role_users.role_id')->where('users.id',$id)->get();

        return response()->json(['status'=>'success','data'=>['info'=>['data' => $rs_user, 'role' => $role_list]]]);
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
