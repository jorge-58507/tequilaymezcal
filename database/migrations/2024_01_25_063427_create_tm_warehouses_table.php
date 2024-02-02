<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmWarehousesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_warehouses', function (Blueprint $table) {
            $table->bigIncrements('ai_warehouse_id');
            $table->string('tx_warehouse_value');
            $table->string('tx_warehouse_number');
            $table->string('tx_warehouse_location');
            $table->integer('tx_warehouse_status');
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
        Schema::dropIfExists('tm_warehouses');
    }
}
