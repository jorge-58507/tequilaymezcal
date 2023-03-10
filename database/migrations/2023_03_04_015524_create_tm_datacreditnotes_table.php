<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmDatacreditnotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_datacreditnotes', function (Blueprint $table) {
            $table->bigIncrements('ai_datacreditnote_id');
            $table->integer('datacreditnote_ai_creditnote_id');
            $table->integer('datacreditnote_ai_commanddata_id');
            $table->integer('datacreditnote_ai_article_id');
            $table->float('tx_datacreditnote_quantity');
            $table->integer('datacreditnote_ai_presentation_id');
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
        Schema::dropIfExists('tm_datacreditnotes');
    }
}
