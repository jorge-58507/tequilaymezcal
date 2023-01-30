<?php

use Illuminate\Database\Seeder;
use App\tm_presentation;
class presentationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm = new tm_presentation;
        $tm->presentation_ai_user_id = 1;		
        $tm->tx_presentation_value	= 'No presentacion';
        $tm->tx_presentation_status	= 1;
        $tm->save();

        $tm = new tm_presentation;
        $tm->presentation_ai_user_id = 1;		
        $tm->tx_presentation_value	= 'Plato';
        $tm->tx_presentation_status	= 1;
        $tm->save();

        $tm = new tm_presentation;
        $tm->presentation_ai_user_id = 1;		
        $tm->tx_presentation_value	= 'Botella';
        $tm->tx_presentation_status	= 1;
        $tm->save();


        $tm = new tm_presentation;
        $tm->presentation_ai_user_id = 1;		
        $tm->tx_presentation_value	= 'Copa';
        $tm->tx_presentation_status	= 1;
        $tm->save();

        $tm = new tm_presentation;
        $tm->presentation_ai_user_id = 1;		
        $tm->tx_presentation_value	= 'Caja';
        $tm->tx_presentation_status	= 1;
        $tm->save();

    }
}
