<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmInventorydatasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_inventorydatas', function (Blueprint $table) {
            $table->bigIncrements('ai_inventorydata_id');
            $table->integer('inventorydata_ai_inventory_id');
            $table->integer('inventorydata_ai_productcode_id');
            $table->integer('inventorydata_ai_product_id');
            $table->integer('inventorydata_ai_measure_id');
            $table->string('tx_inventorydata_description');
            $table->float('tx_inventorydata_quantity');
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
        Schema::dropIfExists('tm_inventorydatas');
    }
}
