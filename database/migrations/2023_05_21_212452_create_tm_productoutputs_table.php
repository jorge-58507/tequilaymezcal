<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductoutputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productoutputs', function (Blueprint $table) {
            $table->bigIncrements('ai_productoutput_id');
            $table->integer('productoutput_ai_user_id');
            $table->string('tx_productoutput_reason');
            $table->float('tx_productoutput_total');
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
        Schema::dropIfExists('tm_productoutputs');
    }
}
