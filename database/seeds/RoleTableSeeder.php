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
        $role->description = "supervisor";
        $role->save();

        $role = new role();
        $role->name = "waiter";
        $role->description = "waiter";
        $role->save();

        $role = new role();
        $role->name = "kitchener";
        $role->description = "kitchener";
        $role->save();

        $role = new role();
        $role->name = "bartender";
        $role->description = "bartender";
        $role->save();
    }
}
