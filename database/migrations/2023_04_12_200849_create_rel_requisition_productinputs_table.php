<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelRequisitionProductinputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_requisition_productinputs', function (Blueprint $table) {
            $table->bigIncrements('ai_requisition_productinput_id');
            $table->integer('requisition_productinput_ai_requisition_id');
            $table->integer('requisition_productinput_ai_productinput_id');
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
        Schema::dropIfExists('rel_requisition_productinputs');
    }
}
