<?php

use Illuminate\Support\Facades\Route;
use App\Models\Vehicules;
use App\Models\Livreurs;
use App\Models\Courses;
use App\Models\Zones;

// Route de test principale pour Nuxt
Route::get('/status', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API Laravel connectée avec succès !',
        'stats' => [
            'total_vehicules' => Vehicules::count(),
            'total_livreurs' => Livreurs::count(),
            'total_courses' => Courses::count(),
            'total_zones' => Zones::count(),
        ]
    ]);
});

// Routes API pour les ressources
Route::get('/vehicules', fn() => response()->json(Vehicules::all()));
Route::get('/livreurs', fn() => response()->json(Livreurs::with(['zone', 'vehicule'])->get()));
Route::get('/courses', fn() => response()->json(Courses::with('livreur')->get()));
Route::get('/zones', fn() => response()->json(Zones::all()));