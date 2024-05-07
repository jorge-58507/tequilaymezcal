<?php

namespace App\Http\Controllers;

use App\tm_acregister;
use Illuminate\Http\Request;
use App\tm_logincode;
use App\User;
use DateTime;

class acregisterController extends Controller
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
        $type = $request->input('a');
        $code = $request->input('b');

        $qry_logincode = tm_logincode::where('tx_logincode_value', $code);
        if ($qry_logincode->count() === 0) {
            return response()->json(['status' => 'failed', 'message' => 'Tarjeta no registrada.']);
        }
        $rs_logincode = $qry_logincode->first();
        // AL GUARDAR SI LA FECHA Y EL REGISTRO COINCIDEN NO GUARDAR EL REGISTRO
        $check_dup = tm_acregister::where('tx_acregister_type',$type)->where('acregister_ai_logincode_id',$rs_logincode['ai_logincode_id'])->where('created_at','like','%'.date('Y-m-d').'%')->orderby('ai_acregister_id','DESC');
        if ($check_dup->count() > 0) {
            if ($type != 4) { 
                $check_dup->update(['tx_acregister_status' => 0]);
            }else{
                $rs_dup = $check_dup->first();
                if (date('H',strtotime($rs_dup['created_at'])) > 3) { //SI EL REGISTRO LA HORA ES MENOR A LA 3 AM NO DESACTIVAR
                    $check_dup->update(['tx_acregister_status' => 0]);
                }
            }
        }
        $tm_acregister = new tm_acregister;
        $tm_acregister->acregister_ai_logincode_id = $rs_logincode['ai_logincode_id'];
        $tm_acregister->tx_acregister_type = $type;
        $tm_acregister->tx_acregister_status = 1;
        $tm_acregister->save();

        // Answer
        $rs_user = user::where('email',$rs_logincode['tx_logincode_user'])->first();
        return response()->json(['status' => 'success', 'message' => 'Registro guardado.', 'data' => $rs_user]);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($code)
    {
        $qry_logincode = tm_logincode::join('users','users.email','tm_logincodes.tx_logincode_user')->where('tx_logincode_value', $code);
        if ($qry_logincode->count() === 0) {
            return response()->json(['status' => 'failed', 'message' => 'Tarjeta no registrada.']);
        }
        $rs_logincode = $qry_logincode->first();

        $rs = tm_acregister::where('acregister_ai_logincode_id',$rs_logincode['ai_logincode_id'])->limit(50)->orderby('created_at','DESC')->get();
        return response()->json(['status' => 'success', 'message' => '', 'data' => ['register' => $rs, 'info' => $rs_logincode]]);
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
        $qry = tm_acregister::where('ai_acregister_id',$id);
        if ($qry->count() === 0) {
            return response()->json(['status' => 'failed', 'message' => 'No existe.']);
        }

        $qry->update(['tx_acregister_status' => 0]);
        return response()->json(['status' => 'success', 'message' => 'Eliminado correctamente.']);
    }

    public function report($from, $to, $user_id='')
    {
        $c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
        $c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

        if (!empty($user_id)) {
            $rs = tm_acregister::select('tm_acregisters.created_at','users.name','users.id','tm_acregisters.tx_acregister_type')
            ->join('tm_logincodes','tm_logincodes.ai_logincode_id','tm_acregisters.acregister_ai_logincode_id')
            ->join('users','users.email','tm_logincodes.tx_logincode_user')
            ->where('tm_acregisters.created_at','>=',$c_from)->where('tm_acregisters.created_at','<=',$c_to)
            ->where('tm_acregisters.tx_acregister_status',1)->where('users.id',$user_id)
            ->orderby('users.name','ASC')
            ->orderby('tm_acregisters.created_at','ASC')
            ->get();
        }else{
            $rs = tm_acregister::select('tm_acregisters.created_at','users.name','users.id','tm_acregisters.tx_acregister_type')
            ->join('tm_logincodes','tm_logincodes.ai_logincode_id','tm_acregisters.acregister_ai_logincode_id')
            ->join('users','users.email','tm_logincodes.tx_logincode_user')
            ->where('tm_acregisters.created_at','>=',$c_from)->where('tm_acregisters.created_at','<=',$c_to)
            ->where('tm_acregisters.tx_acregister_status',1)
            ->orderby('users.name','ASC')
            ->orderby('tm_acregisters.created_at','ASC')
            ->get();
        }


        $interval_totalday = $this->diff_time($c_from,$c_to);
        $report = [];
        $raw_person = [];
        $raw_date = [];
        $asistance = 0;
        $person_counter = [];
        foreach ($rs as $key => $register) {
            //verificar si estoy en el ultimo elemento ->hacer todo el proceso y agregar
            //sino evaluar si cambia el usuario si cambia el usuario hacer el proceso del raw_date y agregar la informacion al raw_person
            //sino verificar si cambia la fecha -> agregar el date y recavar la nueva informacion

            //Agregar informacion del registro
            if ($key === 0) {
                $raw_date['date'] = date('d-m-Y', strtotime($register['created_at']));
            }
            $raw_date['user_id'] = $register['id'];
            $raw_date['name'] = $register['name'];

            switch ($register['tx_acregister_type']) {
                case 1:
                    $raw_date['in']       = date('H:i:s', strtotime($register['created_at']));
                    break;
                
                case 2:
                    $raw_date['breakin']  = date('H:i:s', strtotime($register['created_at']));
                    break;

                case 3:
                    $raw_date['breakout'] = date('H:i:s', strtotime($register['created_at']));
                    break;

                case 4:
                    $raw_date['out']      = date('H:i:s', strtotime($register['created_at']));
                    break;
            }
            //Verificar Asistencia, tiempototal y tiempoextra
            
            if (!empty($raw_date['in']) && !empty($raw_date['out'])) {
                $raw_date['asistance'] = 'Si';
                $raw_date['counter'] = $asistance++;                
                
                //Tiempo total
                if (date('H', strtotime($raw_date['out'])) < 3) {
                    $interval_totaltime = $this->diff_time(date('d-m-Y H:i:s', strtotime($raw_date['date'].' '.$raw_date['in'])),date('d-m-Y H:i:s', strtotime($raw_date['date'].' '.$raw_date['out']." +1 day")));   
                }else{
                    $interval_totaltime = $this->diff_time($raw_date['in'],$raw_date['out']);   
                }
                $raw_date['totaltime'] = date('H:i:s', strtotime($interval_totaltime->format('%H:%i')));

                //Tiempo extra
                if ($interval_totaltime->h > 9) {
                    $interval_totaltime->h -= 9;
                    $raw_date['extratime'] = date('H:i:s', strtotime($interval_totaltime->format('%H:%i')));
                }else{
                    if ($interval_totaltime->h === 9 && $interval_totaltime->i > 0) {
                        $interval_totaltime->h -= 9;
                        $raw_date['extratime'] = date('H:i:s', strtotime($interval_totaltime->format('%H:%i')));
                    }
                }
            }else{
                $raw_date['asistance'] = 'No';
                $raw_date['counter'] = $asistance;
            }
            //Verificar tiempo de almuerzo
            if (!empty($raw_date['breakin']) && !empty($raw_date['breakout'])) {  
                $interval_breaktime = $this->diff_time($raw_date['breakin'], $raw_date['breakout']);
                $raw_date['breaktime'] = date('H:i:s', strtotime($interval_breaktime->format('%H:%i')));
            }

            if ($key === count($rs)-1) { //ESTOY EN EL ULTIMO ELEMENTO
                if ($register['tx_acregister_type'] === 4 && date('H', strtotime($rs[$key]['created_at'])*1) < 3) {
                    if (date('d-m-Y', strtotime($register['created_at'])) === date('d-m-Y', strtotime($rs[$key]['created_at']." +1 day"))) {
                        $raw_date['out']      = date('H:i:s', strtotime($register['created_at']));
                        if (!empty($raw_date['in']) && !empty($raw_date['out'])) {
                            $raw_date['asistance'] = 'Si';
                            $raw_date['counter'] = $asistance++;                
                        }
                    }                              
                }
                $raw_person[$register['id']][] = $raw_date;
                $report[] = $raw_person;
                $interval_totalday->d -= $raw_date['counter']-1;
                $person_counter[] = ['id' => $raw_date['user_id'], 'name' => $raw_date['name'], 'counter' => $raw_date['counter'], 'inasistance' => $interval_totalday->format('%d')];
            }else{
                //Verifica si el usuario cambia el proximo ciclo
                if ($register['id'] != $rs[$key+1]['id']) { // -El usuario cambiará
                    if ($register['tx_acregister_type'] === 4 && (date('H', strtotime($register['created_at']))*1) < 3) {
                        if (date('d-m-Y', strtotime($register['created_at'])) === date('d-m-Y', strtotime($raw_date['date']." +1 day"))) {
                            $raw_date['out']      = date('H:i:s', strtotime($register['created_at']));
                            if (!empty($raw_date['in']) && !empty($raw_date['out'])) {
                                $raw_date['asistance'] = 'Si';
                                $raw_date['counter'] = $asistance++;                
                            }
                        }
                    }

                    $raw_person[$register['id']][] = $raw_date;
                    $report[] = $raw_person;
                    $interval_totalday->d -= $raw_date['counter']-1;
                    $person_counter[] = ['id' => $raw_date['user_id'],  'name' => $raw_date['name'], 'counter' => $raw_date['counter'], 'inasistance' => $interval_totalday->format('%d')];

                    $raw_date = [];
                    $raw_person = [];
                    $asistance = 1;
                    $interval_totalday = $this->diff_time($c_from,$c_to);

                    $raw_date['date'] = date('d-m-Y', strtotime($rs[$key+1]['created_at']));
                }else{
                    //Verifica si la fecha cambiara
                    if (!empty($raw_date['date'])) { 
                        if ($raw_date['date'] != date('d-m-Y', strtotime($rs[$key+1]['created_at']))) { //Cambiara la fecha
                            if (date('d-m-Y', strtotime($rs[$key+1]['created_at'])) === date('d-m-Y', strtotime($raw_date['date']." +1 day"))) {
                                if ($rs[$key+1]['tx_acregister_type'] === 4 && (date('H', strtotime($rs[$key+1]['created_at']))*1) < 3) {
                                    $raw_date['out']      = date('H:i:s', strtotime($rs[$key+1]['created_at']));
                                    if (!empty($raw_date['in']) && !empty($raw_date['out'])) {
                                        $raw_date['asistance'] = 'Si';
                                        $raw_date['counter'] = $asistance++;                
                                    }
                                }else{
                                    $raw_person[$register['id']][] = $raw_date;
                                    $raw_date = [];
                                    $raw_date['date'] = date('d-m-Y', strtotime($rs[$key+1]['created_at']));
                                }
                            }else{
                                $raw_person[$register['id']][] = $raw_date;
                                $raw_date = [];
                                $raw_date['date'] = date('d-m-Y', strtotime($rs[$key+1]['created_at']));
                            }
                        }
                    }
                }
            }
        }
        /*
            [JUANA => 
                [
                    FECHA   => 01/01/24,
                    IN      => 8:30
                    OUT     => 5:30
                ],
                [
                    FECHA   => 02/01/24,
                    IN      => 8:30
                    OUT     => 5:30
                ]            
            ]
        
        */

        $rs_user = tm_acregister::select('users.name','users.id')
        ->join('tm_logincodes','tm_logincodes.ai_logincode_id','tm_acregisters.acregister_ai_logincode_id')
        ->join('users','users.email','tm_logincodes.tx_logincode_user')
        ->where('tm_acregisters.created_at','>=',$c_from)->where('tm_acregisters.created_at','<=',$c_to)
        ->orderby('users.name','ASC')
        ->orderby('tm_acregisters.created_at','ASC')
        ->groupby('users.id')
        ->get();

        $interval_totalday = $this->diff_time($c_from,$c_to);

        return [ 'list' => $rs, 'report' => $report, 'counter_list' => $person_counter, 'user_list' => $rs_user, 'total_day' => $interval_totalday->format('%d')+1];
    }

    public function filter(Request $request){
        $data = $this->report($request->input('a'),$request->input('b'),$request->input('c'));

        return response()->json(['status'=>'success','data'=>$data]);
    }

    public function diff_time($init,$end){
        $horaInicio = new DateTime($init);
        $horaTermino = new DateTime($end);
        $interval = $horaInicio->diff($horaTermino);

        return $interval;
    }
}