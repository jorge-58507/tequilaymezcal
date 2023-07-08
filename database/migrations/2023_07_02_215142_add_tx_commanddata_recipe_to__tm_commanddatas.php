<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTxCommanddataRecipeToTmCommanddatas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_commanddatas', function (Blueprint $table) {
            $table->longtext('tx_commanddata_recipe')->after('tx_commanddata_option');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_commanddatas', function (Blueprint $table) {
            $table->dropColumn('tx_commanddata_recipe');
        });
    }
}
