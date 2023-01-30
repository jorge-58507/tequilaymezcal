<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmPresentationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_presentations', function (Blueprint $table) {
            $table->bigIncrements('ai_presentation_id');
            $table->integer('presentation_ai_user_id');
            $table->string('tx_presentation_value');
            $table->integer('tx_presentation_status')->default(1);
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
        Schema::dropIfExists('tm_presentations');
    }
}
