<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTmCreditnotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tm_creditnotes', function (Blueprint $table) {
            $table->bigIncrements('ai_creditnote_id');
            $table->integer('creditnote_ai_user_id');
            $table->integer('creditnote_ai_charge_id');
            $table->integer('creditnote_ai_cashregister_id')->nullable();
            $table->float('tx_creditnote_retentionrate');
            $table->integer('tx_creditnote_nullification')->default(0);
            $table->string('tx_creditnote_number');
            $table->float('tx_creditnote_nontaxable')->default(0);
            $table->float('tx_creditnote_taxable')->default(0);;
            $table->float('tx_creditnote_tax')->default(0);;
            $table->string('tx_creditnote_reason');
            $table->integer('tx_creditnote_status')->default(1);

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
        Schema::dropIfExists('tm_creditnotes');
    }
}
