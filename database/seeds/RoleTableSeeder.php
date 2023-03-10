<?php

use Illuminate\Database\Seeder;
use App\role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = new role();
        $role->name = "admin";
        $role->description = "Administrador";
        $role->save();

        $role = new role();
        $role->name = "super";
        $role->description = "Supervisor";
        $role->save();

        $role = new role();
        $role->name = "waiter";
        $role->description = "Waiter";
        $role->save();

        $role = new role();
        $role->name = "kitchener";
        $role->description = "Kitchener";
        $role->save();

        $role = new role();
        $role->name = "bartender";
        $role->description = "Bartender";
        $role->save();

        $role = new role();
        $role->name = "cashier";
        $role->description = "Cajera";
        $role->save();

    }
}
