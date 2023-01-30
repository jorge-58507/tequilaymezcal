<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmTablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_tables', function (Blueprint $table) {
            $table->bigIncrements('ai_table_id');
            $table->integer('table_ai_ubication_id');
            $table->string('tx_table_code');
            $table->integer('tx_table_type')->default(2);
            $table->string('tx_table_value');
            $table->integer('tx_table_active')->default(1);
            $table->string('tx_table_slug');
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
        Schema::dropIfExists('tm_tables');
    }
}
	
