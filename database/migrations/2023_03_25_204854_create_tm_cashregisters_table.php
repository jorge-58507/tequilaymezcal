<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmCashregistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_cashregisters', function (Blueprint $table) {
            $table->bigIncrements('ai_cashregister_id');
            $table->integer('cashregister_ai_user_id');
            $table->integer('cashregister_ai_paydesk_id')->nullable();
            $table->string('tx_cashregister_payment')->nullable();
            $table->string('tx_cashregister_paymentnull')->nullable();
            $table->float('tx_cashregister_grosssale');
            $table->float('tx_cashregister_netsale');
            $table->float('tx_cashregister_realsale');
            $table->float('tx_cashregister_nontaxable');
            $table->float('tx_cashregister_returnnontaxable');
            $table->float('tx_cashregister_taxable');
            $table->float('tx_cashregister_returntaxable');
            $table->float('tx_cashregister_tax');
            $table->float('tx_cashregister_returntax');
            $table->float('tx_cashregister_discount');
            $table->float('tx_cashregister_cashback');
            $table->float('tx_cashregister_canceled');
            $table->float('tx_cashregister_cashoutputin');
            $table->float('tx_cashregister_cashoutputout');
            $table->float('tx_cashregister_cashoutputnull');
            $table->integer('tx_cashregister_quantitydoc');
            $table->integer('tx_cashregister_returnquantitydoc');
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
        Schema::dropIfExists('tm_cashregisters');
    }
}
