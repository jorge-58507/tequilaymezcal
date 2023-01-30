<?php

use Illuminate\Database\Seeder;
use App\tm_ubication;

class ubicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm_ubication = new tm_ubication();
        $tm_ubication->tx_ubication_value = "Sala";
        $tm_ubication->tx_ubication_prefix = "S1";
        $tm_ubication->tx_ubication_status = 1;
        $tm_ubication->save();
    }
}
