<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductcodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productcodes', function (Blueprint $table) {
            $table->bigIncrements('ai_productcode_id');
            $table->integer('productcode_ai_user_id');
            $table->integer('productcode_ai_product_id');
            $table->integer('productcode_ai_measure_id');
            $table->string('tx_productcode_value');
            $table->float('tx_productcode_quantity');
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
        Schema::dropIfExists('tm_productcodes');
    }
}
