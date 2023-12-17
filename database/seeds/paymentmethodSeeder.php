<?php

use Illuminate\Database\Seeder;
use App\tm_paymentmethod;

class paymentmethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Efectivo';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Cheque';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Tarjeta de Crédito';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Tarjeta Clave';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Yappy';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Nequi';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

        $tm = new tm_paymentmethod;
        $tm->paymentmethod_ai_user_id = 1;
        $tm->tx_paymentmethod_value	= 'Otro';
        $tm->tx_paymentmethod_status = 1;
        $tm->save();

    }
}
