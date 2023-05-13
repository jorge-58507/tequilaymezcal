<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDatarequisitionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_datarequisitions', function (Blueprint $table) {
            $table->bigIncrements('ai_datarequisition_id');
            $table->integer('datarequisition_ai_user_id');
            $table->integer('datarequisition_ai_requisition_id');
            $table->integer('datarequisition_ai_product_id');
            $table->string('tx_datarequisition_description');
            $table->float('tx_datarequisition_quantity');
            $table->integer('datarequisition_ai_measurement_id');
            $table->float('tx_datarequisition_price');
            $table->float('tx_datarequisition_discountrate');
            $table->float('tx_datarequisition_taxrate');
            $table->float('tx_datarequisition_total');
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
        Schema::dropIfExists('tm_datarequisitions');
    }
}
