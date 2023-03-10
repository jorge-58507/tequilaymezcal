<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_prices', function (Blueprint $table) {
            $table->bigIncrements('ai_price_id');
            $table->integer('price_ai_user_id');
            $table->integer('price_ai_article_id');
            $table->integer('price_ai_presentation_id');
            $table->float('tx_price_one')->nullable();
            $table->float('tx_price_two')->nullable();
            $table->float('tx_price_three');
            $table->integer('tx_price_status')->default(1);
            $table->string('tx_price_date');
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
        Schema::dropIfExists('tm_prices');
    }
}
