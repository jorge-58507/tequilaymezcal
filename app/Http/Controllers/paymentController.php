<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_payment;

class paymentController extends Controller
{
    public function save($raw_payment,$charge_id,$user_id){
        foreach ($raw_payment as $key => $payment) {
            $tm_payment = new tm_payment;
            $tm_payment->payment_ai_charge_id = $charge_id;
            $tm_payment->payment_ai_user_id = $user_id;
            $tm_payment->payment_ai_paymentmethod_id = $payment['method_id'];
            $tm_payment->tx_payment_amount = $payment['amount'];
            $tm_payment->tx_payment_number = $payment['number'];
            $tm_payment->save();
        }
    }

    public function save_giftcard($raw_giftcard,$charge_id,$user_id){
        foreach ($raw_giftcard as $key => $payment) {
            $tm_payment = new tm_payment;
            $tm_payment->payment_ai_charge_id = $charge_id;
            $tm_payment->payment_ai_user_id = $user_id;
            $tm_payment->payment_ai_paymentmethod_id = 8;
            $tm_payment->tx_payment_amount = $payment['amount'];
            $tm_payment->tx_payment_number = $payment['giftcard_number'];
            $tm_payment->save();
        }
    }

}





