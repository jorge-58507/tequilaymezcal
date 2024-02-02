<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductwarehousesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productwarehouses', function (Blueprint $table) {
            $table->bigIncrements('ai_productwarehouse_id');
            $table->integer('productwarehouse_ai_user_id');
            $table->integer('productwarehouse_ai_product_id');
            $table->integer('productwarehouse_ai_warehouse_id');
            $table->string('tx_productwarehouse_description');
            $table->float('tx_productwarehouse_quantity');
            $table->float('tx_productwarehouse_minimun');
            $table->float('tx_productwarehouse_maximun');
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
        Schema::dropIfExists('tm_productwarehouses');
    }
}
