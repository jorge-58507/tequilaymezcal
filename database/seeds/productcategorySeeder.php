<?php

use Illuminate\Database\Seeder;
use App\tm_productcategory;

class productcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Carne';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Lacteo';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Salsa';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Hortaliza';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Legumbre';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Frutos Secos';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Cereales';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Verdura';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Endulzante';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Aderezo';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Aceite';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Otros';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Miscellaneo';
        $tm->tx_productcategory_status = 1;
        $tm->save();

        $tm = new tm_productcategory;
        $tm->productcategory_ai_user_id	= 1;
        $tm->tx_productcategory_value = 'Pulpa/Base';
        $tm->tx_productcategory_status = 1;
        $tm->save();
    }
}
