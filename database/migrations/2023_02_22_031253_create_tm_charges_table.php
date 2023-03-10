<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmChargesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_charges', function (Blueprint $table) {
            $table->bigIncrements('ai_charge_id');
            $table->integer('charge_ai_user_id');
            $table->integer('charge_ai_cashregister_id')->nullable();
            $table->integer('charge_ai_paydesk_id');
            $table->string('tx_charge_number');
            $table->float('tx_charge_nontaxable');
            $table->float('tx_charge_taxable');
            $table->float('tx_charge_discount');
            $table->float('tx_charge_tax');
            $table->float('tx_charge_total');
            $table->float('tx_charge_change');
            $table->integer('tx_charge_status');
            $table->longtext('tx_charge_ticket')->nullable();
            $table->longtext('tx_charge_note')->nullable();
            $table->longtext('tx_charge_slug');
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
        Schema::dropIfExists('tm_charges');
    }
}