<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddImageToTmTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_tables', function (Blueprint $table) {
            $table->longtext('tx_table_image',15,4)->after('tx_table_value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_tables', function (Blueprint $table) {
            $table->dropColumn('tx_table_image');
        });
    }
}
