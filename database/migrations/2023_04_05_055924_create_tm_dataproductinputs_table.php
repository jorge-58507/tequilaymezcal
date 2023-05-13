<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDataproductinputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_dataproductinputs', function (Blueprint $table) {
            $table->bigIncrements('ai_dataproductinput_id');
            $table->integer('dataproductinput_ai_user_id');
            $table->integer('dataproductinput_ai_productinput_id');
            $table->integer('dataproductinput_ai_product_id');
            $table->string('tx_dataproductinput_description');
            $table->float('tx_dataproductinput_quantity');
            $table->integer('dataproductinput_ai_measurement_id');
            $table->float('tx_dataproductinput_price');
            $table->float('tx_dataproductinput_discountrate');
            $table->float('tx_dataproductinput_taxrate');
            $table->float('tx_dataproductinput_total');
            $table->date('tx_dataproductinput_duedate')->nullable();
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
        Schema::dropIfExists('tm_dataproductinputs');
    }
}
