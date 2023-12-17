<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\user;
use App\role;
use App\role_user;
use App\tm_logincode;

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

        $check_logincode = tm_logincode::where('tx_logincode_value',$request->input('e'))->count();
        if ($check_logincode > 0) {
            return response()->json(['status'=>'failed', 'message' => 'El codigo de acceso ingresado ya existe.']);
        }

        $role = role::where('id',$role_id)->first();

        $user = new User();
        $user->name = ucfirst($name);
        $user->email = $email;
        $user->password = bcrypt($pass);
        $user->save();
        $user->roles()->attach($role);

        $tm_logincode = new tm_logincode;
        $tm_logincode->tx_logincode_value       =   $request->input('e');
        $tm_logincode->tx_logincode_user        =   $email;
        $tm_logincode->tx_logincode_password    =   $this->clutterIn($pass);
        $tm_logincode->save();

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
        $qry_logincode = tm_logincode::where('tx_logincode_user',$rs_user['email'])->where('tx_logincode_status',1);
        if ($qry_logincode->count() > 0) {
            $rs_logincode = $qry_logincode->first();
            $rs_user['logincode'] = $rs_logincode['tx_logincode_value'];
        }

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
        // CHECK DUP EMAIL
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
            return response()->json(['status'=>'failed','message'=>'Debe ingresar alguna contraseña.']); 
        }

        if (!empty($request->input('b'))) {
            $rs = $qry->first();
            if (tm_logincode::where('tx_logincode_value',$request->input('b'))->where('tx_logincode_status',1)->count() > 0) {
                return response()->json(['status'=>'failed', 'message' => 'El codigo de acceso ingresado ya existe.']);
            }
            tm_logincode::where('tx_logincode_user',$rs['email'])->update(['tx_logincode_status'=>0]);

            $tm_logincode = new tm_logincode;
            $tm_logincode->tx_logincode_value       =   $request->input('b');
            $tm_logincode->tx_logincode_user        =   $rs['email'];
            $tm_logincode->tx_logincode_password    =   $this->clutterIn($pass);
            $tm_logincode->save();
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

    public function check_logincode($code){
        $rs = tm_logincode::where('tx_logincode_value',$code)->where('tx_logincode_status',1);
        if ($rs->count() === 0) {
            return response()->json(['status'=> 'failed', 'message'=>'Código Erroneo.'], 300);
        }else{
            $rs = $rs->first();
            return response()->json(['status'=> 'success', 'message'=>'', 'data' => ['email'=>$rs['tx_logincode_user'], 'password'=>$this->clutterOut($rs['tx_logincode_password'])] ], 200);
        }
    }

    public function plusOne($group){
        $keya = "96851493";
        $raw_keya = str_split($keya);
        $str = '';
        $raw = str_split($group);
        foreach ($raw as $a => $array) {
        $plus = $array+$raw_keya[$a];
        if ($plus > 9) {
            $str .= $plus-10;
        }else{
            $str .= $plus;
        }
        }
        return $str;
    }
    public function minorOne($group){
        $keya = "96851493";
        $raw_keya = str_split($keya);
        $str = '';
        $raw = str_split($group);
        foreach ($raw as $a => $array) {
        $plus = $array-$raw_keya[$a];
        if ($plus < 0) {
            $str .= $plus+10;
        }else{
            $str .= $plus;
        }
        }
        return $str;
    }
    public function clutterIn($str){
        //  abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ
        $raw_hx = [1 => "31", 2 => "32", 3 => "33", 4 => "34", 5 => "35", 6 => "36", 7 => "37", 8 => "38", 9 => "39", 0 => "30", "-" => "2d",
        "a" => "10", "b" => "14", "c" => "18", "d" => "22", "e" => "26", "f" => "80", "g" => "84", "h" => "88", "i" => "42", "j" => "46", "k" => "50", "l" => "54", "m" => "58", "n" => "62", "." => "66", "o" => "70", 
        "p" => "72", "q" => "68", "r" => "64", "s" => "60", "t" => "56", "u" => "52", "v" => "48", "w" => "44", "x" => "40", "y" => "86", "z" => "82", "*" => "28", "!" => "24", "#" => "20", "%" => "16", "/" => "12", "_" => "90",
        "A" => "11", "B" => "15", "C" => "19", "D" => "23", "E" => "27", "F" => "81", "G" => "85", "H" => "89", "I" => "43", "J" => "47", "K" => "51", "L" => "55", "M" => "59", "N" => "63", ":" => "67", "O" => "71",
        "P" => "73", "Q" => "69", "R" => "65", "S" => "61", "T" => "57", "U" => "53", "V" => "49", "W" => "45", "X" => "41", "Y" => "87", "Z" => "83", "(" => "29", ")" => "25", "{" => "21", "?" => "17", "}" => "13"];
        $raw_bin = [1 => "00110001", 2 => "00110010", 3 => "00110011", 4 => "00110100", 5 => "00110101", 6 => "00110110", 7 => "00110111", 8 => "00111000", 9 => "00111001", 0 => "00110000", "d" => "01100100"];
        $keya = 968574932153;
        $keys = 156987536921;
        $keyd = 684795369751;
        $str =  str_replace([" ","á","é","í","ó","ú","ñ","Á","É","Í","Ó","Ú","Ñ"], ["_","*","!","#","%","/",".","(",")","{","?","}".":"],$str);  
        $raw_str = str_split($str);
        $hx_str = '';
        foreach ($raw_str as $a => $array) {
            $hx_str .= $raw_hx[$array];
        }
        $raw_hx = str_split($hx_str);
        $group = [];
        foreach ($raw_hx as $b => $array) {
            $str = str_replace("0","5",$raw_bin[$array]);
            $str = str_replace("1","3",$str);
            $group[] = $str;
        }

        $str_par = '';
        $str_impar = '';
        foreach ($group as $c => $array) {
            if ($c % 2 == 1) {
            $str_impar .= $this->plusOne($array);
            }else{
            $str_par .= $this->minorOne($array);
            }
        }
        $str = $str_par.$str_impar;
        $str = strlen($str_par).",".$str;
        return $str;
    }
    public function clutterOut($str){
        $raw_hx = ["31" => 1, "32" => 2, "33"  => 3, "34"  => 4, "35" => 5, "36" => 6, "37" => 7, "38" => 8, "39" => 9, "30" => 0, "2d" => "-",
        "10" => "a", "14" => "b", "18" => "c", "22" => "d", "26" => "e", "80" => "f", "84" => "g", "88" => "h", "42" => "i", "46" => "j", "50" => "k", "54" => "l", "58" => "m", "62" => "n", "66" => "ñ", "70" => "o",
        "72" => "p", "68" => "q", "64" => "r", "60" => "s", "56" => "t", "52" => "u", "48" => "v", "44" => "w", "40" => "x", "86" => "y", "82" => "z", "28" => "á", "24" => "é", "20" => "í", "16" => "ó", "12" => "ú", "90" => " ",
        "11" => "A", "15" => "B", "19" => "C", "23" => "D", "27" => "E", "81" => "F", "85" => "G", "89" => "H", "43" => "I", "47" => "J", "51" => "K", "55" => "L", "59" => "M", "63" => "N", "67" => "Ñ", "71" => "O",
        "73" => "P", "69" => "Q", "65" => "R", "61" => "S", "57" => "T", "53" => "U", "49" => "V", "45" => "W", "41" => "X", "87" => "Y", "83" => "Z", "29" => "Á", "25" => "É", "21" => "Í", "17" => "Ó", "13" => "Ú"];
        $raw_bin2hx = ["00110001" => 1, "00110010" =>  2 , "00110011" => 3, "00110100" => 4,"00110101" => 5, "00110110" => 6, "00110111" => 7, "00111000" => 8, "00111001" => 9, "00110000" => 0, "01100100" => "d"];
        $keya = 96851493;
        $keys = 15698751;
        $keyd = 68479536;

        $raw_str = explode(",",$str);
        $str_divided = $raw_str[1];
        $str = $str_divided;
        $str_par = substr($str,0,$raw_str[0]);
        $str_impar = substr($str,$raw_str[0]);
        $length = strlen($str_impar);
                // REORDENAR IMPAR Y PAR
        $group = [];
        for ($a=0; $a < $length;) {
            $x = $a;
            $a += 8;
            $subs = substr($str_par,$x,8);
            $subs = $this->plusOne($subs);
            $subs = str_replace("3","1",$subs);
            $group[] = str_replace("5","0",$subs);

            $subs = substr($str_impar,$x,8);
            $subs = $this->minorOne($subs);
            $subs = str_replace("3","1",$subs);
            $group[] = str_replace("5","0",$subs);
        }
        $new_group = [];
        for ($b=0; $b < count($group);) { 
            $str_a = $raw_bin2hx[$group[$b]];
            $b += 1;
            $str_b = $raw_bin2hx[$group[$b]];
            $b++;
            $str_hx = $str_a.$str_b;
            $new_group[] = $str_hx;
        }
        $answer = '';
        foreach ($new_group as $c => $array) {
            $answer .= $raw_hx[$array];
        }
        return $answer;
    }


    public function test_clutterin($str){
        echo $str_in = $this->clutterIn($str);
        echo "<br/>";

        echo $this->clutterOut($str_in);
    }

}
