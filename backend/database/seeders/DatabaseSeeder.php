<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Faire les courses',
            'content' => 'Acheter du pain, du lait et des œufs',
            'priority' => 'Moyenne',
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Réviser pour l\'examen',
            'content' => 'Chapitres 1 à 5 du cours de mathématiques',
            'priority' => 'Haute',
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Appeler le dentiste',
            'content' => 'Prendre rendez-vous pour le contrôle annuel',
            'priority' => 'Basse',
        ]);
    }
}