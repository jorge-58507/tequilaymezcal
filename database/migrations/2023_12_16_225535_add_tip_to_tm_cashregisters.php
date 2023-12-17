<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTipToTmCashregisters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_cashregisters', function (Blueprint $table) {
            $table->float('tx_cashregister_tip')->after('tx_cashregister_discount')->default('0.00');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_cashregisters', function (Blueprint $table) {
            $table->dropColumn('tx_cashregister_tip');
        });
    }
}
