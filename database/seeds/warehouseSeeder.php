<?php

use Illuminate\Database\Seeder;
use App\tm_warehouse;

class warehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm_warehouse = new tm_warehouse();
        $tm_warehouse->tx_warehouse_value = "Bodega Principal";
        $tm_warehouse->tx_warehouse_number = "001";
        $tm_warehouse->tx_warehouse_location = "Penonomé";
        $tm_warehouse->tx_warehouse_status = 1;
        $tm_warehouse->save();

        $tm_warehouse = new tm_warehouse();
        $tm_warehouse->tx_warehouse_value = "Bodega Secundaria";
        $tm_warehouse->tx_warehouse_number = "002";
        $tm_warehouse->tx_warehouse_location = "Penonomé";
        $tm_warehouse->tx_warehouse_status = 1;
        $tm_warehouse->save();
    }
}
