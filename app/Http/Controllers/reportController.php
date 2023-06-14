<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class reportController extends Controller
{
    public function show(Request $request){
        
        $from = $request->input('a');
        $to = $request->input('b');
        $type = $request->input('c');
        
        switch ($type) {
            case '0':
                $productinputController = new productinputController;
                $rs_productinput = $productinputController->report($from,$to);
                return response()->json([ 'status'=>'success','message'=>'','data'=>[ 'productinput' => $rs_productinput['list'] ] ]);
                break;
            case '1':
                $chargeController = new chargeController;
                $rs_charge = $chargeController->report($from,$to);
                $creditnoteController = new creditnoteController;
                $rs_creditnote = $creditnoteController->report($from,$to);
                return response()->json(['status'=>'success','message'=>'','data'=>[ 'charge' => $rs_charge['list'], 'chargepayment' => $rs_charge['paymentmethod'], 'creditnote' => $rs_creditnote['list']]]);
                break;
            case '2':
                $productinputController = new productinputController;
                $rs_productinput = $productinputController->report($from,$to);
                return response()->json([ 'status'=>'success','message'=>'','data'=>[ 'productinput' => $rs_productinput['list'] ] ]);
                break;
            case '3':
                $chargeController = new chargeController;
                $rs_charge = $chargeController->report($from,$to);
                $creditnoteController = new creditnoteController;
                $rs_creditnote = $creditnoteController->report($from,$to);
                return response()->json(['status'=>'success','message'=>'','data'=>[ 'charge' => $rs_charge['list'], 'chargepayment' => $rs_charge['paymentmethod'], 'creditnote' => $rs_creditnote['list']]]);
                break;
            case '4':
                $creditnoteController = new creditnoteController;
                $rs_creditnote = $creditnoteController->report($from,$to);
                return response()->json(['status'=>'success','message'=>'','data'=>[ 'creditnote' => $rs_creditnote['list']]]);
                break;
            case '5':
                $productinputController = new productinputController;
                $rs_productinput = $productinputController->report_by_provider($from,$to);
                return response()->json([ 'status'=>'success','message'=>'','data'=>[ 'productinput' => $rs_productinput['list'] ] ]);
                break;
            
            default:

                break;
        }
    }
}