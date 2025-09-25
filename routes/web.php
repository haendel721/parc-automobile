<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\AssuranceController;
use App\Http\Controllers\EntretienController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\PieceController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::middleware(['auth', 'verified', 'role:utilisateur'])->group(function () {
//     Route::get('/dashboard', fn() => Inertia::render('dashboard'))
//         ->name('dashboard');
// });

Route::middleware(['auth', 'verified', 'role:admin|utilisateur'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');
    // Route::get('/dashboard',[DashboardController::class , 'index'])
    //     ->name('dashboard.index');
    // // Crud vehicule
    Route::get('/vehicules', [VehiculeController::class, 'index'])
        ->name('vehicules.index');
    Route::get('/vehicules/create', [VehiculeController::class, 'create'])
        ->name('vehicules.create');
    Route::post('/vehicules', [VehiculeController::class, 'store'])
        ->name('vehicules.store');
    Route::get('/vehicules/{vehicule}/edit', [VehiculeController::class, 'edit'])
        ->name('vehicules.edit');
    Route::post('/vehicules/{vehicule}', [VehiculeController::class, 'update'])
        ->name('vehicules.update');
    Route::delete('/vehicules/{vehicule}', [VehiculeController::class, 'destroy'])
        ->name('vehicules.destroy');
    // Crud Assurance
    Route::get('/assurances', [AssuranceController::class, 'index'])
        ->name('assurances.index');
    Route::get('/assurances/create', [AssuranceController::class, 'create'])
        ->name('assurances.create');
    Route::post('/assurances', [AssuranceController::class, 'store'])
        ->name('assurances.store');
    Route::get('/assurances/{assurance}/edit', [AssuranceController::class, 'edit'])
        ->name('assurances.edit');
    Route::post('/assurances/{assurance}', [AssuranceController::class, 'update'])
        ->name('assurances.update');
    Route::delete('/assurances/{assurance}', [AssuranceController::class, 'destroy'])
        ->name('assurances.destroy');

    // Crud pièce
    Route::get('/pieces', [PieceController::class, 'index'])
        ->name('pieces.index');
    Route::get('/pieces/create', [PieceController::class, 'create'])
        ->name('pieces.create');
    Route::post('/pieces', [PieceController::class, 'store'])
        ->name('pieces.store');
    Route::get('/pieces/{piece}/edit', [PieceController::class, 'edit'])
        ->name('pieces.edit');
    Route::post('/pieces/{piece}', [PieceController::class, 'update'])
        ->name('pieces.update');
    Route::delete('/pieces/{piece}', [PieceController::class, 'destroy'])
        ->name('pieces.destroy');
    // Crud entretien
    // Route::resource('entretiens', EntretienController::class);
    Route::get('/entretiens', [EntretienController::class, 'index'])
        ->name('entretiens.index');
    Route::get('/entretiens/create', [EntretienController::class, 'create'])
        ->name('entretiens.create');
    Route::post('/entretiens', [EntretienController::class, 'store'])
        ->name('entretiens.store');
    Route::get('/entretiens/{entretien}/edit', [EntretienController::class, 'edit'])
        ->name('entretiens.edit');
    Route::post('/entretiens/{entretien}', [EntretienController::class, 'update'])
        ->name('entretiens.update');
    Route::delete('/entretiens/{entretien}', [EntretienController::class, 'destroy'])
        ->name('entretiens.destroy');
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
    // Crud Fournisseur
    Route::get('/fournisseurs', [FournisseurController::class, 'index'])
        ->name('fournisseurs.index');
    Route::get('/fournisseurs/create', [FournisseurController::class, 'create'])
        ->name('fournisseurs.create');
    Route::post('/fournisseurs', [FournisseurController::class, 'store'])
        ->name('fournisseurs.store');
    Route::get('/fournisseurs/{fournisseur}/edit', [FournisseurController::class, 'edit'])
        ->name('fournisseurs.edit');
    Route::post('/fournisseurs/{fournisseur}', [FournisseurController::class, 'update'])
        ->name('fournisseurs.update');
    Route::delete('/fournisseurs/{fournisseur}', [FournisseurController::class, 'destroy'])
        ->name('fournisseurs.destroy');
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
    Route::delete('/utilisateurs/{user}', [UserController::class, 'destroy'])
        ->name('utilisateurs.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
