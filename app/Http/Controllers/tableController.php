<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_table;
use App\tm_ubication;
use App\tm_request;

use Illuminate\Support\Facades\Validator;

class tableController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rs = $this->getAll();

        return response()->json(['status'=>'success','data'=>['list'=>$rs['list'],'bar'=>$rs['bar'], 'table'=>$rs['table']]]);
    }
    
    public function getAll(){
        $rs_bar = tm_table::where('tx_table_type',1)->get();
        $rs_table = tm_table::where('tx_table_type',2)->get();
        $rs = tm_table::get();
        
        return ['list'=>$rs, 'bar'=>$rs_bar, 'table'=>$rs_table];
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
        $description = trim($request->input('tableValue'));
        $code = trim($request->input('tableCode'));
        $type = $request->input('tableType');
        $ubication_id = $request->input('tableUbication');

        $check_code = tm_table::where('tx_table_code',$code)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'El c&oacute;digo ya existe.']);
        }
        if ($request->hasFile('tableImage')) {
            $validator = Validator::make($request->all(),['tableImage' => 'mimes:jpg,png,jpeg,gif,svg|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000']);
            if ($validator->fails()) {  return response()->json(['status'=>'fail', 'message'=>'La imagen no tiene el formato adecuado.']); }
            $avatar = $request->file('tableImage');
            $filename = time().$avatar->getClientOriginalName();      
            $avatar->move(public_path().'/attached/image/table/',$filename);
        }else{
            $filename = '';
        }
            // return response()->json(['status'=>'failed','message'=>'nombre: '.$filename]);

        $tm_table = new tm_table;
        $tm_table->table_ai_ubication_id = $ubication_id;
        $tm_table->tx_table_value = $description;
        $tm_table->tx_table_code = $code;
        $tm_table->tx_table_type = $type;
        $tm_table->tx_table_image = $filename;
        $tm_table->tx_table_slug = time().$description;
        $tm_table->save();


        //ANSWER
        $rs_ubication = tm_ubication::where('ai_ubication_id',$ubication_id)->first();
        $rs_table = tm_table::where('table_ai_ubication_id',$ubication_id)->get();

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
    public function renovate(Request $request)
    {
        $tm_table = new tm_table;
        $value = $request->input('tableValue');
        $code = $request->input('tableCode');
        $status = ($request->input('tableStatus') === 'on') ? 1 : 0;
        $id = $request->input('tableId');
        $imagePlaceholder = $request->input('tableImagePlaceholder');

        $check_code = tm_table::where('tx_table_code',$code)->where('ai_table_id','!=',$id)->count();
        if ($check_code > 0) {
            return response()->json(['status'=>'failed','message'=>'El c&oacute;digo ya existe.']);
        }

        if ($request->hasFile('tableImage')) {
            $validator = Validator::make($request->all(),['tableImage' => 'mimes:jpg,png,jpeg,gif,svg|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000']);
            if ($validator->fails()) {  return response()->json(['status'=>'fail', 'message'=>'La imagen no tiene el formato adecuado.']); }
            $avatar = $request->file('tableImage');
            $filename = time().$avatar->getClientOriginalName();      
            $avatar->move(public_path().'/attached/image/table/',$filename);
        }else{
            $filename = ($imagePlaceholder === "null" || $imagePlaceholder === null) ? '' : $imagePlaceholder;
        }

        $qry_table = $tm_table->where('ai_table_id',$id);
        if ($qry_table->count() < 1) {
            return response()->json(['status'=>'failed','message'=>'Verifique la información ingresada.']);
        }else{
            $qry_table->update([
                'tx_table_value' => $value,
                'tx_table_code' => $code,
                'tx_table_active' => $status,
                'tx_table_image' => $filename
            ]);
        }

        // ANSWER
        $table = $qry_table->first();
        $rs_ubication = tm_ubication::where('ai_ubication_id',$table['table_ai_ubication_id'])->first();
        $rs_table = tm_table::where('table_ai_ubication_id',$table['table_ai_ubication_id'])->get();

        return response()->json(['status'=>'success','message'=>'Guardado correctamente.', 'data'=>['ubication'=>$rs_ubication, 'table'=>$rs_table]]);
    }

    public function update(Request $request, $id)
    {
        $tm_table = new tm_table;

        return response()->json(['status'=>'failed','message'=>'AQUI VA '.$request->input('tableCode')]);
        $value = $request->input('tableValue');
        $code = $request->input('tableCode');
        $status = $request->input('tableStatus');

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


// AQUI VA PUT /table_upd/15 HTTP/1.1Accept:           */*Accept-Encoding:  gzip, deflate, brAccept-Language:  es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3Connection:       keep-aliveContent-Length:   714
// Content-Type:     multipart/form-data; boundary=---------------------------40914312791458788567469070773Cookie:           
//     XSRF-TOKEN=eyJpdiI6IklhZkJidWI5S0NIdVBuYU54UmNkVVE9PSIsInZhbHVlIjoiWHRXbUpkMytOUmR3T2syZ21RUHJrTDliNUlsRnk1K05wRWJHV0JMNUJLKzVpWGFkQU5hcGtRY2M2ZzFqMTBrWTVTd1lmS1lZWDJGbTBlM3plNEo3T1FNeEd2WjdZeVBzXC9rRnVRTWZYOTNqRDNPVk9rc1RkSnBpdHhEWFFVd25pIiwibWFjIjoiNjBiZWM5MjlkMjg0YmE4NzRhN2IyNzEwNzQxMGFjM2UwODhiNTU4M2I4ODNjNDAwZWNlMDdhODQyNWE5OWQ1MCJ9;
//      laravel_session=eyJpdiI6IkxvNGcxZGYyWCs3eGRcL2xzU05EUXd3PT0iLCJ2YWx1ZSI6IlFldFVUR3daSUkwUmZrZlIxQWNHUGJUZ2I5bWxhXC9vaXpFaEtucnZKRVUwR09NVk5oanVzaWRNVWxVSnNuZUU2VFljMVNqUU9sdFY1OEdUcjN4RUZqdHFEQU5qUkQ3UmVkWk5hRjhMVmpRb3hEQXM2SlRXTE1mc0Z3b1pzdGpcL1MiLCJtYWMiOiJjN2FjMDNjZmRjZDVkYjVjMTg0OTkxNGU1MjZiZDBiN2ExM2UwN2E1YTQyZThjYjI3NDQyNmEyYzI2ZWJlOTdmIn0%3D;
//       0mmX9H6elMqzrhPBkKYXHi9bgzdmWqqPRJ28HJOi=eyJpdiI6Ik5zcndaUVdTQlwvOUlmSUUxVTRubENRPT0iLCJ2YWx1ZSI6Iis1SjhqV1wvYTNuVEIwY083aWlkejZURktYODhTaUtrNHRpK0pmNVp0RnJBaXQrNEN1VTBxQytadVdiZitETU5iU2QrSExXUDVBaXUxWDlSWDd4M0pzdG9DVCt0UlFMZjRjUFdQWlByVTNFMWNyTTNIRFwvTko1aWNDdnpCclE0VWY1TU9DKzBURVV3bW1nT3hSYlhFYVI4am1JTGd6MEtyeHJSSVNqU3MyUTJ1TTRRS0ZsUFZwN2NuRTIwNWkyeHp3RUxFZk9UQkhBSTBxRENzSlV3K0ZcL2ZpdzZHdUI3SzFValVvNnA4SzZETmhad2k0VXdPOStJbmtVanBGcDFxNVlzelZZYTA1cnJ1T3NKQWlxQ2NUWDlvaWF4VmltMVNcL096SGlWZlM4N09YSGFPWFh6VUpyVFZlaDNteUhSZjQzR3NcL3ZaT2pkTzB1ZE5EbWVXdDV0M0F6bE1yUmFqMmNQOFR6cFJEOW9UVzFlT2dHOVQ5MEtEVnZKbzhGSXdqcVhNMW5ZZmptVHFHSGJsa1JZUHJrd2EyUDFIMmhwcStobjdJZlR4dkx3YUhEXC9KK0VMWXBZanpKOGVUQm93Zk1aSmYzaDRcL2s2b1d1a3NnaForK0NSR2F3cVBidWNOMHNNYzN1N1ZVOU14ZjF5aVVjUnQ2SVVzWUtSUVBXZGpXU1RNbiIsIm1hYyI6Ijg0NjNmZmZiODFhMWEyMmZkNTk0MTQ0NjllZjI3NjhkY2Y1OTZmOTQ2ODNkYjBmMjIwZjYzNWVkZjgzZGE0NmQifQ%3D%3D
//       Host:             localhost:8000
//       Origin:           http://localhost:8000
//       Referer:          http://localhost:8000/configuration
//       Sec-Fetch-Dest:   empty
//       Sec-Fetch-Mode:   cors
//       Sec-Fetch-Site:   same-origin
//       Sec-Gpc:          1
//       User-Agent:       Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0X-Csrf-Token:     9kFVyxXn0bL3t6uouL2AKxqNE1jZ6ax8M1X3vPyOX-
//       Requested-With: XMLHttpRequestCookie: XSRF-TOKEN=9kFVyxXn0bL3t6uouL2AKxqNE1jZ6ax8M1X3vPyO; 
//       laravel_session=0mmX9H6elMqzrhPBkKYXHi9bgzdmWqqPRJ28HJOi; 
//       0mmX9H6elMqzrhPBkKYXHi9bgzdmWqqPRJ28HJOi={"data":"a:4:{s:6:\"_token\";s:40:\"9kFVyxXn0bL3t6uouL2AKxqNE1jZ6ax8M1X3vPyO\";s:9:\"_previous\";a:1:{s:3:\"url\";s:58:\"http:\/\/localhost:8000\/table\/1679453568Ciudad%20de%20Mexico\";}s:6:\"_flash\";a:2:{s:3:\"old\";a:0:{}s:3:\"new\";a:0:{}}s:50:\"login_web_59ba36addc2b2f9401580f014c7f58ea4e30989d\";i:1;}","expires":1679544344}-----------------------------
//       40914312791458788567469070773Content-Disposition: form-data; name="tableValue"Ciudad de Mexico-----------------------------
//       40914312791458788567469070773Content-Disposition: form-data; name="tableId"15-----------------------------
//       40914312791458788567469070773Content-Disposition: form-data; name="tableCode"0010011-----------------------------
//       40914312791458788567469070773Content-Disposition: form-data; name="tableStatus"on-----------------------------
//       40914312791458788567469070773Content-Disposition: form-data; name="tableImage"; filename=""Content-Type: application/octet-stream-----------------------------40914312791458788567469070773--



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
