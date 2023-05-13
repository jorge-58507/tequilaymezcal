<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmRequisitionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_requisitions', function (Blueprint $table) {
            $table->bigIncrements('ai_requisition_id');
            $table->integer('requisition_ai_user_id');
            $table->integer('requisition_ai_provider_id');
            $table->string('tx_requisition_number');
            $table->float('tx_requisition_nontaxable');
            $table->float('tx_requisition_taxable');
            $table->float('tx_requisition_discount');
            $table->float('tx_requisition_tax');
            $table->float('tx_requisition_total');
            $table->string('tx_requisition_slug');
            $table->integer('tx_requisition_status');
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
        Schema::dropIfExists('tm_requisitions');
    }
}
