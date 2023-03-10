<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQuantityToTmProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_products', function (Blueprint $table) {
            $table->float('tx_product_quantity',15,4)->after('tx_product_discountrate')->default(0);        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_products', function (Blueprint $table) {
            $table->dropColumn('tx_product_quantity');
        });
    }
}
