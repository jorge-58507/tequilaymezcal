<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmLogincodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_logincodes', function (Blueprint $table) {
            $table->bigIncrements('ai_logincode_id');
            $table->string('tx_logincode_value');
            $table->string('tx_logincode_user');
            $table->longtext('tx_logincode_password');
            $table->integer('tx_logincode_status')->default(1);
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
        Schema::dropIfExists('tm_logincodes');
    }
}
