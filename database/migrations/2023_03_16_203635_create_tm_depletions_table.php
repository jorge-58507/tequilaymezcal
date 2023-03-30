<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDepletionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_depletions', function (Blueprint $table) {
            $table->bigIncrements('ai_depletion_id');
            $table->integer('depletion_ai_user_id');
            $table->integer('depletion_ai_product_id');
            $table->float('tx_depletion_quantity');
            $table->integer('tx_depletion_status')->default(0);
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
        Schema::dropIfExists('tm_depletions');
    }
}
