<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmCommandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_commands', function (Blueprint $table) {
            $table->bigIncrements('ai_command_id');
            $table->integer('command_ai_user_id');
            $table->integer('command_ai_request_id');
            $table->string('tx_command_time');
            $table->string('tx_command_consumption');
            $table->longtext('tx_command_observation')->nullable();
            $table->integer('tx_command_delivered');
            $table->integer('tx_command_status');
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
        Schema::dropIfExists('tm_commands');
    }
}
