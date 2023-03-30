<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmCashoutputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_cashoutputs', function (Blueprint $table) {
            $table->bigIncrements('ai_cashoutput_id');
            $table->integer('cashoutput_ai_user_id');
            $table->integer('cashoutput_ai_paydesk_id')->nullable();
            $table->integer('cashoutput_ai_cashregister_id')->nullable();
            $table->integer('tx_cashoutput_type');
            $table->string('tx_cashoutput_reason');
            $table->float('tx_cashoutput_amount');
            $table->integer('tx_cashoutput_status')->default(1);
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
        Schema::dropIfExists('tm_cashoutputs');
    }
}
