<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmAcregistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_acregisters', function (Blueprint $table) {
            $table->bigIncrements('ai_acregister_id');
            $table->integer('acregister_ai_logincode_id');
            $table->integer('tx_acregister_type');
            $table->integer('tx_acregister_status')->default(1);            
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
        Schema::dropIfExists('tm_acregisters');
    }
}
