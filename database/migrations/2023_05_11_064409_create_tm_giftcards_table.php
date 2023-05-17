<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmGiftcardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_giftcards', function (Blueprint $table) {
            $table->bigIncrements('ai_giftcard_id');
            $table->integer('giftcard_ai_user_id');
            $table->integer('giftcard_ai_client_id');
            $table->integer('giftcard_ai_cashregister_id')->nullable();
            $table->longtext('tx_giftcard_payment');
            $table->string('tx_giftcard_number');
            $table->float('tx_giftcard_amount');
            $table->integer('tx_giftcard_status');
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
        Schema::dropIfExists('tm_giftcards');
    }
}
