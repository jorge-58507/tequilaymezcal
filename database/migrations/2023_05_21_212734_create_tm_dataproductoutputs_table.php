<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDataproductoutputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_dataproductoutputs', function (Blueprint $table) {
            $table->bigIncrements('ai_dataproductoutput_id');
            $table->integer('dataproductoutput_ai_productoutput_id');
            $table->integer('dataproductoutput_ai_product_id');
            $table->float('tx_dataproductoutput_quantity');
            $table->integer('dataproductoutput_ai_measure_id');
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
        Schema::dropIfExists('tm_dataproductoutputs');
    }
}
