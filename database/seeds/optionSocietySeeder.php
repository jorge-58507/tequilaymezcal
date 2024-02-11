<?php

use Illuminate\Database\Seeder;
use App\tm_option;

class optionSocietySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_option;
        $tm->tx_option_title = 'SOCIETY';
        $tm->tx_option_value = 'Cancino Nuñez, S.A.';
        $tm->save();
    }
}
