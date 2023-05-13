<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductinputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productinputs', function (Blueprint $table) {
            $table->bigIncrements('ai_productinput_id');
            $table->integer('productinput_ai_user_id');
            $table->integer('productinput_ai_provider_id');
            $table->string('tx_productinput_number');
            $table->float('tx_productinput_nontaxable');
            $table->float('tx_productinput_taxable');
            $table->float('tx_productinput_discount');
            $table->float('tx_productinput_tax');
            $table->float('tx_productinput_total');
            $table->float('tx_productinput_due');
            $table->integer('tx_productinput_status');
            $table->longtext('tx_productinput_slug');
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
        Schema::dropIfExists('tm_productinputs');
    }
}
