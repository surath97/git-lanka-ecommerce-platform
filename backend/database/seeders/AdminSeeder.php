<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'fname' => 'Admin',
            'lname' => 'User',
            'email' => 'admin@example.com',
            'contact' => '1234567890',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'fname' => 'Regular',
            'lname' => 'User',
            'email' => 'user@example.com',
            'contact' => '0987654321',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
        ]);
    }
}
