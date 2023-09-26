<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDirectpurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_directpurchases', function (Blueprint $table) {
            $table->bigIncrements('ai_directpurchase_id');
            $table->integer('directpurchase_ai_user_id');
            $table->integer('directpurchase_ai_provider_id');
            $table->integer('tx_directpurchase_status');
            $table->longtext('tx_directpurchase_slug');
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
        Schema::dropIfExists('tm_directpurchases');
    }
}
