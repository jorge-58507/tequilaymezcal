<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentToRelPaymentproviderProductinput extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_paymentprovider_productinputs', function (Blueprint $table) {
            $table->string('tx_paymentprovider_productinput_payment')->after('paymentprovider_productinput_ai_productinput_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_paymentprovider_productinputs', function (Blueprint $table) {
            $table->dropColumn('tx_paymentprovider_productinput_payment');
        });
    }
}
