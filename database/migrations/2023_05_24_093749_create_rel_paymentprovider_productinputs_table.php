<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelPaymentproviderProductinputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_paymentprovider_productinputs', function (Blueprint $table) {
            $table->bigIncrements('ai_paymentprovider_productinput_id');
            $table->integer('paymentprovider_productinput_ai_paymentprovider_id');
            $table->integer('paymentprovider_productinput_ai_productinput_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_paymentprovider_productinputs');
    }
}
