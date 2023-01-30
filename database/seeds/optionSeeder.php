<?php

use Illuminate\Database\Seeder;
use App\tm_option;


class optionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_option;
        $tm->tx_option_title = 'URL';
        $tm->tx_option_value = 'http://localhost:8000/';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'TITULO';
        $tm->tx_option_value = 'Tequila y Mezcal';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'RUC';
        $tm->tx_option_value = '0000-0000';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'DV';
        $tm->tx_option_value = '00';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'DIRECCION';
        $tm->tx_option_value = 'Boulevard Penonomé';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'TELEFONO';
        $tm->tx_option_value = '997-0000';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'CEL';
        $tm->tx_option_value = '6000-0000';
        $tm->save();

        $tm = new tm_option;
        $tm->tx_option_title = 'EMAIL';
        $tm->tx_option_value = 'tequilaymezcal@mail.com';
        $tm->save();
    }
}
