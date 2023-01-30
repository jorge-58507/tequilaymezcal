<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableTmUbication extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_ubications', function (Blueprint $table) {
            $table->bigIncrements('ai_ubication_id');
            $table->string('tx_ubication_value');
            $table->string('tx_ubication_prefix');
            $table->integer('tx_ubication_status')->default(1);
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
        Schema::dropIfExists('tm_ubications');
    }
}
