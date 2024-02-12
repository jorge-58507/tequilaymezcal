<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmWarehousetransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_warehousetransfers', function (Blueprint $table) {
            $table->bigIncrements('ai_warehousetransfer_id');
            $table->integer('warehousetransfer_ai_user_id');
            $table->integer('warehousetransfer_ai_productwarehouse_id');
            $table->integer('warehousetransfer_ai_product_id');
            $table->float('tx_warehousetransfer_quantity');
            $table->integer('tx_warehousetransfer_origin');
            $table->float('tx_warehousetransfer_originquantity');
            $table->integer('tx_warehousetransfer_destination');
            $table->float('tx_warehousetransfer_destinationquantity');
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
        Schema::dropIfExists('tm_warehousetransfers');
    }
}
