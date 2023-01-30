<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductcategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_productcategories', function (Blueprint $table) {
            $table->bigIncrements('ai_productcategory_id');
            $table->integer('productcategory_ai_user_id');
            $table->string('tx_productcategory_value');
            $table->integer('tx_productcategory_status');
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
        Schema::dropIfExists('tm_productcategories');
    }
}
