<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_products', function (Blueprint $table) {
            $table->bigIncrements('ai_product_id');
            $table->integer('product_ai_user_id');
            $table->integer('product_ai_productcategory_id');
            $table->string('tx_product_value');
            $table->string('tx_product_reference')->nullable();
            $table->string('tx_product_code');
            $table->float('tx_product_taxrate');
            $table->float('tx_product_minimum')->nullable();
            $table->float('tx_product_maximum')->nullable();
            $table->float('tx_product_discountrate');
            $table->integer('tx_product_alarm')->default(0);
            $table->integer('tx_product_status')->default(1);
            $table->integer('tx_product_discountable')->default(0);
            $table->string('tx_product_slug');
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
        Schema::dropIfExists('tm_products');
    }
}
