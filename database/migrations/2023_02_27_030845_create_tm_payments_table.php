<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_payments', function (Blueprint $table) {
            $table->bigIncrements('ai_payment_id');
            $table->integer('payment_ai_user_id');
            $table->integer('payment_ai_charge_id');
            $table->integer('payment_ai_paymentmethod_id');
            $table->float('tx_payment_amount');
            $table->string('tx_payment_number')->nullable();
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
        Schema::dropIfExists('tm_payments');
    }
}
