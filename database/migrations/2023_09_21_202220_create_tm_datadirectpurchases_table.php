<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDatadirectpurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_datadirectpurchases', function (Blueprint $table) {
            $table->bigIncrements('ai_datadirectpurchase_id');
            $table->integer('datadirectpurchase_ai_user_id');
            $table->integer('datadirectpurchase_ai_directpurchase_id');
            $table->integer('datadirectpurchase_ai_productcode_id');
            $table->integer('datadirectpurchase_ai_product_id');
            $table->integer('datadirectpurchase_ai_measure_id');
            $table->string('tx_datadirectpurchase_description');
            $table->float('tx_datadirectpurchase_quantity');
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
        Schema::dropIfExists('tm_datadirectpurchases');
    }
}
