<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeliveredTmCommanddatas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_commanddatas', function (Blueprint $table) {
            $table->integer('tx_commanddata_delivered')->after('tx_commanddata_status')->default(0);
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
            $table->dropColumn('tx_commanddata_delivered');
        });
    }
}
