<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmArticleproductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_articleproducts', function (Blueprint $table) {
            $table->bigIncrements('ai_articleproduct_id');
            $table->integer('articleproduct_ai_user_id');
            $table->integer('articleproduct_ai_article_id');
            $table->integer('articleproduct_ai_product_id');
            $table->integer('articleproduct_ai_measure_id');
            $table->float('tx_articleproduct_quantity',15,6);
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
        Schema::dropIfExists('tm_articleproducts');
    }
}
