<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPaymentprovidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_paymentproviders', function (Blueprint $table) {
            $table->bigIncrements('ai_paymentprovider_id');
            $table->integer('paymentprovider_ai_user_id');
            $table->integer('paymentprovider_ai_provider_id');
            $table->string('tx_paymentprovider_number');
            $table->float('tx_paymentprovider_total');
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
        Schema::dropIfExists('tm_paymentproviders');
    }
}
