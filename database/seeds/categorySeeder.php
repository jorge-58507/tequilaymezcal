<?php

use Illuminate\Database\Seeder;
use App\tm_category;

class categorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_category;
        $tm->category_ai_user_id = 1;
        $tm->tx_category_value = 'Entrada';
        $tm->tx_category_status = 1;
        $tm->save();

        $tm = new tm_category;
        $tm->category_ai_user_id = 1;
        $tm->tx_category_value = 'Plato fuerte';
        $tm->tx_category_status = 1;
        $tm->save();

        $tm = new tm_category;
        $tm->category_ai_user_id = 1;
        $tm->tx_category_value = 'Postres';
        $tm->tx_category_status = 1;
        $tm->save();

        $tm = new tm_category;
        $tm->category_ai_user_id = 1;
        $tm->tx_category_value = 'Bebidas';
        $tm->tx_category_status = 1;
        $tm->save();

        $tm = new tm_category;
        $tm->category_ai_user_id = 1;
        $tm->tx_category_value = 'Licor';
        $tm->tx_category_status = 1;
        $tm->save();

    }
}
