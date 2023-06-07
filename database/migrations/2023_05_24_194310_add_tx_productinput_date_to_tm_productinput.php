<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTxProductinputDateToTmProductinput extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_productinputs', function (Blueprint $table) {
            $table->string('tx_productinput_date')->after('tx_productinput_due')->default('1970-01-01');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_productinputs', function (Blueprint $table) {
            $table->dropColumn('tx_productinput_date');
        });
    }
}
