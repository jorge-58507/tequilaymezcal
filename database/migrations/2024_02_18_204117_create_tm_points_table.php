<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_points', function (Blueprint $table) {
            $table->bigIncrements('ai_point_id');
            $table->integer('point_ai_cliente_id');
            $table->integer('point_ai_charge_id');
            $table->integer('tx_point_quantitybefore');
            $table->integer('tx_point_quantity');
            $table->integer('tx_point_quantityafter');
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
        Schema::dropIfExists('tm_points');
    }
}
