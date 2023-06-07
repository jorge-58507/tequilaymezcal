<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDatapaymentprovidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_datapaymentproviders', function (Blueprint $table) {
            $table->bigIncrements('ai_datapaymentprovider_id');
            $table->integer('datapaymentprovider_ai_user_id');
            $table->integer('datapaymentprovider_ai_paymentprovider_id');
            $table->integer('datapaymentprovider_ai_paymentmethod_id');
            $table->float('tx_datapaymentprovider_amount');
            $table->string('tx_datapaymentprovider_number')->nullable();
            $table->longtext('tx_datapaymentprovider_observation')->nullable();
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
        Schema::dropIfExists('tm_datapaymentproviders');
    }
}
