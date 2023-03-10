<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_clients', function (Blueprint $table) {
            $table->bigIncrements('ai_client_id');
            $table->integer('client_ai_user_id');
            $table->string('tx_client_name');
            $table->string('tx_client_cif');
            $table->string('tx_client_dv')->nullable();
            $table->longtext('tx_client_direction')->nullable();
            $table->string('tx_client_telephone')->nullable();
            $table->integer('tx_client_exempt')->default(0);
            $table->integer('tx_client_taxpayer');
            $table->string('tx_client_type');
            $table->string('tx_client_email')->nullable();
            $table->string('tx_client_slug');
            $table->integer('tx_client_status');
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
        Schema::dropIfExists('tm_clients');
    }
}
