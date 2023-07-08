<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTmArticleproducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_articleproducts', function (Blueprint $table) {
            $table->dropColumn('articleproduct_ai_product_id');
            $table->dropColumn('articleproduct_ai_measure_id');
            $table->dropColumn('tx_articleproduct_quantity');
            $table->integer('articleproduct_ai_presentation_id')->after('articleproduct_ai_article_id');
            $table->longtext('tx_articleproduct_ingredient')->after('articleproduct_ai_presentation_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_articles', function (Blueprint $table) {
            $table->dropColumn('articleproduct_ai_presentation_id');
            $table->dropColumn('tx_articleproduct_ingredient');
            $table->integer('articleproduct_ai_product_id');
            $table->integer('articleproduct_ai_measure_id');
            $table->float('tx_articleproduct_quantity',15,6);
        });
    }
}
