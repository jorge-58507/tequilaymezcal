<?php

use Illuminate\Database\Seeder;
use App\User;
use App\role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_waiter = role::where('name','waiter')->first();
        $role_admin = role::where('name','admin')->first();
        $role_supervisor = role::where('name','super')->first();
        $role_cashier = role::where('name','cashier')->first();

        $user = new User();
        $user->name = "Administrador";
        $user->email = "admin@mail.com";
        $user->password = bcrypt('admin');
        $user->save();
        $user->roles()->attach($role_admin);

        $user = new User();
        $user->name = "Usuario_default";
        $user->email = "user@mail.com";
        $user->password = bcrypt('user');
        $user->save();
        $user->roles()->attach($role_waiter);
        
        $user = new User();
        $user->name = "Supervisor";
        $user->email = "supervisor@mail.com";
        $user->password = bcrypt('supervisor');
        $user->save();
        $user->roles()->attach($role_waiter);
        
        $user = new User();
        $user->name = "Cajera";
        $user->email = "cajera@mail.com";
        $user->password = bcrypt('cajera');
        $user->save();
        $user->roles()->attach($role_waiter);
        
    }
}
