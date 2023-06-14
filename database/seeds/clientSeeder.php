<?php

use Illuminate\Database\Seeder;
use App\tm_client;

class clientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tm_client = new tm_client;
        $tm_client->client_ai_user_id = 1;
        $tm_client->tx_client_name = 'Contado';
        $tm_client->tx_client_cif = '0-000-000';
        $tm_client->tx_client_dv = '';
        $tm_client->tx_client_direction = 'NO INDICA';
        $tm_client->tx_client_telephone = '';
        $tm_client->tx_client_exempt = 0;
        $tm_client->tx_client_taxpayer = 1;
        $tm_client->tx_client_type = '02';
        $tm_client->tx_client_email = '';
        $tm_client->tx_client_slug = '001';
        $tm_client->tx_client_status = 1;
        $tm_client->save();
    }
}
