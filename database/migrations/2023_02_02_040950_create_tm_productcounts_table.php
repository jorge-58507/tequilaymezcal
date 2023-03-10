<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductcountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productcounts', function (Blueprint $table) {
            $table->bigIncrements('ai_productcount_id');
            $table->integer('productcount_ai_user_id');
            $table->integer('productcount_ai_product_id');
            $table->float('tx_productcount_before');
            $table->float('tx_productcount_after');
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
        Schema::dropIfExists('tm_productcounts');
    }
}
