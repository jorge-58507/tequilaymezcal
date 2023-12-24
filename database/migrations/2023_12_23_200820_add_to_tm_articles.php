<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddToTmArticles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_articles', function (Blueprint $table) {
            $table->integer('tx_article_kitchen')->after('tx_article_status')->default(0);
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
            $table->dropColumn('tx_article_kitchen');
        });
    }
}
