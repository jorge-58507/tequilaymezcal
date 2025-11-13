<?php

use Illuminate\Database\Seeder;
use App\tm_product;
use App\tm_productwarehouse;

class productwareSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rs_product = tm_product::where('tx_product_status',1)->get();

        foreach ($rs_product as $key => $value) {
            $modal = new tm_productwarehouse;
            $modal->productwarehouse_ai_user_id = 1;
            $modal->productwarehouse_ai_product_id = $value['ai_product_id'];
            $modal->productwarehouse_ai_warehouse_id = 1;
            $modal->tx_productwarehouse_description = $value['tx_product_value'];
            $modal->tx_productwarehouse_quantity = 0;
            $modal->tx_productwarehouse_minimun = 0;
            $modal->tx_productwarehouse_maximun = 10000;
            $modal->save();

            $modal = new tm_productwarehouse;
            $modal->productwarehouse_ai_user_id = 1;
            $modal->productwarehouse_ai_product_id = $value['ai_product_id'];
            $modal->productwarehouse_ai_warehouse_id = 2;
            $modal->tx_productwarehouse_description = $value['tx_product_value'];
            $modal->tx_productwarehouse_quantity = 0;
            $modal->tx_productwarehouse_minimun = 0;
            $modal->tx_productwarehouse_maximun = 10000;
            $modal->save();
        }
    }
}
