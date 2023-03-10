<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPaymentmethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_paymentmethods', function (Blueprint $table) {
            $table->bigIncrements('ai_paymentmethod_id');
            $table->integer('paymentmethod_ai_user_id');
            $table->string('tx_paymentmethod_value');
            $table->integer('tx_paymentmethod_change');
            $table->integer('tx_paymentmethod_status');
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
        Schema::dropIfExists('tm_paymentmethods');
    }
}

