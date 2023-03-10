<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelMeasurementProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_measure_products', function (Blueprint $table) {
            $table->bigIncrements('ai_measure_product_id');
            $table->integer('measure_product_ai_measure_id');
            $table->integer('measure_product_ai_product_id');
            $table->float('tx_measure_product_relation',10,4);
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
        Schema::dropIfExists('rel_measure_products');
    }
}
