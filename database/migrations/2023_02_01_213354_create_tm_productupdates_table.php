<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductupdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productupdates', function (Blueprint $table) {
            $table->bigIncrements('ai_productupdate_id');
            $table->integer('productupdate_ai_user_id');
            $table->integer('productupdate_ai_product_id');
            $table->longtext('tx_productupdate_data');
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
        Schema::dropIfExists('tm_productupdates');
    }
}
