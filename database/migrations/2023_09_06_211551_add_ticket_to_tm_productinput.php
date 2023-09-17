<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTicketToTmProductinput extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_productinputs', function (Blueprint $table) {
            $table->string('tx_productinput_ticket')->after('tx_productinput_number')->nullable();
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
            $table->dropColumn('tx_productinput_ticket');
        });
    }
}
