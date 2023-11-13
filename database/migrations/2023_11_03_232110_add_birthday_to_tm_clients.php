<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBirthdayToTmClients extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tm_clients', function (Blueprint $table) {
            $table->string('tx_client_birthday')->after('tx_client_direction')->default('1970-01-01');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tm_clients', function (Blueprint $table) {
            $table->dropColumn('tx_client_birthday');
        });
    }
}
