<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehiculeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::middleware(['auth', 'verified', 'role:utilisateur'])->group(function () {
//     Route::get('/dashboard', fn() => Inertia::render('dashboard'))
//         ->name('dashboard');
// });

Route::middleware(['auth', 'verified', 'role:admin,utilisateur'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');
    // Crud vehicule
    Route::get('/vehicules',[VehiculeController::class,'index'])
        ->name('vehicules.index');
    Route::get('/vehicules/create', [VehiculeController::class, 'create'])
        ->name('vehicules.create');
    Route::post('/vehicules', [VehiculeController::class, 'store'])
        ->name('vehicules.store');
    Route::get('/vehicules/{vehicule}/edit', [VehiculeController::class, 'edit'])
        ->name('vehicules.edit');
    Route::put('/vehicules/{vehicule}', [VehiculeController::class, 'update'])
        ->name('vehicules.update');
    Route::delete('/vehicules/{vehicule}', [VehiculeController::class, 'destroy'])
        ->name('vehicules.destroy');
});


// Routes accessibles par admin uniquement
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
   
    // Routes pour les produits
    Route::get('/products', [ProductController::class, 'index'])
        ->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])
        ->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])
        ->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->name('products.destroy');

    // Routes pour les utilisateurs
    Route::get('/utilisateurs', [UserController::class, 'index'])
        ->name('utilisateurs.index');
    Route::get('/utilisateurs/create', [UserController::class, 'create'])
        ->name('utilisateurs.create');
    // Route::post('/utilisateurs', [UserController::class, 'store'])
    //     ->name('utilisateurs.store');
    Route::get('/utilisateurs/{user}/edit', [UserController::class, 'edit'])
        ->name('utilisateurs.edit');
    Route::put('/utilisateurs/{user}', [UserController::class, 'update'])
        ->name('utilisateurs.update');
    // Route::delete('/utilisateurs/{user}', [UserController::class, 'destroy'])
    //     ->name('utilisateurs.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
