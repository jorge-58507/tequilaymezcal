<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_client;
use App\tm_request;
use App\tm_giftcard;

class clientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs = $this->getAll();
        return response()->json(['status'=>'success','data'=>['all'=>$rs]]);
    }
    public function getAll(){
        $rs = tm_client::get();
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
        $tm_client->tx_client_birthday = date('Y-m-d', strtotime($request->input('j')));
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
            $rs = $qry->first();
            $giftcardController = new giftcardController;
            $rs_giftcard = $giftcardController->get_all_by_client($rs['ai_client_id']);

            return response()->json(['status'=>'success','message'=>'','data'=>['client'=>$rs, 'giftcard'=>$rs_giftcard]]);
        }else{
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }
    }
    public function show_client($id)
    {
        $qry = tm_client::where('ai_client_id', $id);
        if ($qry->count() > 0) {
            $rs = $qry->first();
            $giftcardController = new giftcardController;
            $rs_giftcard = $giftcardController->get_all_by_client($rs['ai_client_id']);

            return ['status' => 'success', 'message' => '', 'data' => ['client' => $rs, 'giftcard' => $rs_giftcard]];
        } else {
            return ['status' => 'failed', 'message' => 'No existe.'];
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
            'tx_client_birthday' => date('Y-m-d', strtotime($request->input('j'))),
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
    public function destroy($client_slug)
    {
        $qry = tm_client::where("tx_client_slug",$client_slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }

        $rs = $qry->first();
        if ($rs['ai_client_id'] === 1) {
            return response()->json(['status'=>'failed','message'=>'No se puede eliminar.']);
        }
        $check_request = tm_request::where('request_ai_client_id',$rs['ai_client_id'])->count();
        $check_giftcard = tm_giftcard::where('giftcard_ai_client_id',$rs['ai_client_id'])->count();
        if ($check_request === 0 && $check_giftcard === 0) {
            $qry->delete();
            $rs_clientlist = $this->getAll();
            return response()->json(['status'=>'success','message'=>'Cliente Eliminado.','data'=>['client_list'=>$rs_clientlist]]);
        }else{
            $qry->update(['tx_client_status'=>0]);
            $rs_clientlist = $this->getAll();
            return response()->json(['status'=>'success','message'=>'Se desactivó el cliente.','data'=>['client_list'=>$rs_clientlist]]);
        }
    }

    public function show_purchaselist($client_slug)
    {
        $qry = tm_client::where("tx_client_slug",$client_slug);
        if ($qry->count() === 0) {
            return response()->json(['status'=>'failed','message'=>'No existe.']);
        }

        $rs = $qry->first();
        $rs_request = tm_request::select('tm_charges.tx_charge_total','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.commanddata_ai_article_id','tm_commanddatas.tx_commanddata_price','tm_commanddatas.tx_commanddata_description')->join('tm_commands','tm_commands.command_ai_request_id','tm_requests.ai_request_id')
        ->join('tm_commanddatas','tm_commanddatas.commanddata_ai_command_id','tm_commands.ai_command_id')
        ->join('tm_charges','tm_charges.ai_charge_id','tm_requests.request_ai_charge_id')
        ->where('tm_requests.request_ai_client_id',$rs['ai_client_id'])->where('tm_commanddatas.tx_commanddata_status',1)->get();

        return response()->json(['status'=>'success','message'=>'','data'=>['purchaselist'=>$rs_request]]);
    }

    public function fe_checkruc($client_id=2)
    {
        $rs_client = tm_client::where('ai_client_id', $client_id)->first();

        if ($rs_client['tx_client_type'] === '02') {
            return ['status' => 'success','resultado' => 'success', 'mensaje' => 'Cliente no es Contribuyente'];
        }else{
            $optionController = new optionController;
            $rs_option = $optionController->getOption();

            
            $location = 'https://emision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
            // $t_company = $rs_option['FE_USER'].'aa';
            // $t_pass = $rs_option['FE_PASSWORD'];
            $t_company = 'zblvgogrmgjv_tfhka';
            $t_pass = 'n*M,EcB2O_gg';


            $request = "
                <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:ser=\"http://schemas.datacontract.org/2004/07/Services.ApiRest\">
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:ConsultarRucDV>
                        <!--Optional:-->
                        <tem:consultarRucDVRequest>
                            <!--Optional:-->
                            <ser:tokenEmpresa>" . $t_company . "</ser:tokenEmpresa>
                            <!--Optional:-->
                            <ser:tokenPassword>" . $t_pass . "</ser:tokenPassword>
                            <!--Optional:-->
                            <ser:tipoRuc>" . $rs_client['tx_client_taxpayer'] . "</ser:tipoRuc>
                            <!--Optional:-->
                            <ser:ruc>" . $rs_client['tx_client_cif'] . "</ser:ruc>
                        </tem:consultarRucDVRequest>
                    </tem:ConsultarRucDV>
                </soapenv:Body>
                </soapenv:Envelope>
            ";


            $action = "ConsultarRucDV";
            $header = [
                'Method: POST',
                'Connection: Keep-Alive',
                'User-Agent: PHP-SOAP-CURL',
                'Content-Type: text/xml;charset=UTF-8',
                'SOAPAction: "http://tempuri.org/IService/ConsultarRucDV"'
            ];

            $ch = curl_init($location);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
            curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

            $response = curl_exec($ch);
            $err_status = curl_errno($ch);

            $xml = simplexml_load_string(str_replace(["s:", "a:", "i:"], "", $response));
            $xml = json_decode(json_encode($xml), true);
            $responseFE = $xml['Body']['ConsultarRucDVResponse']['ConsultarRucDVResult'];
         
            return $responseFE;
         
            // if ($responseFE['resultado'] === 'error') {
            //     return response()->json(['status' => 'failed', 'message' => $responseFE['mensaje']]);
            // } else {
            //     return response()->json(['status' => 'success', 'data' => $responseFE]);
            // }
        }
    }

}
