<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_providers', function (Blueprint $table) {
            $table->bigIncrements('ai_provider_id');
            $table->integer('provider_ai_user_id');
            $table->string('tx_provider_value');
            $table->string('tx_provider_ruc');
            $table->string('tx_provider_dv');
            $table->string('tx_provider_telephone')->nullable();
            $table->longtext('tx_provider_direction')->nullable();
            $table->longtext('tx_provider_observation')->nullable();
            $table->longtext('tx_provider_slug');
            $table->integer('tx_provider_status');
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
        Schema::dropIfExists('tm_providers');
    }
}
