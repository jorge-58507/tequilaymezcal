<?php

use Illuminate\Database\Seeder;
use App\tm_table;

class tableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_table;
        $tm->table_ai_ubication_id = 1;
        $tm->tx_table_code = '001';
        $tm->tx_table_type = 2;
        $tm->tx_table_value = 'Mesa 001';
        $tm->tx_table_active = 1;
        $tm->tx_table_slug = time().'mesa001';
        $tm->save();

        $tm = new tm_table;
        $tm->table_ai_ubication_id = 1;
        $tm->tx_table_code = '002';
        $tm->tx_table_type = 2;
        $tm->tx_table_value = 'Mesa 002';
        $tm->tx_table_active = 1;
        $tm->tx_table_slug = time().'mesa002';
        $tm->save();

        $tm = new tm_table;
        $tm->table_ai_ubication_id = 1;
        $tm->tx_table_code = '003';
        $tm->tx_table_type = 1;
        $tm->tx_table_value = 'Barra';
        $tm->tx_table_active = 1;
        $tm->tx_table_slug = time().'barra001';
        $tm->save();
    }
}
