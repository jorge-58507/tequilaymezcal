<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTipToTmCharges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_charges', function (Blueprint $table) {
            $table->float('tx_charge_tip')->after('tx_charge_change')->default('0.00');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_charges', function (Blueprint $table) {
            $table->dropColumn('tx_charge_tip');
        });
    }
}
