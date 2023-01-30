<?php

use Illuminate\Database\Seeder;
use App\tm_measure;

class measureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Pulgada';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Pie';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Yarda';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Cm';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Metro';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'M2';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'M3';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Mg';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Gramo';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Kg';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Caja';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Bolsa';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Rollo';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Libra';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Quintal';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Pizca';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Tanque';
        $tm->tx_measure_status = 1;
        $tm->save();
        
        $tm = new tm_measure;
        $tm->measure_ai_user_id	= 1;
        $tm->tx_measure_value = 'Galón';
        $tm->tx_measure_status = 1;
        $tm->save();
        
    }
}
